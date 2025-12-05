import { NextRequest, NextResponse } from "next/server";
import { convertCurrency } from "@/lib/services/currency-exchange";
import {
  currencyExchangeRequestSchema,
  currencyExchangeResponseSchema,
} from "@/lib/validators/currency-exchange";

/**
 * POST /api/currency-exchange
 * Converts an amount between two currencies using ExchangeRate-API (no caching)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const normalizedBody = {
      ...body,
      amount: typeof body.amount === "string" ? Number(body.amount) : body.amount,
    };

    const validation = currencyExchangeRequestSchema.safeParse(normalizedBody);

    if (!validation.success) {
      const message = validation.error.issues[0]?.message || "Invalid input.";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    const { base, target, amount } = validation.data;

    const conversion = await convertCurrency({ base, target, amount });
    const response = currencyExchangeResponseSchema.parse({
      success: true,
      data: conversion,
    });

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    const status =
      message.toLowerCase().includes("non-negative") ||
      message.toLowerCase().includes("not available") ||
      message.toLowerCase().includes("invalid")
        ? 400
        : 500;

    return NextResponse.json({ success: false, error: message }, { status });
  }
}
