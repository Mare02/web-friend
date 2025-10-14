"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLoading } from "@/contexts/loading-context";
import { cn } from "@/lib/utils";
import {
  Home,
  Plus,
  Clock,
  ExternalLink,
  Sparkles,
  BarChart3,
  CheckSquare
} from "lucide-react";
import type { AnalysisHistoryItem, WebsiteData } from "@/lib/validators/schema";

interface DashboardSidebarProps {
  onNewAnalysis?: () => void;
  history: AnalysisHistoryItem[];
  isLoadingHistory: boolean;
}

export function DashboardSidebar({
  onNewAnalysis,
  history,
  isLoadingHistory
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { startLoading } = useLoading();

  const handleNavigation = (href: string) => {
    if (pathname !== href) {
      startLoading();
      router.push(href);
    }
  };

  const formatDate = (timestamp: number): string => {
    if (!timestamp || timestamp <= 0 || isNaN(timestamp)) {
      return "Unknown";
    }

    const timestampMs = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
    const date = new Date(timestampMs);

    if (isNaN(date.getTime())) {
      return "Invalid";
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7 && diffDays > 0) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getWebsiteTitle = (previewData: string): string => {
    try {
      const data: WebsiteData = JSON.parse(previewData);
      return data.title || new URL(data.url).hostname;
    } catch {
      return "Unknown";
    }
  };

  const getWebsiteHostname = (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="flex flex-col h-full border-r bg-muted/10">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-sm">AI Website Analyzer</h2>
        </div>

        <Button
          onClick={onNewAnalysis}
          className="w-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Analysis
        </Button>
      </div>

      {/* Navigation */}
      <div className="p-3 border-b">
        <nav className="space-y-1">
          <Button
            variant={pathname === "/dashboard" ? "secondary" : "ghost"}
            className="w-full justify-start"
            size="sm"
            onClick={() => handleNavigation("/dashboard")}
          >
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={pathname === "/dashboard/tasks" ? "secondary" : "ghost"}
            className="w-full justify-start"
            size="sm"
            onClick={() => handleNavigation("/dashboard/tasks")}
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            My Tasks
          </Button>
        </nav>
      </div>

      {/* Analysis History */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-3 border-b">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4" />
            <span>Recent Analyses</span>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {isLoadingHistory ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-3 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                ))}
              </>
            ) : history.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No analyses yet</p>
              </div>
            ) : (
              history.map((item) => {
                const websiteTitle = getWebsiteTitle(item.preview_data);
                const hostname = getWebsiteHostname(item.url);
                const isActive = pathname === `/analysis/${item.latest_analysis_id}`;
                const href = `/analysis/${item.latest_analysis_id}`;

                return (
                  <div
                    key={item.latest_analysis_id}
                    onClick={() => handleNavigation(href)}
                    className={cn(
                      "block group rounded-lg border transition-colors cursor-pointer",
                      isActive 
                        ? "bg-primary/10 border-primary hover:bg-primary/15" 
                        : "bg-card hover:bg-accent/50"
                    )}
                  >
                    <div className="p-3 space-y-2">
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "text-sm font-medium line-clamp-1 mb-1",
                          isActive && "text-primary"
                        )}>
                          {websiteTitle}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1 flex items-center gap-1">
                          <ExternalLink className="h-3 w-3 shrink-0" />
                          {hostname}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(item.latest_analysis_date)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

