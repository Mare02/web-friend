import { notFound } from "next/navigation";
import { getAnalysis } from "@/lib/services/analysis-db";
import { AnalysisPageLayout } from "@/components/analysis-page-layout";
import { AnalysisTabs } from "@/components/analysis-tabs";

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

/**
 * Analysis detail page - displays a saved analysis
 */
export default async function AnalysisPage({ params, searchParams }: AnalysisPageProps) {
  const { id } = await params;
  const { tab } = await searchParams;

  let analysis;
  try {
    analysis = await getAnalysis(id);
  } catch (error) {
    console.error("Error fetching analysis:", error);
    notFound();
  }

  if (!analysis) {
    notFound();
  }

  // Transform data to match AnalysisResults expected format
  const result = {
    success: true,
    data: {
      websiteData: analysis.websiteData,
      analysis: analysis.analysisResult,
    },
  };

  // Check if action plan exists and transform SavedTask to ActionPlanTask format
  const hasActionPlan = analysis.actionPlan?.summary;
  const transformedActionPlan = hasActionPlan ? {
    summary: analysis.actionPlan.summary,
    timeline: analysis.actionPlan.timeline ?? undefined,
    quickWins: analysis.actionPlan.quickWins,
    tasks: analysis.actionPlan.tasks.map(task => ({
      id: task.id,
      category: task.category,
      priority: task.priority,
      title: task.title,
      description: task.description,
      effort: task.effort,
      impact: task.impact,
      estimatedTime: task.estimated_time ?? undefined,
    })),
  } : null;

  return (
    <AnalysisPageLayout>
      <div className="animate-in fade-in duration-500">
        <AnalysisTabs
          defaultTab={tab === "tasks" ? "tasks" : "analysis"}
          analysisResult={result}
          showGenerateTasksBanner={!hasActionPlan}
          transformedActionPlan={transformedActionPlan}
          savedTasks={analysis.actionPlan?.tasks || []}
          analysisUrl={analysis.url}
          websiteData={analysis.websiteData}
          analysisData={analysis.analysisResult}
        />
      </div>
    </AnalysisPageLayout>
  );
}

