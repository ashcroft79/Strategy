/**
 * Custom hook for AI field suggestions with debouncing
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { aiApi } from "@/lib/api-client";

interface AIFieldSuggestion {
  has_suggestion: boolean;
  severity?: "error" | "warning" | "info";
  message?: string;
  suggestion?: string;
  examples?: string[];
  reasoning?: string;
  error?: string;
}

interface UseAIFieldSuggestionOptions {
  sessionId: string;
  tier: string;
  fieldName: string;
  enabled?: boolean;
  debounceMs?: number;
  minLength?: number;
  context?: any;
}

export function useAIFieldSuggestion(
  value: string,
  options: UseAIFieldSuggestionOptions
) {
  const {
    sessionId,
    tier,
    fieldName,
    enabled = true,
    debounceMs = 1500,
    minLength = 10,
    context,
  } = options;

  const [suggestion, setSuggestion] = useState<AIFieldSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSuggestion = useCallback(
    async (content: string) => {
      if (!enabled || content.length < minLength) {
        setSuggestion(null);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      setIsLoading(true);

      try {
        const result = await aiApi.suggestField(
          sessionId,
          tier,
          fieldName,
          content,
          context
        );

        // Cast severity to proper type
        const typedResult: AIFieldSuggestion = {
          ...result,
          severity: result.severity as "error" | "warning" | "info" | undefined,
        };

        setSuggestion(typedResult);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("AI suggestion error:", err);
          setSuggestion(null);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, tier, fieldName, enabled, minLength, context]
  );

  useEffect(() => {
    if (!enabled || value.length < minLength) {
      setSuggestion(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timerId = setTimeout(() => {
      fetchSuggestion(value);
    }, debounceMs);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, fetchSuggestion, debounceMs, enabled, minLength]);

  const dismissSuggestion = useCallback(() => {
    setSuggestion(null);
  }, []);

  return {
    suggestion,
    isLoading,
    hasSuggestion: suggestion?.has_suggestion ?? false,
    dismissSuggestion,
  };
}
