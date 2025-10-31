export interface RequestHeader {
  key: string;
  value: string;
  enabled: boolean;
}

export interface QueryParam {
  key: string;
  value: string;
  enabled: boolean;
}

export interface AuthConfig {
  type: 'none' | 'basic' | 'bearer' | 'api-key';
  username?: string;
  password?: string;
  token?: string;
  key?: string;
  value?: string;
  placement?: 'header' | 'query';
}

export interface SavedRequestConfig extends RequestConfig {
  name?: string;
}

export interface RequestConfig {
  method: string;
  url: string;
  headers: RequestHeader[];
  queryParams: QueryParam[];
  body: string;
  contentType: string;
  auth: AuthConfig;
}

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  responseTime: number;
  size: number;
}

export const HTTP_METHODS = [
  'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'
];

export const CONTENT_TYPES = [
  { value: 'application/json', label: 'JSON' },
  { value: 'application/xml', label: 'XML' },
  { value: 'application/x-www-form-urlencoded', label: 'Form Data' },
  { value: 'text/plain', label: 'Text' },
  { value: 'multipart/form-data', label: 'Multipart' },
];
