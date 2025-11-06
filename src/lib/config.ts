/**
 * Centralized configuration for the Web Friend application
 */

/**
 * Get the base URL for the application
 * Uses environment variable with fallback to production URL
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://web-friend.vercel.app'
}

/**
 * Get the canonical URL for a given path
 * @param path - The path (should start with /)
 * @returns The full canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const baseUrl = getBaseUrl()
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}
