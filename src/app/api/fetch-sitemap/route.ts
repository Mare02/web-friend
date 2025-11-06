import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { z } from "zod";

const fetchSitemapRequestSchema = z.object({
  url: z.string().url(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = fetchSitemapRequestSchema.parse(body);

    // Fetch the sitemap XML
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RobotsValidator/1.0; +https://example.com/bot)",
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch sitemap: ${response.status}` },
        { status: 400 }
      );
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("xml") && !contentType.includes("text")) {
      return NextResponse.json(
        { success: false, error: `Invalid content type: ${contentType}` },
        { status: 400 }
      );
    }

    const xml = await response.text();
    const $ = cheerio.load(xml, { xmlMode: true });

    const urls: any[] = [];

    // Check if it's a sitemap index or regular sitemap
    const sitemapIndex = $('sitemapindex').length > 0;
    const urlset = $('urlset').length > 0;

    if (sitemapIndex) {
      // Sitemap index - extract child sitemap URLs
      $('sitemap').each((_, element) => {
        const loc = $(element).find('loc').text().trim();
        if (loc) {
          urls.push({
            loc,
            lastmod: $(element).find('lastmod').text().trim() || undefined,
            changefreq: undefined,
            priority: undefined,
            isSitemap: true,
            sitemapSource: url,
          });
        }
      });
    } else if (urlset) {
      // Regular sitemap with page URLs
      $('url').each((_, element) => {
        const loc = $(element).find('loc').text().trim();
        const lastmod = $(element).find('lastmod').text().trim();
        const changefreq = $(element).find('changefreq').text().trim();
        const priority = $(element).find('priority').text().trim();

        if (loc) {
          urls.push({
            loc,
            lastmod: lastmod || undefined,
            changefreq: changefreq || undefined,
            priority: priority || undefined,
            isSitemap: false,
            sitemapSource: url,
          });
        }
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Not a valid sitemap format" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        urls,
        isSitemapIndex: sitemapIndex,
      },
    });

  } catch (error) {
    console.error("Error fetching sitemap:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch sitemap"
      },
      { status: 500 }
    );
  }
}
