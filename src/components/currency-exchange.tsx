"use client";

import { useMemo, useState } from "react";
import { COMMON_CURRENCIES } from "@/lib/validators/currency-exchange";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRightLeft, Banknote, CircleCheck, Clock, Loader2 } from "lucide-react";

interface ExchangeResult {
  base: string;
  target: string;
  amount: number;
  rate: number;
  convertedAmount: number;
  lastUpdated: string;
  nextUpdate?: string;
  provider: "ExchangeRate-API";
  availableCurrencies?: string[];
}

const knownCurrencyNames = new Map<string, string>(
  COMMON_CURRENCIES.map(currency => [currency.code, currency.name])
);

export function CurrencyExchange() {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const [amount, setAmount] = useState("100");
  const [availableCurrencies, setAvailableCurrencies] = useState(
    COMMON_CURRENCIES.map(currency => currency.code)
  );
  const [result, setResult] = useState<ExchangeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currencyOptions = useMemo(() => {
    const codes = new Set<string>([...availableCurrencies, ...COMMON_CURRENCIES.map(c => c.code)]);
    return Array.from(codes)
      .sort()
      .map(code => ({
        code,
        name: knownCurrencyNames.get(code) ?? code,
      }));
  }, [availableCurrencies]);

  const formattedAmount = useMemo(() => {
    if (!result) return null;
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: result.target,
      maximumFractionDigits: 6,
    }).format(result.convertedAmount);
  }, [result]);

  const handleSwap = () => {
    setBaseCurrency(prev => {
      setTargetCurrency(prev);
      return targetCurrency;
    });
  };

  const handleConvert = async () => {
    setError(null);
    setResult(null);

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount < 0) {
      setError("Enter a valid, non-negative amount.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/currency-exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base: baseCurrency,
          target: targetCurrency,
          amount: numericAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Conversion failed.");
      }

      setResult(data.data as ExchangeResult);

      if (data.data?.availableCurrencies) {
        setAvailableCurrencies(prev => {
          const merged = new Set([...prev, ...data.data.availableCurrencies]);
          return Array.from(merged);
        });
      }
    } catch (convertError) {
      const message =
        convertError instanceof Error ? convertError.message : "Unable to complete conversion.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 space-y-8 pb-20">
      <div className="max-w-4xl mx-auto space-y-4 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full">
          <Banknote className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Currency Exchange</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Convert currencies effortlessly using up-to-date global rates.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Exchange Calculator</CardTitle>
            <CardDescription>
              Choose currencies, enter an amount, and get real-time conversion results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="base">From</Label>
                <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                  <SelectTrigger id="base" className="w-full">
                    <SelectValue placeholder="Select base currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} — {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">To</Label>
                <Select value={targetCurrency} onValueChange={setTargetCurrency}>
                  <SelectTrigger id="target" className="w-full">
                    <SelectValue placeholder="Select target currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} — {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" type="button" onClick={handleSwap} className="flex gap-2">
                <ArrowRightLeft className="h-4 w-4" />
                Swap
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={amount}
                onChange={event => setAmount(event.target.value)}
                placeholder="Enter amount to convert"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="button"
              onClick={handleConvert}
              disabled={isLoading}
              className="w-full md:w-auto flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <CircleCheck className="h-4 w-4" />
                  Convert Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-primary" />
                Conversion Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-semibold">
                {result.amount} {result.base} ={" "}
                <span className="text-primary">{formattedAmount ?? result.convertedAmount}</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-3 rounded-lg border bg-muted/30">
                  <p className="text-sm text-muted-foreground">Rate</p>
                  <p className="text-lg font-semibold">
                    1 {result.base} = {result.rate} {result.target}
                  </p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/30 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-medium">
                      {new Date(result.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
