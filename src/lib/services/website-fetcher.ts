import * as cheerio from "cheerio";
import { WebsiteData } from "../validators/schema";

/**
 * Fetches and parses a website's HTML to extract relevant data
 * for SEO, content, and performance analysis
 */
export async function fetchWebsiteData(url: string): Promise<WebsiteData> {
  try {
    // Fetch the HTML
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; WebsiteAnalyzer/1.0; +https://example.com/bot)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract title
    const title = $("title").text().trim() || undefined;

    // Extract meta tags
    const metaDescription =
      $('meta[name="description"]').attr("content")?.trim() || undefined;
    const metaKeywords =
      $('meta[name="keywords"]').attr("content")?.trim() || undefined;

    // Extract all headings with their hierarchy
    const headings = {
      h1: $("h1")
        .map((_, el) => $(el).text().trim())
        .get(),
      h2: $("h2")
        .map((_, el) => $(el).text().trim())
        .get(),
      h3: $("h3")
        .map((_, el) => $(el).text().trim())
        .get(),
      h4: $("h4")
        .map((_, el) => $(el).text().trim())
        .get(),
      h5: $("h5")
        .map((_, el) => $(el).text().trim())
        .get(),
      h6: $("h6")
        .map((_, el) => $(el).text().trim())
        .get(),
    };

    // Analyze images
    const images = $("img");
    const imagesWithAlt = images.filter((_, el) => {
      const alt = $(el).attr("alt");
      return alt !== undefined && alt !== "";
    }).length;
    const imageData = {
      total: images.length,
      withAlt: imagesWithAlt,
      withoutAlt: images.length - imagesWithAlt,
    };

    // Count scripts and stylesheets
    const scripts = $("script").length;
    const stylesheets = $('link[rel="stylesheet"]').length;

    // Calculate word count from body text
    const bodyText = $("body").text();
    const wordCount = bodyText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    // Detect framework
    const framework = detectFramework($, html);

    // Extract Open Graph tags
    const openGraph = {
      title: $('meta[property="og:title"]').attr("content")?.trim(),
      description: $('meta[property="og:description"]').attr("content")?.trim(),
      image: $('meta[property="og:image"]').attr("content")?.trim(),
      type: $('meta[property="og:type"]').attr("content")?.trim(),
    };

    return {
      url,
      title,
      metaDescription,
      metaKeywords,
      headings,
      images: imageData,
      scripts,
      stylesheets,
      wordCount,
      framework,
      openGraph:
        openGraph.title || openGraph.description
          ? openGraph
          : undefined,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch website data: ${error.message}`);
    }
    throw new Error("Unknown error while fetching website data");
  }
}

/**
 * Attempts to detect the framework/platform used by the website
 */
function detectFramework(
  $: cheerio.CheerioAPI,
  html: string
): string | undefined {
  // Check for Next.js
  if ($("#__next").length > 0 || html.includes("_next")) {
    return "Next.js";
  }

  // Check for React
  if ($("#root").length > 0 && html.includes("react")) {
    return "React";
  }

  // Check for Vue
  if ($("[data-v-]").length > 0 || html.includes("vue")) {
    return "Vue.js";
  }

  // Check for Angular
  if ($("[ng-version]").length > 0 || html.includes("angular")) {
    return "Angular";
  }

  // Check for WordPress
  if (html.includes("wp-content") || html.includes("wordpress")) {
    return "WordPress";
  }

  // Check for common meta generators
  const generator = $('meta[name="generator"]').attr("content");
  if (generator) {
    return generator;
  }

  return undefined;
}

