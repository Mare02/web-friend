"use client";

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTENT_TYPES } from "@/lib/validators/api-tester";

interface RequestBodySectionProps {
  body: string;
  contentType: string;
  onBodyChange: (body: string) => void;
  onContentTypeChange: (contentType: string) => void;
}

export function RequestBodySection({
  body,
  contentType,
  onBodyChange,
  onContentTypeChange,
}: RequestBodySectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Request Body</CardTitle>
          <Select
            value={contentType}
            onValueChange={onContentTypeChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Enter request body..."
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          className="min-h-32 font-mono text-sm"
        />
      </CardContent>
    </Card>
  );
}
