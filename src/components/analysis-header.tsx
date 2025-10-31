"use client";

import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { ExternalLink } from "lucide-react";

interface AnalysisHeaderProps {
  analysisId: string;
  url: string;
  title?: string;
}

export interface AnalysisHeaderRef {
  triggerDelete: () => void;
}

export const AnalysisHeader = forwardRef<AnalysisHeaderRef, AnalysisHeaderProps>(
  ({ analysisId, url, title }, ref) => {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();
  const { invalidateHistory } = useHistory();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  // Expose delete function to parent components
  useImperativeHandle(ref, () => ({
    triggerDelete: handleDeleteClick,
  }));

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      startLoading();
      setError(null);

      const response = await fetch(`/api/analyses/${analysisId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete analysis");
      }

      // Invalidate history cache to refetch without deleted analysis
      invalidateHistory();

      // Redirect to workspace after successful deletion
      router.push("/tools/website-analyzer/workspace");
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
    setError(null);
  };


  return (
    <>
      <div className="mb-6 pt-6 px-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight line-clamp-2 sm:line-clamp-1">
            {title || "Website Analysis"}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <ExternalLink className="h-4 w-4" />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="line-clamp-1 hover:text-foreground transition-colors"
            >
              {url}
            </a>
          </div>
        </div>
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
    </>
  );
});

AnalysisHeader.displayName = "AnalysisHeader";
