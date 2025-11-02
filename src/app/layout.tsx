import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkThemeProvider } from "@/components/clerk-theme-provider";
import { HistoryProvider } from "@/contexts/history-context";
import { LoadingProvider } from "@/contexts/loading-context";
import { GlobalLoadingBar } from "@/components/global-loading-bar";
import { NavigationLoading } from "@/components/navigation-loading";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Web Friend",
  "description": "Free digital tools for everyone: AI website analyzer, text analyzer, API tester, color palette generator, and QR code generator. Perfect for businesses, creators, and anyone working online.",
  "url": "https://web-friend.vercel.app",
  "applicationCategory": "Utility",
  "operatingSystem": "Web Browser",
  "featureList": [
    "AI Website Analyzer",
    "Text Analyzer",
    "API Tester",
    "Color Palette Generator",
    "QR Code Generator"
  ],
  "publisher": {
    "@type": "Organization",
    "name": "Web Friend Team"
  }
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web Friend | Free Digital Tools for Everyone",
  description: "Essential digital tools for businesses, creators, and everyone online. AI website analyzer, text analyzer, API tester, color palettes, QR codes - all free and professional-grade.",
  keywords: ["digital tools", "website analyzer", "text analyzer", "API tester", "color palette generator", "QR code generator", "SEO tools", "free tools", "online utilities"],
  authors: [{ name: "Web Friend Team" }],
  creator: "Web Friend",
  publisher: "Web Friend",
  robots: "index, follow",
  openGraph: {
    title: "Web Friend | Free Digital Tools for Everyone",
    description: "Essential digital tools for businesses, creators, and everyone online. AI website analyzer, text analyzer, API tester, color palettes, QR codes - all free and professional-grade.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Friend | Free Digital Tools for Everyone",
    description: "Essential digital tools for businesses, creators, and everyone online. AI website analyzer, text analyzer, API tester, color palettes, QR codes - all free and professional-grade.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkThemeProvider>
            <LoadingProvider>
              <HistoryProvider>
                <GlobalLoadingBar />
                <Suspense fallback={null}>
                  <NavigationLoading />
                </Suspense>
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </HistoryProvider>
            </LoadingProvider>
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
