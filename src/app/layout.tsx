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
  "description": "Comprehensive suite of free web development tools including AI website analyzer, text analyzer, API tester, color palette generator, and QR code generator.",
  "url": "https://web-friend.vercel.app",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
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
  title: "Web Friend | Free Web Development Tools & Utilities",
  description: "Comprehensive suite of free web development tools including AI website analyzer, text analyzer, API tester, color palette generator, and QR code generator. Boost your productivity with professional-grade utilities.",
  keywords: ["web tools", "development tools", "SEO analyzer", "API tester", "color palette generator", "QR code generator", "text analyzer", "website analysis", "free tools"],
  authors: [{ name: "Web Friend Team" }],
  creator: "Web Friend",
  publisher: "Web Friend",
  robots: "index, follow",
  openGraph: {
    title: "Web Friend | Free Web Development Tools & Utilities",
    description: "Comprehensive suite of free web development tools including AI website analyzer, text analyzer, API tester, color palette generator, and QR code generator.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Friend | Free Web Development Tools & Utilities",
    description: "Comprehensive suite of free web development tools including AI website analyzer, text analyzer, API tester, color palette generator, and QR code generator.",
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
