# Sitemap Optimization

The sitemap generation has been optimized to avoid fetching blog posts on every request by pre-generating a JSON file.

## How it works

1. **Generation**: Run `npm run generate:sitemap` to fetch all blog posts and save minimal data (`slug` and `publishedAt`) to `public/sitemap-data.json`

2. **Usage**: The sitemap route reads from this pre-generated JSON file instead of querying the database

3. **Performance**: Much faster sitemap generation and reduced database load

## Commands

```bash
# Generate sitemap data (run this when new articles are published)
npm run generate:sitemap

# View generated data
cat public/sitemap-data.json
```

## When to regenerate

Run the generation script when:
- New articles are published
- Articles are deleted
- Article slugs change
- During deployment/build process

## Integration with CI/CD

Add this to your deployment pipeline:

```bash
npm run generate:sitemap
```

The sitemap will automatically include the `/blogs` page and all individual blog posts with proper priorities and change frequencies.
