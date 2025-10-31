"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLoading } from "@/contexts/loading-context";
import { useHistory } from "@/contexts/history-context";
import { cn } from "@/lib/utils";
import {
  Home,
  Plus,
  Clock,
  ExternalLink,
  BarChart3,
  CheckSquare,
  Trash2
} from "lucide-react";
import type { AnalysisHistoryItem, WebsiteData } from "@/lib/validators/schema";

interface WorkspaceSidebarProps {
  onNewAnalysis?: () => void;
  history: AnalysisHistoryItem[];
  isLoadingHistory: boolean;
}

export function WorkspaceSidebar({
  onNewAnalysis,
  history,
  isLoadingHistory
}: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();
  const { invalidateHistory } = useHistory();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNavigation = (href: string) => {
    if (pathname !== href) {
      startLoading();
      router.push(href);
    }
  };

  const formatDate = (timestamp: number): string => {
    if (!timestamp || timestamp <= 0 || isNaN(timestamp)) {
      return "Unknown";
    }

    const timestampMs = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
    const date = new Date(timestampMs);

    if (isNaN(date.getTime())) {
      return "Invalid";
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7 && diffDays > 0) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getWebsiteTitle = (previewData: string): string => {
    try {
      const data: WebsiteData = JSON.parse(previewData);
      return data.title || new URL(data.url).hostname;
    } catch {
      return "Unknown";
    }
  };

  const getWebsiteHostname = (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const handleDeleteClick = (analysisId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingId(analysisId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    try {
      setIsDeleting(true);
      startLoading();
      setError(null);

      const response = await fetch(`/api/analyses/${deletingId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete analysis");
      }

      // Invalidate history cache to refetch without deleted analysis
      invalidateHistory();

      // If we're currently viewing the deleted analysis, redirect to workspace
      if (pathname === `/tools/website-analyzer/analysis/${deletingId}`) {
        router.push("/tools/website-analyzer/workspace");
      }

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
    setError(null);
  };

  return (
    <div className="flex flex-col h-full border-r bg-muted/10">
      {/* Header */}
      <div className="p-4 border-b">
        <Button
          onClick={onNewAnalysis}
          className="w-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Analysis
        </Button>
      </div>

      {/* Navigation */}
      <div className="p-3 border-b">
        <nav className="space-y-1">
          <Button
            variant={pathname === "/tools/website-analyzer/workspace" ? "secondary" : "ghost"}
            className="w-full justify-start"
            size="sm"
            onClick={() => handleNavigation("/tools/website-analyzer/workspace")}
          >
            <Home className="h-4 w-4 mr-2" />
            Workspace
          </Button>
          <Button
            variant={pathname === "/tools/website-analyzer/workspace/tasks" ? "secondary" : "ghost"}
            className="w-full justify-start"
            size="sm"
            onClick={() => handleNavigation("/tools/website-analyzer/workspace/tasks")}
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            My Tasks
          </Button>
        </nav>
      </div>

      {/* Analysis History */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-3 border-b">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4" />
            <span>Recent Analyses</span>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {isLoadingHistory ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-3 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                ))}
              </>
            ) : history.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No analyses yet</p>
              </div>
            ) : (
              history.map((item) => {
                const websiteTitle = getWebsiteTitle(item.preview_data);
                const hostname = getWebsiteHostname(item.url);
                const isActive = pathname === `/tools/website-analyzer/analysis/${item.latest_analysis_id}`;
                const href = `/tools/website-analyzer/analysis/${item.latest_analysis_id}`;

                return (
                  <div
                    key={item.latest_analysis_id}
                    className={cn(
                      "block group rounded-lg border transition-colors",
                      isActive
                        ? "bg-primary/10 border-primary hover:bg-primary/15"
                        : "bg-card hover:bg-accent/50"
                    )}
                  >
                    <div
                      onClick={() => handleNavigation(href)}
                      className="p-3 space-y-2 cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className={cn(
                            "text-sm font-medium line-clamp-1 mb-1",
                            isActive && "text-primary"
                          )}>
                            {websiteTitle}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-1 flex items-center gap-1">
                            <ExternalLink className="h-3 w-3 shrink-0" />
                            {hostname}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleDeleteClick(item.latest_analysis_id, e)}
                          title="Delete analysis"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(item.latest_analysis_date)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Analysis</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this analysis? This will delete ALL analyses for this website URL.
              This action cannot be undone and all associated tasks will also be deleted.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}
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

