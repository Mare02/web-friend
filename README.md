# Web Friend

A comprehensive suite of free digital tools for businesses, creators, and professionals working online. Features AI-powered website analysis, content optimization, QR code generation, color palette creation, API testing, and indexability validation - all completely free with no ads or subscriptions.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square)

## Features

### Core Tools Suite (6 Tools)

- **AI Website Analyzer** - Comprehensive SEO, performance, and accessibility analysis with AI-powered insights and actionable recommendations
- **Text Analyzer** - Analyze text readability, SEO keywords, content quality metrics, and optimization suggestions
- **Color Palette Generator** - Generate harmonious color palettes using color theory and design principles with CSS export
- **API Tester** - Test REST APIs with authentication support, request history, and detailed response analysis
- **QR Code Generator** - Generate custom QR codes for URLs, text, email addresses, phone numbers, and WiFi networks
- **Indexability Validator** - Analyze robots.txt configuration, check indexability blockers, validate sitemaps, and get SEO recommendations

### Content Management System
- **Blog Platform** - Full-featured blog with Sanity CMS integration, categories, tags, and SEO optimization
- **Admin Studio** - Integrated Sanity Studio for content management and article publishing
- **Dynamic Content** - ISR-enabled blog pages with filtering, search, and recent articles display

### Advanced Features
- **Action Plans** - Generate prioritized, actionable task lists from website analysis with progress tracking
- **Task Management** - Track task status, add notes, and monitor completion with reanalysis verification
- **Data Persistence** - Save analyses, tasks, and user data to Cloudflare D1 database
- **User Authentication** - Optional Clerk authentication for personalized experience and data persistence

## Tech Stack

- **Framework**: Next.js 15.5.5 (App Router + Turbopack)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **AI Provider**: Groq SDK (with extensible provider abstraction)
- **Database**: Cloudflare D1 (SQLite) + Sanity CMS
- **Authentication**: Clerk (optional)
- **Validation**: Zod 4.1.12
- **HTML Parsing**: Cheerio
- **Content Management**: Sanity.io + Portable Text
- **Performance**: Lighthouse integration
- **Icons**: Lucide React
- **Themes**: next-themes

## Architecture

This application is built with scalability and maintainability in mind:

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (15+ endpoints)
│   │   ├── analyze/       # Website analysis
│   │   ├── generate-plan/ # Action plan generation
│   │   ├── analyses/      # Analysis history & retrieval
│   │   ├── tasks/         # Task management
│   │   ├── lighthouse/    # Performance analysis
│   │   ├── robots-validate/ # Indexability validation
│   │   └── webhooks/      # Clerk authentication
│   ├── admin/studio/      # Sanity Studio integration
│   ├── blogs/             # Blog pages with ISR
│   ├── tools/             # Individual tool pages
│   └── page.tsx           # Homepage with tool showcase
├── lib/
│   ├── ai/                # AI provider abstraction layer
│   │   ├── providers/     # Individual AI implementations
│   │   │   ├── base.ts    # Provider interface
│   │   │   └── groq.ts    # Groq implementation
│   │   └── index.ts       # Provider factory
│   ├── services/          # Business logic (15+ services)
│   │   ├── analyzer.ts        # Analysis orchestration
│   │   ├── action-planner.ts  # Action plan generation
│   │   ├── lighthouse-service.ts # Performance analysis
│   │   ├── robots-validator.ts   # Indexability validation
│   │   ├── text-analyzer.ts     # Text analysis
│   │   ├── color-palette-service.ts # Color palette generation
│   │   ├── qr-code-service.ts   # QR code generation
│   │   └── article-service.ts   # Blog/CMS integration
│   ├── sanity/            # CMS integration
│   │   ├── client.ts      # Sanity client
│   │   ├── schemas/       # Content schemas
│   │   └── utils.ts       # Helper functions
│   ├── db.ts              # D1 database client
│   └── validators/        # Zod schemas
└── components/            # React components (50+ components)
    ├── ui/                # shadcn/ui components
    ├── blogs/             # Blog-related components
    ├── tools/             # Tool-specific components
    └── *.tsx              # Feature components
