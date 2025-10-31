/**
 * Lighthouse service for running performance analysis
 * Only loaded when ENABLE_LIGHTHOUSE=true
 */

export interface LighthouseData {
  performance: number;
  accessibility: number;
  seo: number;
  bestPractices: number;
  coreWebVitals: {
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number;
  };
  loadingMetrics: {
    firstContentfulPaint: number;
    speedIndex: number;
    timeToInteractive: number;
    totalBlockingTime: number;
  };
  resourceMetrics: {
    totalSize: number;
    requestCount: number;
  };
  analyzedAt: number;
}

export async function runLighthouseAnalysis(url: string): Promise<LighthouseData> {
  // Dynamic imports to avoid Next.js build issues
  const lighthouse = await import('lighthouse').then(m => m.default);
  const { launch: launchChrome } = await import('chrome-launcher');

  let chrome: unknown = null;

  try {
    console.log('Launching Chrome instance...');
    chrome = await launchChrome({
      chromeFlags: [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    console.log('Chrome launched successfully');

    // Run Lighthouse analysis
    console.log('Running Lighthouse analysis...');
    const runnerResult = await lighthouse(url, {
      logLevel: 'info',
      output: 'json',
      port: (chrome as any).port,
      throttlingMethod: 'devtools',
      maxWaitForLoad: 30000,
    });

    if (!runnerResult?.lhr) {
      throw new Error('Lighthouse analysis failed - no results returned');
    }

    const lhr = runnerResult.lhr;
    console.log('Lighthouse analysis completed successfully');

    // Extract key performance metrics
    return {
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
        requestCount: (lhr.audits?.['network-requests']?.details as { items?: unknown[] })?.items?.length || 0,
      },
      analyzedAt: Date.now(),
    };

  } finally {
    // Always clean up Chrome instance
    if (chrome) {
      try {
        await (chrome as any).kill();
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}
