"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalysisResults } from "@/components/analysis-results";
import { ActionPlanInteractive } from "@/components/action-plan-interactive";
import { EmptyTasksState } from "@/components/empty-tasks-state";
import type { AnalyzeResponse, ActionPlan, SavedTask, WebsiteData, AnalysisResult } from "@/lib/validators/schema";

interface AnalysisTabsProps {
  defaultTab: "analysis" | "tasks";
  analysisResult: AnalyzeResponse;
  showGenerateTasksBanner: boolean;
  transformedActionPlan: ActionPlan | null;
  savedTasks: SavedTask[];
  analysisUrl: string;
  websiteData: WebsiteData;
  analysisData: AnalysisResult;
  onDeleteAnalysis: () => void;
}

export function AnalysisTabs({
  defaultTab,
  analysisResult,
  showGenerateTasksBanner,
  transformedActionPlan,
  savedTasks,
  analysisUrl,
  websiteData,
  analysisData,
  onDeleteAnalysis,
}: AnalysisTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 pt-4">
          <TabsContent value="analysis" className="mt-0">
            <AnalysisResults
              result={analysisResult}
              showHeader={false}
              showGenerateTasksBanner={showGenerateTasksBanner}
            />
          </TabsContent>

          <TabsContent value="tasks" className="mt-0">
            {transformedActionPlan ? (
              <ActionPlanInteractive
                plan={transformedActionPlan}
                savedTasks={savedTasks}
                analysisUrl={analysisUrl}
              />
            ) : (
              <EmptyTasksState
                websiteData={websiteData}
                analysis={analysisData}
              />
            )}
          </TabsContent>
        </div>
      </div>

      {/* Delete Analysis Button at the bottom */}
      <div className="border-t px-6 py-4 bg-muted/10 flex-shrink-0">
        <button
          onClick={onDeleteAnalysis}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-md transition-colors"
        >
          Delete Analysis
        </button>
      </div>
    </Tabs>
  );
}

