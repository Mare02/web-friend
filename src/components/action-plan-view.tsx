"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionPlan } from "@/lib/validators/schema";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  Target,
  Zap,
  FileText,
  Search,
  Accessibility,
} from "lucide-react";

interface ActionPlanViewProps {
  plan: ActionPlan;
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

export function ActionPlanView({ plan }: ActionPlanViewProps) {
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

      {/* Tasks by Priority */}
      {(["high", "medium", "low"] as const).map((priority) => {
        const tasks = plan.tasks.filter((t) => t.priority === priority);
        if (tasks.length === 0) return null;

        return (
          <div key={priority} className="space-y-3">
            <div className="flex items-center gap-2">
              {priority === "high" && (
                <AlertCircle className={`h-5 w-5 ${priorityColors.high}`} />
              )}
              {priority === "medium" && (
                <Info className={`h-5 w-5 ${priorityColors.medium}`} />
              )}
              {priority === "low" && (
                <Info className={`h-5 w-5 ${priorityColors.low}`} />
              )}
              <h3 className="text-lg font-semibold">
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority Tasks
              </h3>
              <Badge variant="outline">{tasks.length}</Badge>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => {
                const CategoryIcon = categoryIcons[task.category];
                
                return (
                  <Card key={task.id} className="hover:border-primary/40 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-2 flex-1">
                          <CategoryIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <CardTitle className="text-base">{task.title}</CardTitle>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-end">
                          <Badge variant="outline" className="capitalize">
                            {task.category}
                          </Badge>
                          <Badge variant={impactColors[task.impact]}>
                            {task.impact} impact
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          <span>Effort: {effortLabels[task.effort]}</span>
                        </div>
                        {task.estimatedTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{task.estimatedTime}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

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

