"use client";

import { useRef } from "react";
import { AnalysisHeader, AnalysisHeaderRef } from "@/components/analysis-header";
import { AnalysisTabs } from "@/components/analysis-tabs";
import type { AnalyzeResponse, ActionPlan, SavedTask, WebsiteData, AnalysisResult } from "@/lib/validators/schema";

interface AnalysisPageClientProps {
  analysisId: string;
  analysisResult: AnalyzeResponse;
  showGenerateTasksBanner: boolean;
  transformedActionPlan: ActionPlan | null;
  savedTasks: SavedTask[];
  analysisUrl: string;
  websiteData: WebsiteData;
  analysisData: AnalysisResult;
  defaultTab: "analysis" | "tasks";
}

export function AnalysisPageClient({
  analysisId,
  analysisResult,
  showGenerateTasksBanner,
  transformedActionPlan,
  savedTasks,
  analysisUrl,
  websiteData,
  analysisData,
  defaultTab,
}: AnalysisPageClientProps) {
  const headerRef = useRef<AnalysisHeaderRef>(null);

  const handleDeleteAnalysis = () => {
    if (headerRef.current) {
      headerRef.current.triggerDelete();
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <AnalysisHeader
        ref={headerRef}
        analysisId={analysisId}
        url={analysisUrl}
        title={websiteData.title}
      />
      <AnalysisTabs
        defaultTab={defaultTab}
        analysisResult={analysisResult}
        showGenerateTasksBanner={showGenerateTasksBanner}
        transformedActionPlan={transformedActionPlan}
        savedTasks={savedTasks}
        analysisUrl={analysisUrl}
        websiteData={websiteData}
        analysisData={analysisData}
        analysisId={analysisId}
        onDeleteAnalysis={handleDeleteAnalysis}
      />
    </div>
  );
}
