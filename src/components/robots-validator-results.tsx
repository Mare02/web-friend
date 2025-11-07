"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RobotsValidateResponse } from "@/lib/validators/schema";
import { SitemapUrl, SitemapDetail, SitemapAnalysis } from "@/lib/validators/robots-validator";

// Extended type for backward compatibility
type ExtendedSitemapAnalysis = SitemapAnalysis & {
  sitemaps?: SitemapDetail[];
};
import { SitemapUrlsModal } from "@/components/sitemap-urls-modal";
import {
  Shield,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
  ExternalLink,
  Globe,
  Map,
  AlertTriangle,
  Target
} from "lucide-react";

interface RobotsValidatorResultsProps {
  result: RobotsValidateResponse;
}

export function RobotsValidatorResults({ result }: RobotsValidatorResultsProps) {
  const [selectedSitemap, setSelectedSitemap] = useState<{
    url: string;
    urls: SitemapUrl[];
    isSitemapIndex: boolean;
  } | null>(null);

  const [displayedUrlCount, setDisplayedUrlCount] = useState(100);

  // Reset displayed URL count when new results are loaded
  useEffect(() => {
    setDisplayedUrlCount(100);
  }, [result]);

  if (!result.success || !result.data) {
    return null;
  }

  const { data } = result;
  const { robotsTxt, indexability, sitemaps, overallIndexable, crawlabilityScore, recommendations } = data;


  // Get crawlability score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="w-full space-y-6">
      {/* URL Header */}
      <div className="border-b pb-4">
        <div className="flex items-center gap-3 justify-center">
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-lg"
          >
            {data.url}
          </a>
          <ExternalLink className="h-4 w-4" />
        </div>
      </div>

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Analysis Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Indexability Status */}
            <div className="text-center p-4 rounded-lg border">
              <div className="flex items-center justify-center mb-2">
                {overallIndexable ? (
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500" />
                )}
              </div>
              <h3 className="font-semibold text-lg">
                {overallIndexable ? "Indexable" : "Not Indexable"}
              </h3>
              <p className="text-sm text-gray-700 dark:text-muted-foreground">
                {overallIndexable
                  ? "Website can be indexed by search engines"
                  : "Website has blocking factors preventing indexing"
                }
              </p>
            </div>

            {/* Crawlability Score */}
            <div className="text-center p-4 rounded-lg border">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-semibold text-lg">{crawlabilityScore}/100</h3>
              <p className="text-sm text-gray-700 dark:text-muted-foreground">Crawlability Score</p>
              <Progress value={crawlabilityScore} className="mt-2" />
            </div>

            {/* Sitemap Status */}
            <div className="text-center p-4 rounded-lg border">
              <div className="flex items-center justify-center mb-2">
                <Map className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="font-semibold text-lg">
                {sitemaps.discovered.length === 0 ? "None" : `${sitemaps.valid.length}/${sitemaps.discovered.length}`}
              </h3>
              <p className="text-sm text-gray-700 dark:text-muted-foreground">
                {sitemaps.discovered.length === 0 ? "No Sitemaps" : "Valid Sitemaps"}
              </p>
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Recommendations
              </h4>
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <Alert key={index}>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-gray-800 dark:text-gray-200">{rec}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="robots" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="robots">Robots.txt</TabsTrigger>
          <TabsTrigger value="indexability">Indexability</TabsTrigger>
          <TabsTrigger value="sitemaps">Sitemaps</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        {/* Robots.txt Tab */}
        <TabsContent value="robots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Robots.txt Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Robots.txt Status */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  {robotsTxt.exists ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">
                    {robotsTxt.exists ? "Robots.txt Found" : "No Robots.txt"}
                  </span>
                </div>
                {robotsTxt.exists && (
                  <Badge variant={robotsTxt.isValid ? "default" : "destructive"}>
                    {robotsTxt.isValid ? "Valid" : "Has Errors"}
                  </Badge>
                )}
                {sitemaps.discovered.length === 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">
                      No Sitemap URL provided
                    </span>
                  </div>
                )}
              </div>

              {/* Errors */}
              {robotsTxt.errors.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-red-600 mb-2">Errors Found:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {robotsTxt.errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-600">{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rules */}
              {robotsTxt.rules.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">User Agent Rules:</h4>
                  <div className="space-y-3">
                    {robotsTxt.rules.map((rule, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="h-4 w-4" />
                          <Badge variant="outline">User-agent: {rule.userAgent}</Badge>
                        </div>

                        {rule.disallow.length > 0 && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-red-600">Disallow:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rule.disallow.map((path, idx) => (
                                <Badge key={idx} variant="destructive" className="text-xs">
                                  {path}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {rule.allow.length > 0 && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-green-600">Allow:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rule.allow.map((path, idx) => (
                                <Badge key={idx} variant="default" className="text-xs">
                                  {path}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {rule.crawlDelay && (
                          <div className="text-sm">
                            <span className="font-medium">Crawl Delay:</span> {rule.crawlDelay} seconds
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sitemaps in robots.txt */}
              {robotsTxt.sitemaps.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Sitemaps Declared:</h4>
                  <div className="space-y-1">
                    {robotsTxt.sitemaps.map((sitemap, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <ExternalLink className="h-4 w-4" />
                        <a
                          href={sitemap}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {sitemap}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Robots.txt Content */}
              {robotsTxt.exists && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Robots.txt Content:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                    {robotsTxt.content}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Indexability Tab */}
        <TabsContent value="indexability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Indexability Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Blocking Factors */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Blocking Factors:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg border ${indexability.blockingFactors.robotsTxt ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20' : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'}`}>
                    <div className="flex items-center gap-2">
                      {indexability.blockingFactors.robotsTxt ? (
                        <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                      )}
                      <span className="font-medium">Robots.txt</span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg border ${indexability.blockingFactors.metaRobots ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20' : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'}`}>
                    <div className="flex items-center gap-2">
                      {indexability.blockingFactors.metaRobots ? (
                        <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                      )}
                      <span className="font-medium">Meta Robots</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta Robots Tags */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Meta Robots Tags:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(indexability.metaRobots).map(([key, value]) => (
                    <div key={key} className={`p-2 rounded text-center text-sm font-medium ${value ? 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400'}`}>
                      {key}: {value ? 'Yes' : 'No'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Canonical URL */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Canonical URL:</h4>
                {indexability.canonicalUrl ? (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <a
                      href={indexability.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {indexability.canonicalUrl}
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-yellow-600">
                    <AlertTriangle className="h-4 w-4" />
                    No canonical URL found
                  </div>
                )}
              </div>

              {/* Indexability Recommendations */}
              {indexability.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Indexability Recommendations:</h4>
                  <ul className="space-y-1">
                    {indexability.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sitemaps Tab */}
        <TabsContent value="sitemaps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Sitemap Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Sitemap Summary */}
              <div className="mb-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 border rounded">
                    <div className="text-2xl font-bold text-blue-600">{sitemaps.discovered.length}</div>
                    <div className="text-sm text-gray-700 dark:text-muted-foreground">Discovered</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-2xl font-bold text-green-600">{sitemaps.valid.length}</div>
                    <div className="text-sm text-gray-700 dark:text-muted-foreground">Valid</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-2xl font-bold text-red-600">{sitemaps.invalid.length}</div>
                    <div className="text-sm text-gray-700 dark:text-muted-foreground">Invalid</div>
                  </div>
                </div>
              </div>

              {/* No Sitemaps Warning */}
              {sitemaps.discovered.length === 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium">
                    No Sitemaps Found
                  </span>
                </div>
              )}

              {/* Valid Sitemaps */}
              {sitemaps.valid.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-green-600">Valid Sitemaps:</h4>
                  <div className="space-y-2">
                    {sitemaps.valid.map((url, index) => {
                      const sitemapDetail = (sitemaps as ExtendedSitemapAnalysis).sitemaps?.find((s: SitemapDetail) => s.url === url);
                      return (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <Button
                            variant="link"
                            className="h-auto p-0 text-sm justify-start"
                            onClick={() => setSelectedSitemap({
                              url,
                              urls: [], // Will be fetched fresh in modal
                              isSitemapIndex: sitemapDetail?.isSitemapIndex || false
                            })}
                          >
                            {url}
                          </Button>
                          {sitemapDetail?.isSitemapIndex && (
                            <Badge variant="outline" className="text-xs">
                              Index
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Invalid Sitemaps */}
              {sitemaps.invalid.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-red-600">Invalid Sitemaps:</h4>
                  <div className="space-y-2">
                    {sitemaps.invalid.map((url, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>{url}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sitemap URLs - Only show for single non-index sitemaps */}
              {(() => {
                // Only show URLs section if there's exactly one discovered sitemap and it's not an index
                const hasSingleNonIndexSitemap = sitemaps.discovered.length === 1 &&
                  (sitemaps as ExtendedSitemapAnalysis).sitemaps?.some(s =>
                    s.url === sitemaps.discovered[0] && !s.isSitemapIndex
                  );

                return hasSingleNonIndexSitemap && sitemaps.urls.length > 0 ? (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">URLs in Sitemap ({sitemaps.urls.length} total):</h4>
                    <div className="max-h-60 overflow-y-auto border rounded p-3">
                      <div className="space-y-2">
                        {sitemaps.urls.slice(0, displayedUrlCount).map((url, index) => (
                          <div key={index} className="text-sm">
                            <a
                              href={url.loc}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline break-all"
                            >
                              {url.loc}
                            </a>
                            {url.lastmod && (
                              <span className="text-gray-700 dark:text-muted-foreground ml-2">
                                (Modified: {new Date(url.lastmod).toLocaleDateString()})
                              </span>
                            )}
                          </div>
                        ))}
                        {displayedUrlCount < sitemaps.urls.length && (
                          <div className="pt-2 border-t">
                            <Button
                              onClick={() => setDisplayedUrlCount(prev => prev + 100)}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              Load More ({Math.min(100, sitemaps.urls.length - displayedUrlCount)} more URLs)
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Sitemap Errors */}
              {sitemaps.errors.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">Sitemap Errors:</h4>
                  <ul className="space-y-1">
                    {sitemaps.errors.map((error, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Analysis Timestamp */}
                <div>
                  <h4 className="font-semibold mb-2">Analysis Information:</h4>
                  <div className="text-sm text-gray-700 dark:text-muted-foreground">
                    Analyzed on: {new Date(data.analyzedAt).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-muted-foreground">
                    URL: {data.url}
                  </div>
                </div>

                {/* Technical Scores */}
                <div>
                  <h4 className="font-semibold mb-2">Technical Scores:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 border rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Crawlability Score</span>
                        <span className={`font-bold ${getScoreColor(crawlabilityScore)}`}>
                          {crawlabilityScore}/100
                        </span>
                      </div>
                      <Progress value={crawlabilityScore} className="h-2" />
                    </div>

                    <div className="p-3 border rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Indexability</span>
                        <Badge variant={overallIndexable ? "default" : "destructive"}>
                          {overallIndexable ? "Indexable" : "Not Indexable"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Statistics */}
                <div>
                  <h4 className="font-semibold mb-2">Summary Statistics:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div className="p-2 border rounded text-center">
                      <div className="font-bold">{robotsTxt.exists ? "✓" : "✗"}</div>
                      <div>Robots.txt</div>
                    </div>
                    <div className="p-2 border rounded text-center">
                      <div className="font-bold">{robotsTxt.isValid ? "✓" : "✗"}</div>
                      <div>Valid Syntax</div>
                    </div>
                    <div className="p-2 border rounded text-center">
                      <div className="font-bold">{sitemaps.valid.length}</div>
                      <div>Valid Sitemaps</div>
                    </div>
                    <div className="p-2 border rounded text-center">
                      <div className="font-bold">{recommendations.length}</div>
                      <div>Recommendations</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sitemap URLs Modal */}
      {selectedSitemap && (
        <SitemapUrlsModal
          isOpen={!!selectedSitemap}
          onClose={() => setSelectedSitemap(null)}
          sitemapUrl={selectedSitemap.url}
          urls={selectedSitemap.urls}
          isSitemapIndex={selectedSitemap.isSitemapIndex}
        />
      )}
    </div>
  );
}
