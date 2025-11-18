/**
 * Favicon generator service using Sharp, png-to-ico, and Archiver
 * Pure functions for generating favicon packs from images
 */

import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import archiver from 'archiver';
import { Readable } from 'stream';
import {
  FaviconGeneratorOptions,
  FaviconGeneratorRequest,
  FaviconResult,
  FaviconGeneratorResponse
} from '@/lib/validators/favicon-generator';

export interface FaviconPack {
  favicons: FaviconResult[];
  icoDataUrl?: string;
  htmlSnippet: string;
  generatedAt: Date;
}

/**
 * Generate a complete favicon pack from an image
 */
export async function generateFaviconPack(request: FaviconGeneratorRequest): Promise<FaviconPack> {
  const { image, options } = request;

  // Convert base64 to buffer
  const imageBuffer = Buffer.from(image.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64');

  // Get image metadata to understand original dimensions
  const metadata = await sharp(imageBuffer).metadata();
  const originalWidth = metadata.width!;
  const originalHeight = metadata.height!;

  // Generate PNG favicons for all requested sizes
  const favicons: FaviconResult[] = [];

  for (const size of options.sizes) {
    const resizedBuffer = await sharp(imageBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: options.backgroundColor,
        withoutEnlargement: false
      })
      .png({
        quality: options.quality,
        compressionLevel: 9
      })
      .toBuffer();

    const dataUrl = `data:image/png;base64,${resizedBuffer.toString('base64')}`;

    favicons.push({
      size,
      dataUrl,
      mimeType: 'image/png',
      filename: `favicon-${size}x${size}.png`
    });
  }

  // Generate ICO file if requested
  let icoDataUrl: string | undefined;
  if (options.includeIco) {
    // Create ICO from multiple PNG sizes (typically 16x16, 32x32, 48x48)
    const icoSizes = [16, 32, 48].filter(size => options.sizes.includes(size));

    if (icoSizes.length > 0) {
      const icoBuffers: Buffer[] = [];

      for (const size of icoSizes) {
        const icoBuffer = await sharp(imageBuffer)
          .resize(size, size, {
            fit: 'contain',
            background: options.backgroundColor,
            withoutEnlargement: false
          })
          .png({
            quality: options.quality,
            compressionLevel: 9
          })
          .toBuffer();

        icoBuffers.push(icoBuffer);
      }

      const icoBuffer = await pngToIco(icoBuffers);
      icoDataUrl = `data:image/x-icon;base64,${icoBuffer.toString('base64')}`;
    }
  }

  // Generate HTML snippet
  const htmlSnippet = generateHtmlSnippet(options.sizes, options.includeIco);

  return {
    favicons,
    icoDataUrl,
    htmlSnippet,
    generatedAt: new Date()
  };
}

/**
 * Generate HTML link tags for favicons
 */
export function generateHtmlSnippet(sizes: number[], includeIco: boolean): string {
  const links: string[] = [];

  // Add ICO favicon if included
  if (includeIco) {
    links.push('<link rel="icon" type="image/x-icon" href="/favicon.ico" />');
  }

  // Add PNG favicons for different sizes
  const pngSizes = sizes.filter(size => size >= 16 && size <= 512);
  const iconSizes = pngSizes.join(' ');

  if (pngSizes.length > 0) {
    links.push(`<link rel="icon" type="image/png" sizes="${iconSizes}" href="/favicon-256x256.png" />`);
  }

  // Add Apple touch icons (180x180 is standard)
  if (sizes.includes(180)) {
    links.push('<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png" />');
  }

  // Add Android/Chrome specific sizes
  if (sizes.includes(192)) {
    links.push('<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />');
  }

  if (sizes.includes(512)) {
    links.push('<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" />');
  }

  return links.join('\n');
}

/**
 * Create a ZIP archive containing all favicon files
 */
export async function createFaviconZip(pack: FaviconPack): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    const buffers: Buffer[] = [];

    archive.on('data', (chunk: Buffer) => {
      buffers.push(chunk);
    });

    archive.on('end', () => {
      resolve(Buffer.concat(buffers));
    });

    archive.on('error', reject);

    // Add PNG favicons
    for (const favicon of pack.favicons) {
      const buffer = Buffer.from(favicon.dataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
      archive.append(buffer, { name: favicon.filename });
    }

    // Add ICO file if present
    if (pack.icoDataUrl) {
      const icoBuffer = Buffer.from(pack.icoDataUrl.replace(/^data:image\/x-icon;base64,/, ''), 'base64');
      archive.append(icoBuffer, { name: 'favicon.ico' });
    }

    // Add HTML snippet as a text file
    archive.append(pack.htmlSnippet, { name: 'favicon-links.html' });

    archive.finalize();
  });
}

/**
 * Validate that an uploaded image is suitable for favicon generation
 */
export async function validateFaviconImage(imageBuffer: Buffer): Promise<{
  isValid: boolean;
  error?: string;
  metadata?: sharp.Metadata;
}> {
  try {
    const metadata = await sharp(imageBuffer).metadata();

    // Check if it's a supported image format
    if (!metadata.format || !['jpeg', 'jpg', 'png', 'webp', 'tiff', 'gif'].includes(metadata.format)) {
      return {
        isValid: false,
        error: 'Unsupported image format. Please use JPEG, PNG, WebP, TIFF, or GIF.'
      };
    }

    // Check minimum dimensions
    if (!metadata.width || !metadata.height || metadata.width < 16 || metadata.height < 16) {
      return {
        isValid: false,
        error: 'Image must be at least 16x16 pixels.'
      };
    }

    // Check maximum dimensions (to prevent huge files)
    if (metadata.width > 2048 || metadata.height > 2048) {
      return {
        isValid: false,
        error: 'Image dimensions too large. Maximum size is 2048x2048 pixels.'
      };
    }

    return {
      isValid: true,
      metadata
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid image file.'
    };
  }
}