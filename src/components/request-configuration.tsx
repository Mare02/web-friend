"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Save, History, Key, Globe } from "lucide-react";
import type { RequestConfig, SavedRequestConfig } from "@/lib/validators/api-tester";
import { HTTP_METHODS } from "@/lib/validators/api-tester";

interface RequestConfigurationProps {
  config: RequestConfig;
  onConfigChange: (config: RequestConfig) => void;
  onSendRequest: () => void;
  isLoading: boolean;
  savedRequests: SavedRequestConfig[];
  onLoadRequest: (request: SavedRequestConfig) => void;
  onShowAuthDialog: () => void;
  onShowSaveDialog: () => void;
}

export function RequestConfiguration({
  config,
  onConfigChange,
  onSendRequest,
  isLoading,
  savedRequests,
  onLoadRequest,
  onShowAuthDialog,
  onShowSaveDialog,
}: RequestConfigurationProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              API Request
            </CardTitle>
            <CardDescription className="mt-1">
              Configure your HTTP request with headers, parameters, and authentication
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={onShowSaveDialog}
              disabled={!config.url.trim()}
              className="flex-1 sm:flex-none"
            >
              <Save className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <History className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">History</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
                {savedRequests.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No saved requests
                  </div>
                ) : (
                  savedRequests.map((request, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => onLoadRequest(request)}
                      className="flex flex-col items-start p-3"
                    >
                      <div className="font-medium text-sm">
                        {request.name || `${request.method} ${request.url}`}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {request.method} {request.url}
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Method and URL */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 w-full">
            <Select
              value={config.method}
              onValueChange={(value) => onConfigChange({ ...config, method: value })}
            >
              <SelectTrigger className="w-24 sm:w-32 shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HTTP_METHODS.map(method => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Enter API endpoint URL"
              value={config.url}
              onChange={(e) => onConfigChange({ ...config, url: e.target.value })}
              className="flex-1 min-w-0 w-full"
            />
          </div>
          <Button
            onClick={onSendRequest}
            disabled={isLoading}
            className="w-full sm:w-auto shrink-0"
          >
            <Play className="h-4 w-4 mr-2" />
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>

        {/* Auth Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onShowAuthDialog}
          >
            <Key className="h-4 w-4 mr-2" />
            Auth: {config.auth.type === 'none' ? 'None' : config.auth.type.toUpperCase()}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
