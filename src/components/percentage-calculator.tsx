"use client";

import { useMemo, useState } from "react";
import { percentageCalculationSchema, type PercentageMode } from "@/lib/validators/percentage-calculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Copy, Percent, RefreshCw } from "lucide-react";

type CalculatorState = {
  mode: PercentageMode;
  percentage: string;
  base: string;
  part: string;
  total: string;
  from: string;
  to: string;
  current: string;
  target: string;
  decimals: string;
};

const presetPercentages = ["5", "10", "12.5", "15", "20", "25", "50"];

export function PercentageCalculator() {
  const [state, setState] = useState<CalculatorState>({
    mode: "percent-of",
    percentage: "20",
    base: "100",
    part: "25",
    total: "200",
    from: "80",
    to: "100",
    current: "75",
    target: "120",
    decimals: "2",
  });
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  const parsed = useMemo(() => {
    const decimals = clampDecimals(state.decimals);

    const payload = {
      ...state,
      decimals,
      percentage: Number(state.percentage),
      base: Number(state.base),
      part: Number(state.part),
      total: Number(state.total),
      from: Number(state.from),
      to: Number(state.to),
      current: Number(state.current),
      target: Number(state.target),
    };

    const result = percentageCalculationSchema.safeParse(payload);

    if (!result.success) {
      return { success: false as const, error: result.error.issues[0]?.message ?? "Invalid input" };
    }

    return { success: true as const, data: result.data };
  }, [state]);

  const calculation = useMemo(() => {
    if (!parsed.success) {
      return null;
    }

    const { data } = parsed;
    const decimals = data.decimals;

    switch (data.mode) {
      case "percent-of": {
        const value = round(data.base * (data.percentage / 100), decimals);
        return {
          title: `${data.percentage}% of ${data.base}`,
          resultLabel: "Result",
          resultValue: formatNumber(value, decimals),
          detail: `${data.percentage}% × ${formatNumber(data.base, decimals)} = ${formatNumber(value, decimals)}`,
        };
      }
      case "what-percent": {
        const percent = round((data.part / data.total) * 100, decimals);
        return {
          title: `What percent is ${data.part} of ${data.total}?`,
          resultLabel: "Percentage",
          resultValue: formatPercent(percent, decimals),
          detail: `${data.part} / ${data.total} × 100 = ${percent}%`,
        };
      }
      case "percent-change": {
        const difference = data.to - data.from;
        const percent = data.from === 0 ? Infinity : (difference / data.from) * 100;
        const rounded = data.from === 0 ? percent : round(percent, decimals);
        const direction = percent > 0 ? "increase" : percent < 0 ? "decrease" : "no change";
        return {
          title: `Change from ${data.from} to ${data.to}`,
          resultLabel: "Percent change",
          resultValue: data.from === 0 ? "∞" : formatPercent(rounded, decimals),
          detail:
            data.from === 0
              ? "Cannot compute percent change from zero."
              : `${difference > 0 ? "+" : ""}${formatNumber(difference, decimals)} (${formatPercent(rounded, decimals)} ${direction})`,
        };
      }
      case "difference-to-target": {
        const gap = data.target - data.current;
        const percent = data.target === 0 ? 0 : (gap / data.target) * 100;
        const rounded = round(percent, decimals);
        const direction = gap >= 0 ? "to reach target" : "over target";
        return {
          title: `Gap from ${data.current} to ${data.target}`,
          resultLabel: "Gap",
          resultValue: `${formatNumber(gap, decimals)} (${formatPercent(rounded, decimals)})`,
          detail: `${gap >= 0 ? "Need" : "Over by"} ${formatNumber(Math.abs(gap), decimals)} (${formatPercent(rounded, decimals)} ${direction})`,
        };
      }
      default:
        return null;
    }
  }, [parsed]);

  const handleFieldChange = (field: keyof CalculatorState, value: string) => {
    setState(prev => ({ ...prev, [field]: value }));
    if (field === "mode") {
      setCopyStatus("idle");
    }
  };

  const handlePreset = (value: string) => {
    handleFieldChange("percentage", value);
  };

  const handleCopy = async () => {
    if (!calculation) return;
    const text = `${calculation.title}\n${calculation.resultLabel}: ${calculation.resultValue}\n${calculation.detail}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 1500);
    } catch {
      setCopyStatus("idle");
    }
  };

  const renderInputs = () => {
    switch (state.mode) {
      case "percent-of":
        return (
          <>
            <NumberInput
              id="percentage"
              label="Percentage (%)"
              value={state.percentage}
              onChange={value => handleFieldChange("percentage", value)}
            />
            <NumberInput
              id="base"
              label="Base value"
              value={state.base}
              onChange={value => handleFieldChange("base", value)}
            />
          </>
        );
      case "what-percent":
        return (
          <>
            <NumberInput
              id="part"
              label="Part"
              value={state.part}
              onChange={value => handleFieldChange("part", value)}
            />
            <NumberInput
              id="total"
              label="Total"
              value={state.total}
              onChange={value => handleFieldChange("total", value)}
            />
          </>
        );
      case "percent-change":
        return (
          <>
            <NumberInput
              id="from"
              label="From"
              value={state.from}
              onChange={value => handleFieldChange("from", value)}
            />
            <NumberInput
              id="to"
              label="To"
              value={state.to}
              onChange={value => handleFieldChange("to", value)}
            />
          </>
        );
      case "difference-to-target":
        return (
          <>
            <NumberInput
              id="current"
              label="Current"
              value={state.current}
              onChange={value => handleFieldChange("current", value)}
            />
            <NumberInput
              id="target"
              label="Target"
              value={state.target}
              onChange={value => handleFieldChange("target", value)}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 space-y-8 pb-20">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full">
          <Percent className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Percentage Calculator</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Quickly compute percentage values, percent change, and target gaps with precise rounding controls.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Calculator</CardTitle>
            <CardDescription>Select a calculation type and enter your numbers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Calculation type</Label>
                <Select
                  value={state.mode}
                  onValueChange={value => handleFieldChange("mode", value as PercentageMode)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select calculation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent-of">Percent of</SelectItem>
                    <SelectItem value="what-percent">What percent</SelectItem>
                    <SelectItem value="percent-change">Percent change</SelectItem>
                    <SelectItem value="difference-to-target">Gap to target</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Decimals</Label>
                <Select
                  value={state.decimals}
                  onValueChange={value => handleFieldChange("decimals", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["0", "1", "2", "3", "4", "5", "6"].map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {state.mode === "percent-of" && (
              <div className="flex flex-wrap gap-2">
                <Label className="text-sm text-muted-foreground">Quick percentages:</Label>
                {presetPercentages.map(value => (
                  <Button
                    key={value}
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePreset(value)}
                  >
                    {value}%
                  </Button>
                ))}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">{renderInputs()}</div>

            {parsed.success &&
              parsed.data.mode === "percent-change" &&
              parsed.data.from === 0 && (
              <Alert variant="default">
                <AlertDescription>
                  Percent change from zero is undefined. Showing ∞; adjust inputs to compute a finite change.
                </AlertDescription>
              </Alert>
            )}

            {!parsed.success && (
              <Alert variant="destructive">
                <AlertDescription>{parsed.error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={handleCopy} disabled={!calculation}>
                <Copy className="h-4 w-4 mr-2" />
                {copyStatus === "copied" ? "Copied" : "Copy result"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setState(prev => ({
                    ...prev,
                    percentage: "20",
                    base: "100",
                    part: "25",
                    total: "200",
                    from: "80",
                    to: "100",
                    current: "75",
                    target: "120",
                  }))
                }
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset inputs
              </Button>
            </div>
          </CardContent>
        </Card>

        {calculation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">{calculation.resultLabel}</Badge>
                {calculation.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-semibold">{calculation.resultValue}</div>
              <p className="text-sm text-muted-foreground">{calculation.detail}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

interface NumberInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function NumberInput({ id, label, value, onChange }: NumberInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        value={value}
        onChange={event => onChange(event.target.value)}
        className="w-full"
      />
    </div>
  );
}

function clampDecimals(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 2;
  return Math.min(6, Math.max(0, Math.round(parsed)));
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function formatNumber(value: number, decimals = 6): string {
  if (!Number.isFinite(value)) return "∞";
  const formatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return formatter.format(value);
}

function formatPercent(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return "∞";
  return `${formatNumber(value, decimals)}%`;
}
