"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { usePyramidStore } from "@/lib/store";
import { visualizationsApi } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, BarChart3, RefreshCw } from "lucide-react";

// Dynamically import Plot to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function VisualizationsPage() {
  const router = useRouter();
  const { sessionId, pyramid } = usePyramidStore();

  const [pyramidDiagramData, setPyramidDiagramData] = useState<any>(null);
  const [sunburstData, setSunburstData] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<any>(null);
  const [networkData, setNetworkData] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pyramid) {
      router.push("/");
      return;
    }
    loadVisualizations();
  }, [pyramid, router, sessionId]);

  const loadVisualizations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all visualizations in parallel
      const [pyramidDiagram, sunburst, timeline, network] = await Promise.all([
        visualizationsApi.getPyramidDiagram(sessionId, true),
        visualizationsApi.getDistributionSunburst(sessionId),
        visualizationsApi.getHorizonTimeline(sessionId),
        visualizationsApi.getNetworkDiagram(sessionId),
      ]);

      setPyramidDiagramData(pyramidDiagram);
      setSunburstData(sunburst);
      setTimelineData(timeline);
      setNetworkData(network);
    } catch (err: any) {
      console.error("Failed to load visualizations:", err);
      setError(err.response?.data?.detail || "Failed to load visualizations");
    } finally {
      setIsLoading(false);
    }
  };

  if (!pyramid) {
    return null;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.push("/builder")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Builder
          </Button>

          <Button onClick={loadVisualizations} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-800">Strategy Visualizations</h1>
          </div>
          <p className="text-gray-600">
            Interactive charts showing your strategic pyramid structure, relationships, and distribution.
          </p>
        </div>

        {error && (
          <div className="card bg-red-50 border-red-200 mb-6">
            <p className="text-red-800 font-medium">Error: {error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="card">
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-gray-600">Loading visualizations...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pyramid Diagram */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Pyramid Structure</h2>
              <p className="text-gray-600 mb-4">
                Visual representation of your 9-tier strategic pyramid with item counts.
              </p>
              {pyramidDiagramData ? (
                <div className="bg-white rounded-lg">
                  <Plot
                    data={pyramidDiagramData.data}
                    layout={pyramidDiagramData.layout}
                    config={{ responsive: true, displayModeBar: true }}
                    style={{ width: "100%", height: "600px" }}
                  />
                </div>
              ) : (
                <p className="text-gray-500 italic">No data available</p>
              )}
            </div>

            {/* Distribution Sunburst */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Commitment Distribution</h2>
              <p className="text-gray-600 mb-4">
                Shows how iconic commitments are distributed across strategic drivers.
              </p>
              {sunburstData ? (
                <div className="bg-white rounded-lg">
                  <Plot
                    data={sunburstData.data}
                    layout={sunburstData.layout}
                    config={{ responsive: true, displayModeBar: true }}
                    style={{ width: "100%", height: "500px" }}
                  />
                </div>
              ) : (
                <p className="text-gray-500 italic">No data available</p>
              )}
            </div>

            {/* Horizon Timeline */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Horizon Timeline</h2>
              <p className="text-gray-600 mb-4">
                Timeline view of iconic commitments organized by time horizon (H1: 0-12 months, H2: 12-24 months, H3: 24-36 months).
              </p>
              {timelineData ? (
                <div className="bg-white rounded-lg">
                  <Plot
                    data={timelineData.data}
                    layout={timelineData.layout}
                    config={{ responsive: true, displayModeBar: true }}
                    style={{ width: "100%", height: "500px" }}
                  />
                </div>
              ) : (
                <p className="text-gray-500 italic">No data available</p>
              )}
            </div>

            {/* Network Diagram */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Strategic Drivers Overview</h2>
              <p className="text-gray-600 mb-4">
                Shows the relationship between strategic drivers, their intents, and commitments.
              </p>
              {networkData ? (
                <div className="bg-white rounded-lg">
                  <Plot
                    data={networkData.data}
                    layout={networkData.layout}
                    config={{ responsive: true, displayModeBar: true }}
                    style={{ width: "100%", height: "400px" }}
                  />
                </div>
              ) : (
                <p className="text-gray-500 italic">No data available</p>
              )}
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="card mt-6 bg-blue-50 border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">Interactive Charts</h3>
          <p className="text-sm text-blue-800">
            All charts are interactive. You can hover over elements for details, zoom in/out, pan,
            and use the toolbar in the top-right of each chart for additional options.
          </p>
        </div>
      </div>
    </div>
  );
}
