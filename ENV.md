# Environment Variables

This project requires the following environment variables to be set in your `.env.local` file:

## Required Variables

### Groq AI API Key
```
GROQ_API_KEY=your_groq_api_key_here
```
- **Purpose**: Powers the AI analysis of websites
- **Get it from**: https://console.groq.com/keys

### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SECRET=whsec_...
```
- **Purpose**: User authentication and profile management
- **Get it from**: https://dashboard.clerk.com
- **Setup**:
  1. Create a Clerk application
  2. Copy your publishable and secret keys
  3. Set up webhook endpoint at `/api/webhooks/clerk`
  4. Subscribe to `user.created` and `user.updated` events
  5. Copy the webhook signing secret

### Sanity CMS
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_USE_CDN=true
SANITY_API_TOKEN=your_sanity_api_token
SANITY_AUTH_TOKEN=your_sanity_auth_token
```
- **Purpose**: Content management system for articles, categories, and tags
- **Get it from**: https://sanity.io/manage
- **Note**: Required for article functionality
- **Setup**:
  1. Create a Sanity project at https://sanity.io
  2. Get your Project ID and Dataset from the project settings
  3. Create an API token with Editor permissions (for seeding categories and API operations)
  4. Create an Auth token with **Viewer permissions** (for Studio access) - This is different from the API token
  5. Run the seed script to create initial categories: `npm run seed:sanity`
  6. Access Sanity Studio at `/studio` route

### Cloudflare D1 Database
```
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_API_TOKEN=your_api_token
```
- **Purpose**: Store user profiles and analysis history
- **Get it from**: https://dash.cloudflare.com
- **Note**: Only needed for local development or Vercel deployment. When deployed to Cloudflare Workers, the DB binding will be used instead.
- **Setup**:
  1. Create a D1 database in Cloudflare dashboard
  2. Run the schema from `schema.sql`
  3. Get your Account ID from Cloudflare dashboard
  4. Get your Database ID from the D1 database page
  5. Create an API token with D1 edit permissions

## Setup Instructions

1. Copy the template below to `.env.local`:
```bash
# Groq AI API Key
GROQ_API_KEY=

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SECRET=

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_USE_CDN=true
SANITY_API_TOKEN=
SANITY_AUTH_TOKEN=

# Cloudflare D1 Database
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_DATABASE_ID=
CLOUDFLARE_API_TOKEN=
```

2. Fill in the values from your service providers
3. Restart your development server

## Testing Locally

For local development with webhooks, you'll need to:
1. Use a tool like [ngrok](https://ngrok.com/) or [localtunnel](https://localtunnel.github.io/www/) to expose your local server
2. Configure the webhook URL in Clerk dashboard to point to your tunnel URL + `/api/webhooks/clerk`

Example with ngrok:
```bash
ngrok http 3000
```
Then use: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`

