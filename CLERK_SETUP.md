# Clerk Authentication Setup Guide

This guide will help you set up Clerk authentication for the Web Friend project.

## Prerequisites

- A Clerk account (sign up at https://clerk.com)
- A Cloudflare D1 database set up (see QUICKSTART.md)
- Local development environment running

## Step 1: Create a Clerk Application

1. Go to https://dashboard.clerk.com
2. Click "Add application" or create your first application
3. Choose your application name (e.g., "Web Friend")
4. Select the authentication methods you want to support:
   - Email + Password
   - Google OAuth (recommended)
   - GitHub OAuth (optional)
   - Other social providers as needed
5. Click "Create Application"

## Step 2: Get Your API Keys

After creating your application:

1. In the Clerk dashboard, go to "API Keys" section
2. Copy the following values to your `.env.local` file:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```
3. Add the following URL configurations:
   ```
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   ```

## Step 3: Configure Clerk Webhook

The webhook syncs user data from Clerk to your D1 database automatically.

### For Local Development (with ngrok)

1. Install ngrok: `npm install -g ngrok` or download from https://ngrok.com
2. Start your Next.js dev server: `npm run dev`
3. In a new terminal, start ngrok: `ngrok http 3000`
4. Copy the HTTPS forwarding URL (e.g., `https://abc123.ngrok.io`)

### Configure Webhook in Clerk Dashboard

1. Go to "Webhooks" in the Clerk dashboard
2. Click "Add Endpoint"
3. Enter your webhook URL:
   - **Local (ngrok)**: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
   - **Production**: `https://your-domain.com/api/webhooks/clerk`
4. Subscribe to the following events:
   - ✅ `user.created`
   - ✅ `user.updated`
5. Click "Create"
6. Copy the **Signing Secret** (starts with `whsec_`)
7. Add it to your `.env.local`:
   ```
   CLERK_WEBHOOK_SECRET=whsec_...
   ```

## Step 4: Initialize D1 Database

Make sure your D1 database has the correct schema:

```bash
# Apply the schema to your D1 database
npx wrangler d1 execute your-database-name --file=schema.sql
```

Or use the Cloudflare dashboard to run the SQL from `schema.sql`.

## Step 5: Restart Development Server

After adding all environment variables:

```bash
npm run dev
```

## Step 6: Test the Integration

1. Open your app at `http://localhost:3000`
2. Click "Sign In" in the top right
3. Create a new account or sign in
4. Check your Cloudflare D1 database:
   ```bash
   npx wrangler d1 execute your-database-name --command "SELECT * FROM user_profiles"
   ```
5. Your user data should appear in the `user_profiles` table

## Troubleshooting

### Webhook not syncing users

1. **Check webhook endpoint is accessible**:
   - If using ngrok, make sure it's running
   - Try accessing `https://your-ngrok-url.ngrok.io/api/webhooks/clerk` manually (should return 405 Method Not Allowed for GET)

2. **Check webhook logs in Clerk dashboard**:
   - Go to Webhooks → Your endpoint → View logs
   - Look for failed requests and error messages

3. **Verify webhook secret**:
   - Make sure `CLERK_WEBHOOK_SECRET` matches the signing secret in Clerk dashboard
   - Check there are no extra spaces or newlines

4. **Check server logs**:
   - Look for errors in your Next.js terminal
   - Webhook errors will be logged to console

### Users not appearing in database

1. **Check D1 database connection**:
   - Verify `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_DATABASE_ID`, and `CLOUDFLARE_API_TOKEN` are correct
   - Check database exists and schema is applied

2. **Check webhook received the event**:
   - Look at webhook logs in Clerk dashboard
   - Verify `user.created` event was sent

3. **Test database connection manually**:
   ```bash
   npx wrangler d1 execute your-database-name --command "SELECT 1"
   ```

### Authentication not working

1. **Clear browser cache and cookies**
2. **Check environment variables are loaded**:
   - Restart dev server after changing `.env.local`
   - Verify variables with `console.log(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)` (only in dev!)
3. **Check Clerk application is in development mode** if testing locally

## Production Deployment

When deploying to production:

1. **Update Clerk webhook URL** to your production domain
2. **Add environment variables** to your hosting platform (Vercel, Cloudflare Pages, etc.)
3. **Use production Clerk keys** (not test keys)
4. **Ensure D1 database is accessible** from your production environment

## Features Enabled by Clerk Auth

With Clerk authentication enabled, users can:

- ✅ Sign in/up with email or social providers
- ✅ View their analysis history
- ✅ Have analyses automatically saved
- ✅ Access their data across devices
- ✅ See analyses grouped by URL

Anonymous users can still:
- ✅ Analyze websites without signing in
- ⚠️ But analyses won't be saved

## Security Best Practices

1. **Never commit** `.env.local` to git
2. **Use different Clerk applications** for development and production
3. **Rotate webhook secrets** periodically
4. **Monitor webhook logs** for suspicious activity
5. **Set up proper CORS** if using custom domains

## Need Help?

- Clerk Documentation: https://clerk.com/docs
- Clerk Discord: https://clerk.com/discord
- Project Issues: [Your GitHub Issues URL]

## Cost Considerations

### Clerk Free Tier Includes:
- 10,000 monthly active users (MAU)
- Unlimited sign-ins
- Social login providers
- Email + password authentication
- Webhook support

### Cloudflare D1 Free Tier Includes:
- 5 GB storage
- 5 million rows read per day
- 100,000 rows written per day

Both free tiers are generous for most small to medium projects!

