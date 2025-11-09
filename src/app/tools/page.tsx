import { Wrench } from "lucide-react";
import type { Metadata } from "next";
import { ToolCard } from "@/components/tool-card";
import { tools } from "@/lib/tools-data";
import { getCanonicalUrl } from "@/lib/config";

const pageTitle = "Digital Tools | Web Friend";
const pageDescription = "Essential tools for everyone working with digital content and online projects. Professional quality, completely free, no limits.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: pageTitle,
    description: pageDescription,
    keywords: ["digital tools", "online tools", "free tools", "website tools", "developer tools", "content tools"],
    robots: "index, follow",
    alternates: {
      canonical: getCanonicalUrl("/tools"),
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
    },
  };
}

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 pt-16 md:pt-24 pb-40">
      {/* Header Section */}
      <div className="text-center mb-16 space-y-6">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
          <Wrench className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Digital Tools
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Essential tools for everyone working with digital content and online projects.
          Professional quality, completely free, no limits.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <ToolCard key={tool.title} tool={tool} variant="default" />
        ))}
      </div>
    </div>
  );
}
