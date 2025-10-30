import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

/**
 * API route for running Lighthouse performance analysis
 * Provides real analytics data to complement AI analysis
 * Uses Lighthouse CLI with headless Chrome flags to avoid bundling issues
 */
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'URL is required'
      }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Invalid URL format'
      }, { status: 400 });
    }

    // Get the path to lighthouse binary
    const lighthousePath = path.join(process.cwd(), 'node_modules', '.bin', 'lighthouse');

    // Create a unique temporary file path for results
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const outputPath = path.join(tempDir, `lighthouse-result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.json`);

    // Run Lighthouse CLI with optimized Chrome flags for macOS
    const command = `"${lighthousePath}" "${url}" --output=json --output-path="${outputPath}" --quiet --chrome-flags="--headless=new --disable-gpu --no-sandbox --disable-dev-shm-usage --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-renderer-backgrounding --disable-extensions --disable-plugins" --disable-device-emulation --throttling-method=devtools --max-wait-for-load=30000`;

    try {
      console.log('Starting Lighthouse analysis for:', url);
      await execAsync(command, {
        timeout: 90000, // 90 second timeout (increased from 60)
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      });
      console.log('Lighthouse analysis completed successfully');

      // Read the results file
      const resultData = fs.readFileSync(outputPath, 'utf8');
      const lhr = JSON.parse(resultData);

      // Clean up temp file
      try {
        fs.unlinkSync(outputPath);
      } catch {
        // Ignore cleanup errors
      }

      // Extract key performance metrics
      const lighthouseData = {
        performance: Math.round((lhr.categories?.performance?.score || 0) * 100),
        accessibility: Math.round((lhr.categories?.accessibility?.score || 0) * 100),
        seo: Math.round((lhr.categories?.seo?.score || 0) * 100),
        bestPractices: Math.round((lhr.categories?.['best-practices']?.score || 0) * 100),
        coreWebVitals: {
          largestContentfulPaint: Math.round(lhr.audits?.['largest-contentful-paint']?.numericValue || 0),
          firstInputDelay: Math.round(lhr.audits?.['max-potential-fid']?.numericValue || 0),
          cumulativeLayoutShift: Math.round((lhr.audits?.['cumulative-layout-shift']?.numericValue || 0) * 100) / 100,
        },
        loadingMetrics: {
          firstContentfulPaint: Math.round(lhr.audits?.['first-contentful-paint']?.numericValue || 0),
          speedIndex: Math.round(lhr.audits?.['speed-index']?.numericValue || 0),
          timeToInteractive: Math.round(lhr.audits?.['interactive']?.numericValue || 0),
          totalBlockingTime: Math.round(lhr.audits?.['total-blocking-time']?.numericValue || 0),
        },
        resourceMetrics: {
          totalSize: lhr.audits?.['total-byte-weight']?.numericValue || 0,
          requestCount: 0, // Simplified - can be enhanced later
        },
        analyzedAt: Date.now(),
      };

      return NextResponse.json({
        success: true,
        data: lighthouseData
      });

    } catch (execError) {
      console.error('Lighthouse CLI execution error:', execError);

      // Provide more detailed error information
      let errorMessage = 'Failed to run Lighthouse analysis';
      if (execError instanceof Error) {
        if (execError.message.includes('timeout')) {
          errorMessage = 'Lighthouse analysis timed out - the website may be too slow to load';
        } else if (execError.message.includes('ENOENT')) {
          errorMessage = 'Lighthouse CLI not found - Chrome/Chromium may not be installed';
        } else if (execError.message.includes('SIGTERM')) {
          errorMessage = 'Lighthouse was terminated - possibly due to system resource limits';
        }
      }

      throw new Error(errorMessage);
    }

  } catch (error) {
    console.error('Lighthouse API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to run Lighthouse analysis'
    }, { status: 500 });
  }
}
