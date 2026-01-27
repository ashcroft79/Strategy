"use client";

import { useState, useEffect } from "react";
import { contextApi, type SOCCItem } from "@/lib/api-client";
import { usePyramidStore } from "@/lib/store";
import { ChevronDown, ChevronUp, Lightbulb, TrendingUp, Target, AlertTriangle, Lock } from "lucide-react";

export function ContextSummary() {
  const { sessionId } = usePyramidStore();
  const [analysis, setAnalysis] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const loadAnalysis = async () => {
      try {
        setIsLoading(true);
        const data = await contextApi.getSOCC(sessionId);
        setAnalysis(data);
      } catch (err) {
        console.error("Failed to load context summary:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalysis();
  }, [sessionId]);

  if (isLoading) return null;
  if (!analysis || !analysis.items || analysis.items.length === 0) return null;

  const getItemsByQuadrant = (quadrant: string): SOCCItem[] => {
    return analysis.items.filter((item: SOCCItem) => item.quadrant === quadrant);
  };

  const strengths = getItemsByQuadrant("strength");
  const opportunities = getItemsByQuadrant("opportunity");
  const considerations = getItemsByQuadrant("consideration");
  const constraints = getItemsByQuadrant("constraint");

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-purple-500 text-white p-2 rounded-lg">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-900">
              Context Foundation (Tier 0)
            </h3>
            <p className="text-sm text-gray-600">
              {analysis.items.length} items • Click to {isExpanded ? "collapse" : "expand"} your context
            </p>
          </div>
        </div>
        <div className="text-purple-600">
          {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-white rounded-lg p-4 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-800">Strengths ({strengths.length})</h4>
            </div>
            {strengths.length > 0 ? (
              <ul className="space-y-2">
                {strengths.slice(0, 5).map((item) => (
                  <li key={item.id} className="text-sm text-gray-700">
                    <span className="font-medium">{item.title}</span>
                    {item.impact_level === "high" && (
                      <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">HIGH</span>
                    )}
                  </li>
                ))}
                {strengths.length > 5 && (
                  <li className="text-xs text-gray-500 italic">
                    +{strengths.length - 5} more...
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No strengths captured yet</p>
            )}
          </div>

          {/* Opportunities */}
          <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Opportunities ({opportunities.length})</h4>
            </div>
            {opportunities.length > 0 ? (
              <ul className="space-y-2">
                {opportunities.slice(0, 5).map((item) => (
                  <li key={item.id} className="text-sm text-gray-700">
                    <span className="font-medium">{item.title}</span>
                    {item.impact_level === "high" && (
                      <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">HIGH</span>
                    )}
                  </li>
                ))}
                {opportunities.length > 5 && (
                  <li className="text-xs text-gray-500 italic">
                    +{opportunities.length - 5} more...
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No opportunities captured yet</p>
            )}
          </div>

          {/* Considerations */}
          <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h4 className="font-semibold text-orange-800">Considerations ({considerations.length})</h4>
            </div>
            {considerations.length > 0 ? (
              <ul className="space-y-2">
                {considerations.slice(0, 5).map((item) => (
                  <li key={item.id} className="text-sm text-gray-700">
                    <span className="font-medium">{item.title}</span>
                    {item.impact_level === "high" && (
                      <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">HIGH</span>
                    )}
                  </li>
                ))}
                {considerations.length > 5 && (
                  <li className="text-xs text-gray-500 italic">
                    +{considerations.length - 5} more...
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No considerations captured yet</p>
            )}
          </div>

          {/* Constraints */}
          <div className="bg-white rounded-lg p-4 border-2 border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-red-600" />
              <h4 className="font-semibold text-red-800">Constraints ({constraints.length})</h4>
            </div>
            {constraints.length > 0 ? (
              <ul className="space-y-2">
                {constraints.slice(0, 5).map((item) => (
                  <li key={item.id} className="text-sm text-gray-700">
                    <span className="font-medium">{item.title}</span>
                    {item.impact_level === "high" && (
                      <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">HIGH</span>
                    )}
                  </li>
                ))}
                {constraints.length > 5 && (
                  <li className="text-xs text-gray-500 italic">
                    +{constraints.length - 5} more...
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No constraints captured yet</p>
            )}
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-purple-200">
          <p className="text-sm text-gray-600">
            <strong>💡 Remember:</strong> Your context informs every strategic choice. When building
            your pyramid, ask: "Does this leverage our strengths? Address our constraints? Capitalize
            on opportunities?"
          </p>
        </div>
      )}
    </div>
  );
}
