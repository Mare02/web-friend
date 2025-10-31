import type { RequestConfig, QueryParam, RequestHeader } from '@/lib/validators/api-tester';

/**
 * Builds the final URL including query parameters
 */
export function buildUrl(config: RequestConfig): string {
  const baseUrl = config.url;
  const enabledParams = config.queryParams.filter(p => p.enabled && p.key.trim());

  if (enabledParams.length === 0) return baseUrl;

  const params = new URLSearchParams();
  enabledParams.forEach(param => {
    if (param.key && param.value) {
      params.append(param.key, param.value);
    }
  });

  const paramString = params.toString();
  return baseUrl + (baseUrl.includes('?') ? '&' : '?') + paramString;
}

/**
 * Builds headers object including auth headers
 */
export function buildHeaders(config: RequestConfig): Record<string, string> {
  const headers: Record<string, string> = {};

  // Add enabled custom headers
  config.headers
    .filter(h => h.enabled && h.key.trim())
    .forEach(header => {
      headers[header.key] = header.value;
    });

  // Add Content-Type if body is present
  if (config.body.trim() && config.method !== 'GET' && config.method !== 'HEAD') {
    headers['Content-Type'] = config.contentType;
  }

  // Add auth headers
  if (config.auth.type === 'bearer' && config.auth.token) {
    headers['Authorization'] = `Bearer ${config.auth.token}`;
  } else if (config.auth.type === 'basic' && config.auth.username && config.auth.password) {
    const credentials = btoa(`${config.auth.username}:${config.auth.password}`);
    headers['Authorization'] = `Basic ${credentials}`;
  } else if (config.auth.type === 'api-key' && config.auth.key && config.auth.value) {
    if (config.auth.placement === 'header') {
      headers[config.auth.key] = config.auth.value;
    }
  }

  return headers;
}

/**
 * Formats response data for display
 */
export function formatResponse(data: unknown): string {
  if (typeof data === 'string') return data;
  return JSON.stringify(data, null, 2);
}

/**
 * Adds API key as query parameter to URL
 */
export function addApiKeyToUrl(url: string, config: RequestConfig): string {
  if (config.auth.type === 'api-key' && config.auth.placement === 'query' && config.auth.key && config.auth.value) {
    const urlObj = new URL(url);
    urlObj.searchParams.append(config.auth.key, config.auth.value);
    return urlObj.toString();
  }
  return url;
}

/**
 * Header management utilities
 */
export function addHeader(headers: RequestHeader[]): RequestHeader[] {
  return [...headers, { key: '', value: '', enabled: true }];
}

export function removeHeader(headers: RequestHeader[], index: number): RequestHeader[] {
  return headers.filter((_, i) => i !== index);
}

export function updateHeader(
  headers: RequestHeader[],
  index: number,
  field: keyof RequestHeader,
  value: string | boolean
): RequestHeader[] {
  return headers.map((header, i) =>
    i === index ? { ...header, [field]: value } : header
  );
}

/**
 * Query parameter management utilities
 */
export function addQueryParam(params: QueryParam[]): QueryParam[] {
  return [...params, { key: '', value: '', enabled: true }];
}

export function removeQueryParam(params: QueryParam[], index: number): QueryParam[] {
  return params.filter((_, i) => i !== index);
}

export function updateQueryParam(
  params: QueryParam[],
  index: number,
  field: keyof QueryParam,
  value: string | boolean
): QueryParam[] {
  return params.map((param, i) =>
    i === index ? { ...param, [field]: value } : param
  );
}
