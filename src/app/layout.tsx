import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkThemeProvider } from "@/components/clerk-theme-provider";
import { LoadingProvider } from "@/contexts/loading-context";
import { GlobalLoadingBar } from "@/components/global-loading-bar";
import { NavigationLoading } from "@/components/navigation-loading";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getBaseUrl } from "@/lib/config";

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Web Friend",
  "description": "Free digital tools for everyone: text analyzer, API tester, color palette generator, QR code generator, and indexability validator. Perfect for businesses, creators, and anyone working online.",
  "url": getBaseUrl(),
  "applicationCategory": "Utility",
  "operatingSystem": "Web Browser",
  "featureList": [
    "Text Analyzer",
    "API Tester",
    "Color Palette Generator",
    "QR Code Generator",
    "Indexability Validator"
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
  description: "Free digital tools for online professionals: content optimization, design tools, developer utilities, and SEO validation. Professional-grade, completely free.",
  keywords: ["digital tools", "text analyzer", "API tester", "color palette generator", "QR code generator", "SEO tools", "free tools", "online utilities"],
  authors: [{ name: "Web Friend Team" }],
  creator: "Web Friend",
  publisher: "Web Friend",
  robots: "index, follow",
  openGraph: {
    title: "Web Friend | Free Digital Tools for Everyone",
    description: "Free digital tools for online professionals: content optimization, design tools, developer utilities, and SEO validation. Professional-grade, completely free.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Friend | Free Digital Tools for Everyone",
    description: "Free digital tools for online professionals: content optimization, design tools, developer utilities, and SEO validation. Professional-grade, completely free.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col transition-colors duration-300 ease-in-out`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ClerkThemeProvider>
            <LoadingProvider>
              <GlobalLoadingBar />
              <Suspense fallback={null}>
                <NavigationLoading />
              </Suspense>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </LoadingProvider>
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
