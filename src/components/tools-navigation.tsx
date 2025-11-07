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
import { Wrench, ChevronDown } from "lucide-react";
import { tools as allTools } from "@/lib/tools-data";

// Transform tools data for navigation format
const tools = allTools.map(tool => ({
  name: tool.title,
  description: tool.description.split('. ')[0] + (tool.description.includes('. ') ? '.' : ''), // Shorten description
  href: tool.href,
  icon: tool.icon,
  badges: tool.badges.map(badge =>
    badge === "AI Powered" ? "AI" : badge.replace(" Tool", "")
  ),
}));

interface ToolsNavigationProps {
  onItemClick?: () => void;
}

export function ToolsNavigation({ onItemClick }: ToolsNavigationProps = {}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          <span>Tools</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-full max-w-sm md:max-w-3xl">
        <div className="px-2 py-2">
          <p className="text-sm font-medium text-muted-foreground mb-2">Available Tools</p>
        </div>
        <div className="grid md:grid-cols-2 gap-2">
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
                  onClick={() => {
                    setIsOpen(false);
                    onItemClick?.();
                  }}
                >
                  <div className="shrink-0 mt-0.5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{tool.name}</span>
                      <div className="flex flex-wrap gap-1">
                        {tool.badges.map((badge) => (
                          <Badge key={badge} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {tool.description}
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
