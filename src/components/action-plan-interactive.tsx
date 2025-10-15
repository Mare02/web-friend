"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionPlan, SavedTask } from "@/lib/validators/schema";
import {
  CheckCircle2,
  Target,
  Zap,
  Clock,
} from "lucide-react";
import { TaskList } from "@/components/task-list";

interface ActionPlanInteractiveProps {
  plan: ActionPlan;
  savedTasks?: SavedTask[];
  analysisUrl?: string;
}

export function ActionPlanInteractive({
  plan,
  savedTasks,
  analysisUrl,
}: ActionPlanInteractiveProps) {
  // Convert ActionPlanTask to SavedTask format if using plan.tasks
  const convertActionPlanTasksToSavedTasks = (actionPlanTasks: typeof plan.tasks): SavedTask[] => {
    return actionPlanTasks.map((task, index) => ({
      id: task.id,
      analysis_id: '', // Will be set when saved to database
      user_id: null,
      category: task.category,
      priority: task.priority,
      title: task.title,
      description: task.description,
      effort: task.effort,
      impact: task.impact,
      estimated_time: task.estimatedTime || null,
      status: 'pending' as const,
      completed_at: null,
      started_at: null,
      notes: null,
      task_order: index,
      created_at: Date.now(),
      updated_at: null,
      last_reanalysis: null,
      last_reanalysis_at: null,
    }));
  };

  // Use savedTasks if available (from database), otherwise convert plan.tasks to SavedTask format
  const [tasks, setTasks] = useState<SavedTask[]>(
    savedTasks && savedTasks.length > 0
      ? savedTasks
      : convertActionPlanTasksToSavedTasks(plan.tasks)
  );

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

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const progressPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Action Plan</CardTitle>
          </div>
          <CardDescription className="text-base mt-2">
            {plan.summary}
          </CardDescription>
        </CardHeader>
        {tasks.length > 0 && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {completedCount} / {tasks.length} tasks completed
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Quick Wins Section */}
      {plan.quickWins.length > 0 && (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500" />
              Quick Wins 🎯
            </CardTitle>
            <CardDescription>
              High-impact tasks that require minimal effort - start here!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plan.quickWins.map((win, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{win}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Interactive Task List */}
      {tasks.length > 0 ? (
        <TaskList
          tasks={tasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          onTaskReanalyze={handleTaskReanalyze}
          analysisUrl={analysisUrl}
        />
      ) : (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <p>No tasks available. Generate an action plan to see tasks.</p>
          </CardContent>
        </Card>
      )}

      {/* Timeline Section */}
      {plan.timeline && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recommended Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {plan.timeline}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{plan.tasks.length}</p>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">
                {plan.tasks.filter((t) => t.priority === "high").length}
              </p>
              <p className="text-xs text-muted-foreground">High Priority</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">
                {plan.quickWins.length}
              </p>
              <p className="text-xs text-muted-foreground">Quick Wins</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-500">
                {plan.tasks.filter((t) => t.effort === "quick").length}
              </p>
              <p className="text-xs text-muted-foreground">Quick Tasks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

