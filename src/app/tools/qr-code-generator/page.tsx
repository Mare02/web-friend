import type { Metadata } from "next";
import QRCodeGeneratorClient from "./qr-code-generator-client";

export const metadata: Metadata = {
  title: "QR Code Generator | Create Custom QR Codes Online Free",
  description: "Free QR code generator for URLs, text, email, phone numbers, and WiFi networks. Create custom QR codes with colors, logos, and advanced settings. Download in PNG, SVG formats.",
  keywords: ["QR code generator", "free QR code", "custom QR code", "QR code maker", "URL to QR", "text to QR", "WiFi QR code", "contact QR code", "download QR code"],
  openGraph: {
    title: "QR Code Generator | Create Custom QR Codes Online Free",
    description: "Free QR code generator for URLs, text, email, phone numbers, and WiFi networks. Create custom QR codes with colors, logos, and advanced settings.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator | Create Custom QR Codes Online Free",
    description: "Free QR code generator for URLs, text, email, phone numbers, and WiFi networks. Create custom QR codes with colors, logos, and advanced settings.",
  },
};

export default function QRCodeGeneratorPage() {
  return <QRCodeGeneratorClient />;
}
