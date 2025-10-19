## Project Description
AI-powered website analysis tool that evaluates websites for SEO, content quality, performance, and accessibility. Provides actionable insights and generates prioritized task lists.

## Tech Stack
- **Framework**: Next.js 15.5.5 (App Router + Turbopack)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **AI**: Groq SDK with extensible provider abstraction
- **Database**: Cloudflare D1 (SQLite)
- **Auth**: Clerk (optional)
- **Validation**: Zod 4.1.12
- **HTML Parsing**: Cheerio

## Key Features
- SEO Analysis (title tags, meta descriptions, headings)
- Content Quality Assessment (readability, structure)
- Performance Insights (scripts, images, optimization)
- Accessibility Checks (alt text, semantic HTML)
- AI-Powered Recommendations
- Action Plan Generation with prioritized tasks
- Task Management & Tracking
- Task Reanalysis (verify completion)
- Data Persistence (Cloudflare D1)

## Architecture
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (analyze, tasks, webhooks)
│   ├── dashboard/         # User dashboard
│   └── analysis/[id]/     # Analysis pages
├── lib/
│   ├── ai/                # AI provider abstraction
│   ├── services/          # Business logic (pure functions)
│   ├── validators/        # Zod schemas
│   └── db.ts              # D1 database client
└── components/            # React components
    ├── ui/                # shadcn/ui components
    └── *.tsx              # Custom components
```

## Key Design Patterns
- **Provider Pattern**: Easy to add OpenAI, Claude, etc.
- **Service Layer**: Framework-agnostic (Cloudflare Workers ready)
- **Type Safety**: Zod + TypeScript
- **Stateless API**: Horizontally scalable

## API Endpoints
- `POST /api/analyze` - Analyze website
- `POST /api/generate-plan` - Create action plan
- `GET /api/analyses` - Analysis history
- `GET /api/tasks` - Task management
- `PATCH /api/tasks/[id]` - Update task status
- `POST /api/webhooks/clerk` - Auth webhooks

## Current Status
- ✅ Core analysis functionality
- ✅ AI recommendations (Groq)
- ✅ Action plans & task management
- ✅ Database integration
- ✅ Authentication (Clerk)
- 🔄 Working on: Delete analysis feature
```

## File Structure (Key Files)
```
src/
├── app/api/analyze/route.ts           # Main analysis endpoint
├── app/api/generate-plan/route.ts     # Action plan generation
├── app/api/tasks/route.ts             # Task management
├── lib/services/analyzer.ts           # Analysis orchestration
├── lib/services/action-planner.ts     # Plan generation
├── lib/ai/providers/groq.ts           # AI provider
├── components/analysis-results.tsx    # Results display
├── components/task-list.tsx           # Task management UI
└── lib/validators/schema.ts           # Type definitions
```

## Code Style
- Functional components only
- "use client" for interactive components
- Server components by default
- Named exports for components
- Zod validation for all inputs
- Parallel API calls with Promise.all()
- Error handling with try-catch
- TypeScript strict mode
- Tailwind utility classes
- Dark/light theme support
```
