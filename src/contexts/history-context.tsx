"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useLoading } from "@/contexts/loading-context";
import type { AnalysisHistoryItem } from "@/lib/validators/schema";

interface HistoryContextType {
  history: AnalysisHistoryItem[];
  isLoading: boolean;
  error: string | null;
  fetchHistory: () => Promise<void>;
  invalidateHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const { startLoading, stopLoading } = useLoading();
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldFetch, setShouldFetch] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      startLoading();
      setError(null);

      const response = await fetch("/api/history");
      const data = await response.json();

      if (response.ok && data.success) {
        setHistory(data.data || []);
      } else {
        setError(data.error || "Failed to fetch history");
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch history");
    } finally {
      setIsLoading(false);
      stopLoading();
      setShouldFetch(false);
    }
  }, [startLoading, stopLoading]);

  // Fetch history on mount or when invalidated
  useEffect(() => {
    if (shouldFetch) {
      fetchHistory();
    }
  }, [shouldFetch, fetchHistory]);

  // Method to trigger a refetch (e.g., after creating or deleting an analysis)
  const invalidateHistory = useCallback(() => {
    setShouldFetch(true);
  }, []);

  return (
    <HistoryContext.Provider
      value={{
        history,
        isLoading,
        error,
        fetchHistory,
        invalidateHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
}

