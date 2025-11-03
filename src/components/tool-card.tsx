import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Tool } from "@/lib/tools-data";

interface ToolCardProps {
  tool: Tool;
  variant?: "default" | "compact";
}

export function ToolCard({ tool, variant = "default" }: ToolCardProps) {
  const Icon = tool.icon;
  const isCompact = variant === "compact";

  return (
    <Link href={tool.href}>
      <Card className="group hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 border-2 hover:border-primary/20 backdrop-blur-sm bg-card/95 hover:bg-card/98 cursor-pointer">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-linear-to-r ${tool.color} text-white`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex flex-wrap gap-1">
              {tool.badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
          <CardTitle className={isCompact ? "text-xl mb-2" : "text-2xl mb-2"}>
            {tool.title}
          </CardTitle>
          <CardDescription className={isCompact ? "text-sm leading-relaxed" : "text-base leading-relaxed"}>
            {tool.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {tool.features.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
          <Button
            size={isCompact ? "sm" : "default"}
            className="w-full group-hover:bg-primary/90 group-hover:scale-105 group-hover:shadow-md transition-all duration-300 shadow-sm hover:shadow-lg"
            variant="default"
          >
            Get Started
            <ArrowRight className={`ml-2 ${isCompact ? "h-3 w-3" : "h-4 w-4"}`} />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
