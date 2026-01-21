"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePyramidStore } from "@/lib/store";
import { validationApi } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import { UnsavedChangesIndicator } from "@/components/ui/UnsavedChangesIndicator";
import { VALIDATION_TOOLTIPS } from "@/config/tooltips";
import type { ValidationResult } from "@/types/pyramid";
import { CheckCircle, AlertTriangle, Info, XCircle, ArrowLeft } from "lucide-react";

export default function ValidationPage() {
  const router = useRouter();
  const { sessionId, pyramid } = usePyramidStore();
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!pyramid) {
      router.push("/");
    } else {
      // Auto-run validation on page load
      runValidation();
    }
  }, [pyramid, router]);

  const runValidation = async () => {
    try {
      setIsValidating(true);
      const result = await validationApi.validate(sessionId);
      setValidationResult(result);
    } catch (err) {
      console.error("Validation failed:", err);
    } finally {
      setIsValidating(false);
    }
  };

  const getIcon = (level: string) => {
    switch (level) {
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getBgColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const groupIssuesByCategory = () => {
    if (!validationResult) return {};

    const grouped: Record<string, ValidationResult["issues"]> = {};
    validationResult.issues.forEach((issue) => {
      const category = issue.category || "Other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(issue);
    });
    return grouped;
  };

  const getFilteredIssues = (issues: ValidationResult["issues"]) => {
    if (filterLevel === "all") return issues;
    return issues.filter((issue) => issue.level === filterLevel);
  };

  const getCategoryTooltip = (category: string) => {
    const categoryMap: Record<string, any> = {
      "Completeness": VALIDATION_TOOLTIPS.COMPLETENESS,
      "Structure": VALIDATION_TOOLTIPS.STRUCTURE,
      "Orphaned Items": VALIDATION_TOOLTIPS.ORPHANED_ITEMS,
      "Balance": VALIDATION_TOOLTIPS.BALANCE,
      "Language Quality": VALIDATION_TOOLTIPS.LANGUAGE_QUALITY,
      "Commitment Quality": VALIDATION_TOOLTIPS.COMMITMENT_QUALITY,
      "Weighting": VALIDATION_TOOLTIPS.WEIGHTING,
      "Cascade Alignment": VALIDATION_TOOLTIPS.CASCADE_ALIGNMENT,
    };
    return categoryMap[category];
  };

  if (!pyramid) {
    return null;
  }

  return (
    <div className="min-h-screen p-4">
      <UnsavedChangesIndicator />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/builder")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Builder
          </Button>
        </div>

        <div className="card mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Pyramid Validation</h1>
          <p className="text-gray-600 mb-6">
            Check your strategic pyramid for completeness, structural integrity, and quality.
          </p>

          <Button onClick={runValidation} disabled={isValidating}>
            {isValidating ? "Validating..." : "Run Validation"}
          </Button>
        </div>

        {validationResult && (
          <>
            {/* Summary */}
            <div className="card mb-6">
              <div className="flex items-center gap-4 mb-4">
                {validationResult.passed ? (
                  <CheckCircle className="w-12 h-12 text-green-500" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-500" />
                )}
                <div>
                  <h2 className="text-2xl font-bold">
                    {validationResult.passed ? "Validation Passed" : "Validation Failed"}
                  </h2>
                  <p className="text-gray-600">
                    {validationResult.total_issues} issue(s) found
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <div className="text-3xl font-bold text-red-600">{validationResult.errors}</div>
                  <div className="text-sm text-gray-600 inline-flex items-center justify-center">
                    Errors
                    <Tooltip tooltipContent={VALIDATION_TOOLTIPS.SEVERITY_ERROR} placement="top" />
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <div className="text-3xl font-bold text-yellow-600">{validationResult.warnings}</div>
                  <div className="text-sm text-gray-600 inline-flex items-center justify-center">
                    Warnings
                    <Tooltip tooltipContent={VALIDATION_TOOLTIPS.SEVERITY_WARNING} placement="top" />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600">{validationResult.info}</div>
                  <div className="text-sm text-gray-600 inline-flex items-center justify-center">
                    Info
                    <Tooltip tooltipContent={VALIDATION_TOOLTIPS.SEVERITY_INFO} placement="top" />
                  </div>
                </div>
              </div>
            </div>

            {/* Issues */}
            {validationResult.issues.length > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Issues</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilterLevel("all")}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        filterLevel === "all"
                          ? "bg-gray-800 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterLevel("error")}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        filterLevel === "error"
                          ? "bg-red-600 text-white"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      Errors
                    </button>
                    <button
                      onClick={() => setFilterLevel("warning")}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        filterLevel === "warning"
                          ? "bg-yellow-600 text-white"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      }`}
                    >
                      Warnings
                    </button>
                    <button
                      onClick={() => setFilterLevel("info")}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        filterLevel === "info"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                    >
                      Info
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(groupIssuesByCategory()).map(([category, issues]) => {
                    const filteredIssues = getFilteredIssues(issues);
                    if (filteredIssues.length === 0) return null;

                    const isExpanded = expandedCategories.has(category);
                    const errorCount = filteredIssues.filter((i) => i.level === "error").length;
                    const warningCount = filteredIssues.filter((i) => i.level === "warning").length;
                    const infoCount = filteredIssues.filter((i) => i.level === "info").length;

                    return (
                      <div key={category} className="border rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleCategory(category)}
                          className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-800 inline-flex items-center">
                              {category}
                              {getCategoryTooltip(category) && (
                                <Tooltip tooltipContent={getCategoryTooltip(category)} placement="right" />
                              )}
                            </span>
                            <div className="flex gap-2">
                              {errorCount > 0 && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                                  {errorCount} error{errorCount !== 1 ? "s" : ""}
                                </span>
                              )}
                              {warningCount > 0 && (
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                                  {warningCount} warning{warningCount !== 1 ? "s" : ""}
                                </span>
                              )}
                              {infoCount > 0 && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                  {infoCount} info
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-gray-500">{isExpanded ? "▼" : "▶"}</span>
                        </button>

                        {isExpanded && (
                          <div className="p-4 space-y-3 bg-white">
                            {filteredIssues.map((issue, index) => (
                              <div
                                key={index}
                                className={`p-4 border rounded-lg ${getBgColor(issue.level)}`}
                              >
                                <div className="flex items-start gap-3">
                                  {getIcon(issue.level)}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      {issue.level && (
                                        <span className="px-2 py-0.5 bg-white rounded text-xs font-medium capitalize">
                                          {issue.level}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-gray-700">{issue.message}</p>
                                    {issue.suggestion && (
                                      <p className="text-sm text-gray-600 mt-2">
                                        💡 {issue.suggestion}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {validationResult.issues.length === 0 && (
              <div className="card text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No Issues Found
                </h3>
                <p className="text-gray-600">
                  Your strategic pyramid looks great! You're ready to export.
                </p>
                <Button className="mt-4" onClick={() => router.push("/exports")}>
                  Go to Exports
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
