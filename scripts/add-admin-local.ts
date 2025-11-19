#!/usr/bin/env tsx

/**
 * Script to add admin role to local D1 database using wrangler
 */

import { execSync } from 'child_process'

async function addAdminToLocalDB() {
  console.log('🔄 Adding admin role to local D1 database...\n')

  try {
    const userEmail = 'marko123obradovic@gmail.com'

    // Check if user already has admin role in local database
    console.log('🔍 Checking existing admin assignments...')
    const existingCheck = execSync(
      `npx wrangler d1 execute web-friend-db --local --command "SELECT ur.email FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE ur.email = '${userEmail}' AND r.name = 'admin';"`,
      { encoding: 'utf8' }
    )

    if (existingCheck.includes(userEmail)) {
      console.log(`✅ User ${userEmail} already has admin role in local database!`)
      return
    }

    // Create a placeholder user profile first (required by foreign key constraint)
    const placeholderUserId = `clerk_${Date.now()}`
    const now = Math.floor(Date.now() / 1000)

    console.log('👤 Creating user profile...')
    execSync(
      `npx wrangler d1 execute web-friend-db --local --command "INSERT OR IGNORE INTO user_profiles (user_id, email, created_at, updated_at) VALUES ('${placeholderUserId}', '${userEmail}', ${now}, ${now});"`,
      { stdio: 'inherit' }
    )

    console.log('🔑 Assigning admin role...')
    execSync(
      `npx wrangler d1 execute web-friend-db --local --command "INSERT INTO user_roles (user_id, role_id, email, assigned_by) VALUES ('${placeholderUserId}', 1, '${userEmail}', 'system');"`,
      { stdio: 'inherit' }
    )

    console.log(`✅ Successfully added admin role to ${userEmail} in local database!`)
    console.log('🔄 Verifying assignment...')

    // Verify the assignment
    const verifyResult = execSync(
      `npx wrangler d1 execute web-friend-db --local --command "SELECT ur.email, r.name FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE ur.email = '${userEmail}';"`,
      { encoding: 'utf8' }
    )

    console.log('Verification result:')
    console.log(verifyResult)

  } catch (error) {
    console.error('❌ Error adding admin user to local database:', error)
    process.exit(1)
  }
}

// Run the script
addAdminToLocalDB()
