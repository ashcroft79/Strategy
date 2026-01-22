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
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSuggestion = useCallback(
    async (content: string) => {
      // Skip if content is AI-generated (don't critique our own generation)
      if (!enabled || content.length < minLength || isAiGenerated) {
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
    [sessionId, tier, fieldName, enabled, minLength, context, isAiGenerated]
  );

  useEffect(() => {
    if (!enabled || value.length < minLength) {
      setSuggestion(null);
      setIsLoading(false);
      return;
    }

    // If content is marked as AI-generated, skip analysis
    if (isAiGenerated) {
      return;
    }

    setIsLoading(true);
    const timerId = setTimeout(() => {
      fetchSuggestion(value);
    }, debounceMs);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, fetchSuggestion, debounceMs, enabled, minLength, isAiGenerated]);

  const dismissSuggestion = useCallback(() => {
    setSuggestion(null);
  }, []);

  const markAsAiGenerated = useCallback(() => {
    // Mark content as AI-generated to skip analysis
    setIsAiGenerated(true);
    setSuggestion(null);
    setIsLoading(false);
  }, []);

  const markAsUserEdited = useCallback(() => {
    // User started editing - re-enable suggestions
    setIsAiGenerated(false);
  }, []);

  return {
    suggestion,
    isLoading,
    hasSuggestion: suggestion?.has_suggestion ?? false,
    dismissSuggestion,
    markAsAiGenerated,
    markAsUserEdited,
  };
}
