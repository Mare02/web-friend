"use client";

import { useState } from "react";
import { SavedTask } from "@/lib/validators/schema";
import { TaskItem } from "@/components/task-item";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Info, CheckCircle2, Clock, Target } from "lucide-react";

interface TaskListProps {
  tasks: SavedTask[];
  onTaskUpdate?: (taskId: string, status: SavedTask["status"]) => Promise<void>;
  onTaskDelete?: (taskId: string) => Promise<void>;
  onTaskReanalyze?: (taskId: string) => Promise<void>;
  showUrl?: boolean;
  analysisUrl?: string;
}

const priorityColors = {
  high: "text-red-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
};

export function TaskList({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskReanalyze,
  showUrl,
  analysisUrl,
}: TaskListProps) {
  const [deletedTasks, setDeletedTasks] = useState<Set<string>>(new Set());

  // Filter out deleted tasks
  const activeTasks = tasks.filter((task) => !deletedTasks.has(task.id));

  // Group tasks by status
  const pendingTasks = activeTasks.filter((t) => t.status === "pending");
  const inProgressTasks = activeTasks.filter((t) => t.status === "in_progress");
  const completedTasks = activeTasks.filter((t) => t.status === "completed");
  const skippedTasks = activeTasks.filter((t) => t.status === "skipped");

  // Group tasks by priority
  const highPriorityTasks = activeTasks.filter((t) => t.priority === "high" && t.status !== "completed" && t.status !== "skipped");
  const mediumPriorityTasks = activeTasks.filter((t) => t.priority === "medium" && t.status !== "completed" && t.status !== "skipped");
  const lowPriorityTasks = activeTasks.filter((t) => t.priority === "low" && t.status !== "completed" && t.status !== "skipped");

  const handleTaskDelete = async (taskId: string) => {
    if (onTaskDelete) {
      await onTaskDelete(taskId);
      // Optimistically remove from UI
      setDeletedTasks((prev) => new Set(prev).add(taskId));
    }
  };

  if (activeTasks.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>No tasks available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card className="bg-muted/50">
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{activeTasks.length}</p>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-500">{pendingTasks.length}</p>
              <p className="text-xs text-muted-foreground">To Do</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-500">{inProgressTasks.length}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">{completedTasks.length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Tabs */}
      <Tabs defaultValue="priority" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="priority">By Priority</TabsTrigger>
          <TabsTrigger value="status">By Status</TabsTrigger>
        </TabsList>

        {/* By Priority View */}
        <TabsContent value="priority" className="space-y-6 mt-6">
          {/* High Priority */}
          {highPriorityTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className={`h-5 w-5 ${priorityColors.high}`} />
                <h3 className="text-lg font-semibold">High Priority Tasks</h3>
                <Badge variant="outline">{highPriorityTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {highPriorityTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={onTaskUpdate}
                    onDelete={handleTaskDelete}
                    onReanalyze={onTaskReanalyze}
                    showUrl={showUrl}
                    url={analysisUrl}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Medium Priority */}
          {mediumPriorityTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Info className={`h-5 w-5 ${priorityColors.medium}`} />
                <h3 className="text-lg font-semibold">Medium Priority Tasks</h3>
                <Badge variant="outline">{mediumPriorityTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {mediumPriorityTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={onTaskUpdate}
                    onDelete={handleTaskDelete}
                    onReanalyze={onTaskReanalyze}
                    showUrl={showUrl}
                    url={analysisUrl}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Low Priority */}
          {lowPriorityTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Info className={`h-5 w-5 ${priorityColors.low}`} />
                <h3 className="text-lg font-semibold">Low Priority Tasks</h3>
                <Badge variant="outline">{lowPriorityTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {lowPriorityTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={onTaskUpdate}
                    onDelete={handleTaskDelete}
                    onReanalyze={onTaskReanalyze}
                    showUrl={showUrl}
                    url={analysisUrl}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold">Completed Tasks</h3>
                <Badge variant="outline">{completedTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={onTaskUpdate}
                    onDelete={handleTaskDelete}
                    onReanalyze={onTaskReanalyze}
                    showUrl={showUrl}
                    url={analysisUrl}
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* By Status View */}
        <TabsContent value="status" className="space-y-6 mt-6">
          {/* To Do */}
          {pendingTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">To Do</h3>
                <Badge variant="outline">{pendingTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={onTaskUpdate}
                    onDelete={handleTaskDelete}
                    onReanalyze={onTaskReanalyze}
                    showUrl={showUrl}
                    url={analysisUrl}
                  />
                ))}
              </div>
            </div>
          )}

          {/* In Progress */}
          {inProgressTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">In Progress</h3>
                <Badge variant="outline">{inProgressTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {inProgressTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={onTaskUpdate}
                    onDelete={handleTaskDelete}
                    onReanalyze={onTaskReanalyze}
                    showUrl={showUrl}
                    url={analysisUrl}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {completedTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold">Completed</h3>
                <Badge variant="outline">{completedTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={onTaskUpdate}
                    onDelete={handleTaskDelete}
                    onReanalyze={onTaskReanalyze}
                    showUrl={showUrl}
                    url={analysisUrl}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Skipped */}
          {skippedTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Skipped</h3>
                <Badge variant="outline">{skippedTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {skippedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={onTaskUpdate}
                    onDelete={handleTaskDelete}
                    onReanalyze={onTaskReanalyze}
                    showUrl={showUrl}
                    url={analysisUrl}
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

