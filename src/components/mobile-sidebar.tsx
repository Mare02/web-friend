"use client";

import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useState } from "react";
import type { AnalysisHistoryItem } from "@/lib/validators/schema";

interface MobileSidebarProps {
  onNewAnalysis?: () => void;
  history: AnalysisHistoryItem[];
  isLoadingHistory: boolean;
}

export function MobileSidebar({
  onNewAnalysis,
  history,
  isLoadingHistory
}: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  const handleNewAnalysis = () => {
    setOpen(false);
    onNewAnalysis?.();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-80" aria-describedby="mobile-menu-description">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription id="mobile-menu-description" className="sr-only">
          Access your analysis history and create new website analyses
        </SheetDescription>
        <DashboardSidebar
          onNewAnalysis={handleNewAnalysis}
          history={history}
          isLoadingHistory={isLoadingHistory}
        />
      </SheetContent>
    </Sheet>
  );
}

