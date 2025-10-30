"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultsSignupBanner } from "@/components/results-signup-banner";
import { GenerateTasksBanner } from "@/components/generate-tasks-banner";
import { AnalyzeResponse } from "@/lib/validators/schema";
import {
  FileText,
  Search,
  Zap,
  Accessibility,
  CheckCircle2,
  AlertCircle,
  Info,
  ExternalLink,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AnalysisResultsProps {
  result: AnalyzeResponse;
  showHeader?: boolean;
  showGenerateTasksBanner?: boolean;
}

export function AnalysisResults({ result, showHeader = false, showGenerateTasksBanner = false }: AnalysisResultsProps) {
  if (!result.success || !result.data || !result.data.websiteData || !result.data.analysis) {
    return null;
  }

  const { websiteData, analysis } = result.data;

  // Use real Lighthouse scores if available, otherwise calculate from website data
  const lighthouseData = result.data.lighthouseData;
  const seoScore = lighthouseData?.seo ?? calculateSEOScore(websiteData);
  const performanceScore = lighthouseData?.performance ?? 0;
  const accessibilityScore = lighthouseData?.accessibility ?? calculateAccessibilityScore(websiteData);

  return (
    <div className="w-full space-y-6">
      {/* Generate Tasks Banner */}
      {showGenerateTasksBanner && (
        <GenerateTasksBanner websiteData={websiteData} analysis={analysis} />
      )}

      {/* Analysis Header */}
      {showHeader && (
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold mb-2">
            {websiteData.title || new URL(websiteData.url).hostname}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <a
              href={websiteData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {websiteData.url}
            </a>
          </p>
        </div>
      )}

      {/* Overview Metrics */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-6">
            {/* Scores */}
            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">SEO:</p>
              <p className="text-lg font-bold">{seoScore}%</p>
              {seoScore >= 80 ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : seoScore >= 50 ? (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>

            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">Perf:</p>
              <p className="text-lg font-bold">{performanceScore}%</p>
              {performanceScore >= 90 ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : performanceScore >= 70 ? (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>

            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">A11y:</p>
              <p className="text-lg font-bold">{accessibilityScore}%</p>
              {accessibilityScore >= 80 ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : accessibilityScore >= 50 ? (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>


            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">Words:</p>
              <p className="text-lg font-bold">{websiteData.wordCount.toLocaleString()}</p>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-border" />

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-xs h-6">{websiteData.images.total} images</Badge>
              <Badge variant="outline" className="text-xs h-6">{websiteData.scripts} scripts</Badge>
              <Badge variant="outline" className="text-xs h-6">{websiteData.stylesheets} stylesheets</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Analysis Content */}
      <Tabs defaultValue="content" className="w-full flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-5 flex-shrink-0">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">SEO</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-2">
            <Accessibility className="h-4 w-4" />
            <span className="hidden sm:inline">Accessibility</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
        </TabsList>

        {/* Content Analysis */}
        <TabsContent value="content" className="mt-6 flex-1 flex flex-col">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis.content || "Analysis content not available."}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Analysis */}
        <TabsContent value="seo" className="mt-6 flex-1 flex flex-col">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                SEO Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis.seo || "SEO analysis not available."}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Analysis */}
        <TabsContent value="performance" className="mt-6 flex-1 flex flex-col">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis.performance || "Performance analysis not available."}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility Analysis */}
        <TabsContent value="accessibility" className="mt-6 flex-1 flex flex-col">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accessibility
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis.accessibility || "Accessibility analysis not available."}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Raw Data */}
        <TabsContent value="data" className="mt-6 flex-1 flex flex-col">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Extracted Data
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="space-y-6 text-sm">
                {/* Basic Meta Tags */}
                <div>
                  <h3 className="font-semibold mb-3 text-base">Basic Meta Tags</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium">Title</p>
                      <p className="text-muted-foreground">{websiteData.title || "No title found"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Meta Description</p>
                      <p className="text-muted-foreground">
                        {websiteData.metaDescription || "No meta description found"}
                      </p>
                    </div>
                    {websiteData.metaKeywords && (
                      <div>
                        <p className="font-medium">Meta Keywords</p>
                        <p className="text-muted-foreground">{websiteData.metaKeywords}</p>
                      </div>
                    )}
                    {websiteData.charset && (
                      <div>
                        <p className="font-medium">Charset</p>
                        <p className="text-muted-foreground">{websiteData.charset}</p>
                      </div>
                    )}
                    {websiteData.viewport && (
                      <div>
                        <p className="font-medium">Viewport</p>
                        <p className="text-muted-foreground">{websiteData.viewport}</p>
                      </div>
                    )}
                    {websiteData.robots && (
                      <div>
                        <p className="font-medium">Robots</p>
                        <p className="text-muted-foreground">{websiteData.robots}</p>
                      </div>
                    )}
                    {websiteData.canonical && (
                      <div>
                        <p className="font-medium">Canonical URL</p>
                        <p className="text-muted-foreground">{websiteData.canonical}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Headings */}
                <div>
                  <h3 className="font-semibold mb-3 text-base">Headings</h3>
                  <div className="space-y-3">
                    {Object.entries(websiteData.headings).map(([tag, headings]) => {
                      if (headings.length === 0) return null;
                      return (
                        <div key={tag}>
                          <Badge variant="outline" className="mb-2">
                            {tag.toUpperCase()} ({headings.length})
                          </Badge>
                          <ul className="list-disc list-inside text-muted-foreground space-y-1">
                            {headings.map((heading, i) => (
                              <li key={i}>{heading}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Social Media Tags */}
                {(websiteData.openGraph || websiteData.twitterCard) && (
                  <div>
                    <h3 className="font-semibold mb-3 text-base">Social Media Tags</h3>
                    <div className="space-y-4">
                      {websiteData.openGraph && (
                        <div>
                          <Badge variant="outline" className="mb-2">Open Graph</Badge>
                          <div className="space-y-1 text-muted-foreground">
                            {websiteData.openGraph.title && <p>Title: {websiteData.openGraph.title}</p>}
                            {websiteData.openGraph.description && <p>Description: {websiteData.openGraph.description}</p>}
                            {websiteData.openGraph.image && <p>Image: {websiteData.openGraph.image}</p>}
                            {websiteData.openGraph.type && <p>Type: {websiteData.openGraph.type}</p>}
                            {websiteData.openGraph.url && <p>URL: {websiteData.openGraph.url}</p>}
                            {websiteData.openGraph.siteName && <p>Site Name: {websiteData.openGraph.siteName}</p>}
                          </div>
                        </div>
                      )}
                      {websiteData.twitterCard && (
                        <div>
                          <Badge variant="outline" className="mb-2">Twitter Card</Badge>
                          <div className="space-y-1 text-muted-foreground">
                            {websiteData.twitterCard.card && <p>Card: {websiteData.twitterCard.card}</p>}
                            {websiteData.twitterCard.title && <p>Title: {websiteData.twitterCard.title}</p>}
                            {websiteData.twitterCard.description && <p>Description: {websiteData.twitterCard.description}</p>}
                            {websiteData.twitterCard.image && <p>Image: {websiteData.twitterCard.image}</p>}
                            {websiteData.twitterCard.site && <p>Site: {websiteData.twitterCard.site}</p>}
                            {websiteData.twitterCard.creator && <p>Creator: {websiteData.twitterCard.creator}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Structured Data */}
                {websiteData.structuredData && websiteData.structuredData.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-base">Structured Data (JSON-LD)</h3>
                    <div className="space-y-2">
                      {websiteData.structuredData.map((item, index) => (
                        <div key={index}>
                          <Badge variant="outline" className="mb-1">
                            {item.type}
                          </Badge>
                          <pre className="text-xs text-muted-foreground bg-muted p-2 rounded overflow-x-auto">
                            {JSON.stringify(item.data, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images */}
                <div>
                  <h3 className="font-semibold mb-3 text-base">Images</h3>
                  <div className="space-y-2">
                    <div className="flex gap-4">
                      <Badge variant="outline">{websiteData.images.total} total</Badge>
                      <Badge variant="outline" className="text-green-600">{websiteData.images.withAlt} with alt</Badge>
                      <Badge variant="outline" className="text-red-600">{websiteData.images.withoutAlt} without alt</Badge>
                    </div>
                    {websiteData.images.details.length > 0 && (
                      <div className="mt-3">
                        <p className="font-medium mb-2">Image Details:</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {websiteData.images.details.map((img, index) => (
                            <div key={index} className="text-xs border rounded p-2">
                              <p><strong>Src:</strong> {img.src}</p>
                              <p><strong>Alt:</strong> {img.alt || <span className="text-red-500">Missing</span>}</p>
                              {img.title && <p><strong>Title:</strong> {img.title}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Link Tags */}
                {websiteData.linkTags && websiteData.linkTags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-base">Link Tags</h3>
                    <div className="space-y-2">
                      {websiteData.linkTags.map((link, index) => (
                        <div key={index} className="text-xs border rounded p-2">
                          <p><strong>Rel:</strong> {link.rel}</p>
                          <p><strong>Href:</strong> {link.href}</p>
                          {link.type && <p><strong>Type:</strong> {link.type}</p>}
                          {link.hreflang && <p><strong>Hreflang:</strong> {link.hreflang}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Meta Tags */}
                {(() => {
                  const additionalMetaTags = websiteData.metaTags?.filter(meta =>
                    !['description', 'keywords', 'viewport', 'robots'].includes(meta.name || '') &&
                    !['og:title', 'og:description', 'og:image', 'og:type', 'og:url', 'og:site_name'].includes(meta.property || '') &&
                    !['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:site', 'twitter:creator'].includes(meta.name || '')
                  ) || [];

                  return additionalMetaTags.length > 0 ? (
                    <div>
                      <h3 className="font-semibold mb-3 text-base">Additional Meta Tags</h3>
                      <div className="space-y-2">
                        {additionalMetaTags.map((meta, index) => (
                          <div key={index} className="text-xs border rounded p-2">
                            {meta.name && <p><strong>Name:</strong> {meta.name}</p>}
                            {meta.property && <p><strong>Property:</strong> {meta.property}</p>}
                            {meta.httpEquiv && <p><strong>HTTP-Equiv:</strong> {meta.httpEquiv}</p>}
                            <p><strong>Content:</strong> {meta.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Technical Stats */}
                <div>
                  <h3 className="font-semibold mb-3 text-base">Technical Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Scripts</p>
                      <p className="text-muted-foreground">{websiteData.scripts}</p>
                    </div>
                    <div>
                      <p className="font-medium">Stylesheets</p>
                      <p className="text-muted-foreground">{websiteData.stylesheets}</p>
                    </div>
                    <div>
                      <p className="font-medium">Word Count</p>
                      <p className="text-muted-foreground">{websiteData.wordCount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sign Up Banner */}
      <div className="mt-8">
        <ResultsSignupBanner />
      </div>
    </div>
  );
}

/**
 * Calculate a basic SEO score based on key metrics
 */
function calculateSEOScore(data: NonNullable<AnalyzeResponse["data"]>["websiteData"]): number {
  let score = 0;
  let maxScore = 0;

  // Title (20 points)
  maxScore += 20;
  if (data.title) {
    const titleLength = data.title.length;
    if (titleLength >= 30 && titleLength <= 60) {
      score += 20;
    } else if (titleLength > 0) {
      score += 10;
    }
  }

  // Meta description (20 points)
  maxScore += 20;
  if (data.metaDescription) {
    const descLength = data.metaDescription.length;
    if (descLength >= 120 && descLength <= 160) {
      score += 20;
    } else if (descLength > 0) {
      score += 10;
    }
  }

  // H1 tags (20 points) - should have exactly 1
  maxScore += 20;
  if (data.headings.h1.length === 1) {
    score += 20;
  } else if (data.headings.h1.length > 0) {
    score += 10;
  }

  // Heading hierarchy (20 points)
  maxScore += 20;
  if (data.headings.h2.length > 0) {
    score += 20;
  }

  // Open Graph (20 points)
  maxScore += 20;
  if (data.openGraph?.title && data.openGraph?.description) {
    score += 20;
  } else if (data.openGraph?.title || data.openGraph?.description) {
    score += 10;
  }

  return Math.round((score / maxScore) * 100);
}

/**
 * Calculate a basic accessibility score
 */
function calculateAccessibilityScore(
  data: NonNullable<AnalyzeResponse["data"]>["websiteData"]
): number {
  let score = 0;
  let maxScore = 0;

  // Image alt text (40 points)
  maxScore += 40;
  if (data.images.total > 0) {
    const altPercentage = (data.images.withAlt / data.images.total) * 100;
    score += Math.round((altPercentage / 100) * 40);
  } else {
    score += 40; // No images is fine
  }

  // Title presence (30 points)
  maxScore += 30;
  if (data.title) {
    score += 30;
  }

  // Proper H1 usage (30 points)
  maxScore += 30;
  if (data.headings.h1.length === 1) {
    score += 30;
  } else if (data.headings.h1.length > 0) {
    score += 15;
  }

  return Math.round((score / maxScore) * 100);
}

