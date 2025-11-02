import Link from "next/link";
import { Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { ToolsNavigation } from "@/components/tools-navigation";

export function Header() {
  return (
    <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Web Friend</span>
          </Link>
          <div className="flex items-center gap-4">
            <ToolsNavigation />
            <Link href="/blogs">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Blogs</span>
              </Button>
            </Link>
            <UserMenu />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
