# Quick Start Guide

## Prerequisites

1. **Node.js 20+** installed
2. **Groq API Key** - Get one free at [console.groq.com](https://console.groq.com)
3. **Cloudflare Account** (optional, for database) - [cloudflare.com](https://cloudflare.com)
4. **Clerk Account** (optional, for authentication) - [clerk.com](https://clerk.com)
5. **Sanity Account** (optional, for CMS) - [sanity.io](https://sanity.io)

## Installation (5 minutes)

```bash
# 1. Navigate to project
cd web-friend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys (see below)

# 4. (Optional) Set up Cloudflare D1 database
wrangler d1 create web-friend-db
wrangler d1 execute web-friend-db --file=schema.sql

# 5. (Optional) Seed Sanity CMS with categories and tags
npm run seed:sanity

# 6. Start development server
npm run dev
```

## Environment Setup

### Required
```env
GROQ_API_KEY=your_groq_api_key_here
```

### Optional - Database (Cloudflare D1)
```env
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_DATABASE_ID=your_d1_database_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
```

### Optional - Authentication (Clerk)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SECRET=whsec_...
```

### Optional - CMS (Sanity)
```env
SANITY_PROJECT_ID=your_sanity_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token
```

## Usage (3 minutes)

1. **Open your browser** → `http://localhost:3000`

2. **Get your Groq API key**:
   - Visit [console.groq.com](https://console.groq.com)
   - Sign up (free)
   - Create an API key
   - Copy it (starts with `gsk_`)

3. **Explore the tools**:
   - **Website Analyzer**: Comprehensive SEO, performance, and accessibility analysis
   - **Text Analyzer**: Content optimization and readability scoring
   - **Color Palette Generator**: Design harmonious color schemes
   - **API Tester**: Test and debug REST API endpoints
   - **QR Code Generator**: Create custom QR codes for various content types
   - **Indexability Validator**: Check robots.txt and sitemap configurations

4. **Try a tool**:
   - Select "AI Website Analyzer" from the homepage
   - Enter a URL (e.g., `https://example.com`)
   - Paste your Groq API key
   - Click "Analyze Website"
   - Wait ~10-30 seconds for complete analysis

5. **Review comprehensive insights**:
   - SEO score and actionable recommendations
   - Performance metrics and Lighthouse scores
   - Accessibility audit with WCAG compliance
   - Content analysis with readability scores
   - Action plan with prioritized tasks

## Tool Suite Overview

### AI Website Analyzer
**Purpose**: Complete website audit with AI-powered insights
- SEO analysis (titles, meta, keywords, structure)
- Performance metrics (Lighthouse integration)
- Accessibility audit (WCAG compliance)
- Content quality assessment
- Action plan generation with task tracking

### Text Analyzer
**Purpose**: Optimize written content for SEO and readability
- Readability scoring (Flesch-Kincaid, etc.)
- Keyword density analysis
- SEO recommendations
- Content structure evaluation
- Grammar and style suggestions

### Color Palette Generator
**Purpose**: Create professional color schemes for design projects
- Color harmony generation
- Multiple color theory algorithms
- CSS export functionality
- Color accessibility checking
- Palette visualization and download

### API Tester
**Purpose**: Test and debug REST API endpoints
- HTTP method support (GET, POST, PUT, DELETE)
- Authentication headers
- Request/response inspection
- Request history and saving
- JSON/XML response formatting

### QR Code Generator
**Purpose**: Generate QR codes for various content types
- URLs, text, email addresses
- Phone numbers and WiFi networks
- Custom colors and styling
- Download options (PNG, SVG)
- Error correction levels

### Indexability Validator
**Purpose**: Ensure search engines can crawl and index your site
- Robots.txt analysis and validation
- Sitemap detection and checking
- Indexability blocker identification
- SEO recommendations
- Crawl budget optimization tips

## Blog & CMS Features

### Content Management
- **Admin Studio**: Visit `/admin/studio` to manage blog content
- **Article Publishing**: Create, edit, and publish blog posts
- **Categories & Tags**: Organize content with taxonomies
- **Rich Text Editor**: Portable Text with formatting options

### Blog Features
- **ISR Pages**: Incremental Static Regeneration for performance
- **Article Filtering**: Filter by categories and tags
- **Recent Articles**: Homepage showcase of latest content
- **SEO Optimized**: Meta tags and structured data

## Authentication & User Features (Optional)

### Clerk Integration
- **Social Login**: Google, GitHub, email/password
- **User Profiles**: Personalized dashboards
- **Analysis History**: Save and track all analyses
- **Task Management**: Personal action plans and progress tracking

### User Benefits
- Persistent data across sessions
- Analysis history and comparisons
- Task progress tracking
- Reanalysis verification for completed tasks

## Example URLs to Try

### Website Analyzer
- `https://example.com` - Simple site for basics
- `https://github.com` - Complex site with lots of content
- `https://vercel.com` - Modern Next.js site
- `https://stripe.com` - High-performance commerce site
- Your own website!

### API Tester
- `https://jsonplaceholder.typicode.com/posts` - Test GET requests
- `https://httpbin.org/post` - Test POST requests
- `https://api.github.com/user` - Test with authentication

### Indexability Validator
- `https://example.com` - Basic robots.txt
- `https://github.com` - Complex configuration
- `https://vercel.com` - Modern setup

## What You'll Get

### Website Analyzer Results
- **SEO Score** (0-100%) with improvement suggestions
- **Performance Metrics** from Lighthouse (speed, accessibility, best practices)
- **Content Analysis** with readability scores and keyword insights
- **Accessibility Audit** with WCAG compliance checking
- **Action Plan** with prioritized, actionable tasks
- **Technical Details** (framework detection, resource counts, headers)

### Tool-Specific Outputs
- **Text Analyzer**: Readability metrics, keyword analysis, optimization tips
- **Color Generator**: Hex codes, CSS variables, accessibility ratings
- **API Tester**: Response codes, headers, formatted JSON/XML
- **QR Codes**: Downloadable images with custom styling
- **Indexability**: Robots.txt validation, sitemap checks, SEO recommendations

## Troubleshooting

### "Failed to fetch website data"
- Check if the URL is accessible and public
- Some sites block automated requests
- Try a different website or your own site

### "Groq API error"
- Verify your API key is correct (starts with `gsk_`)
- Check you have API credits in Groq console
- Ensure the key is properly set in `.env.local`

### "Invalid URL"
- Include the protocol (`https://` or `http://`)
- Ensure the URL is properly formatted
- Some sites require `www.` prefix

### Database Connection Issues
- Verify Cloudflare credentials in `.env.local`
- Check that D1 database was created and schema applied
- Ensure `wrangler` CLI is authenticated (`wrangler whoami`)

### Authentication Problems
- Check Clerk keys are correct in `.env.local`
- Verify webhook URL is set correctly in Clerk dashboard
- Restart dev server after changing environment variables

### CMS/Content Issues
- Ensure Sanity project is configured correctly
- Check API token has proper permissions
- Run `npm run seed:sanity` to initialize content

## Next Steps

### Customize Analysis
Edit service files in `src/lib/services/` to modify:
- AI prompts and analysis criteria
- Scoring algorithms and thresholds
- Tool-specific logic and features

### Add New AI Providers
1. Create `src/lib/ai/providers/openai.ts` or `claude.ts`
2. Implement the `AIProvider` interface
3. Update factory in `src/lib/ai/index.ts`

### Extend the Tool Suite
1. Add tool definition to `src/lib/tools-data.ts`
2. Create tool page in `src/app/tools/[tool-name]/page.tsx`
3. Build component in `src/components/[tool-name].tsx`
4. Add service logic in `src/lib/services/[tool-name]-service.ts`
5. Create API endpoint in `src/app/api/[tool-name]/route.ts`

### Content Management
- Access Sanity Studio at `/admin/studio`
- Create blog categories and tags
- Publish articles with rich content
- Manage SEO metadata and descriptions

### User Features (with Clerk)
- Enable authentication for data persistence
- Set up webhooks for user synchronization
- Configure production Clerk application

## Production Deployment

### Build Process
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Deployment Options
- **Vercel**: `vercel` (recommended)
- **Netlify**: Standard Next.js deployment
- **Cloudflare Pages**: With D1 database integration
- **Self-hosted**: Any Node.js hosting platform

### Environment Variables
Ensure all production environment variables are set:
- API keys (Groq, Clerk, Sanity)
- Database credentials (Cloudflare D1)
- Webhook URLs for authentication

## Support & Resources

### Documentation
- **Full README**: See `README.md` for complete documentation
- **Database Setup**: `DATABASE_SETUP.md` for D1 configuration
- **Authentication**: `CLERK_SETUP.md` for Clerk integration
- **API Reference**: All endpoints documented in README

### Community & Help
- **Issues**: Check GitHub issues for common problems
- **Groq Docs**: [console.groq.com/docs](https://console.groq.com/docs)
- **Clerk Docs**: [clerk.com/docs](https://clerk.com/docs)
- **Sanity Docs**: [sanity.io/docs](https://sanity.io/docs)

## Tips & Best Practices

1. **API Key Security**: Never commit keys to git, use environment variables
2. **Rate Limits**: Groq has generous free tiers, monitor usage
3. **Analysis Time**: Complex sites take longer (~30s vs ~10s)
4. **Database**: D1 has free tier limits (5GB storage, 100k daily writes)
5. **Authentication**: Clerk free tier includes 10k MAU
6. **CMS**: Sanity free tier perfect for small blogs
7. **Performance**: Server-side fetching avoids CORS issues
8. **Development**: Use `npm run dev` with Turbopack for fast reloads

Enjoy exploring the comprehensive digital tools suite! 🚀