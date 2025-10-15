"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { NewAnalysisDialog } from "@/components/new-analysis-dialog";
import { TaskList } from "@/components/task-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useHistory } from "@/contexts/history-context";
import { useLoading } from "@/contexts/loading-context";
import { SavedTask, AnalyzeResponse } from "@/lib/validators/schema";
import { AlertCircle, CheckSquare } from "lucide-react";

interface TaskWithUrl extends SavedTask {
  url?: string;
  analyzed_at?: number;
}

export default function TasksPage() {
  const { user } = useUser();
  const router = useRouter();
  const { invalidateHistory } = useHistory();
  const { startLoading, stopLoading } = useLoading();
  const [tasks, setTasks] = useState<TaskWithUrl[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Failed to fetch tasks");
        return;
      }

      setTasks(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId: string, status: SavedTask["status"]) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      // Update local state
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status,
                completed_at: status === "completed" ? Date.now() : null,
                started_at: status === "in_progress" ? Date.now() : task.started_at,
                updated_at: Date.now(),
              }
            : task
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);
      throw error;
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Remove from local state
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
      throw error;
    }
  };

  const handleTaskReanalyze = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/reanalyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to reanalyze task");
      }

      // Update local state with reanalysis data
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                last_reanalysis: JSON.stringify(data.data),
                last_reanalysis_at: data.data.checked_at,
                updated_at: Date.now(),
              }
            : task
        )
      );
    } catch (error) {
      console.error("Failed to reanalyze task:", error);
      throw error;
    }
  };

  const handleAnalyze = async (url: string) => {
    setIsAnalyzing(true);
    startLoading();
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data: AnalyzeResponse = await response.json();

      if (!data.success) {
        setError(data.error || "An unexpected error occurred");
        return;
      }

      // Invalidate history cache to refetch with new analysis
      invalidateHistory();

      // Close the dialog on success
      setDialogOpen(false);

      // If analysis was saved (has ID), navigate to the analysis page
      if (data.data?.analysisId) {
        router.push(`/analysis/${data.data.analysisId}`);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze website"
      );
    } finally {
      setIsAnalyzing(false);
      stopLoading();
    }
  };

  const handleNewAnalysis = () => {
    setDialogOpen(true);
  };

  return (
    <DashboardLayout onNewAnalysis={handleNewAnalysis}>
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <CheckSquare className="h-8 w-8 text-primary" />
              My Tasks
            </h1>
            <p className="text-lg text-muted-foreground">
              Track and manage all your optimization tasks across all analyses
            </p>
          </div>

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tasks List */}
          {!isLoading && !error && (
            <>
              {tasks.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Tasks Yet</CardTitle>
                    <CardDescription>
                      Start by analyzing a website and generating an action plan to see tasks here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                      <CheckSquare className="h-16 w-16 opacity-20" />
                      <p>Your tasks will appear here once you create an action plan.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <TaskList
                  tasks={tasks}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskDelete={handleTaskDelete}
                  onTaskReanalyze={handleTaskReanalyze}
                  showUrl={true}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* New Analysis Dialog */}
      <NewAnalysisDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAnalyze={handleAnalyze}
        isLoading={isAnalyzing}
      />
    </DashboardLayout>
  );
}

