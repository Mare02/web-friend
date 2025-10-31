"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  Search,
  FileText,
  ChevronDown,
  Sparkles
} from "lucide-react";

const tools = [
  {
    name: "AI Website Analyzer",
    description: "SEO, performance, and accessibility analysis",
    href: "/tools/website-analyzer",
    icon: Search,
    badge: "AI",
  },
  {
    name: "Text Analyzer",
    description: "Readability and SEO content analysis",
    href: "/tools/text-analyzer",
    icon: FileText,
    badge: "Free",
  },
];

export function ToolsNavigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          <span className="hidden sm:inline">Tools</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <div className="px-2 py-2">
          <p className="text-sm font-medium text-muted-foreground mb-2">Available Tools</p>
        </div>
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = pathname === tool.href;

          return (
            <DropdownMenuItem key={tool.href} asChild>
              <Link
                href={tool.href}
                className={`flex items-start gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer ${
                  isActive ? 'bg-muted' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="shrink-0 mt-0.5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{tool.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {tool.badge}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tool.description}
                  </p>
                </div>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
