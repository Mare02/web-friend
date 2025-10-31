/**
 * QR code generation service using the qrcode library
 * Pure functions for generating QR codes with various options
 */

import QRCode from 'qrcode';
import { QRCodeOptions } from '@/lib/validators/schema';

export interface QRCodeResult {
  dataUrl: string;
  options: QRCodeOptions;
  generatedAt: Date;
}

export interface QRCodeTemplate {
  id: string;
  name: string;
  description: string;
  defaultOptions: Partial<QRCodeOptions>;
}

export const QR_TEMPLATES: QRCodeTemplate[] = [
  {
    id: 'url',
    name: 'Website URL',
    description: 'Generate QR code for website links',
    defaultOptions: {
      errorCorrectionLevel: 'M',
      format: 'png',
    },
  },
  {
    id: 'text',
    name: 'Plain Text',
    description: 'Simple text content',
    defaultOptions: {
      errorCorrectionLevel: 'L',
      format: 'png',
    },
  },
  {
    id: 'email',
    name: 'Email Address',
    description: 'mailto: links for email addresses',
    defaultOptions: {
      errorCorrectionLevel: 'M',
      format: 'png',
    },
  },
  {
    id: 'phone',
    name: 'Phone Number',
    description: 'tel: links for phone numbers',
    defaultOptions: {
      errorCorrectionLevel: 'M',
      format: 'png',
    },
  },
  {
    id: 'wifi',
    name: 'WiFi Network',
    description: 'WiFi connection QR codes',
    defaultOptions: {
      errorCorrectionLevel: 'H',
      format: 'png',
    },
  },
];

/**
 * Generate a QR code with the given options
 */
export async function generateQRCode(options: QRCodeOptions): Promise<QRCodeResult> {
  let dataUrl: string;

  if (options.format === 'svg') {
    // For SVG, generate as string and convert to data URL
    const svgString = await QRCode.toString(options.text, {
      type: 'svg',
      width: options.size,
      errorCorrectionLevel: options.errorCorrectionLevel,
      margin: options.margin,
      color: {
        dark: options.color.dark,
        light: options.color.light,
      },
    } as QRCode.QRCodeToStringOptions);
    dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
  } else {
    // For PNG/JPEG, use toDataURL
    const baseOptions = {
      width: options.size,
      errorCorrectionLevel: options.errorCorrectionLevel,
      margin: options.margin,
      color: {
        dark: options.color.dark,
        light: options.color.light,
      },
    };

    if (options.format === 'jpeg') {
      // JPEG supports quality via rendererOpts
      const qrOptions: QRCode.QRCodeToDataURLOptions = {
        ...baseOptions,
        type: 'image/jpeg',
        rendererOpts: {
          quality: 0.92,
        },
      };
      dataUrl = await QRCode.toDataURL(options.text, qrOptions);
    } else {
      // PNG doesn't support quality
      const qrOptions: QRCode.QRCodeToDataURLOptions = {
        ...baseOptions,
        type: 'image/png',
      };
      dataUrl = await QRCode.toDataURL(options.text, qrOptions);
    }
  }

  return {
    dataUrl,
    options,
    generatedAt: new Date(),
  };
}

/**
 * Generate QR code as buffer for downloads
 */
export async function generateQRCodeBuffer(
  options: QRCodeOptions
): Promise<{ buffer: Buffer; mimeType: string }> {
  const qrOptions: QRCode.QRCodeToBufferOptions = {
    width: options.size,
    errorCorrectionLevel: options.errorCorrectionLevel,
    type: 'png',
    margin: options.margin,
    color: {
      dark: options.color.dark,
      light: options.color.light,
    },
  };

  const buffer = await QRCode.toBuffer(options.text, qrOptions);

  return {
    buffer,
    mimeType: 'image/png',
  };
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRCodeSVG(options: QRCodeOptions): Promise<string> {
  const qrOptions: QRCode.QRCodeToStringOptions = {
    width: options.size,
    errorCorrectionLevel: options.errorCorrectionLevel,
    type: 'svg',
    margin: options.margin,
    color: {
      dark: options.color.dark,
      light: options.color.light,
    },
  };

  return await QRCode.toString(options.text, qrOptions);
}

/**
 * Validate and format different types of QR content
 */
export function formatQRContent(type: string, content: string): string {
  switch (type) {
    case 'email':
      return content.startsWith('mailto:') ? content : `mailto:${content}`;
    case 'phone':
      return content.startsWith('tel:') ? content : `tel:${content}`;
    case 'wifi':
      // WIFI:S:<SSID>;T:<WPA|WEP|>;P:<password>;;
      if (content.includes(';')) {
        return `WIFI:${content}`;
      }
      // Assume SSID only, will need password input
      return `WIFI:S:${content};T:WPA2;P:;;`;
    default:
      return content;
  }
}

/**
 * Check if QR code content is valid for the given type
 */
export function validateQRContent(type: string, content: string): boolean {
  if (!content.trim()) return false;

  switch (type) {
    case 'url':
      try {
        new URL(content);
        return true;
      } catch {
        return false;
      }
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(content.replace('mailto:', ''));
    case 'phone':
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(content.replace('tel:', ''));
    default:
      return content.length > 0 && content.length <= 2000;
  }
}
