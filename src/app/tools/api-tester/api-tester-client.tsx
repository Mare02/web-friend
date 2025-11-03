"use client";

import { ApiTester } from "@/components/api-tester";
import { Globe } from "lucide-react";

export default function ApiTesterClient() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8 md:pt-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            API Tester
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
            Test and debug REST APIs with a comprehensive interface. Send requests, inspect responses,
            manage authentication, and save your API calls for later use.
          </p>
        </div>
      </div>

      {/* Tool */}
      <ApiTester />
    </div>
  );
}
