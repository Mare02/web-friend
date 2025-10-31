"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XCircle } from "lucide-react";

// Import our new components
import { RequestConfiguration } from "@/components/request-configuration";
import { QueryParamsSection } from "@/components/query-params-section";
import { HeadersSection } from "@/components/headers-section";
import { RequestBodySection } from "@/components/request-body-section";
import { ResponseSection } from "@/components/response-section";
import { ResponseFullscreenModal } from "@/components/response-fullscreen-modal";
import { AuthDialog } from "@/components/auth-dialog";
import { SaveRequestDialog } from "@/components/save-request-dialog";

// Import types and utilities
import type {
  RequestConfig,
  SavedRequestConfig,
  ResponseData,
  RequestHeader,
  QueryParam,
  AuthConfig
} from "@/lib/validators/api-tester";
import {
  buildUrl,
  buildHeaders,
  addApiKeyToUrl
} from "@/lib/services/api-tester-utils";

export function ApiTester() {
  const [config, setConfig] = useState<RequestConfig>({
    method: 'GET',
    url: '',
    headers: [{ key: '', value: '', enabled: true }],
    queryParams: [{ key: '', value: '', enabled: true }],
    body: '',
    contentType: 'application/json',
    auth: { type: 'none' }
  });

  const [response, setResponse] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedRequests, setSavedRequests] = useState<SavedRequestConfig[]>([]);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const [requestName, setRequestName] = useState('');
  const [responseView, setResponseView] = useState<'pretty' | 'raw' | 'headers'>('pretty');

  // Load saved requests from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('api-tester-requests');
    if (saved) {
      try {
        setSavedRequests(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to load saved requests:', err);
      }
    }
  }, []);

  // Save requests to localStorage
  const saveRequestsToStorage = (requests: SavedRequestConfig[]) => {
    localStorage.setItem('api-tester-requests', JSON.stringify(requests));
    setSavedRequests(requests);
  };

  const sendRequest = async () => {
    if (!config.url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    const startTime = Date.now();

    try {
      const url = buildUrl(config);
      const headers = buildHeaders(config);

      // Add API key as query param if configured
      const finalUrl = addApiKeyToUrl(url, config);

      const requestOptions: RequestInit = {
        method: config.method,
        headers,
      };

      // Add body for non-GET requests
      if (config.body.trim() && config.method !== 'GET' && config.method !== 'HEAD') {
        requestOptions.body = config.body;
      }

      const res = await fetch(finalUrl, requestOptions);
      const responseTime = Date.now() - startTime;

      let responseData;
      const contentType = res.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        responseData = await res.json();
      } else if (contentType?.includes('text/')) {
        responseData = await res.text();
      } else {
        responseData = await res.blob();
      }

      // Convert headers to object
      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const responseSize = JSON.stringify(responseData).length;

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        data: responseData,
        responseTime,
        size: responseSize
      });

    } catch (err) {
      const responseTime = Date.now() - startTime;
      setError(err instanceof Error ? err.message : 'Network error occurred');
      setResponse({
        status: 0,
        statusText: 'Error',
        headers: {},
        data: null,
        responseTime,
        size: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveRequest = () => {
    if (!requestName.trim()) return;

    const newRequests = [...savedRequests, { ...config, name: requestName } as SavedRequestConfig];
    saveRequestsToStorage(newRequests);
    setShowSaveDialog(false);
    setRequestName('');
  };

  const loadRequest = (request: SavedRequestConfig) => {
    setConfig({
      method: request.method,
      url: request.url,
      headers: request.headers.length > 0 ? request.headers : [{ key: '', value: '', enabled: true }],
      queryParams: request.queryParams.length > 0 ? request.queryParams : [{ key: '', value: '', enabled: true }],
      body: request.body || '',
      contentType: request.contentType || 'application/json',
      auth: request.auth || { type: 'none' }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleFullscreenToggle = () => {
    setShowFullscreenModal(true);
  };

  // Handler functions for child components
  const handleHeadersChange = (headers: RequestHeader[]) => {
    setConfig(prev => ({ ...prev, headers }));
  };

  const handleQueryParamsChange = (queryParams: QueryParam[]) => {
    setConfig(prev => ({ ...prev, queryParams }));
  };

  const handleBodyChange = (body: string) => {
    setConfig(prev => ({ ...prev, body }));
  };

  const handleContentTypeChange = (contentType: string) => {
    setConfig(prev => ({ ...prev, contentType }));
  };

  const handleAuthChange = (auth: AuthConfig) => {
    setConfig(prev => ({ ...prev, auth }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Request Configuration */}
      <RequestConfiguration
        config={config}
        onConfigChange={setConfig}
        onSendRequest={sendRequest}
        isLoading={isLoading}
        savedRequests={savedRequests}
        onLoadRequest={loadRequest}
        onShowAuthDialog={() => setShowAuthDialog(true)}
        onShowSaveDialog={() => setShowSaveDialog(true)}
      />

      {/* Tabs for different sections */}
      <Tabs defaultValue="params" className="mb-6">
        <TabsList>
          <TabsTrigger value="params">Params</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
        </TabsList>

        {/* Query Parameters */}
        <TabsContent value="params">
          <QueryParamsSection
            queryParams={config.queryParams}
            onQueryParamsChange={handleQueryParamsChange}
          />
        </TabsContent>

        {/* Headers */}
        <TabsContent value="headers">
          <HeadersSection
            headers={config.headers}
            onHeadersChange={handleHeadersChange}
          />
        </TabsContent>

        {/* Request Body */}
        <TabsContent value="body">
          <RequestBodySection
            body={config.body}
            contentType={config.contentType}
            onBodyChange={handleBodyChange}
            onContentTypeChange={handleContentTypeChange}
          />
        </TabsContent>
      </Tabs>

      {/* Response Section */}
      {response && (
        <ResponseSection
          response={response}
          responseView={responseView}
          onResponseViewChange={setResponseView}
          onCopyToClipboard={copyToClipboard}
          onFullscreenToggle={handleFullscreenToggle}
        />
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Auth Dialog */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        auth={config.auth}
        onAuthChange={handleAuthChange}
      />

      {/* Save Request Dialog */}
      <SaveRequestDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        requestName={requestName}
        onRequestNameChange={setRequestName}
        onSave={saveRequest}
      />

      {/* Fullscreen Response Modal */}
      {response && showFullscreenModal && (
        <ResponseFullscreenModal
          open={showFullscreenModal}
          onOpenChange={setShowFullscreenModal}
          response={response}
          responseView={responseView}
          onResponseViewChange={setResponseView}
          onCopyToClipboard={copyToClipboard}
        />
      )}
    </div>
  );
}
