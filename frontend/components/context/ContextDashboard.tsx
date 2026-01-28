"use client";

import { useState, useEffect } from "react";
import { contextApi, type ContextSummary } from "@/lib/api-client";
import { usePyramidStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import {
  CheckCircle,
  Circle,
  TrendingUp,
  Target,
  Scale,
  Users,
  FileDown,
  ArrowRight,
  AlertCircle,
  Sparkles
} from "lucide-react";

interface ContextDashboardProps {
  onNavigateToTab: (tab: 'socc' | 'scoring' | 'tensions' | 'stakeholders') => void;
  onContinueToStrategy: () => void;
}

export function ContextDashboard({ onNavigateToTab, onContinueToStrategy }: ContextDashboardProps) {
  const { sessionId } = usePyramidStore();
  const [summary, setSummary] = useState<ContextSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSummary = async () => {
    if (!sessionId) return;
    try {
      setIsLoading(true);
      const data = await contextApi.getContextSummary(sessionId);
      setSummary(data);
    } catch (error) {
      console.error("Failed to load context summary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, [sessionId]);

  const handleExport = async () => {
    try {
      const exportData = await contextApi.exportContext(sessionId);

      // Create JSON file and download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `context-analysis-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading context summary...</div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">No context data found</div>
      </div>
    );
  }

  const completionPercentage = summary.completion_percentage || 0;
  const isComplete = summary.overall_complete || false;

  const sections = [
    {
      id: 'socc' as const,
      name: 'SOCC Analysis',
      icon: <TrendingUp className="w-5 h-5" />,
      count: summary.socc_item_count,
      target: 1,
      complete: summary.socc_complete,
      color: 'blue',
      description: 'Capture strengths, opportunities, considerations, and constraints',
    },
    {
      id: 'scoring' as const,
      name: 'Opportunity Scoring',
      icon: <Target className="w-5 h-5" />,
      count: summary.opportunities_scored_count,
      target: 1,
      complete: summary.opportunities_complete,
      color: 'purple',
      description: 'Score opportunities by strength match and constraints',
    },
    {
      id: 'tensions' as const,
      name: 'Strategic Tensions',
      icon: <Scale className="w-5 h-5" />,
      count: summary.tensions_identified_count,
      target: 1,
      complete: summary.tensions_complete,
      color: 'orange',
      description: 'Map key trade-offs and positioning choices',
    },
    {
      id: 'stakeholders' as const,
      name: 'Stakeholder Mapping',
      icon: <Users className="w-5 h-5" />,
      count: summary.stakeholders_mapped_count,
      target: 1,
      complete: summary.stakeholders_complete,
      color: 'green',
      description: 'Map stakeholders by interest and influence',
    },
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      complete: 'bg-blue-600',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-600',
      complete: 'bg-purple-600',
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-600',
      complete: 'bg-orange-600',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      complete: 'bg-green-600',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Context Layer Dashboard</h2>
        <p className="text-gray-600">
          Track your progress building the strategic foundation. Complete all sections before moving to strategy.
        </p>
      </div>

      {/* Overall Progress */}
      <Card className={`border-2 ${isComplete ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Overall Completion</h3>
              <p className="text-sm text-gray-600">
                {isComplete
                  ? "Context analysis complete! Ready to build strategy."
                  : "Complete all sections to proceed to strategy."}
              </p>
            </div>
            <div className="text-4xl font-bold text-gray-900">{Math.round(completionPercentage)}%</div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className={`h-4 rounded-full transition-all ${isComplete ? 'bg-green-600' : 'bg-blue-600'}`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {isComplete && (
            <div className="flex items-center gap-2 text-green-700 bg-green-100 rounded-lg p-3">
              <CheckCircle className="w-5 h-5" />
              <div className="flex-1">
                <div className="font-semibold">Context Foundation Complete!</div>
                <div className="text-sm">You're ready to move to Step 2: Strategy</div>
              </div>
              <Button onClick={onContinueToStrategy} variant="primary">
                Continue to Strategy
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Cards */}
      <div className="grid grid-cols-2 gap-4">
        {sections.map((section) => {
          const colors = colorClasses[section.color as keyof typeof colorClasses];
          const percentage = Math.min(100, (section.count / section.target) * 100);

          return (
            <Card key={section.id} className={`border-2 ${colors.border}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <div className={colors.text}>{section.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{section.name}</h3>
                      <p className="text-xs text-gray-600">{section.description}</p>
                    </div>
                  </div>
                  {section.complete ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Count */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-lg font-bold text-gray-900">
                      {section.count} / {section.target}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${section.complete ? colors.complete : 'bg-gray-400'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {/* Status */}
                  {section.complete ? (
                    <div className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Complete</span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        {section.target - section.count} more needed
                      </span>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    variant={section.complete ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => onNavigateToTab(section.id)}
                    className="w-full"
                  >
                    {section.complete ? "View" : "Continue"}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion Checklist */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-gray-900">Completion Checklist</h3>
          <p className="text-sm text-gray-600">Track what's been completed</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {section.complete ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className={`font-medium ${section.complete ? 'text-gray-900' : 'text-gray-600'}`}>
                    {section.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {section.complete ? (
                      `✓ ${section.count} items captured`
                    ) : (
                      `${section.count}/${section.target} - ${section.target - section.count} more needed`
                    )}
                  </div>
                </div>
                {!section.complete && (
                  <Button variant="ghost" size="sm" onClick={() => onNavigateToTab(section.id)}>
                    Add More
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleExport} variant="secondary">
          <FileDown className="w-4 h-4 mr-2" />
          Export Context Report
        </Button>

        {isComplete && (
          <Button onClick={onContinueToStrategy} className="ml-auto">
            <Sparkles className="w-4 h-4 mr-2" />
            Continue to Strategy
          </Button>
        )}
      </div>
    </div>
  );
}
