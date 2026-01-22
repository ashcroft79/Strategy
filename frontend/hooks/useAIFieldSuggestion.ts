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
  const [aiGeneratedValue, setAiGeneratedValue] = useState<string>("");
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

    // If content is marked as AI-generated, check for substantive edits
    if (isAiGenerated) {
      // Calculate edit distance from original AI-generated content
      const changeSize = Math.abs(value.length - aiGeneratedValue.length);
      const percentChange = changeSize / Math.max(aiGeneratedValue.length, 1);

      // Only re-enable if substantive change (>20 chars or >10% different)
      if (changeSize > 20 || percentChange > 0.1) {
        setIsAiGenerated(false);
        setAiGeneratedValue("");
      } else {
        // Minor edit, keep skipping analysis
        return;
      }
    }

    setIsLoading(true);
    const timerId = setTimeout(() => {
      fetchSuggestion(value);
    }, debounceMs);

    return () => {
      clearTimeout(timerId);
    };
    // IMPORTANT: Don't include fetchSuggestion to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, debounceMs, enabled, minLength, isAiGenerated, aiGeneratedValue]);

  const dismissSuggestion = useCallback(() => {
    setSuggestion(null);
  }, []);

  const markAsAiGenerated = useCallback((generatedValue: string) => {
    // Mark content as AI-generated to skip analysis
    // Store the generated value to detect substantive edits later
    setIsAiGenerated(true);
    setAiGeneratedValue(generatedValue);
    setSuggestion(null);
    setIsLoading(false);
  }, []);

  const markAsUserEdited = useCallback(() => {
    // Force re-enable suggestions (for manual override if needed)
    setIsAiGenerated(false);
    setAiGeneratedValue("");
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
