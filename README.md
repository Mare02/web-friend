# AI Website Analyzer

A powerful AI-driven tool to analyze websites for SEO, content quality, performance, and accessibility. Get actionable insights and recommendations powered by Groq AI.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square)

## Features

- **SEO Analysis** - Title tags, meta descriptions, heading hierarchy, Open Graph tags
- **Content Quality** - Readability, structure, and content depth assessment
- **Performance Insights** - Script/stylesheet optimization, image analysis
- **Accessibility Check** - Alt text coverage, semantic HTML, screen reader compatibility
- **AI-Powered Recommendations** - Actionable suggestions from Groq's LLMs
- **Action Plans** - Generate prioritized, actionable task lists from analysis
- **Data Persistence** - Save analyses and tasks to Cloudflare D1 database
- **Task Management** - Track task status, add notes, and monitor progress
- **Task Reanalysis** - Verify if tasks have been completed by re-checking the website

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **AI Provider**: Groq (with abstraction for future providers)
- **Database**: Cloudflare D1 (SQLite)
- **Validation**: Zod
- **HTML Parsing**: Cheerio
- **TypeScript**: Full type safety
- **Authentication**: Clerk (optional)

## Architecture

This application is built with scalability and maintainability in mind:

```
src/
├── app/                    # Next.js app directory
│   ├── api/
│   │   ├── analyze/        # Website analysis endpoint
│   │   ├── generate-plan/  # Action plan generation
│   │   ├── analyses/       # Analysis history & retrieval
│   │   ├── tasks/          # Task management
│   │   └── webhooks/       # Clerk webhooks
│   └── page.tsx            # Main UI
├── lib/
│   ├── ai/                 # AI provider abstraction layer
│   │   ├── providers/      # Individual AI provider implementations
│   │   │   ├── base.ts     # Provider interface
│   │   │   └── groq.ts     # Groq implementation
│   │   └── index.ts        # Provider factory
│   ├── services/           # Business logic
│   │   ├── website-fetcher.ts  # HTML fetching & parsing
│   │   ├── analyzer.ts         # Analysis orchestration
│   │   ├── action-planner.ts   # Action plan generation
│   │   ├── analysis-db.ts      # Analysis database operations
│   │   └── task-db.ts          # Task database operations
│   ├── db.ts               # D1 database client
│   └── validators/         # Zod schemas
└── components/             # React components
    ├── ui/                 # shadcn components
    ├── analyzer-form.tsx   # URL input form
    ├── analysis-results.tsx # Results display
    ├── action-plan-view.tsx # Action plan display
    └── analysis-history.tsx # Analysis history
```

### Key Design Decisions

1. **Provider Pattern**: Easy to add OpenAI, Claude, or other AI providers
2. **Service Layer**: Pure functions, framework-agnostic (ready for Cloudflare Workers)
3. **Type Safety**: Zod validation + TypeScript for runtime & compile-time safety
4. **Stateless API**: No server-side sessions, easy to scale horizontally

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

1. Enter a website URL (e.g., `https://example.com`)
2. Click "Analyze Website"
3. View comprehensive insights across 4 categories:
   - Content Analysis
   - SEO Insights
   - Performance
   - Accessibility
4. Generate an action plan with prioritized tasks
5. (Optional) Sign in to save analyses and track tasks

## API Endpoints

### Analysis

#### POST /api/analyze
Analyzes a website URL and returns comprehensive insights.

**Request:** `{ "url": "https://example.com" }`
**Response:** Website data + AI analysis

#### POST /api/generate-plan
Generates an actionable improvement plan and saves to database.

**Request:** `{ "analysis": {...}, "websiteData": {...} }`
**Response:** Action plan with prioritized tasks

#### GET /api/analyses?userId=xxx&limit=10
Returns user's analysis history (requires authentication).

#### GET /api/analyses/[id]
Retrieves a single analysis with full details.

### Tasks

#### GET /api/tasks?userId=xxx&status=pending
Lists user's tasks with optional status filter.

#### PATCH /api/tasks/[id]
Updates task status or adds notes.

**Request:** `{ "status": "completed", "notes": "..." }`

### Webhooks

#### POST /api/webhooks/clerk
Handles Clerk authentication events (user creation, update, deletion).

See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) for detailed API documentation.

## Database Setup

This project uses Cloudflare D1 for data persistence. See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed setup instructions.

**Quick Setup:**
```bash
# Create database
wrangler d1 create web-friend-db

# Apply schema
wrangler d1 execute web-friend-db --file=schema.sql

# Configure environment variables
# Add to .env.local or Vercel:
# CLOUDFLARE_ACCOUNT_ID=xxx
# CLOUDFLARE_DATABASE_ID=xxx
# CLOUDFLARE_API_TOKEN=xxx
```

## Future Enhancements

- [ ] Add OpenAI and Claude providers
- [x] User authentication (Clerk ready)
- [x] Analysis history and persistence
- [x] Cloudflare D1 database integration
- [x] Action plan generation
- [x] Task management
- [ ] Cloudflare Workers migration
- [ ] Lighthouse integration for performance scores
- [ ] PDF report generation
- [ ] Scheduled monitoring & alerts
- [ ] Task reordering and custom tasks
- [ ] Analysis comparison tool

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
