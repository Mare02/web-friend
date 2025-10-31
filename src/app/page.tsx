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
  Code
} from "lucide-react";

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
    features: ["API Testing", "API Documentation", "API Monitoring", "API Management"]
  }
];

const features = [
  {
    icon: Sparkles,
    title: "Specialized Tools",
    description: "Complete toolkit with AI website analyzer, text analyzer, color palette generator, and API tester"
  },
  {
    icon: BarChart3,
    title: "AI-Enhanced Features",
    description: "Intelligent analysis powered by AI across website SEO, content quality, and design tools"
  },
  {
    icon: Target,
    title: "Zero Cost Utilities",
    description: "High-quality web development tools available completely free for everyone"
  }
];

export default function Home() {
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
            Comprehensive web analysis tools powered by AI and advanced algorithms.
            Optimize your website&apos;s SEO, performance, accessibility, and content quality.
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
              A comprehensive suite of free web development tools designed for developers, designers, marketers, and content creators.
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
      </div>
    </div>
  );
}
