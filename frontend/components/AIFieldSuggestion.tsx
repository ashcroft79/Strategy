"use client";

import { AlertTriangle, Info, XCircle, X, Lightbulb, Sparkles } from "lucide-react";

interface AIFieldSuggestionProps {
  severity: "error" | "warning" | "info";
  message: string;
  suggestion?: string;
  examples?: string[];
  reasoning?: string;
  onDismiss: () => void;
  onApply?: (suggestion: string) => void;
}

export function AIFieldSuggestion({
  severity,
  message,
  suggestion,
  examples,
  reasoning,
  onDismiss,
  onApply,
}: AIFieldSuggestionProps) {
  const getIcon = () => {
    switch (severity) {
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (severity) {
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
    }
  };

  const getTextColor = () => {
    switch (severity) {
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      case "info":
        return "text-blue-800";
    }
  };

  return (
    <div className={`mt-2 p-3 border rounded-lg ${getBgColor()} animate-slideDown`}>
      <div className="flex items-start gap-2">
        <div className="flex items-center gap-2 flex-1">
          {getIcon()}
          <div className="flex-1">
            <p className={`text-sm font-medium ${getTextColor()}`}>{message}</p>

            {suggestion && (
              <div className="mt-2 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{suggestion}</p>
                  {onApply && (
                    <button
                      onClick={() => onApply(suggestion)}
                      className="mt-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Apply this suggestion
                    </button>
                  )}
                </div>
              </div>
            )}

            {examples && examples.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-600 mb-1">Examples:</p>
                <ul className="text-xs text-gray-700 space-y-0.5">
                  {examples.map((example, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-green-600">✓</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {reasoning && (
              <p className="mt-2 text-xs text-gray-600 italic">{reasoning}</p>
            )}
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          aria-label="Dismiss suggestion"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface AIFieldSuggestionIndicatorProps {
  isLoading: boolean;
  hasSuggestion: boolean;
}

export function AIFieldSuggestionIndicator({
  isLoading,
  hasSuggestion,
}: AIFieldSuggestionIndicatorProps) {
  if (isLoading) {
    return (
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
        <span className="text-xs text-gray-500">AI analyzing...</span>
      </div>
    );
  }

  if (hasSuggestion) {
    return (
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <Sparkles className="w-4 h-4 text-yellow-500" />
      </div>
    );
  }

  return null;
}
