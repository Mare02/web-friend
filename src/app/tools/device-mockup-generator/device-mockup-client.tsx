"use client";

import { DeviceMockup } from "@/components/device-mockup";
import { MonitorSmartphone } from "lucide-react";

export default function DeviceMockupClient() {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8 md:pt-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <MonitorSmartphone className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            App Screenshot Mockup Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
            Wrap your app screenshots in beautiful, realistic smartphone frames with vibrant gradient backgrounds. Perfect for App Store listings.
          </p>
        </div>
      </div>

      {/* Device Mockup Tool */}
      <DeviceMockup />
    </div>
  );
}
