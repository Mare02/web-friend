"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              card: "shadow-lg border-2 border-border",
              headerTitle: "text-2xl font-bold text-center",
              headerSubtitle: "text-muted-foreground text-center",
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 w-full",
              formFieldInput: "border-border focus:border-primary",
              footerActionLink: "text-primary hover:text-primary/80",
            },
          }}
        />
      </div>
    </div>
  );
}
