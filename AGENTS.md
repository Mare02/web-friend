# AGENTS.md

This document serves as the foundational instruction set for all AI agent interactions within the **Web Friend** project. These mandates take absolute precedence over general defaults.

## Project Overview

This is a comprehensive suite of free digital tools for businesses, creators, and professionals working online. The application features:

- Digital tools including text analysis, QR code generation, color palette creation, API testing, and indexability validation
- A full CMS-powered blog system using Sanity.io
- Built with Next.js (App Router + Turbopack), TypeScript, Tailwind CSS, and shadcn/ui
- Cloudflare D1 (SQLite) for user data and Sanity CMS for content management
- Clerk authentication system

## Common Development Commands

### Development Workflow
```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Seed Sanity categories (development)
pnpm seed:sanity

# Generate sitemap data
pnpm generate:sitemap
```

### Testing Individual Components
- Run specific tool components by navigating to their respective pages in `/src/app/tools/[tool-name]/`
- Test API endpoints by making requests to `/api/[endpoint-name]`
- Check blog functionality through the Sanity Studio at `/admin/studio/`

### Package Management
- Use `pnpm` exclusively (as specified in .cursorrules)
- Dependencies are managed in `package.json`

## High-Level Code Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (15+ endpoints)
│   │   ├── robots-validate/ # Indexability validation
│   │   └── webhooks/      # Clerk authentication
│   ├── admin/studio/      # Sanity Studio integration
│   ├── blogs/             # Blog pages with ISR
│   └── tools/             # Individual tool pages (13+ tools)
├── lib/
│   ├── ai/                # AI provider abstraction (Groq SDK)
│   ├── services/          # Business logic (15+ services)
│   ├── sanity/            # CMS integration
│   ├── validators/        # Zod schemas
│   └── db.ts              # D1 database client
└── components/            # React components (50+ components)
    ├── ui/                # shadcn/ui components
    ├── blogs/             # Blog-related components
    ├── tools/             # Tool-specific components
    └── *.tsx              # Feature components
```

### Key Design Patterns
1. **Provider Pattern**: Extensible AI provider abstraction (currently using Groq SDK)
2. **Service Layer**: Pure functions, framework-agnostic business logic
3. **Type Safety**: Zod validation + TypeScript for runtime & compile-time safety
4. **Stateless API**: Horizontally scalable with proper error handling
5. **Tool Abstraction**: Consistent interface across all tools for maintainability

### Code Style Guidelines
- Functional components only with "use client" for interactive components
- Server components by default for better performance
- Named exports for components
- Zod validation for all inputs
- TypeScript strict mode
- Tailwind utility classes with dark/light theme support
- Responsive design with mobile-first approach

### Performance Considerations
- Minimize 'use client', 'useEffect', and 'setState'; favor React Server Components (RSC)
- Wrap client components in Suspense with fallback
- Use dynamic loading for non-critical components
- Optimize images with lazy loading
- Leverage ISR (Incremental Static Regeneration) for blog pages