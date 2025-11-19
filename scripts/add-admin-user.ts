#!/usr/bin/env tsx

/**
 * Script to add admin role to a user
 */

import { config } from 'dotenv'
import { createD1Client } from '../src/lib/db'

// Load environment variables from .env.local
config({ path: '.env.local' })

async function addAdminUser() {
  console.log('🔄 Connecting to Cloudflare D1 database...\n')

  try {
    const db = createD1Client()
    const userEmail = 'marko123obradovic@gmail.com'

    // First, get the admin role ID
    const roleResult = await db.prepare('SELECT id FROM roles WHERE name = ?').bind('admin').first<{ id: number }>()

    if (!roleResult) {
      console.error('❌ Admin role not found!')
      return
    }

    const roleId = roleResult.id

    // Check if user already has admin role
    const existingRole = await db.prepare('SELECT id FROM user_roles WHERE email = ? AND role_id = ?').bind(userEmail, roleId).first()

    if (existingRole) {
      console.log(`✅ User ${userEmail} already has admin role!`)
      return
    }

    // Create a placeholder user profile first (required by foreign key constraint)
    const placeholderUserId = `clerk_${Date.now()}`
    const now = Math.floor(Date.now() / 1000)

    await db.prepare(`
      INSERT OR IGNORE INTO user_profiles (user_id, email, created_at, updated_at)
      VALUES (?, ?, ?, ?)
    `).bind(placeholderUserId, userEmail, now, now).run()

    // Add admin role to user
    await db.prepare(`
      INSERT INTO user_roles (user_id, role_id, email, assigned_by)
      VALUES (?, ?, ?, ?)
    `).bind(placeholderUserId, roleId, userEmail, 'system').run()

    console.log(`✅ Successfully added admin role to ${userEmail}!`)
    console.log('🔄 Verifying assignment...')

    // Verify the assignment
    const verifyResult = await db.prepare(`
      SELECT ur.email, r.name
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.email = ?
    `).bind(userEmail).all<{ email: string, name: string }>()

    if (verifyResult.results && verifyResult.results.length > 0) {
      console.table(verifyResult.results)
    }

  } catch (error) {
    console.error('❌ Error adding admin user:', error)
    process.exit(1)
  }
}

// Run the script
addAdminUser()
