"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { ReactNode } from "react";

export function ClerkThemeProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
        elements: {
          card: "shadow-lg",
          modalContent: "shadow-lg",
          formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}

