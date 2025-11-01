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
  Palette,
  Globe,
  QrCode,
  ChevronDown
} from "lucide-react";

const tools = [
  {
    name: "AI Website Analyzer",
    description: "SEO, performance, and accessibility analysis",
    href: "/tools/website-analyzer",
    icon: Search,
    badges: ["AI", "Free"],
  },
  {
    name: "Text Analyzer",
    description: "Readability and SEO content analysis",
    href: "/tools/text-analyzer",
    icon: FileText,
    badges: ["Free"],
  },
  {
    name: "Color Palette Generator",
    description: "Generate harmonious color palettes",
    href: "/tools/color-palette-generator",
    icon: Palette,
    badges: ["Free"],
  },
  {
    name: "API Tester",
    description: "Test and debug REST APIs with authentication",
    href: "/tools/api-tester",
    icon: Globe,
    badges: ["Free"],
  },
  {
    name: "QR Code Generator",
    description: "Generate QR codes for URLs, text, and more",
    href: "/tools/qr-code-generator",
    icon: QrCode,
    badges: ["Free"],
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
      <DropdownMenuContent align="start">
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
                  onClick={() => setIsOpen(false)}
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
