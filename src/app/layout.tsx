import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkThemeProvider } from "@/components/clerk-theme-provider";
import { HistoryProvider } from "@/contexts/history-context";
import { LoadingProvider } from "@/contexts/loading-context";
import { GlobalLoadingBar } from "@/components/global-loading-bar";
import { NavigationLoading } from "@/components/navigation-loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Website Analyzer | SEO, Content & Performance Analysis",
  description: "Analyze your website for SEO, content quality, performance, and accessibility with AI-powered insights and recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
                <NavigationLoading />
                {children}
              </HistoryProvider>
            </LoadingProvider>
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
