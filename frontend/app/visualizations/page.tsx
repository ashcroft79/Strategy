"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePyramidStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import TimeHorizonView from "@/components/visualizations/TimeHorizonView";
import StrategicHealthDashboard from "@/components/visualizations/StrategicHealthDashboard";
import StrategicBalanceScorecard from "@/components/visualizations/StrategicBalanceScorecard";
import CommitmentTraceabilityFlow from "@/components/visualizations/CommitmentTraceabilityFlow";
import { ArrowLeft, Calendar, Activity, BarChart2, GitBranch, FileText } from "lucide-react";
import { useState } from "react";

export default function VisualizationsPage() {
  const router = useRouter();
  const { pyramid } = usePyramidStore();
  const [activeTab, setActiveTab] = useState<"horizon" | "health" | "balance" | "traceability">("horizon");

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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
            <div>
              <Button variant="primary" onClick={() => router.push("/visualizations/one-page")}>
                <FileText className="w-4 h-4 mr-2" />
                Strategy Blueprint
              </Button>
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
