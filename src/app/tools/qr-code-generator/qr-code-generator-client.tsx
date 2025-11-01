"use client";

import { QRCodeGenerator } from "@/components/qr-code-generator";
import { QrCode } from "lucide-react";

export default function QRCodeGeneratorClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8 md:pt-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <QrCode className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            QR Code Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
            Generate custom QR codes for URLs, text, email addresses, phone numbers,
            and WiFi networks. Fully customizable with advanced options.
          </p>
        </div>
      </div>

      {/* Tool */}
      <QRCodeGenerator />
    </div>
  );
}
