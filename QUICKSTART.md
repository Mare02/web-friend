# Quick Start Guide

## Prerequisites

1. **Node.js 20+** installed
2. **Groq API Key** - Get one free at [console.groq.com](https://console.groq.com)

## Installation (30 seconds)

```bash
# 1. Navigate to project
cd web-friend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

## Usage (2 minutes)

1. **Open your browser** → `http://localhost:3000`

2. **Get your Groq API key**:
   - Visit [console.groq.com](https://console.groq.com)
   - Sign up (free)
   - Create an API key
   - Copy it (starts with `gsk_...`)

3. **Analyze a website**:
   - Enter a URL (e.g., `https://example.com`)
   - Paste your Groq API key
   - Click "Analyze Website"
   - Wait ~10-30 seconds for analysis

4. **Review insights**:
   - SEO score and recommendations
   - Content quality feedback
   - Performance suggestions
   - Accessibility audit

## Example URLs to Try

- `https://example.com` - Simple site
- `https://github.com` - Complex site
- `https://vercel.com` - Modern Next.js site
- Your own website!

## What You'll Get

### Overview Card
- SEO Score (0-100%)
- Accessibility Score (0-100%)
- Word count
- Framework detection
- Resource counts

### Content Analysis
- Readability assessment
- Structure evaluation
- Heading hierarchy review
- Content depth analysis

### SEO Insights
- Title tag optimization
- Meta description review
- Heading structure
- Keyword usage
- Open Graph tags

### Performance
- Script/stylesheet optimization
- Image handling recommendations
- Resource loading strategies
- Framework-specific tips

### Accessibility
- Alt text coverage
- Semantic HTML usage
- Screen reader compatibility
- ARIA compliance

## Troubleshooting

### "Failed to fetch website data"
- Check if the URL is accessible
- Some sites block automated requests
- Try a different website

### "Groq API error"
- Verify your API key is correct
- Check you have API credits
- Ensure the key starts with `gsk_`

### "Invalid URL"
- Include the protocol (`https://`)
- Ensure the URL is properly formatted
- Example: `https://example.com`

## Next Steps

### Customize Analysis
Edit `src/lib/services/analyzer.ts` to change:
- AI prompts
- Analysis focus areas
- Scoring algorithms

### Add New AI Providers
1. Create `src/lib/ai/providers/openai.ts`
2. Implement `AIProvider` interface
3. Update factory in `src/lib/ai/index.ts`

### Modify UI
- Components in `src/components/`
- Main page: `src/app/page.tsx`
- Styles: `src/app/globals.css`

### Add Features
- User authentication
- Analysis history (add database)
- Scheduled monitoring
- PDF reports
- Multiple URL batch analysis

## Production Deployment

```bash
# Build
npm run build

# Start production server
npm start
```

Or deploy to Vercel:
```bash
vercel
```

## Support

- **Documentation**: See `README.md` and `IMPLEMENTATION.md`
- **Issues**: Check GitHub issues
- **API Docs**: [Groq Documentation](https://console.groq.com/docs)

## Tips

1. **API Key Security**: Never commit API keys to git
2. **Rate Limits**: Groq has generous free tier limits
3. **Analysis Time**: Complex sites take longer (~30s vs ~10s)
4. **Best Results**: Works best on public websites
5. **CORS**: Server-side fetching avoids CORS issues

Enjoy analyzing websites! 🚀

