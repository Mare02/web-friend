/**
 * Simple in-memory rate limiter for Sanity API calls
 * This helps prevent abuse and reduces API costs
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private requests = new Map<string, RateLimitEntry>()
  private readonly windowMs: number
  private readonly maxRequests: number

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  /**
   * Check if a request should be allowed
   * @param identifier - Unique identifier for the request (e.g., IP address or user ID)
   * @returns true if request is allowed, false if rate limited
   */
  check(identifier: string): boolean {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      })
      return true
    }

    if (entry.count >= this.maxRequests) {
      return false
    }

    entry.count++
    return true
  }

  /**
   * Get remaining requests for an identifier
   */
  getRemainingRequests(identifier: string): number {
    const entry = this.requests.get(identifier)
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests
    }
    return Math.max(0, this.maxRequests - entry.count)
  }

  /**
   * Clean up expired entries (optional, for memory management)
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key)
      }
    }
  }
}

// Create a global rate limiter for Sanity API calls
// 100 requests per minute per IP should be sufficient for a blog
export const sanityRateLimiter = new RateLimiter(60000, 100)

/**
 * Rate limited Sanity query wrapper
 */
export async function rateLimitedSanityQuery<T>(
  queryFn: () => Promise<T>,
  identifier: string = 'default'
): Promise<T> {
  if (!sanityRateLimiter.check(identifier)) {
    throw new Error('Rate limit exceeded. Please try again later.')
  }

  return queryFn()
}

// Clean up expired entries every 5 minutes
if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    sanityRateLimiter.cleanup()
  }, 300000)
}
