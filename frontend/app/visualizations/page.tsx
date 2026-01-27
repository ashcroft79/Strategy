"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePyramidStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { UnsavedChangesIndicator } from "@/components/ui/UnsavedChangesIndicator";
import TimeHorizonView from "@/components/visualizations/TimeHorizonView";
import StrategicHealthDashboard from "@/components/visualizations/StrategicHealthDashboard";
import StrategicBalanceScorecard from "@/components/visualizations/StrategicBalanceScorecard";
import CommitmentTraceabilityFlow from "@/components/visualizations/CommitmentTraceabilityFlow";
import { ArrowLeft, Calendar, Activity, BarChart2, GitBranch, Target, Users } from "lucide-react";
import { useState } from "react";

export default function VisualizationsPage() {
  const router = useRouter();
  const { pyramid } = usePyramidStore();
  const [activeTab, setActiveTab] = useState<"context" | "opportunities" | "horizon" | "health" | "balance" | "traceability">("context");

  useEffect(() => {
    if (!pyramid) {
      router.push("/");
    }
  }, [pyramid, router]);

  if (!pyramid) {
    return null;
  }

  const tabs = [
    {
      id: "context" as const,
      label: "Context Overview",
      icon: Target,
      description: "SOCC Analysis, Strategic Tensions, and Stakeholder Mapping"
    },
    {
      id: "opportunities" as const,
      label: "Opportunity Analysis",
      icon: Activity,
      description: "Opportunity scoring, prioritization, and strategic fit"
    },
    {
      id: "horizon" as const,
      label: "Time Horizon",
      icon: Calendar,
      description: "View commitments organized by delivery timeline (H1/H2/H3)"
    },
    {
      id: "health" as const,
      label: "Strategic Health",
      icon: Activity,
      description: "Driver-level health metrics with actionable insights"
    },
    {
      id: "balance" as const,
      label: "Balance Scorecard",
      icon: BarChart2,
      description: "Overall pyramid balance, completeness, and coverage gaps"
    },
    {
      id: "traceability" as const,
      label: "Traceability",
      icon: GitBranch,
      description: "Trace commitments from vision to execution (golden threads)"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <UnsavedChangesIndicator />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/builder")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Builder
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Visualizations</h1>
              <p className="text-sm text-gray-600">{pyramid.metadata.project_name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Description */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <p className="text-sm text-blue-900">
            {tabs.find(t => t.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Context Overview Tab */}
        {activeTab === "context" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Step 1: Context & Discovery Overview
                </h2>
                <p className="text-sm text-gray-600">
                  Your strategic context foundation including SOCC analysis, tensions, and stakeholders.
                </p>
              </div>

              <div className="space-y-8">
                {/* SOCC Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">SOCC Analysis Summary</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-green-700 mb-1">Strengths</div>
                      <div className="text-2xl font-bold text-green-900">
                        {pyramid.context?.socc_analysis?.items?.filter((i: any) => i.quadrant === "strength").length || 0}
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-blue-700 mb-1">Opportunities</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {pyramid.context?.socc_analysis?.items?.filter((i: any) => i.quadrant === "opportunity").length || 0}
                      </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-orange-700 mb-1">Considerations</div>
                      <div className="text-2xl font-bold text-orange-900">
                        {pyramid.context?.socc_analysis?.items?.filter((i: any) => i.quadrant === "consideration").length || 0}
                      </div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-red-700 mb-1">Constraints</div>
                      <div className="text-2xl font-bold text-red-900">
                        {pyramid.context?.socc_analysis?.items?.filter((i: any) => i.quadrant === "constraint").length || 0}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strategic Tensions Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Strategic Tensions</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">
                      Total Tensions Identified: <span className="font-semibold text-gray-900">{pyramid.context?.strategic_tensions?.length || 0}</span>
                    </div>
                    {pyramid.context?.strategic_tensions && pyramid.context.strategic_tensions.length > 0 ? (
                      <div className="space-y-2 mt-4">
                        {pyramid.context.strategic_tensions.map((tension: any) => (
                          <div key={tension.id} className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="font-medium text-gray-900">{tension.name}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              Current: {tension.current_position} → Target: {tension.target_position}
                              {Math.abs(tension.target_position - tension.current_position) > 10 && (
                                <span className="ml-2 text-orange-600 font-medium">
                                  ({Math.abs(tension.target_position - tension.current_position)} point shift required)
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">No tensions identified yet</div>
                    )}
                  </div>
                </div>

                {/* Stakeholders Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Stakeholder Mapping</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-green-700 mb-1">Key Players</div>
                      <div className="text-2xl font-bold text-green-900">
                        {pyramid.context?.stakeholders?.filter((s: any) => s.interest_level === "high" && s.influence_level === "high").length || 0}
                      </div>
                      <div className="text-xs text-green-600 mt-1">High Interest + High Influence</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-blue-700 mb-1">Keep Satisfied</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {pyramid.context?.stakeholders?.filter((s: any) => s.interest_level === "low" && s.influence_level === "high").length || 0}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">Low Interest + High Influence</div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-orange-700 mb-1">Keep Informed</div>
                      <div className="text-2xl font-bold text-orange-900">
                        {pyramid.context?.stakeholders?.filter((s: any) => s.interest_level === "high" && s.influence_level === "low").length || 0}
                      </div>
                      <div className="text-xs text-orange-600 mt-1">High Interest + Low Influence</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-700 mb-1">Monitor</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {pyramid.context?.stakeholders?.filter((s: any) => s.interest_level === "low" && s.influence_level === "low").length || 0}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Low Interest + Low Influence</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Opportunity Analysis Tab */}
        {activeTab === "opportunities" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Opportunity Scoring & Prioritization
                </h2>
                <p className="text-sm text-gray-600">
                  Opportunities prioritized by strategic fit, strength leverage, and viability.
                </p>
              </div>

              {pyramid.context?.opportunity_scores && Object.keys(pyramid.context.opportunity_scores).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(pyramid.context.opportunity_scores || {})
                    .map(([opportunityId, score]: [string, any]) => {
                      const opportunity = pyramid.context?.socc_analysis?.items?.find((i: any) => i.id === opportunityId);
                      const calculatedScore = (score.strength_match * 2) - score.consideration_risk - score.constraint_impact;
                      const viability = calculatedScore >= 7 ? "High" : calculatedScore >= 4 ? "Moderate" : calculatedScore >= 1 ? "Marginal" : "Low";
                      const viabilityColor = calculatedScore >= 7 ? "green" : calculatedScore >= 4 ? "blue" : calculatedScore >= 1 ? "orange" : "red";

                      return {
                        opportunityId,
                        opportunity,
                        score,
                        calculatedScore,
                        viability,
                        viabilityColor
                      };
                    })
                    .sort((a, b) => b.calculatedScore - a.calculatedScore)
                    .map(({ opportunityId, opportunity, score, calculatedScore, viability, viabilityColor }, index) => (
                      <div key={opportunityId} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                              <h4 className="font-semibold text-gray-900">{opportunity?.title || "Unknown Opportunity"}</h4>
                            </div>
                            {opportunity?.description && (
                              <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
                            )}
                          </div>
                          <div className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold bg-${viabilityColor}-100 text-${viabilityColor}-800`}>
                            {viability} ({calculatedScore > 0 ? '+' : ''}{calculatedScore})
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-3">
                          <div className="bg-green-50 border border-green-200 rounded p-2">
                            <div className="text-xs text-green-700 mb-1">Strength Match</div>
                            <div className="text-lg font-bold text-green-900">{score.strength_match}/5</div>
                          </div>
                          <div className="bg-orange-50 border border-orange-200 rounded p-2">
                            <div className="text-xs text-orange-700 mb-1">Consideration Risk</div>
                            <div className="text-lg font-bold text-orange-900">{score.consideration_risk}/5</div>
                          </div>
                          <div className="bg-red-50 border border-red-200 rounded p-2">
                            <div className="text-xs text-red-700 mb-1">Constraint Impact</div>
                            <div className="text-lg font-bold text-red-900">{score.constraint_impact}/5</div>
                          </div>
                        </div>
                        {score.rationale && (
                          <div className="mt-3 text-sm text-gray-600 italic bg-gray-50 rounded p-2">
                            {score.rationale}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-5xl mb-4">🎯</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No scored opportunities yet</h3>
                  <p className="text-gray-600 mb-4">
                    Score your opportunities in the Context & Discovery section to see prioritization here
                  </p>
                  <Button onClick={() => router.push("/builder")}>
                    Go to Builder
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Time Horizon Tab */}
        {activeTab === "horizon" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Iconic Commitments by Time Horizon
                </h2>
                <p className="text-sm text-gray-600">
                  Your strategic commitments organized by delivery timeline. H1 (near-term), H2 (mid-term), and H3 (long-term).
                </p>
              </div>

              {pyramid.iconic_commitments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-5xl mb-4">📅</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No commitments yet</h3>
                  <p className="text-gray-600 mb-4">
                    Add iconic commitments in the builder to see them visualized here
                  </p>
                  <Button onClick={() => router.push("/builder")}>
                    Go to Builder
                  </Button>
                </div>
              ) : (
                <TimeHorizonView pyramid={pyramid} />
              )}
            </div>
          </div>
        )}

        {/* Strategic Health Dashboard Tab */}
        {activeTab === "health" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Strategic Health Dashboard
                </h2>
                <p className="text-sm text-gray-600">
                  Monitor the health of each strategic driver with actionable insights and metrics.
                </p>
              </div>

              <StrategicHealthDashboard pyramid={pyramid} />
            </div>
          </div>
        )}

        {/* Strategic Balance Scorecard Tab */}
        {activeTab === "balance" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Strategic Balance Scorecard
                </h2>
                <p className="text-sm text-gray-600">
                  Assess overall pyramid balance, completeness, and identify coverage gaps.
                </p>
              </div>

              <StrategicBalanceScorecard pyramid={pyramid} />
            </div>
          </div>
        )}

        {/* Commitment Traceability Flow Tab */}
        {activeTab === "traceability" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Commitment Traceability Flow
                </h2>
                <p className="text-sm text-gray-600">
                  Visualize how commitments trace back to vision through drivers and intents. Identify golden threads and orphaned commitments.
                </p>
              </div>

              <CommitmentTraceabilityFlow pyramid={pyramid} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
