import { useState, useEffect } from "react";

const LOADING_MESSAGES = [
  "Fetching website data...",
  "Analyzing page structure...",
  "Checking SEO elements...",
  "Evaluating content quality...",
  "Assessing performance...",
  "Reviewing accessibility...",
  "Generating insights...",
  "Finalizing analysis...",
];

const MESSAGE_INTERVAL = 2000; // Change message every 2 seconds

/**
 * Hook that cycles through different loading messages during analysis
 * @param isLoading - Whether the analysis is currently loading
 * @returns Current loading message
 */
export function useLoadingMessages(isLoading: boolean) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      const frameId = requestAnimationFrame(() => setCurrentMessageIndex(0));
      return () => cancelAnimationFrame(frameId);
    }

    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === LOADING_MESSAGES.length - 1 ? 0 : prevIndex + 1
      );
    }, MESSAGE_INTERVAL);

    return () => clearInterval(interval);
  }, [isLoading]);

  return LOADING_MESSAGES[currentMessageIndex];
}
