import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAnalysis } from "@/lib/services/analysis-db";
import { AnalysisPageLayout } from "@/components/analysis-page-layout";
import { AnalysisPageClient } from "./analysis-page-client";
import { getCanonicalUrl } from "@/lib/config";

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export async function generateMetadata({ params }: AnalysisPageProps): Promise<Metadata> {
  const { id } = await params;

  let analysis;
  try {
    analysis = await getAnalysis(id);
  } catch {
    return {
      title: 'Analysis Not Found | Web Friend',
    };
  }

  if (!analysis) {
    return {
      title: 'Analysis Not Found | Web Friend',
    };
  }

  const title = `Website Analysis: ${new URL(analysis.url).hostname} | Web Friend`;
  const description = `AI-powered website analysis for ${analysis.url}. Get SEO, performance, accessibility, and content quality insights.`;

  return {
    title,
    description,
    robots: "index, follow",
    alternates: {
      canonical: getCanonicalUrl(`/tools/website-analyzer/analysis/${id}`),
    },
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
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
      lighthouseData: analysis.lighthouseData,
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
      <AnalysisPageClient
        analysisId={id}
        analysisResult={result}
        showGenerateTasksBanner={!hasActionPlan}
        transformedActionPlan={transformedActionPlan}
        savedTasks={analysis.actionPlan?.tasks || []}
        analysisUrl={analysis.url}
        websiteData={analysis.websiteData}
        analysisData={analysis.analysisResult}
        defaultTab={tab === "tasks" ? "tasks" : "analysis"}
      />
    </AnalysisPageLayout>
  );
}

