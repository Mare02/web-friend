/**
 * D1 Database Client
 * Provides HTTP-based access to Cloudflare D1 database
 */

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  meta?: Record<string, unknown>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1Result>;
}

/**
 * Creates a D1 client for database operations
 * This is a simplified implementation that will work with Cloudflare Workers
 * For local development and Vercel, this would use HTTP API
 */
export function createD1Client(): D1Database {
  // Check if we're in Cloudflare Workers environment
  if ('DB' in globalThis) {
    // In Cloudflare Workers, DB binding is available
    return (globalThis as unknown as { DB: D1Database }).DB;
  }

  // For local development/Vercel, we'd use HTTP API
  // This is a placeholder - actual implementation would use Cloudflare D1 HTTP API
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    throw new Error(
      'D1 configuration missing. Please set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, and CLOUDFLARE_API_TOKEN environment variables.'
    );
  }

  // HTTP-based D1 client implementation
  return createHttpD1Client(accountId, databaseId, apiToken);
}

/**
 * Creates an HTTP-based D1 client for use outside Cloudflare Workers
 */
function createHttpD1Client(
  accountId: string,
  databaseId: string,
  apiToken: string
): D1Database {
  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}`;

  async function executeQuery(sql: string, params: unknown[] = []): Promise<D1Result> {
    try {
      const response = await fetch(`${baseUrl}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql,
          params,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`D1 HTTP API error (${response.status}):`, error);
        throw new Error(`D1 query failed with status ${response.status}: ${error}`);
      }

      const data = await response.json();

      // Check for API-level errors
      if (!data.success) {
        const errorMsg = data.errors?.map((e: { message: string }) => e.message).join(', ') || 'Unknown error';
        console.error('D1 API returned error:', errorMsg);
        throw new Error(`D1 API error: ${errorMsg}`);
      }

      return data.result?.[0] || { success: true, results: [] };
    } catch (error) {
      console.error('D1 query execution error:', {
        sql: sql.substring(0, 100),
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  return {
    prepare(query: string): D1PreparedStatement {
      let boundParams: unknown[] = [];

      const statement: D1PreparedStatement = {
        bind(...values: unknown[]) {
          boundParams = values;
          return statement;
        },

        async first<T = unknown>(): Promise<T | null> {
          const result = await executeQuery(query, boundParams);
          return (result.results?.[0] as T) || null;
        },

        async run(): Promise<D1Result> {
          return executeQuery(query, boundParams);
        },

        async all<T = unknown>(): Promise<D1Result<T>> {
          return executeQuery(query, boundParams) as Promise<D1Result<T>>;
        },
      };

      return statement;
    },

    async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
      // For simplicity, execute statements sequentially
      // In production, you might want to use D1's batch endpoint
      const results: D1Result<T>[] = [];
      for (const stmt of statements) {
        const result = await stmt.run();
        results.push(result as D1Result<T>);
      }
      return results;
    },

    async exec(query: string): Promise<D1Result> {
      return executeQuery(query);
    },
  };
}

