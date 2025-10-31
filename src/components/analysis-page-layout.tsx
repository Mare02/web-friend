"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/workspace-layout";
import { NewAnalysisDialog } from "@/components/new-analysis-dialog";
import { AnalysisLoadingModal } from "@/components/analysis-loading-modal";
import { useHistory } from "@/contexts/history-context";
import { useLoading } from "@/contexts/loading-context";

interface AnalysisPageLayoutProps {
  children: React.ReactNode;
}

export function AnalysisPageLayout({ children }: AnalysisPageLayoutProps) {
  const router = useRouter();
  const { invalidateHistory } = useHistory();
  const { startLoading, stopLoading } = useLoading();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewAnalysis = () => {
    setDialogOpen(true);
  };

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    startLoading();

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      // Close the dialog before navigation
      setDialogOpen(false);

      if (data.success && data.data?.analysisId) {
        // Invalidate history cache to refetch with new analysis
        invalidateHistory();

        // Redirect to the new analysis page
        router.push(`/tools/website-analyzer/analysis/${data.data.analysisId}`);
      } else {
        // If no analysisId, go to workspace
        router.push("/tools/website-analyzer/workspace");
      }
    } catch (err) {
      console.error("Error analyzing:", err);
      // Close dialog even on error before navigation
      setDialogOpen(false);
      // On error, still go to workspace
      router.push("/tools/website-analyzer/workspace");
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  };

  return (
    <WorkspaceLayout
      onNewAnalysis={handleNewAnalysis}
    >
      {children}

      {/* New Analysis Dialog */}
      <NewAnalysisDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAnalyze={handleAnalyze}
        isLoading={isLoading}
      />

      {/* Loading Modal */}
      <AnalysisLoadingModal isOpen={isLoading} isLoading={isLoading} />
    </WorkspaceLayout>
  );
}

