"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SitemapUrl } from "@/lib/validators/robots-validator";
import { ExternalLink, FileText, Globe, Map, AlertCircle } from "lucide-react";

interface SitemapUrlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sitemapUrl: string;
  urls: SitemapUrl[]; // Keep for backward compatibility, but we'll fetch fresh
  isSitemapIndex: boolean;
}

export function SitemapUrlsModal({
  isOpen,
  onClose,
  sitemapUrl,
  urls,
  isSitemapIndex: initialIsSitemapIndex
}: SitemapUrlsModalProps) {
  const [fetchedUrls, setFetchedUrls] = useState<SitemapUrl[]>([]);
  const [fetchedIsSitemapIndex, setFetchedIsSitemapIndex] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSitemapUrl, setCurrentSitemapUrl] = useState(sitemapUrl);
  const [originalSitemapUrl, setOriginalSitemapUrl] = useState(sitemapUrl);

  // Function to fetch sitemap URLs via API
  const fetchSitemapUrls = async (url: string): Promise<{ urls: SitemapUrl[]; isSitemapIndex: boolean }> => {
    const response = await fetch("/api/fetch-sitemap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch sitemap");
    }

    return data.data;
  };

  // Function to handle opening a referenced sitemap
  const handleOpenSitemap = async (url: string) => {
    setLoading(true);
    setError(null);
    setCurrentSitemapUrl(url);

    try {
      const { urls, isSitemapIndex } = await fetchSitemapUrls(url);
      setFetchedUrls(urls);
      setFetchedIsSitemapIndex(isSitemapIndex);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sitemap');
    } finally {
      setLoading(false);
    }
  };

  // Fetch sitemap URLs when modal opens
  useEffect(() => {
    if (isOpen && sitemapUrl) {
      setLoading(true);
      setError(null);
      setFetchedUrls([]);
      setFetchedIsSitemapIndex(null);
      setCurrentSitemapUrl(sitemapUrl);
      setOriginalSitemapUrl(sitemapUrl);

      fetchSitemapUrls(sitemapUrl)
        .then(({ urls, isSitemapIndex }) => {
          setFetchedUrls(urls);
          setFetchedIsSitemapIndex(isSitemapIndex);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to load sitemap');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, sitemapUrl]);

  // Use fetched URLs if available, otherwise fall back to provided URLs
  const displayUrls = fetchedUrls.length > 0 ? fetchedUrls : urls;

  // Use fetched isSitemapIndex if available, otherwise use the initial prop
  const displayIsSitemapIndex = fetchedIsSitemapIndex !== null ? fetchedIsSitemapIndex : initialIsSitemapIndex;

  // Separate sitemap references from page URLs
  const sitemapRefs = displayUrls.filter(url => url.isSitemap);
  const pageUrls = displayUrls.filter(url => !url.isSitemap);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Sitemap URLs
          </DialogTitle>
          <div className="flex flex-col gap-2">
            {currentSitemapUrl !== originalSitemapUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenSitemap(originalSitemapUrl)}
                className="text-xs"
              >
                ← Back to Main Sitemap
              </Button>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-muted-foreground">
              <ExternalLink className="h-4 w-4" />
              <a
                href={currentSitemapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline break-all"
              >
                {currentSitemapUrl}
              </a>
            </div>
          </div>
          {displayIsSitemapIndex && (
            <Badge variant="secondary" className="w-fit">
              Sitemap Index ({displayUrls.length} total URLs)
            </Badge>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load sitemap</h3>
              <p className="text-gray-700 dark:text-muted-foreground mb-4">{error}</p>
              <Button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  fetchSitemapUrls(sitemapUrl)
                    .then(({ urls, isSitemapIndex }) => {
                      setFetchedUrls(urls);
                      setFetchedIsSitemapIndex(isSitemapIndex);
                    })
                    .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load sitemap'))
                    .finally(() => setLoading(false));
                }}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Sitemap References (only shown for sitemap indexes) */}
              {displayIsSitemapIndex && sitemapRefs.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Referenced Sitemaps ({sitemapRefs.length})
                  </h3>
                  <div className="space-y-2">
                    {sitemapRefs.map((url, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Button
                            variant="link"
                            className="h-auto p-0 text-left justify-start text-sm hover:underline"
                            onClick={() => handleOpenSitemap(url.loc)}
                          >
                            {url.loc}
                          </Button>
                          {url.lastmod && (
                            <div className="text-xs text-gray-700 dark:text-muted-foreground mt-1">
                              Last modified: {new Date(url.lastmod).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t my-4" />
                </div>
              )}

              {/* Page URLs */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Page URLs ({pageUrls.length})
                </h3>

                {pageUrls.length === 0 ? (
                  <div className="text-center py-8 text-gray-600 dark:text-muted-foreground">
                    No page URLs found in this sitemap
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pageUrls.map((url, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <Globe className="h-4 w-4 text-green-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <a
                            href={url.loc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline break-all text-sm"
                          >
                            {url.loc}
                          </a>
                          <div className="flex items-center gap-2 mt-1">
                            {url.lastmod && (
                              <span className="text-xs text-gray-700 dark:text-muted-foreground">
                                Modified: {new Date(url.lastmod).toLocaleDateString()}
                              </span>
                            )}
                            {url.changefreq && (
                              <Badge variant="outline" className="text-xs">
                                {url.changefreq}
                              </Badge>
                            )}
                            {url.priority && (
                              <Badge variant="secondary" className="text-xs">
                                Priority: {url.priority}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
