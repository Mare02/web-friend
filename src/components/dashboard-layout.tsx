"use client";

import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { UserMenu } from "@/components/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useHistory } from "@/contexts/history-context";
import { Sparkles } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onNewAnalysis?: () => void;
}

export function DashboardLayout({
  children,
  onNewAnalysis
}: DashboardLayoutProps) {
  const { history, isLoading: isLoadingHistory } = useHistory();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 flex-col">
        <DashboardSidebar
          onNewAnalysis={onNewAnalysis}
          history={history}
          isLoadingHistory={isLoadingHistory}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex h-14 items-center gap-4 px-4">
            <MobileSidebar
              onNewAnalysis={onNewAnalysis}
              history={history}
              isLoadingHistory={isLoadingHistory}
            />

            <div className="flex items-center gap-2 lg:hidden">
              <Sparkles className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <UserMenu />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

