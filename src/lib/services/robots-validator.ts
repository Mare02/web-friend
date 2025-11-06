import * as cheerio from "cheerio";
import { gunzipSync } from "zlib";
import {
  RobotsTxtAnalysis,
  IndexabilityResult,
  SitemapAnalysis,
  SitemapDetail,
  SitemapUrl,
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
 * Processes a single sitemap and extracts its URLs
 */
async function processSitemap(sitemapUrl: string, processedSitemaps: Set<string> = new Set(), depth: number = 0): Promise<{ detail: SitemapDetail; additionalValidSitemaps: string[]; allDetails: SitemapDetail[] }> {
  const urls: SitemapUrl[] = [];
  let isSitemapIndex = false;

  try {
    // Prevent infinite loops in case of circular references
    if (processedSitemaps.has(sitemapUrl)) {
      return {
        detail: {
          url: sitemapUrl,
          isValid: false,
          isSitemapIndex: false,
          urls: [],
          error: "Circular sitemap reference detected"
        },
        additionalValidSitemaps: [],
        allDetails: []
      };
    }

    // Limit recursion depth to prevent stack overflow
    const MAX_DEPTH = 10;
    if (depth > MAX_DEPTH) {
      return {
        detail: {
          url: sitemapUrl,
          isValid: false,
          isSitemapIndex: false,
          urls: [],
          error: `Maximum sitemap recursion depth (${MAX_DEPTH}) exceeded`
        },
        additionalValidSitemaps: [],
        allDetails: []
      };
    }

    processedSitemaps.add(sitemapUrl);

    const response = await fetch(sitemapUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RobotsValidator/1.0; +https://example.com/bot)",
      },
      signal: AbortSignal.timeout(10000), // Increased timeout for large sitemaps
    });

    if (!response.ok) {
      return {
        detail: {
          url: sitemapUrl,
          isValid: false,
          isSitemapIndex: false,
          urls: [],
          error: `HTTP ${response.status}`
        },
        additionalValidSitemaps: [],
        allDetails: []
      };
    }

    const contentType = response.headers.get("content-type") || "";
    const isGzip = contentType.includes("gzip") || contentType.includes("application/gzip") || contentType.includes("application/x-gzip");

    if (!contentType.includes("xml") && !contentType.includes("text") && !isGzip) {
      return {
        detail: {
          url: sitemapUrl,
          isValid: false,
          isSitemapIndex: false,
          urls: [],
          error: `Invalid content type: ${contentType}`
        },
        additionalValidSitemaps: [],
        allDetails: []
      };
    }

    let xml: string;
    try {
      if (isGzip) {
        // Handle gzipped sitemap
        const buffer = await response.arrayBuffer();
        xml = gunzipSync(Buffer.from(buffer)).toString('utf-8');
      } else {
        xml = await response.text();
      }
    } catch (error) {
      return {
        detail: {
          url: sitemapUrl,
          isValid: false,
          isSitemapIndex: false,
          urls: [],
          error: `Failed to decode sitemap content: ${error instanceof Error ? error.message : 'Unknown error'}`
        },
        additionalValidSitemaps: [],
        allDetails: []
      };
    }

    let $: cheerio.CheerioAPI;
    try {
      $ = cheerio.load(xml, { xmlMode: true });
    } catch (error) {
      return {
        detail: {
          url: sitemapUrl,
          isValid: false,
          isSitemapIndex: false,
          urls: [],
          error: `Failed to parse XML: ${error instanceof Error ? error.message : 'Unknown error'}`
        },
        additionalValidSitemaps: [],
        allDetails: []
      };
    }

    // Check if it's a sitemap index or regular sitemap
    isSitemapIndex = $('sitemapindex').length > 0;
    const urlset = $('urlset').length > 0;

    if (!isSitemapIndex && !urlset) {
      return {
        detail: {
          url: sitemapUrl,
          isValid: false,
          isSitemapIndex: false,
          urls: [],
          error: "Not a valid sitemap format"
        },
        additionalValidSitemaps: [],
        allDetails: []
      };
    }

    // Extract URLs
    if (urlset) {
      // Regular sitemap with page URLs
      const MAX_URLS_PER_SITEMAP = 100000; // Higher limit since UI supports progressive loading
      let urlCount = 0;

      $('url').each((_, element) => {
        if (urlCount >= MAX_URLS_PER_SITEMAP) {
          return false; // Break out of each loop
        }

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
            sitemapSource: sitemapUrl,
          });
          urlCount++;
        }
      });

      if (urlCount >= MAX_URLS_PER_SITEMAP) {
        return {
          detail: {
            url: sitemapUrl,
            isValid: true,
            isSitemapIndex: false,
            urls,
            error: `Sitemap contains more than ${MAX_URLS_PER_SITEMAP} URLs, truncated for performance`
          },
          additionalValidSitemaps: [],
          allDetails: []
        };
      }
    } else if (isSitemapIndex) {
      // Sitemap index - extract child sitemap URLs
      const childSitemaps: string[] = [];
      const additionalValidSitemaps: string[] = [];

      $('sitemap').each((_, element) => {
        const loc = $(element).find('loc').text().trim();
        if (loc) {
          childSitemaps.push(loc);
          urls.push({
            loc,
            lastmod: $(element).find('lastmod').text().trim() || undefined,
            changefreq: undefined,
            priority: undefined,
            isSitemap: true,
            sitemapSource: sitemapUrl,
          });
        }
      });

      // Add all child sitemap URLs to additionalValidSitemaps since they are listed in the index
      additionalValidSitemaps.push(...childSitemaps);

      // Recursively process child sitemaps
      const allChildDetails: SitemapDetail[] = [];
      for (const childSitemapUrl of childSitemaps) {
        try {
          const childResult = await processSitemap(childSitemapUrl, processedSitemaps, depth + 1);

          // Add all URLs from child sitemaps to our collection
          urls.push(...childResult.detail.urls);
          // Also add any additional valid sitemaps found by the child
          additionalValidSitemaps.push(...childResult.additionalValidSitemaps);
          // Collect all child details
          allChildDetails.push(childResult.detail, ...childResult.allDetails);
        } catch (error) {
          // If processing fails, create a basic detail for it
          allChildDetails.push({
            url: childSitemapUrl,
            isValid: false,
            isSitemapIndex: false,
            urls: [],
            error: `Failed to process: ${error instanceof Error ? error.message : 'Unknown error'}`
          });
        }
      }

      return {
        detail: {
          url: sitemapUrl,
          isValid: true,
          isSitemapIndex,
          urls,
        },
        additionalValidSitemaps,
        allDetails: allChildDetails
      };
    }

    return {
      detail: {
        url: sitemapUrl,
        isValid: true,
        isSitemapIndex,
        urls,
      },
      additionalValidSitemaps: [],
      allDetails: []
    };

  } catch (error) {
    return {
      detail: {
        url: sitemapUrl,
        isValid: false,
        isSitemapIndex,
        urls: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      additionalValidSitemaps: [],
      allDetails: []
    };
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
  const sitemaps: SitemapDetail[] = [];
  const errors: string[] = [];

  const MAX_TOTAL_URLS = 500000; // Higher limit since UI supports progressive loading

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
        sitemaps: [],
        errors: [],
      };
    }

    // Process each declared sitemap recursively
    for (const sitemapUrl of discovered) {
      const sitemapResult = await processSitemap(sitemapUrl);

      sitemaps.push(sitemapResult.detail);
      // Add all child sitemap details that were processed
      sitemaps.push(...sitemapResult.allDetails);

      if (sitemapResult.detail.isValid) {
        valid.push(sitemapUrl);
        // Add all additional valid sitemaps found during processing
        valid.push(...sitemapResult.additionalValidSitemaps);
        // Add all URLs from this sitemap (including recursively processed ones) to the global list
        // But limit total URLs to prevent memory issues
        const remainingCapacity = MAX_TOTAL_URLS - allUrls.length;
        if (remainingCapacity > 0) {
          const urlsToAdd = sitemapResult.detail.urls.slice(0, remainingCapacity);
          allUrls.push(...urlsToAdd);

          if (sitemapResult.detail.urls.length > urlsToAdd.length) {
            errors.push(`${sitemapUrl}: Too many URLs (${sitemapResult.detail.urls.length}), truncated to ${urlsToAdd.length}`);
          }
        } else if (allUrls.length >= MAX_TOTAL_URLS) {
          errors.push(`${sitemapUrl}: Skipped due to URL limit (${MAX_TOTAL_URLS}) reached`);
        }
      } else {
        invalid.push(sitemapUrl);
        if (sitemapResult.detail.error) {
          errors.push(`${sitemapUrl}: ${sitemapResult.detail.error}`);
        }
      }
    }

  } catch (error) {
    errors.push(`Failed to analyze sitemaps: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Remove duplicates from valid sitemaps
  const uniqueValid = [...new Set(valid)];

  return {
    discovered,
    valid: uniqueValid,
    invalid,
    urls: allUrls,
    sitemaps,
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
