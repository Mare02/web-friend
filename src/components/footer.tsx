import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity cursor-pointer">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Web Friend</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              Professional web analysis tools powered by AI and advanced algorithms.
              Optimize your website&apos;s SEO, performance, accessibility, and content quality.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools/website-analyzer" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  AI Website Analyzer
                </Link>
              </li>
              <li>
                <Link href="/tools/text-analyzer" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Text Analyzer
                </Link>
              </li>
              <li>
                <Link href="/tools/api-tester" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  API Tester
                </Link>
              </li>
              <li>
                <Link href="/tools/color-palette-generator" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Color Palette Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/qr-code-generator" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  QR Code Generator
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Web Friend.
          </p>
        </div>
      </div>
    </footer>
  );
}
