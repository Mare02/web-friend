## Project Description
A comprehensive suite of free digital tools for businesses, creators, and professionals working online. Features text analysis, QR code generation, color palette creation, API testing, and indexability validation - all completely free with no ads or subscriptions. Includes a full CMS-powered blog system.

## Tech Stack
- **Framework**: Next.js 16.0 (App Router + Turbopack)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **AI**: Groq SDK with extensible provider abstraction
- **Database**: Cloudflare D1 (SQLite) + Sanity CMS
- **Auth**: Clerk
- **Validation**: Zod 4.1.12
- **HTML Parsing**: Cheerio
- **Content Management**: Sanity.io

## Key Features

### Core Tools Suite (6 Tools)
- **Text Analyzer**: Analyze text readability, SEO keywords, and content quality metrics
- **Color Palette Generator**: Generate harmonious color palettes using color theory
- **API Tester**: Test REST APIs with authentication support and request history
- **QR Code Generator**: Generate custom QR codes for URLs, text, email, phone, and WiFi
- **Indexability Validator**: Analyze robots.txt, check indexability blockers, validate sitemaps

### Content Management System
- **Sanity Studio**: Integrated admin interface for content management
- **Blog System**: Article publishing with categories and tags
- **Dynamic Content**: Recent articles, filtering, and search
- **SEO-Optimized**: Server-side rendering and metadata management

## Architecture
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (15+ endpoints)
│   ├── admin/studio/      # Sanity Studio integration
│   ├── blogs/             # Blog pages with ISR
│   └── tools/             # Individual tool pages
├── lib/
│   ├── ai/                # AI provider abstraction
│   ├── services/          # Business logic (15+ services)
│   ├── sanity/            # CMS integration
│   ├── validators/        # Zod schemas
│   └── db.ts              # D1 database client
└── components/            # React components (50+ components)
    ├── ui/               # shadcn/ui components
    ├── blogs/            # Blog-related components
    ├── tools/            # Tool-specific components
    └── *.tsx             # Feature components
```

## Key Design Patterns
- **Provider Pattern**: Easy to add OpenAI, Claude, or other AI providers
- **Service Layer**: Framework-agnostic (Cloudflare Workers ready)
- **Type Safety**: Zod validation + TypeScript for runtime & compile-time safety
- **Stateless API**: Horizontally scalable with proper error handling
- **Component Composition**: Reusable UI components with consistent patterns

## API Endpoints (15+ Routes)

### Tools & Validation
- `POST /api/robots-validate` - Robots.txt and indexability validation

### Additional Tools
- `POST /api/text-analyzer` - Text analysis and optimization
- `POST /api/color-palette` - Color palette generation
- `POST /api/qr-code` - QR code generation

### System & Auth
- `POST /api/webhooks/clerk` - Authentication webhooks
- `GET /api/history` - User activity history
- `POST /api/cleanup` - Data cleanup utilities

## Database Schema
- **User Profiles**: Clerk authentication data
- **Content**: Sanity CMS for blogs and articles

## File Structure (Key Files)
```
src/
├── app/api/robots-validate/route.ts   # Indexability validation
├── app/admin/studio/[[...index]]/     # Sanity Studio
├── app/blogs/page.tsx                 # Blog listing with ISR
├── lib/services/robots-validator.ts   # Indexability validation
├── lib/services/text-analyzer.ts      # Text analysis
├── lib/services/color-palette-service.ts # Color palette generation
├── lib/services/qr-code-service.ts    # QR code generation
├── lib/services/api-tester-utils.ts   # API testing utilities
├── lib/services/xml-converter.ts      # XML/JSON conversion
├── lib/services/article-service.ts    # Blog content management
├── lib/services/user-service.ts       # User management
├── lib/ai/providers/groq.ts           # AI provider
├── lib/sanity/client.ts               # CMS integration
├── components/text-analyzer.tsx       # Text analysis UI
├── components/color-palette-generator.tsx # Color palette UI
├── components/qr-code-generator.tsx   # QR code generation UI
├── components/api-tester.tsx          # API testing UI
├── components/xml-json-converter.tsx  # XML/JSON converter UI
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