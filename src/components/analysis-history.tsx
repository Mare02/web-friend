"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHistory } from "@/contexts/history-context";
import { useLoading } from "@/contexts/loading-context";
import { Clock, ExternalLink, BarChart3, Trash2 } from "lucide-react";
import type { WebsiteData } from "@/lib/validators/schema";

interface AnalysisHistoryProps {
  onAnalyze?: (url: string) => void;
}

export function AnalysisHistory({ onAnalyze }: AnalysisHistoryProps) {
  const { history, isLoading, error: contextError, invalidateHistory } = useHistory();
  const { startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Combine context error with local error
  const displayError = error || contextError;

  const formatDate = (timestamp: number): string => {
    // Validate timestamp
    if (!timestamp || timestamp <= 0 || isNaN(timestamp)) {
      return "Unknown date";
    }

    // Auto-detect if timestamp is in seconds or milliseconds
    // If timestamp is less than 10 billion, it's likely in seconds (before year 2286)
    const timestampMs = timestamp < 10000000000 ? timestamp * 1000 : timestamp;

    const date = new Date(timestampMs);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7 && diffDays > 0) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getWebsiteTitle = (previewData: string): string => {
    try {
      const data: WebsiteData = JSON.parse(previewData);
      return data.title || new URL(data.url).hostname;
    } catch {
      return "Unknown";
    }
  };

  const handleDeleteClick = (analysisId: string) => {
    setDeletingId(analysisId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    try {
      setIsDeleting(true);
      startLoading();
      const response = await fetch(`/api/analyses/${deletingId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete analysis");
      }

      // Invalidate history cache to refetch without deleted analysis
      invalidateHistory();
      
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (err) {
      console.error("Error deleting analysis:", err);
      setError(err instanceof Error ? err.message : "Failed to delete analysis");
    } finally {
      setIsDeleting(false);
      stopLoading();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (displayError) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{displayError}</p>
        <Button variant="outline" size="sm" onClick={() => invalidateHistory()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Analysis History</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your analyzed websites will appear here. Start by analyzing your first website above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Your Analysis History</h2>
        <p className="text-muted-foreground">
          View and re-analyze your previously analyzed websites
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {history.map((item) => {
          const websiteTitle = getWebsiteTitle(item.preview_data);
          const url = new URL(item.url);

          return (
            <Card key={item.latest_analysis_id} className="hover:shadow-lg transition-shadow group cursor-pointer">
              <Link href={`/tools/website-analyzer/analysis/${item.latest_analysis_id}`} className="block cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base line-clamp-1">
                        {websiteTitle}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteClick(item.latest_analysis_id);
                      }}
                      title="Delete analysis"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <ExternalLink className="h-3 w-3" />
                    <span className="line-clamp-1">{url.hostname}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(item.latest_analysis_date)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(item.url, "_blank");
                      }}
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      Visit
                    </Button>
                    {onAnalyze && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onAnalyze(item.url);
                        }}
                      >
                        <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                        Re-analyze
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Analysis</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this analysis? This action cannot be undone.
              All associated tasks will also be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
