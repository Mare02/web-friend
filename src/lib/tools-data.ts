import {
  FileText,
  Palette,
  Code,
  QrCode,
  Shield,
  FileCode,
  Eye,
  Regex
} from "lucide-react";

/**
 * Collection of available tools with their metadata
 * This is the single source of truth for tool definitions
 */
export const tools = [
  {
    title: "Text Analyzer",
    description: "Analyze text readability, SEO keywords, and content quality metrics",
    icon: FileText,
    href: "/tools/text-analyzer",
    badges: ["Free Tool", "SEO"],
    color: "from-green-500 to-emerald-500",
    features: ["Readability Scores", "Keyword Density", "SEO Analysis", "Content Metrics"]
  },
  {
    title: "Regex Tester",
    description: "Test and debug regular expressions with real-time matching, replacement, and comprehensive pattern library",
    icon: Regex,
    href: "/tools/regex-tester",
    badges: ["Free Tool"],
    color: "from-cyan-500 to-blue-500",
    features: ["Pattern Testing", "Find & Replace", "Pattern Library", "Real-time Validation"]
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
  },
  {
    title: "Indexability Validator",
    description: "Analyze robots.txt configuration, check indexability blockers, validate sitemaps, and get SEO recommendations",
    icon: Shield,
    href: "/tools/indexability-validator",
    badges: ["Free Tool", "SEO"],
    color: "from-blue-500 to-indigo-500",
    features: ["Robots.txt Analysis", "Indexability Check", "Sitemap Validation", "SEO Recommendations"]
  },
  {
    title: "XML/JSON Converter",
    description: "Convert between XML and JSON formats with real-time validation and formatting",
    icon: FileCode,
    href: "/tools/xml-json-converter",
    badges: ["Free Tool"],
    color: "from-teal-500 to-cyan-500",
    features: ["XML to JSON", "JSON to XML", "Format Validation", "Pretty Print"]
  },
  {
    title: "Markdown Preview",
    description: "Live markdown editor with instant preview, syntax highlighting, and export options",
    icon: Eye,
    href: "/tools/markdown-preview",
    badges: ["Free Tool"],
    color: "from-indigo-500 to-purple-500",
    features: ["Live Preview", "Syntax Highlighting", "Export Options", "GitHub Flavored Markdown"]
  }
] as const;

// Export the type for use in components
export type Tool = typeof tools[number];
