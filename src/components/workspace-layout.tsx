"use client";

import { WorkspaceSidebar } from "@/components/workspace-sidebar";
import { MobileWorkspaceSidebar } from "@/components/mobile-workspace-sidebar";
import { useHistory } from "@/contexts/history-context";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  onNewAnalysis?: () => void;
}

export function WorkspaceLayout({
  children,
  onNewAnalysis
}: WorkspaceLayoutProps) {
  const { history, isLoading: isLoadingHistory } = useHistory();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 flex-col">
        <WorkspaceSidebar
          onNewAnalysis={onNewAnalysis}
          history={history}
          isLoadingHistory={isLoadingHistory}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto relative pt-10 lg:pt-0">
          {children}
        </main>
      </div>

      {/* Secondary Header with Mobile Menu - Fixed to viewport */}
      <div
        className="lg:hidden fixed top-16 left-0 right-0 z-10 flex items-center h-12 px-4 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80"
      >
        <MobileWorkspaceSidebar
          onNewAnalysis={onNewAnalysis}
          history={history}
          isLoadingHistory={isLoadingHistory}
        />
      </div>
    </div>
  );
}

