"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SavedTask, TaskReanalysis } from "@/lib/validators/schema";
import {
  Check,
  X,
  Clock,
  Target,
  Zap,
  FileText,
  Search,
  Accessibility,
  Trash2,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: SavedTask;
  onStatusChange?: (taskId: string, status: SavedTask["status"]) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
  onReanalyze?: (taskId: string) => Promise<void>;
  showUrl?: boolean;
  url?: string;
}

const categoryIcons = {
  seo: Search,
  content: FileText,
  performance: Zap,
  accessibility: Accessibility,
};

const priorityColors = {
  high: "text-red-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
};

const impactColors = {
  high: "default",
  medium: "secondary",
  low: "outline",
} as const;

const effortLabels = {
  quick: "Quick Win",
  moderate: "Moderate",
  significant: "Significant",
};

const statusLabels = {
  pending: "To Do",
  in_progress: "In Progress",
  completed: "Completed",
  skipped: "Skipped",
};

export function TaskItem({ task, onStatusChange, onDelete, onReanalyze, showUrl, url }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showReanalysis, setShowReanalysis] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const CategoryIcon = categoryIcons[task.category];
  const isCompleted = task.status === "completed";
  const isSkipped = task.status === "skipped";

  const handleToggleComplete = async () => {
    if (!onStatusChange || isUpdating) return;

    setIsUpdating(true);
    try {
      const newStatus = isCompleted ? "pending" : "completed";
      await onStatusChange(task.id, newStatus);
    } catch (error) {
      console.error("Failed to update task status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!onDelete || isDeleting) return;

    setIsDeleting(true);
    setShowDeleteDialog(false);
    try {
      await onDelete(task.id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      setIsDeleting(false);
    }
  };

  const handleReanalyze = async () => {
    if (!onReanalyze || isReanalyzing) return;

    setIsReanalyzing(true);
    try {
      await onReanalyze(task.id);
      setShowReanalysis(true);
    } catch (error) {
      console.error("Failed to reanalyze task:", error);
    } finally {
      setIsReanalyzing(false);
    }
  };

  // Parse reanalysis data if available
  let reanalysisData: TaskReanalysis | null = null;
  if (task.last_reanalysis) {
    try {
      reanalysisData = JSON.parse(task.last_reanalysis);
    } catch (error) {
      console.error("Failed to parse reanalysis data:", error);
    }
  }

  const getReanalysisIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'partially_resolved':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'not_resolved':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getReanalysisColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20';
      case 'partially_resolved':
        return 'border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20';
      case 'not_resolved':
        return 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20';
      default:
        return '';
    }
  };

  return (
    <Card
      className={cn(
        "hover:border-primary/40 transition-all",
        isCompleted && "opacity-60 bg-muted/30",
        isSkipped && "opacity-40",
        isDeleting && "opacity-30"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3 flex-1">
            {/* Enhanced Interactive Checkbox */}
            <button
              onClick={handleToggleComplete}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              disabled={isUpdating || isSkipped || isDeleting}
              className={cn(
                "mt-0.5 flex-shrink-0 transition-all duration-200 rounded-md relative",
                "w-5 h-5 border-2 flex items-center justify-center",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isUpdating && "cursor-wait border-muted-foreground",
                isSkipped && "cursor-not-allowed opacity-50 border-muted",
                isCompleted && "bg-green-500 border-green-500",
                isCompleted && isHovered && "bg-green-600 border-green-600 scale-105 shadow-sm",
                !isCompleted && !isSkipped && !isUpdating && "border-muted-foreground",
                !isCompleted && !isSkipped && !isUpdating && isHovered && "border-primary bg-primary/10 scale-105 shadow-sm",
                !isCompleted && !isSkipped && !isUpdating && "cursor-pointer"
              )}
            >
              {isUpdating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              ) : isCompleted ? (
                <>
                  <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
                  {isHovered && (
                    <X className="absolute h-3 w-3 text-white/60 stroke-[2.5]" />
                  )}
                </>
              ) : (
                <>
                  {isHovered && (
                    <Check className="h-3.5 w-3.5 text-primary/50 stroke-[2.5]" />
                  )}
                </>
              )}
            </button>

            {/* Category Icon and Title */}
            <div className="flex items-start gap-2 flex-1">
              <CategoryIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <CardTitle
                  className={cn(
                    "text-base",
                    isCompleted && "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </CardTitle>
                {showUrl && url && (
                  <p className="text-xs text-muted-foreground mt-1">{url}</p>
                )}
              </div>
            </div>
          </div>

          {/* Badges - Below title on mobile, right side on desktop */}
          <div className="flex flex-wrap gap-2 ml-8 sm:ml-0 sm:items-center sm:justify-end sm:-mt-11">
            <Badge variant="outline" className="capitalize">
              {task.category}
            </Badge>
            <Badge variant={impactColors[task.impact]}>
              {task.impact} impact
            </Badge>
            {reanalysisData && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 cursor-pointer hover:bg-accent"
                onClick={() => setShowReanalysis(!showReanalysis)}
              >
                {getReanalysisIcon(reanalysisData.status)}
                <span className="capitalize">{reanalysisData.status.replace('_', ' ')}</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p
          className={cn(
            "text-sm text-muted-foreground",
            isCompleted && "line-through"
          )}
        >
          {task.description}
        </p>

        {/* Action Buttons Section */}
        <div className="flex flex-wrap gap-2 pt-1">
          {onReanalyze && (
            <Button
              variant={reanalysisData ? "outline" : "secondary"}
              size="sm"
              onClick={handleReanalyze}
              disabled={isReanalyzing || isDeleting || isUpdating}
              className={cn(
                "text-xs gap-1.5",
                !reanalysisData && "border-primary/30 bg-primary/5 hover:bg-primary/10"
              )}
            >
              {isReanalyzing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5" />
                  {reanalysisData ? "Check Again" : "Verify Completion"}
                </>
              )}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteClick}
              disabled={isDeleting || isUpdating}
              className="text-xs gap-1.5 text-muted-foreground hover:text-destructive"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </>
              )}
            </Button>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm font-medium text-foreground">{task.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete Task"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Target className={`h-3 w-3 ${priorityColors[task.priority]}`} />
            <span className="capitalize">{task.priority} priority</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>Effort: {effortLabels[task.effort]}</span>
          </div>
          {task.estimated_time && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{task.estimated_time}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Badge
              variant={
                task.status === "completed"
                  ? "default"
                  : task.status === "in_progress"
                  ? "secondary"
                  : "outline"
              }
              className="h-5 text-xs"
            >
              {statusLabels[task.status]}
            </Badge>
          </div>
        </div>
        {task.notes && (
          <div className="mt-2 p-2 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground">{task.notes}</p>
          </div>
        )}
        {task.completed_at && (
          <p className="text-xs text-muted-foreground">
            Completed {new Date(task.completed_at).toLocaleDateString()}
          </p>
        )}

        {/* Verification Prompt - shown when no reanalysis yet */}
        {onReanalyze && !reanalysisData && !isReanalyzing && (
          <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-2">
              <RefreshCw className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-primary">
                  Ready to verify this task?
                </p>
                <p className="text-xs text-muted-foreground">
                  Click &quot;Verify Completion&quot; to check if you&apos;ve successfully completed this task. 
                  The AI will analyze your website and provide detailed feedback.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reanalysis Results */}
        {reanalysisData && showReanalysis && (
          <div className={cn("mt-3 p-4 rounded-lg border-2", getReanalysisColor(reanalysisData.status))}>
            <div className="flex items-start gap-2 mb-2">
              {getReanalysisIcon(reanalysisData.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">
                    Task Verification Results
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    Score: {reanalysisData.score}/100
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {reanalysisData.feedback}
                </p>

                {reanalysisData.suggestions.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Suggestions for improvement:
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1 pl-4">
                      {reanalysisData.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="list-disc">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-3">
                  Checked {new Date(reanalysisData.checked_at).toLocaleString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowReanalysis(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

