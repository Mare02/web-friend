"use client";

import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger, SheetHeader, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Newspaper, Sparkles, Wrench, Palette, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ToolsNavigation } from "@/components/tools-navigation";
import Link from "next/link";
import { useState } from "react";

export function MobileMenuSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-11 w-11 md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0 [&>button]:hidden" aria-describedby="mobile-menu-description">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription id="mobile-menu-description" className="sr-only">
          Access tools, blogs, and theme settings
        </SheetDescription>

        {/* Header */}
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            </div>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Navigation */}
          <div className="flex-1 px-4 py-6 space-y-6">
            {/* Tools Section */}
            <ToolsNavigation onItemClick={() => setOpen(false)} />

            {/* Content Section */}
            <Link href="/blogs" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-3 h-11">
                <Newspaper className="h-4 w-4" />
                <span>Blogs</span>
              </Button>
            </Link>

            <div className="border-t border-border" />

            {/* Preferences Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Preferences</h3>
              </div>
              <div className="pl-6">
                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Theme</span>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
