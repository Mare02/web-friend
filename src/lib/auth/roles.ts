/**
 * Role-based authorization utilities
 * Provides functions for checking user roles in the database
 */

import { createD1Client } from '@/lib/db';

/**
 * Check if a user has admin role
 * @param email - The user's email address
 * @returns Promise<boolean> - True if user has admin role, false otherwise
 */
export async function isAdminUser(email: string): Promise<boolean> {
  try {
    const db = createD1Client();

    // Query to check if user has admin role
    const result = await db.prepare(`
      SELECT ur.id
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.email = ? AND r.name = 'admin'
      LIMIT 1
    `).bind(email).first<{ id: number }>();

    return !!result;
  } catch (error) {
    console.error('Error checking admin role for user:', email, error);
    // Default to denying access on any error
    return false;
  }
}

/**
 * Get all roles for a user
 * @param email - The user's email address
 * @returns Promise<string[]> - Array of role names
 */
export async function getUserRoles(email: string): Promise<string[]> {
  try {
    const db = createD1Client();

    const result = await db.prepare(`
      SELECT r.name
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.email = ?
    `).bind(email).all<{ name: string }>();

    return result.results?.map(row => row.name) || [];
  } catch (error) {
    console.error('Error getting user roles for:', email, error);
    return [];
  }
}

/**
 * Check if a user has a specific role
 * @param email - The user's email address
 * @param roleName - The role name to check
 * @returns Promise<boolean> - True if user has the role, false otherwise
 */
export async function hasRole(email: string, roleName: string): Promise<boolean> {
  try {
    const db = createD1Client();

    const result = await db.prepare(`
      SELECT ur.id
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.email = ? AND r.name = ?
      LIMIT 1
    `).bind(email, roleName).first<{ id: number }>();

    return !!result;
  } catch (error) {
    console.error('Error checking role for user:', email, roleName, error);
    return false;
  }
}