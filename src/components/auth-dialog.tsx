"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { AuthConfig } from "@/lib/validators/api-tester";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auth: AuthConfig;
  onAuthChange: (auth: AuthConfig) => void;
}

export function AuthDialog({
  open,
  onOpenChange,
  auth,
  onAuthChange,
}: AuthDialogProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleAuthTypeChange = (type: AuthConfig['type']) => {
    onAuthChange({ ...auth, type });
  };

  const handleAuthFieldChange = (field: keyof AuthConfig, value: string) => {
    onAuthChange({ ...auth, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>
            Configure authentication for your API request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-2">Authentication Type</Label>
            <Select
              value={auth.type}
              onValueChange={handleAuthTypeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Auth</SelectItem>
                <SelectItem value="basic">Basic Auth</SelectItem>
                <SelectItem value="bearer">Bearer Token</SelectItem>
                <SelectItem value="api-key">API Key</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {auth.type === 'basic' && (
            <div className="space-y-2">
              <div>
                <Label>Username</Label>
                <Input
                  value={auth.username || ''}
                  onChange={(e) => handleAuthFieldChange('username', e.target.value)}
                />
              </div>
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={auth.password || ''}
                    onChange={(e) => handleAuthFieldChange('password', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {auth.type === 'bearer' && (
            <div>
              <Label className="mb-2">Bearer Token</Label>
              <Input
                placeholder="Enter bearer token"
                value={auth.token || ''}
                onChange={(e) => handleAuthFieldChange('token', e.target.value)}
              />
            </div>
          )}

          {auth.type === 'api-key' && (
            <div className="space-y-2">
              <div>
                <Label className="mb-2">API Key Name</Label>
                <Input
                  placeholder="X-API-Key"
                  value={auth.key || ''}
                  onChange={(e) => handleAuthFieldChange('key', e.target.value)}
                />
              </div>
              <div>
                <Label className="mb-2">API Key Value</Label>
                <Input
                  placeholder="your-api-key"
                  value={auth.value || ''}
                  onChange={(e) => handleAuthFieldChange('value', e.target.value)}
                />
              </div>
              <div>
                <Label className="mb-2">Add to</Label>
                <Select
                  value={auth.placement || 'header'}
                  onValueChange={(value: string) => handleAuthFieldChange('placement', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="query">Query Parameter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
