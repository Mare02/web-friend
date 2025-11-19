/**
 * Server actions for admin functionality
 */

'use server'

import { isAdminUser } from '@/lib/auth/roles'

/**
 * Server action to check if a user has admin role
 * This runs on the server and can access environment variables
 */
export async function checkAdminRole(email: string): Promise<boolean> {
  try {
    return await isAdminUser(email)
  } catch (error) {
    console.error('Error checking admin role for user:', email, error)
    return false
  }
}
