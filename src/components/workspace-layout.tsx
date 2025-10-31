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
        <main className="flex-1 overflow-auto relative">
          {/* Mobile Sidebar Trigger */}
          <div className="lg:hidden fixed top-20 left-4 z-30">
            <MobileWorkspaceSidebar
              onNewAnalysis={onNewAnalysis}
              history={history}
              isLoadingHistory={isLoadingHistory}
            />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

