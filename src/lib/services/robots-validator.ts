import * as cheerio from "cheerio";
import {
  RobotsTxtAnalysis,
  IndexabilityResult,
  SitemapAnalysis,
  RobotsAnalysisResult
} from "../validators/robots-validator";

/**
 * Complete robots.txt and indexability analysis service
 * Provides comprehensive analysis of crawling and indexing configuration
 */

/**
 * Fetches and parses robots.txt from a website
 */
export async function fetchRobotsTxt(url: string): Promise<{ exists: boolean; content: string; url: string }> {
  let robotsUrl = "";

  try {
    // Construct robots.txt URL
    const urlObj = new URL(url);
    robotsUrl = `${urlObj.protocol}//${urlObj.hostname}/robots.txt`;

    const response = await fetch(robotsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RobotsValidator/1.0; +https://example.com/bot)",
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { exists: false, content: "", url: robotsUrl };
      }
      throw new Error(`Failed to fetch robots.txt: ${response.statusText}`);
    }

    const content = await response.text();
    return { exists: true, content, url: robotsUrl };
  } catch {
    // If it's a timeout, network error, or invalid URL, return as if robots.txt doesn't exist
    if (!robotsUrl) {
      // If we couldn't even construct the robots.txt URL, try to extract hostname from original URL
      try {
        const urlObj = new URL(url);
        robotsUrl = `${urlObj.protocol}//${urlObj.hostname}/robots.txt`;
      } catch {
        // If original URL is also invalid, use a fallback
        robotsUrl = "invalid-url/robots.txt";
      }
    }
    return { exists: false, content: "", url: robotsUrl };
  }
}

/**
 * Validates robots.txt syntax and extracts rules
 */
export function validateRobotsTxt(content: string, userAgent: string = "*"): RobotsTxtAnalysis {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
  const errors: string[] = [];
  const rules: RobotsTxtAnalysis['rules'] = [];
  const sitemaps: string[] = [];

  let currentUserAgent = "";
  let currentRules: RobotsTxtAnalysis['rules'][0] = {
    userAgent: "",
    disallow: [],
    allow: [],
  };

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) {
      errors.push(`Invalid line format: ${line}`);
      continue;
    }

    const directive = line.substring(0, colonIndex).toLowerCase().trim();
    const value = line.substring(colonIndex + 1).trim();

    switch (directive) {
      case 'user-agent':
        // Save previous rules if they exist
        if (currentUserAgent) {
          rules.push({ ...currentRules });
        }
        currentUserAgent = value;
        currentRules = {
          userAgent: value,
          disallow: [],
          allow: [],
        };
        break;

      case 'disallow':
        if (currentUserAgent) {
          currentRules.disallow.push(value);
        }
        break;

      case 'allow':
        if (currentUserAgent) {
          currentRules.allow.push(value);
        }
        break;

      case 'crawl-delay':
        if (currentUserAgent) {
          const delay = parseFloat(value);
          if (!isNaN(delay) && delay >= 0) {
            currentRules.crawlDelay = delay;
          } else {
            errors.push(`Invalid crawl-delay value: ${value}`);
          }
        }
        break;

      case 'sitemap':
        sitemaps.push(value);
        if (currentUserAgent) {
          currentRules.sitemap = currentRules.sitemap || [];
          currentRules.sitemap.push(value);
        }
        break;

      default:
        errors.push(`Unknown directive: ${directive}`);
    }
  }

  // Save the last rules
  if (currentUserAgent) {
    rules.push({ ...currentRules });
  }

  // Check for common issues
  if (rules.length === 0 && content.trim()) {
    errors.push("No valid user-agent rules found");
  }

  // Find rules for the specified user agent
  let applicableRules = rules.find(rule => rule.userAgent === userAgent);
  if (!applicableRules && userAgent !== "*") {
    applicableRules = rules.find(rule => rule.userAgent === "*");
  }

  return {
    exists: content.trim().length > 0,
    content,
    isValid: errors.length === 0,
    errors,
    rules,
    sitemaps,
    applicableRules: applicableRules || {
      userAgent: "*",
      disallow: [],
      allow: [],
    }
  };
}

/**
 * Checks if a URL is indexable based on robots.txt and meta tags
 */
