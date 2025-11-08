# Web Friend

A comprehensive suite of free digital tools for businesses, creators, and professionals working online. Includes a CMS-powered blog system.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square)

## Features

### Core Tools Suite (5 Tools)

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
- **User Authentication** - Optional Clerk authentication for personalized experience
- **Content Management** - Full-featured blog platform with Sanity CMS integration

## Tech Stack

- **Framework**: Next.js 16.0 (App Router + Turbopack)
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
│   ├── api/               # API routes
│   │   ├── robots-validate/ # Indexability validation
│   │   └── webhooks/      # Clerk authentication
│   ├── admin/studio/      # Sanity Studio integration
│   ├── blogs/             # Blog pages with ISR
│   ├── tools/             # Individual tool pages
│   └── page.tsx           # Homepage with tool showcase
├── lib/
│   ├── services/          # Business logic
│   ├── sanity/            # CMS integration
│   │   ├── client.ts      # Sanity client
│   │   ├── schemas/       # Content schemas
│   │   └── utils.ts       # Helper functions
│   └── validators/        # Zod schemas
└── components/            # React components
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


## Database Setup

### Cloudflare D1 (SQLite)
Used for user data and application state. See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed setup.

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