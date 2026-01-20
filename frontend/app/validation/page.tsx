"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePyramidStore } from "@/lib/store";
import { validationApi } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import type { ValidationResult } from "@/types/pyramid";
import { CheckCircle, AlertTriangle, Info, XCircle, ArrowLeft } from "lucide-react";

export default function ValidationPage() {
  const router = useRouter();
  const { sessionId, pyramid } = usePyramidStore();
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (!pyramid) {
      router.push("/");
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

  if (!pyramid) {
    return null;
  }

  return (
    <div className="min-h-screen p-4">
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
                  <div className="text-sm text-gray-600">Errors</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <div className="text-3xl font-bold text-yellow-600">{validationResult.warnings}</div>
                  <div className="text-sm text-gray-600">Warnings</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600">{validationResult.info}</div>
                  <div className="text-sm text-gray-600">Info</div>
                </div>
              </div>
            </div>

            {/* Issues */}
            {validationResult.issues.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Issues</h2>
                <div className="space-y-3">
                  {validationResult.issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg ${getBgColor(issue.level)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getIcon(issue.level)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800">{issue.category}</span>
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
