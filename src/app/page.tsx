import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import {
  Sparkles,
  BarChart3,
  ArrowRight,
  Globe,
  Target
} from "lucide-react";
import { getRecentArticles } from "@/lib/services/article-service";
import { RecentArticlesHomeSection } from "@/components/blogs/recent-articles-home-section";
import { ToolCard } from "@/components/tool-card";
import { tools } from "@/lib/tools-data";
import { getCanonicalUrl } from "@/lib/config";
import { AnimatedText } from "@/components/animated-text";

export const metadata: Metadata = {
  title: "Web Friend | Free Digital Tools for Everyone",
  description: "Free digital tools for online professionals: AI analysis, content optimization, design tools, and developer utilities. Professional-grade, completely free.",
  keywords: ["digital tools", "website analyzer", "text analyzer", "API tester", "color palette generator", "QR code generator", "SEO tools", "free tools", "online utilities"],
  authors: [{ name: "Web Friend Team" }],
  creator: "Web Friend",
  publisher: "Web Friend",
  robots: "index, follow",
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  openGraph: {
    title: "Web Friend | Free Digital Tools for Everyone",
    description: "Free digital tools for online professionals: AI analysis, content optimization, design tools, and developer utilities. Professional-grade, completely free.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Friend | Free Digital Tools for Everyone",
    description: "Free digital tools for online professionals: AI analysis, content optimization, design tools, and developer utilities. Professional-grade, completely free.",
  },
};

const features = [
  {
    icon: Sparkles,
    title: "Comprehensive Toolkit",
    description: "Everything you need for digital work: website analysis, QR codes, color palettes, API testing, text optimization, and more - all in one place"
  },
  {
    icon: BarChart3,
    title: "Professional Quality",
    description: "Industry-standard tools trusted by businesses, bloggers, creators, and professionals worldwide"
  },
  {
    icon: Target,
    title: "100% Free Forever",
    description: "No subscriptions, no limits, no ads. High-quality digital tools available completely free for everyone"
  }
];

export default async function Home() {
  const recentArticles = await getRecentArticles(3)

  return (
    <div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Globe className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight">
            Powerful Web Tools
            <AnimatedText words={["For Everyone", "For Creators", "For Designers", "For Developers", "For Professionals"]} />
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Free digital tools for everyone: AI analysis, content optimization, design tools, and developer utilities.
          </p>
        </div>

        {/* Featured Tools Section */}
        <div className="pb-20" id="tools">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tools.slice(0, 3).map((tool) => (
              <ToolCard key={tool.title} tool={tool} variant="compact" />
            ))}
          </div>

          <div className="text-center">
            <Link href="/tools">
              <Button size="lg" variant="outline">
                View All Tools
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Articles Section */}
        <div className="py-20">
          {recentArticles.length > 0 && (
            <RecentArticlesHomeSection articles={recentArticles} />
          )}
        </div>

        {/* Features Section */}
        <div className="pb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Web Friend?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Essential digital tools for everyone working online. Whether you&apos;re a business owner managing your website, a blogger creating content, a freelancer handling projects, or anyone who needs to work with digital tools - we have you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const floatClasses = [
                "float-animation",
                "float-animation-delayed",
                "float-animation-slow"
              ];
              return (
                <div key={feature.title} className="text-center group">
                  <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className={`h-6 w-6 text-primary ${floatClasses[index]}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
