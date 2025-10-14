# Database Setup Guide

This guide will help you set up the Cloudflare D1 database for storing website analyses and tasks.

## Prerequisites

- Cloudflare account
- wrangler CLI installed (`npm install -g wrangler`)
- Authenticated with wrangler (`wrangler login`)

## Step 1: Create D1 Database

```bash
# Create the database
wrangler d1 create web-friend-db
```

This will output something like:
```
✅ Successfully created DB 'web-friend-db'
 
[[d1_databases]]
binding = "DB"
database_name = "web-friend-db"
database_id = "your-database-id-here"
```

Copy the `database_id` and update it in `wrangler.toml`.

## Step 2: Apply Database Schema

```bash
# Apply the schema to create tables and indexes
wrangler d1 execute web-friend-db --file=schema.sql
```

This will create:
- `analyses` table - stores website analysis data
- `tasks` table - stores action plan tasks
- `user_profiles` table (if you're using Clerk auth)
- All necessary indexes for optimal query performance

## Step 3: Verify Database Creation

```bash
# List all tables
wrangler d1 execute web-friend-db --command="SELECT name FROM sqlite_master WHERE type='table';"

# Check analyses table structure
wrangler d1 execute web-friend-db --command="PRAGMA table_info(analyses);"

# Check tasks table structure
wrangler d1 execute web-friend-db --command="PRAGMA table_info(tasks);"
```

## Step 4: Configure Environment Variables

### For Vercel Deployment

Add these environment variables to your Vercel project:

```bash
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_DATABASE_ID=your_d1_database_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
```

To get your Cloudflare API token:
1. Go to Cloudflare Dashboard → My Profile → API Tokens
2. Create a token with D1 Edit permissions
3. Copy the token and add it to Vercel

To get your Account ID:
1. Go to Cloudflare Dashboard
2. Your Account ID is shown on the right side

### For Local Development

Create a `.env.local` file (copy from `.env.example`):

```env
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_DATABASE_ID=your_d1_database_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
GROQ_API_KEY=your_groq_api_key
```

## Step 5: Test Database Connection

You can test the database connection by running the app locally:

```bash
npm run dev
```

Then try analyzing a website and generating an action plan. Check the database:

```bash
# View all analyses
wrangler d1 execute web-friend-db --command="SELECT id, url, analyzed_at FROM analyses LIMIT 10;"

# View all tasks
wrangler d1 execute web-friend-db --command="SELECT id, title, category, priority FROM tasks LIMIT 10;"
```

## Database Schema Overview

### Analyses Table

Stores complete website analysis data as JSON:

- `id` - Unique analysis ID
- `user_id` - User who created the analysis (NULL for anonymous)
- `url` - Website URL analyzed
- `website_data` - JSON: extracted website data
- `analysis_result` - JSON: AI analysis results
- `action_plan_summary` - Quick summary of action plan
- `action_plan_timeline` - Timeline estimate
- `quick_wins` - JSON array of quick win suggestions
- `analyzed_at` - Timestamp of analysis
- `created_at` - Timestamp of record creation

### Tasks Table

Normalized task data for querying and updates:

- `id` - Unique task ID
- `analysis_id` - Reference to parent analysis
- `user_id` - Denormalized user ID for fast queries
- `category` - seo | content | performance | accessibility
- `priority` - high | medium | low
- `title` - Task title
- `description` - Detailed task description
- `effort` - quick | moderate | significant
- `impact` - low | medium | high
- `estimated_time` - Human-readable time estimate
- `status` - pending | in_progress | completed | skipped
- `completed_at` - Completion timestamp
- `started_at` - Start timestamp
- `notes` - User notes
- `task_order` - Order within analysis
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Querying the Database

### Useful Queries

```sql
-- Get recent analyses
SELECT id, url, analyzed_at 
FROM analyses 
ORDER BY analyzed_at DESC 
LIMIT 10;

-- Get high-priority pending tasks
SELECT title, category, description 
FROM tasks 
WHERE status = 'pending' AND priority = 'high' 
ORDER BY created_at DESC;

-- Get task completion statistics
SELECT 
  category,
  COUNT(*) as total,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
FROM tasks
GROUP BY category;
```

## Troubleshooting

### Database Not Found

If you get "database not found" errors:
1. Verify the database was created: `wrangler d1 list`
2. Check that `database_id` in `wrangler.toml` matches the created database
3. Ensure you're authenticated: `wrangler whoami`

### Permission Errors

If you get permission errors:
1. Check your Cloudflare API token has D1 Edit permissions
2. Verify the Account ID is correct
3. Try regenerating the API token

### Connection Errors in Development

For local development with Vercel:
1. Ensure all environment variables are set in `.env.local`
2. The D1 HTTP API has rate limits - use cautiously in development
3. Consider using wrangler dev for local testing with actual D1

## Migration from Previous Versions

If you already have data and need to add these tables:

```bash
# The schema uses IF NOT EXISTS, so it's safe to run on existing databases
wrangler d1 execute web-friend-db --file=schema.sql
```

## Backup and Recovery

### Backup Database

```bash
# Export all data
wrangler d1 execute web-friend-db --command="SELECT * FROM analyses;" > analyses_backup.json
wrangler d1 execute web-friend-db --command="SELECT * FROM tasks;" > tasks_backup.json
```

### Delete Test Data

```bash
# Delete all analyses and tasks (be careful!)
wrangler d1 execute web-friend-db --command="DELETE FROM analyses WHERE user_id IS NULL;"
```

## Next Steps

After setting up the database:
1. Configure Clerk authentication (optional)
2. Test the analysis flow
3. Monitor database usage in Cloudflare Dashboard
4. Set up regular backups for production data

