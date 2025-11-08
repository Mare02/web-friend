"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tabParam = searchParams?.get("tab") || null;
  const derivedTab = useMemo(() => (tabParam === "tasks" || tabParam === "analysis" ? tabParam : null), [tabParam]);
  const [localTab, setLocalTab] = useState<"analysis" | "tasks">(derivedTab ?? defaultTab);
  const activeTab = derivedTab ?? localTab;
  const searchParamsString = searchParams?.toString() ?? "";

  const handleTabChange = useCallback(
    (value: string) => {
      if (value !== "analysis" && value !== "tasks") {
        return;
      }

      setLocalTab(value);

      if (!pathname) {
        return;
      }

      const params = new URLSearchParams(searchParamsString);

      if (value === defaultTab) {
        params.delete("tab");
      } else {
        params.set("tab", value);
      }

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [defaultTab, pathname, router, searchParamsString]
  );

  // Listen for manual events (e.g., after generating tasks) to switch tabs
  useEffect(() => {
    const handler = () => handleTabChange("tasks");
    window.addEventListener("tasks-generated", handler as EventListener);
    return () => window.removeEventListener("tasks-generated", handler as EventListener);
  }, [handleTabChange]);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex flex-col h-full">
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

