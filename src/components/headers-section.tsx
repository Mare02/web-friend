"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import type { RequestHeader } from "@/lib/validators/api-tester";
import { addHeader, removeHeader, updateHeader } from "@/lib/services/api-tester-utils";

interface HeadersSectionProps {
  headers: RequestHeader[];
  onHeadersChange: (headers: RequestHeader[]) => void;
}

export function HeadersSection({
  headers,
  onHeadersChange,
}: HeadersSectionProps) {
  const handleAddHeader = () => {
    onHeadersChange(addHeader(headers));
  };

  const handleRemoveHeader = (index: number) => {
    onHeadersChange(removeHeader(headers, index));
  };

  const handleUpdateHeader = (index: number, field: keyof RequestHeader, value: string | boolean) => {
    onHeadersChange(updateHeader(headers, index, field, value));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Headers</CardTitle>
          <Button variant="outline" size="sm" onClick={handleAddHeader}>
            <Plus className="h-4 w-4 mr-2" />
            Add Header
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile Layout */}
        <div className="block md:hidden space-y-3">
          {headers.map((header, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={header.enabled}
                    onCheckedChange={(checked) => handleUpdateHeader(index, 'enabled', checked as boolean)}
                  />
                  <span className="text-sm font-medium">Enabled</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveHeader(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Header Name</label>
                  <Input
                    placeholder="header name"
                    value={header.key}
                    onChange={(e) => handleUpdateHeader(index, 'key', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Header Value</label>
                  <Input
                    placeholder="header value"
                    value={header.value}
                    onChange={(e) => handleUpdateHeader(index, 'value', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16"></TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {headers.map((header, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={header.enabled}
                      onCheckedChange={(checked) => handleUpdateHeader(index, 'enabled', checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="header name"
                      value={header.key}
                      onChange={(e) => handleUpdateHeader(index, 'key', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="header value"
                      value={header.value}
                      onChange={(e) => handleUpdateHeader(index, 'value', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveHeader(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
