"use client";

import { useState, useEffect } from "react";

interface AnimatedTextProps {
  words: string[];
}

export function AnimatedText({ words }: AnimatedTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsVisible(true);
      }, 200);
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span
      className={`block gradient-text transition-opacity duration-200 pb-2 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {words[currentWordIndex]}
    </span>
  );
}