```

### Key Design Decisions

1. **Provider Pattern**: Easy to add OpenAI, Claude, or other AI providers
2. **Service Layer**: Pure functions, framework-agnostic (ready for Cloudflare Workers)
3. **Type Safety**: Zod validation + TypeScript for runtime & compile-time safety
4. **Stateless API**: Horizontally scalable with proper error handling
5. **CMS Integration**: Sanity for content management with ISR for performance
6. **Tool Abstraction**: Consistent interface across all tools for maintainability

## Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, or pnpm
- A Groq API key ([Get one free](https://console.groq.com))
- (Optional) Cloudflare account for D1 database
- (Optional) Clerk account for authentication

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd web-friend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# (Optional) Set up D1 database
# See DATABASE_SETUP.md for detailed instructions
wrangler d1 create web-friend-db
wrangler d1 execute web-friend-db --file=schema.sql

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Usage

1. **Choose Your Tool** - Select from 6 professional digital tools:
   - **Website Analyzer**: SEO, performance, and accessibility analysis
   - **Text Analyzer**: Content optimization and readability scoring
   - **Color Palette Generator**: Design harmonious color schemes
   - **API Tester**: Test and debug REST API endpoints
   - **QR Code Generator**: Create custom QR codes for various content types
   - **Indexability Validator**: Check robots.txt and sitemap configurations

2. **Use the Tools** - Each tool provides professional-grade features:
   - Enter your input (URL, text, colors, API endpoints, etc.)
   - Get instant results with detailed analysis and recommendations
   - Export results, copy codes, or download generated content

3. **Explore Content** - Browse our blog for digital tools insights and best practices

4. **Advanced Features** (with account):
   - Save analyses and track progress with action plans
   - Manage tasks and verify completion through reanalysis
   - Access your personal dashboard and usage history

All tools are **completely free** with no ads, subscriptions, or limitations.

## API Endpoints

### Analysis & Tools

#### POST /api/analyze
Analyzes a website URL and returns comprehensive SEO, performance, and accessibility insights.

**Request:** `{ "url": "https://example.com" }`
**Response:** Website data + AI-powered analysis results

#### POST /api/generate-plan
Generates an actionable improvement plan from analysis results.

**Request:** `{ "analysis": {...}, "websiteData": {...} }`
**Response:** Prioritized action plan with tasks

#### POST /api/lighthouse
Runs Lighthouse performance analysis on a website.

**Request:** `{ "url": "https://example.com" }`
**Response:** Performance metrics and recommendations

#### POST /api/robots-validate
Validates robots.txt configuration and checks indexability.

**Request:** `{ "url": "https://example.com" }`
**Response:** Robots.txt analysis and SEO recommendations

### Data Management

#### GET /api/analyses?userId=xxx&limit=10
Returns user's analysis history with pagination.

#### GET /api/analyses/[id]
Retrieves a single analysis with full details.

#### GET /api/tasks?userId=xxx&status=pending
Lists user's tasks with optional status filtering.

#### PATCH /api/tasks/[id]
Updates task status, notes, or completion status.

**Request:** `{ "status": "completed", "notes": "...", "completed": true }`

#### POST /api/tasks/[id]/reanalyze
Reanalyzes a website to verify task completion.

**Request:** `{ "url": "https://example.com" }`
**Response:** Updated task status based on reanalysis

### System & Auth

#### POST /api/webhooks/clerk
Handles Clerk authentication events for user management.

#### GET /api/history?userId=xxx
Returns user's activity history and usage statistics.

#### POST /api/cleanup
Administrative endpoint for data cleanup operations.

### Tool Endpoints (Frontend-Only)
- `/api/text-analyzer` - Text analysis and optimization
- `/api/color-palette` - Color palette generation
- `/api/qr-code` - QR code generation
- `/api/api-tester` - API testing utilities

All endpoints return consistent response format:
```typescript
{ success: true, data: {...} }
// or
{ success: false, error: "message" }
```

## Database Setup

This project uses **dual database architecture** for optimal performance and flexibility:

### Cloudflare D1 (SQLite)
Used for user data, analyses, tasks, and application state. See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed setup.

**Quick Setup:**
```bash
# Create database
wrangler d1 create web-friend-db

# Apply schema
wrangler d1 execute web-friend-db --file=schema.sql

# Configure environment variables:
# CLOUDFLARE_ACCOUNT_ID=xxx
# CLOUDFLARE_DATABASE_ID=xxx
# CLOUDFLARE_API_TOKEN=xxx
```

### Sanity CMS
Used for blog content, articles, categories, and tags with real-time collaboration.

**Setup:**
```bash
# Install Sanity CLI and initialize
npm install -g @sanity/cli
sanity init

# Configure environment variables:
# SANITY_PROJECT_ID=xxx
# SANITY_DATASET=xxx
# SANITY_API_TOKEN=xxx
```

See [CLERK_SETUP.md](CLERK_SETUP.md) for authentication configuration.

## Current Status & Roadmap

### ✅ Implemented Features
- [x] Complete tool suite (6 professional digital tools)
- [x] AI-powered website analysis with Groq integration
- [x] User authentication via Clerk
- [x] Analysis history and data persistence (Cloudflare D1)
- [x] Action plan generation and task management
- [x] Task reanalysis and completion verification
- [x] Lighthouse performance analysis integration
- [x] Blog platform with Sanity CMS
- [x] Admin studio for content management
- [x] Responsive design with dark/light themes

### 🚧 Future Enhancements
- [ ] Add OpenAI and Claude AI providers
- [ ] Cloudflare Workers migration for edge deployment
- [ ] PDF report generation for analyses
- [ ] Scheduled monitoring and automated alerts
- [ ] Task reordering and custom task creation
- [ ] Analysis comparison and trending tools
- [ ] API rate limiting and usage analytics
- [ ] Multi-language support and internationalization
- [ ] Advanced user dashboard with analytics
- [ ] Integration with popular CMS platforms

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.
