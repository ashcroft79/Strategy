"use client";

import { useState, useEffect } from "react";
import { contextApi, type SortedOpportunity, type OpportunityScore, type SOCCItem } from "@/lib/api-client";
import { usePyramidStore } from "@/lib/store";
import { OpportunityScoringCard } from "./OpportunityScoringCard";
import { AlertCircle, TrendingUp, Info } from "lucide-react";

export function OpportunityScoring() {
  const { sessionId, incrementUnsavedChanges } = usePyramidStore();
  const [opportunities, setOpportunities] = useState<SortedOpportunity[]>([]);
  const [soccItems, setSoccItems] = useState<SOCCItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOpportunities = async () => {
    if (!sessionId) return;
    try {
      setIsLoading(true);
      const data = await contextApi.getSortedOpportunities(sessionId);
      setOpportunities(data);
    } catch (error) {
      console.error("Failed to load opportunities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSOCCItems = async () => {
    if (!sessionId) return;
    try {
      const data = await contextApi.getSOCC(sessionId);
      setSoccItems(data.items);
    } catch (error) {
      console.error("Failed to load SOCC items:", error);
    }
  };

  useEffect(() => {
    loadOpportunities();
    loadSOCCItems();
  }, [sessionId]);

  const handleScore = async (opportunityId: string, score: Partial<OpportunityScore>) => {
    try {
      await contextApi.scoreOpportunity(sessionId, opportunityId, {
        ...score,
        opportunity_item_id: opportunityId,
        created_by: "user",
      });
      await loadOpportunities();
      incrementUnsavedChanges();
    } catch (error) {
      console.error("Failed to score opportunity:", error);
    }
  };

  const handleDeleteScore = async (opportunityId: string) => {
    try {
      await contextApi.deleteOpportunityScore(sessionId, opportunityId);
      await loadOpportunities();
      incrementUnsavedChanges();
    } catch (error) {
      console.error("Failed to delete score:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading opportunities...</div>
      </div>
    );
  }

  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Opportunities Found</h3>
        <p className="text-gray-600 text-center max-w-md">
          You need to add opportunities to your SOCC analysis before you can score them.
          Go to the SOCC Canvas and add items to the "Opportunities" quadrant.
        </p>
      </div>
    );
  }

  const scoredCount = opportunities.filter((o) => o.score).length;
  const highViabilityCount = opportunities.filter((o) => o.viability_level === "high").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Opportunity Scoring</h2>
        <p className="text-gray-600 mb-4">
          Systematically evaluate opportunities by assessing strength match, consideration risks, and constraint
          impacts.
        </p>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{opportunities.length}</div>
            <div className="text-sm text-gray-600">Total Opportunities</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{scoredCount}</div>
            <div className="text-sm text-gray-600">Scored</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{highViabilityCount}</div>
            <div className="text-sm text-gray-600">High Viability</div>
          </div>
        </div>

        {/* Scoring Formula Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Scoring Formula</h4>
              <p className="text-sm text-blue-800 mb-2">
                Score = (Strength Match × 2) - Consideration Risk - Constraint Impact
              </p>
              <div className="grid grid-cols-4 gap-3 text-xs">
                <div className="bg-white rounded p-2">
                  <div className="font-semibold text-green-700">High (7-10)</div>
                  <div className="text-gray-600">Strong confidence</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="font-semibold text-blue-700">Moderate (4-6)</div>
                  <div className="text-gray-600">Worth exploring</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="font-semibold text-orange-700">Marginal (1-3)</div>
                  <div className="text-gray-600">Low priority</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="font-semibold text-red-700">Low (≤0)</div>
                  <div className="text-gray-600">Avoid</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {opportunities.map((opportunity, index) => (
          <OpportunityScoringCard
            key={opportunity.opportunity.id}
            opportunity={opportunity}
            rank={index + 1}
            soccItems={soccItems}
            onScore={(score) => handleScore(opportunity.opportunity.id, score)}
            onDeleteScore={() => handleDeleteScore(opportunity.opportunity.id)}
          />
        ))}
      </div>
    </div>
  );
}
