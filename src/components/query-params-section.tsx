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
import type { QueryParam } from "@/lib/validators/api-tester";
import { addQueryParam, removeQueryParam, updateQueryParam } from "@/lib/services/api-tester-utils";

interface QueryParamsSectionProps {
  queryParams: QueryParam[];
  onQueryParamsChange: (params: QueryParam[]) => void;
}

export function QueryParamsSection({
  queryParams,
  onQueryParamsChange,
}: QueryParamsSectionProps) {
  const handleAddParam = () => {
    onQueryParamsChange(addQueryParam(queryParams));
  };

  const handleRemoveParam = (index: number) => {
    onQueryParamsChange(removeQueryParam(queryParams, index));
  };

  const handleUpdateParam = (index: number, field: keyof QueryParam, value: string | boolean) => {
    onQueryParamsChange(updateQueryParam(queryParams, index, field, value));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Query Parameters</CardTitle>
          <Button variant="outline" size="sm" onClick={handleAddParam}>
            <Plus className="h-4 w-4 mr-2" />
            Add Param
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile Layout */}
        <div className="block md:hidden space-y-3">
          {queryParams.map((param, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={param.enabled}
                    onCheckedChange={(checked) => handleUpdateParam(index, 'enabled', checked as boolean)}
                  />
                  <span className="text-sm font-medium">Enabled</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveParam(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Key</label>
                  <Input
                    placeholder="parameter name"
                    value={param.key}
                    onChange={(e) => handleUpdateParam(index, 'key', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Value</label>
                  <Input
                    placeholder="parameter value"
                    value={param.value}
                    onChange={(e) => handleUpdateParam(index, 'value', e.target.value)}
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
              {queryParams.map((param, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={param.enabled}
                      onCheckedChange={(checked) => handleUpdateParam(index, 'enabled', checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="key"
                      value={param.key}
                      onChange={(e) => handleUpdateParam(index, 'key', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="value"
                      value={param.value}
                      onChange={(e) => handleUpdateParam(index, 'value', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveParam(index)}
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
