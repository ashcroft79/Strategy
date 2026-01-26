"use client";

import { useState, useEffect } from "react";
import { contextApi, type SOCCItem, type QuadrantType } from "@/lib/api-client";
import { usePyramidStore } from "@/lib/store";
import { QuadrantPanel } from "./QuadrantPanel";
import { TrendingUp, Target, AlertTriangle, Lock } from "lucide-react";

export function SOCCCanvas() {
  const { sessionId, setLoading, setError, showToast } = usePyramidStore();
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);

  // Load SOCC analysis
  useEffect(() => {
    if (!sessionId) return;

    const loadAnalysis = async () => {
      try {
        setIsLoadingAnalysis(true);
        const data = await contextApi.getSOCC(sessionId);
        setAnalysis(data);
      } catch (err: any) {
        console.error("Failed to load SOCC analysis:", err);
        setError(err.message || "Failed to load SOCC analysis");
      } finally {
        setIsLoadingAnalysis(false);
      }
    };

    loadAnalysis();
  }, [sessionId, setError]);

  // Refresh analysis data
  const refreshAnalysis = async () => {
    if (!sessionId) return;
    try {
      const data = await contextApi.getSOCC(sessionId);
      setAnalysis(data);
    } catch (err: any) {
      console.error("Failed to refresh SOCC analysis:", err);
    }
  };

  // Add item handler
  const handleAddItem = async (item: Partial<SOCCItem>) => {
    try {
      setLoading(true);
      await contextApi.addSOCCItem(sessionId, item);
      await refreshAnalysis();
      showToast("Item added successfully");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  // Update item handler
  const handleUpdateItem = async (id: string, item: Partial<SOCCItem>) => {
    try {
      setLoading(true);
      await contextApi.updateSOCCItem(sessionId, id, item);
      await refreshAnalysis();
      showToast("Item updated successfully");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  // Delete item handler
  const handleDeleteItem = async (id: string) => {
    try {
      setLoading(true);
      await contextApi.deleteSOCCItem(sessionId, id);
      await refreshAnalysis();
      showToast("Item deleted successfully");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingAnalysis) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SOCC analysis...</p>
        </div>
      </div>
    );
  }

  const getItemsByQuadrant = (quadrant: QuadrantType) =>
    analysis?.items?.filter((item: SOCCItem) => item.quadrant === quadrant) || [];

  const totalItems = analysis?.items?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">SOCC Analysis</h2>
        <p className="text-gray-600">
          Capture your <span className="font-semibold">Strengths</span>,{" "}
          <span className="font-semibold">Opportunities</span>,{" "}
          <span className="font-semibold">Considerations</span>, and{" "}
          <span className="font-semibold">Constraints</span> to build a foundation for your strategy.
        </p>
      </div>

      {/* Four-Quadrant Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuadrantPanel
          type="strength"
          title="Strengths"
          subtitle="Internal, Positive"
          description="What we're good at, what assets we have, what's working"
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
          items={getItemsByQuadrant("strength")}
          onAddItem={(item) => handleAddItem({ ...item, quadrant: "strength" })}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
        />

        <QuadrantPanel
          type="opportunity"
          title="Opportunities"
          subtitle="External, Positive"
          description="What needs exist, what's changing in our favor, where is white space"
          icon={<Target className="w-5 h-5" />}
          color="blue"
          items={getItemsByQuadrant("opportunity")}
          onAddItem={(item) => handleAddItem({ ...item, quadrant: "opportunity" })}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
        />

        <QuadrantPanel
          type="consideration"
          title="Considerations"
          subtitle="External, Threats"
          description="What's working against us, competitive pressures, weakening areas"
          icon={<AlertTriangle className="w-5 h-5" />}
          color="orange"
          items={getItemsByQuadrant("consideration")}
          onAddItem={(item) => handleAddItem({ ...item, quadrant: "consideration" })}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
        />

        <QuadrantPanel
          type="constraint"
          title="Constraints"
          subtitle="Internal, Blockers"
          description="What's stopping us, resource limitations, organizational barriers"
          icon={<Lock className="w-5 h-5" />}
          color="red"
          items={getItemsByQuadrant("constraint")}
          onAddItem={(item) => handleAddItem({ ...item, quadrant: "constraint" })}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
        />
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-green-600">
              {getItemsByQuadrant("strength").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Strengths</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">
              {getItemsByQuadrant("opportunity").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Opportunities</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600">
              {getItemsByQuadrant("consideration").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Considerations</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-600">
              {getItemsByQuadrant("constraint").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Constraints</div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="text-3xl font-bold text-gray-900">{totalItems}</div>
            <div className="text-sm text-gray-600 mt-1">Total Items</div>
          </div>
        </div>

        {/* Progress indicator */}
        {totalItems > 0 && totalItems < 20 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Recommended: 20+ items for complete context</span>
              <span className="font-semibold text-gray-900">{totalItems} / 20</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((totalItems / 20) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {totalItems >= 20 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-green-700">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-semibold">
                Great! You've captured comprehensive context.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
