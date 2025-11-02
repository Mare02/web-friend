import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Search,
  FileText,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Globe,
  Target,
  Palette,
  Code,
  QrCode
} from "lucide-react";
import { getAllCategoriesWithRecentArticles } from "@/lib/services/article-service";
import { RecentArticlesSection } from "@/components/articles/recent-articles-section";

const tools = [
  {
    title: "AI Website Analyzer",
    description: "Comprehensive SEO, performance, and accessibility analysis with AI-powered insights",
    icon: Search,
    href: "/tools/website-analyzer",
    badges: ["AI Powered", "Free Tool"],
    color: "from-blue-500 to-cyan-500",
    features: ["SEO Analysis", "Performance Metrics", "Accessibility Audit", "AI Recommendations"]
  },
  {
    title: "Text Analyzer",
    description: "Analyze text readability, SEO keywords, and content quality metrics",
    icon: FileText,
    href: "/tools/text-analyzer",
    badges: ["Free Tool"],
    color: "from-green-500 to-emerald-500",
    features: ["Readability Scores", "Keyword Density", "SEO Analysis", "Content Metrics"]
  },
  {
    title: "Color Palette Generator",
    description: "Generate harmonious color palettes using color theory and design principles",
    icon: Palette,
    href: "/tools/color-palette-generator",
    badges: ["Free Tool"],
    color: "from-purple-500 to-pink-500",
    features: ["Color Picker", "Color Harmonies", "CSS Gradients", "Palette Export"]
  },
  {
    title: "API Tester",
    description: "Test your APIs with ease using a simple and intuitive interface",
    icon: Code,
    href: "/tools/api-tester",
    badges: ["Free Tool"],
    color: "from-orange-500 to-yellow-500",
    features: ["API Testing Suite", "Auth Support", "Save & Load Requests"]
  },
  {
    title: "QR Code Generator",
    description: "Generate custom QR codes for URLs, text, email addresses, phone numbers, and WiFi networks",
    icon: QrCode,
    href: "/tools/qr-code-generator",
    badges: ["Free Tool"],
    color: "from-red-500 to-pink-500",
    features: ["Multiple Content Types", "Custom Colors", "Download Options", "Advanced Settings"]
  }
];

const features = [
  {
    icon: Sparkles,
    title: "Comprehensive Toolkit",
    description: "Everything you need for web development: AI analysis, API testing, design tools, content creation, and more - all in one place"
  },
  {
    icon: BarChart3,
    title: "Professional Quality",
    description: "Industry-standard tools used by developers, designers, marketers, and content creators worldwide"
  },
  {
    icon: Target,
    title: "100% Free Forever",
    description: "No subscriptions, no limits, no ads. High-quality web development tools available completely free"
  }
];

export default async function Home() {
  const categoriesWithArticles = await getAllCategoriesWithRecentArticles(3)

  return (
    <div className="bg-linear-to-b from-background to-muted/20">

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Globe className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight">
            Web Tools for
            <span className="block text-primary">Modern Creators</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your complete toolkit for web development, design, and content creation.
            From AI-powered website analysis to API testing, color palettes, and QR codes - all free.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.title} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 max-h-max">
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
                  <CardTitle className="text-2xl mb-2">{tool.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
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
                  <Link href={tool.href} className="block cursor-pointer">
                    <Button className="w-full group-hover:bg-primary/90 transition-colors">
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Web Friend?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The ultimate collection of professional web development tools. Whether you&apos;re a developer testing APIs, a designer creating color palettes, a marketer analyzing content, or anyone building for the web - we have you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center group">
                  <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
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

        {/* Articles Section */}
        {categoriesWithArticles.length > 0 && (
          <RecentArticlesSection categoriesWithArticles={categoriesWithArticles} />
        )}
      </div>
    </div>
  );
}