export async function checkUrlIndexability(url: string): Promise<IndexabilityResult> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RobotsValidator/1.0; +https://example.com/bot)",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return {
        url,
        isIndexable: false,
        blockingFactors: {
          robotsTxt: false,
          metaRobots: false,
          canonical: false,
          nofollow: false,
        },
        metaRobots: {
          noindex: false,
          nofollow: false,
          noarchive: false,
          nosnippet: false,
        },
        recommendations: [`HTTP ${response.status} error - page not accessible`],
      };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Check meta robots
    const metaRobots = $('meta[name="robots"]').attr("content")?.toLowerCase() || "";
    const hasNoindex = metaRobots.includes("noindex");
    const hasNofollow = metaRobots.includes("nofollow");
    const hasNoarchive = metaRobots.includes("noarchive");
    const hasNosnippet = metaRobots.includes("nosnippet");

    // Check canonical
    const canonicalAnalysis = analyzeCanonicalTags(html, url);

    // Check robots.txt
    const robotsCheck = await isUrlBlockedByRobotsTxt(url);

    // Determine overall indexability
    const isIndexable = !hasNoindex && !robotsCheck.blocked;

    const blockingFactors = {
      robotsTxt: robotsCheck.blocked,
      metaRobots: hasNoindex,
      canonical: false, // Canonical doesn't block indexing
      nofollow: hasNofollow,
    };

    const recommendations: string[] = [];

    if (robotsCheck.blocked) {
      recommendations.push("URL is blocked by robots.txt - remove from disallow rules");
    }

    if (hasNoindex) {
      recommendations.push("Page has noindex meta robots tag - remove to allow indexing");
    }

    // Add canonical analysis issues to recommendations
    recommendations.push(...canonicalAnalysis.issues);

    if (hasNofollow) {
      recommendations.push("Page has nofollow - links from this page won't pass link equity");
    }

    return {
      url,
      isIndexable,
      blockingFactors,
      metaRobots: {
        noindex: hasNoindex,
        nofollow: hasNofollow,
        noarchive: hasNoarchive,
        nosnippet: hasNosnippet,
      },
      canonicalUrl: canonicalAnalysis.canonicalUrl,
      recommendations,
    };
  } catch (error) {
    return {
      url,
      isIndexable: false,
      blockingFactors: {
        robotsTxt: false,
        metaRobots: false,
        canonical: false,
        nofollow: false,
      },
      metaRobots: {
        noindex: false,
        nofollow: false,
        noarchive: false,
        nosnippet: false,
      },
      recommendations: [`Failed to analyze URL: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
}

/**
 * Checks if a URL is blocked by robots.txt
 */
async function isUrlBlockedByRobotsTxt(url: string): Promise<{ blocked: boolean; reason?: string }> {
  try {
    const robotsData = await fetchRobotsTxt(url);
    if (!robotsData.exists) {
      return { blocked: false }; // No robots.txt means no restrictions
    }

    const analysis = validateRobotsTxt(robotsData.content);
    const urlObj = new URL(url);
    const path = urlObj.pathname + urlObj.search;

    // Check if path is disallowed
    for (const rule of analysis.applicableRules.disallow) {
      if (rule === "/" || path.startsWith(rule) || matchesRobotsPattern(rule, path)) {
        return { blocked: true, reason: `Blocked by robots.txt rule: ${rule}` };
      }
    }

    return { blocked: false };
  } catch {
    return { blocked: false }; // On error, assume not blocked
  }
}

/**
 * Simple pattern matching for robots.txt wildcards
 */
function matchesRobotsPattern(pattern: string, path: string): boolean {
  // Convert robots.txt pattern to regex
  // * matches any sequence of characters
  // $ matches end of string (if present)
  let regex = pattern.replace(/\*/g, ".*");

  // If pattern ends with $, it should match end of string
  if (regex.endsWith('$')) {
    regex = regex.slice(0, -1) + '$';
  }

  try {
    return new RegExp(regex).test(path);
  } catch {
    return false;
  }
}

/**
 * Analyzes XML sitemaps from a website
 */
export async function analyzeSitemaps(baseUrl: string): Promise<SitemapAnalysis> {
  const discovered: string[] = [];
  const valid: string[] = [];
  const invalid: string[] = [];
  const allUrls: SitemapAnalysis['urls'] = [];
  const errors: string[] = [];

  try {
    // Only check sitemaps declared in robots.txt
    const robotsData = await fetchRobotsTxt(baseUrl);
    if (robotsData.exists) {
      const analysis = validateRobotsTxt(robotsData.content);
      discovered.push(...analysis.sitemaps);
    }

    // If no sitemaps are declared in robots.txt, return early with no sitemaps found
    if (discovered.length === 0) {
      return {
        discovered: [],
        valid: [],
        invalid: [],
        urls: [],
        errors: [],
      };
    }

    // Analyze each declared sitemap
    for (const sitemapUrl of discovered) {
      try {
        const response = await fetch(sitemapUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; RobotsValidator/1.0; +https://example.com/bot)",
          },
          signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
          invalid.push(sitemapUrl);
          errors.push(`${sitemapUrl}: HTTP ${response.status}`);
          continue;
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("xml") && !contentType.includes("text")) {
          invalid.push(sitemapUrl);
          errors.push(`${sitemapUrl}: Invalid content type: ${contentType}`);
          continue;
        }

        const xml = await response.text();
        const $ = cheerio.load(xml, { xmlMode: true });

        // Check if it's a sitemap index or regular sitemap
        const sitemapIndex = $('sitemapindex').length > 0;
        const urlset = $('urlset').length > 0;

        if (!sitemapIndex && !urlset) {
          invalid.push(sitemapUrl);
          errors.push(`${sitemapUrl}: Not a valid sitemap format`);
          continue;
        }

        valid.push(sitemapUrl);

        // Extract URLs
        if (urlset) {
          // Regular sitemap with URLs
          $('url').each((_, element) => {
            const loc = $(element).find('loc').text().trim();
            const lastmod = $(element).find('lastmod').text().trim();
            const changefreq = $(element).find('changefreq').text().trim();
            const priority = $(element).find('priority').text().trim();

            if (loc) {
              allUrls.push({
                loc,
                lastmod: lastmod || undefined,
                changefreq: changefreq || undefined,
                priority: priority || undefined,
              });
            }
          });
        } else if (sitemapIndex) {
          // Sitemap index - extract child sitemap URLs (but don't recursively process them)
          $('sitemap').each((_, element) => {
            const loc = $(element).find('loc').text().trim();
            if (loc) {
              allUrls.push({
                loc,
                lastmod: $(element).find('lastmod').text().trim() || undefined,
                changefreq: undefined,
                priority: undefined,
              });
            }
          });
        }

      } catch (error) {
        invalid.push(sitemapUrl);
        errors.push(`${sitemapUrl}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

  } catch (error) {
    errors.push(`Failed to analyze sitemaps: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    discovered,
    valid,
    invalid,
    urls: allUrls,
    errors,
  };
}

/**
 * Extracts meta robots tags from HTML
 */
export function checkMetaRobotsTags(html: string): {
  noindex: boolean;
  nofollow: boolean;
  noarchive: boolean;
  nosnippet: boolean;
  content: string;
} {
  const $ = cheerio.load(html);
  const content = $('meta[name="robots"]').attr("content")?.toLowerCase() || "";

  return {
    noindex: content.includes("noindex"),
    nofollow: content.includes("nofollow"),
    noarchive: content.includes("noarchive"),
    nosnippet: content.includes("nosnippet"),
    content,
  };
}

/**
 * Analyzes canonical URL implementation
 */
export function analyzeCanonicalTags(html: string, currentUrl: string): {
  canonicalUrl?: string;
  hasCanonical: boolean;
  isSelfReferencing: boolean;
  issues: string[];
} {
  const $ = cheerio.load(html);
  const canonical = $('link[rel="canonical"]').attr("href");
  const issues: string[] = [];

  if (!canonical) {
    issues.push("Missing canonical URL");
    return {
      hasCanonical: false,
      isSelfReferencing: false,
      issues,
    };
  }

  // Normalize URLs for comparison (remove trailing slashes, etc.)
  const normalizeUrl = (url: string) => url.replace(/\/$/, '');

  const normalizedCanonical = normalizeUrl(canonical);
  const normalizedCurrent = normalizeUrl(currentUrl);

  const isSelfReferencing = normalizedCanonical === normalizedCurrent;

  if (!isSelfReferencing) {
    issues.push("Canonical URL differs from current URL - check for duplicate content");
  }

  return {
    canonicalUrl: canonical,
    hasCanonical: true,
    isSelfReferencing,
    issues,
  };
}

/**
 * Main analysis function that combines all checks
 */
export async function analyzeRobotsAndIndexability(url: string): Promise<RobotsAnalysisResult> {
  try {
    // Fetch robots.txt
    const robotsData = await fetchRobotsTxt(url);
    const robotsAnalysis = validateRobotsTxt(robotsData.content);

    // Check indexability
    const indexability = await checkUrlIndexability(url);

    // Analyze sitemaps
    const sitemaps = await analyzeSitemaps(url);

    // Overall assessment
    const overallIndexable = indexability.isIndexable;
    const hasRobotsTxt = robotsData.exists;
    const hasValidSitemaps = sitemaps.valid.length > 0;

    // Generate recommendations
    const recommendations: string[] = [];

    if (!hasRobotsTxt) {
      recommendations.push("Consider adding a robots.txt file to control crawler access");
    } else if (!robotsAnalysis.isValid) {
      recommendations.push("Fix robots.txt syntax errors for proper crawler behavior");
    }

    if (sitemaps.discovered.length === 0) {
      recommendations.push("Add an XML sitemap to help search engines discover your pages");
    } else if (!hasValidSitemaps) {
      recommendations.push("Fix invalid sitemaps - ensure they return valid XML and are accessible");
    }

    recommendations.push(...indexability.recommendations);

    // Determine crawlability score (0-100)
    let crawlabilityScore = 100;
    if (!hasRobotsTxt) crawlabilityScore -= 20;
    if (!robotsAnalysis.isValid) crawlabilityScore -= 30;
    if (!overallIndexable) crawlabilityScore -= 50;
    if (!hasValidSitemaps) crawlabilityScore -= 10;
    crawlabilityScore = Math.max(0, crawlabilityScore);

    return {
      url,
      robotsTxt: robotsAnalysis,
      indexability,
      sitemaps,
      overallIndexable,
      crawlabilityScore,
      recommendations,
      analyzedAt: Date.now(),
    };
  } catch (error) {
    throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
