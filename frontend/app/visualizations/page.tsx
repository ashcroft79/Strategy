"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { usePyramidStore } from "@/lib/store";
import { visualizationsApi } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import TimeHorizonView from "@/components/visualizations/TimeHorizonView";
import { ArrowLeft, Calendar, PieChart, Network, Loader2 } from "lucide-react";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function VisualizationsPage() {
  const router = useRouter();
  const { sessionId, pyramid } = usePyramidStore();
  const [activeTab, setActiveTab] = useState<"horizon" | "sunburst" | "network">("horizon");
  const [sunburstData, setSunburstData] = useState<any>(null);
  const [networkData, setNetworkData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pyramid) {
      router.push("/");
    }
  }, [pyramid, router]);

  // Load visualization data when tabs are clicked
  useEffect(() => {
    if (!sessionId) return;

    const loadVisualization = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (activeTab === "sunburst" && !sunburstData) {
          const data = await visualizationsApi.getDistributionSunburst(sessionId);
          setSunburstData(data);
        } else if (activeTab === "network" && !networkData) {
          const data = await visualizationsApi.getNetworkDiagram(sessionId);
          setNetworkData(data);
        }
      } catch (err: any) {
        console.error("Failed to load visualization:", err);
        setError(err.response?.data?.detail || "Failed to load visualization");
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab !== "horizon") {
      loadVisualization();
    }
  }, [activeTab, sessionId, sunburstData, networkData]);

  if (!pyramid) {
    return null;
  }

  const tabs = [
    {
      id: "horizon" as const,
      label: "Time Horizon",
      icon: Calendar,
      description: "View commitments organized by delivery timeline"
    },
    {
      id: "sunburst" as const,
      label: "Distribution",
      icon: PieChart,
      description: "See how commitments are distributed across strategic drivers"
    },
    {
      id: "network" as const,
      label: "Network View",
      icon: Network,
      description: "Visualize strategic intents and commitments per driver"
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

        {/* Distribution Sunburst Tab */}
        {activeTab === "sunburst" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Commitment Distribution by Strategic Driver
              </h2>
              <p className="text-sm text-gray-600">
                Interactive sunburst chart showing how commitments are distributed across your strategic drivers.
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-red-50 rounded-xl">
                <p className="text-red-600">{error}</p>
              </div>
            ) : sunburstData ? (
              <div className="flex justify-center">
                <Plot
                  data={sunburstData.data}
                  layout={{
                    ...sunburstData.layout,
                    autosize: true,
                    margin: { l: 0, r: 0, t: 40, b: 0 }
                  }}
                  config={{
                    responsive: true,
                    displayModeBar: true,
                    displaylogo: false,
                    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
                  }}
                  style={{ width: "100%", height: "600px" }}
                />
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-600">Loading visualization...</p>
              </div>
            )}
          </div>
        )}

        {/* Network Diagram Tab */}
        {activeTab === "network" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Strategic Network View
              </h2>
              <p className="text-sm text-gray-600">
                Compare the number of strategic intents and iconic commitments across each driver.
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-red-50 rounded-xl">
                <p className="text-red-600">{error}</p>
              </div>
            ) : networkData ? (
              <div className="flex justify-center">
                <Plot
                  data={networkData.data}
                  layout={{
                    ...networkData.layout,
                    autosize: true,
                    margin: { l: 120, r: 40, t: 40, b: 80 }
                  }}
                  config={{
                    responsive: true,
                    displayModeBar: true,
                    displaylogo: false,
                    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'zoom2d']
                  }}
                  style={{ width: "100%", height: "500px" }}
                />
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-600">Loading visualization...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
