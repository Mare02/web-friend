# AI Website Optimizer

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

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **AI Provider**: Groq (with abstraction for future providers)
- **Validation**: Zod
- **HTML Parsing**: Cheerio
- **TypeScript**: Full type safety

## Architecture

This application is built with scalability and maintainability in mind:

```
src/
├── app/                    # Next.js app directory
│   ├── api/analyze/        # API endpoint for website analysis
│   └── page.tsx            # Main UI
├── lib/
│   ├── ai/                 # AI provider abstraction layer
│   │   ├── providers/      # Individual AI provider implementations
│   │   │   ├── base.ts     # Provider interface
│   │   │   └── groq.ts     # Groq implementation
│   │   └── index.ts        # Provider factory
│   ├── services/           # Business logic
│   │   ├── website-fetcher.ts  # HTML fetching & parsing
│   │   └── analyzer.ts         # Analysis orchestration
│   └── validators/         # Zod schemas
└── components/             # React components
    ├── ui/                 # shadcn components
    ├── analyzer-form.tsx   # URL input form
    └── analysis-results.tsx # Results display
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

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd web-friend

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Usage

1. Enter a website URL (e.g., `https://example.com`)
2. Provide your Groq API key
3. Click "Analyze Website"
4. View comprehensive insights across 4 categories:
   - Content Analysis
   - SEO Insights
   - Performance
   - Accessibility

## API

### POST /api/analyze

Analyzes a website URL.

**Request Body:**
```json
{
  "url": "https://example.com",
  "apiKey": "gsk_..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "websiteData": {
      "url": "https://example.com",
      "title": "Example Domain",
      "metaDescription": "...",
      "headings": { "h1": [...], "h2": [...] },
      "images": { "total": 5, "withAlt": 3, "withoutAlt": 2 },
      ...
    },
    "analysis": {
      "content": "...",
      "seo": "...",
      "performance": "...",
      "accessibility": "..."
    }
  }
}
```

## Future Enhancements

- [ ] Add OpenAI and Claude providers
- [ ] User authentication & API key storage
- [ ] Analysis history and dashboard
- [ ] Cloudflare D1 database integration
- [ ] Cloudflare Workers migration
- [ ] Lighthouse integration for performance scores
- [ ] PDF report generation
- [ ] Scheduled monitoring & alerts

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
