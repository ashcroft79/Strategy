"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contextApi, type Stakeholder } from "@/lib/api-client";
import { usePyramidStore } from "@/lib/store";
import { StakeholderCard } from "./StakeholderCard";
import { AddStakeholderModal } from "./AddStakeholderModal";
import { Button } from "@/components/ui/Button";
import { Users, Plus, Lightbulb } from "lucide-react";

export function StakeholderMapping() {
  const { sessionId } = usePyramidStore();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch stakeholders
  const { data: stakeholderData, isLoading } = useQuery({
    queryKey: ["stakeholders", sessionId],
    queryFn: () => contextApi.getStakeholders(sessionId),
    enabled: !!sessionId,
  });

  // Add stakeholder mutation
  const addMutation = useMutation({
    mutationFn: (stakeholder: Partial<Stakeholder>) => contextApi.addStakeholder(sessionId, stakeholder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stakeholders", sessionId] });
      setShowAddModal(false);
    },
  });

  // Update stakeholder mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, stakeholder }: { id: string; stakeholder: Partial<Stakeholder> }) =>
      contextApi.updateStakeholder(sessionId, id, stakeholder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stakeholders", sessionId] });
    },
  });

  // Delete stakeholder mutation
  const deleteMutation = useMutation({
    mutationFn: (stakeholderId: string) => contextApi.deleteStakeholder(sessionId, stakeholderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stakeholders", sessionId] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading stakeholders...</div>
      </div>
    );
  }

  const stakeholders = stakeholderData?.stakeholders || [];

  // Group stakeholders by quadrant
  const getQuadrant = (stakeholder: Stakeholder): string => {
    if (stakeholder.interest_level === "high" && stakeholder.influence_level === "high") {
      return "key_players";
    } else if (stakeholder.interest_level === "low" && stakeholder.influence_level === "high") {
      return "keep_satisfied";
    } else if (stakeholder.interest_level === "high" && stakeholder.influence_level === "low") {
      return "keep_informed";
    } else {
      return "monitor";
    }
  };

  const keyPlayers = stakeholders.filter((s) => getQuadrant(s) === "key_players");
  const keepSatisfied = stakeholders.filter((s) => getQuadrant(s) === "keep_satisfied");
  const keepInformed = stakeholders.filter((s) => getQuadrant(s) === "keep_informed");
  const monitor = stakeholders.filter((s) => getQuadrant(s) === "monitor");

  const handleMoveStakeholder = (stakeholderId: string, newInterest: "high" | "low", newInfluence: "high" | "low") => {
    updateMutation.mutate({
      id: stakeholderId,
      stakeholder: {
        interest_level: newInterest,
        influence_level: newInfluence,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Stakeholder Mapping</h2>
        <p className="text-gray-600 mb-4">
          Map stakeholders by their level of interest and influence to plan appropriate engagement strategies.
        </p>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Stakeholder Engagement Strategy</h4>
              <p className="text-sm text-blue-800 mb-2">
                Different stakeholder groups require different levels of engagement based on their interest and
                influence.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white rounded p-2">
                  <div className="font-semibold text-green-700">Key Players (High Interest + High Influence)</div>
                  <div className="text-gray-600">Engage closely and make efforts to satisfy</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="font-semibold text-blue-700">Keep Satisfied (Low Interest + High Influence)</div>
                  <div className="text-gray-600">Put in enough work to keep them satisfied</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="font-semibold text-orange-700">Keep Informed (High Interest + Low Influence)</div>
                  <div className="text-gray-600">Keep adequately informed, talk to them</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="font-semibold text-gray-700">Monitor (Low Interest + Low Influence)</div>
                  <div className="text-gray-600">Monitor with minimum effort</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{keyPlayers.length}</div>
            <div className="text-sm text-gray-600">Key Players</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{keepSatisfied.length}</div>
            <div className="text-sm text-gray-600">Keep Satisfied</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">{keepInformed.length}</div>
            <div className="text-sm text-gray-600">Keep Informed</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-600">{monitor.length}</div>
            <div className="text-sm text-gray-600">Monitor</div>
          </div>
        </div>

        {/* Add Stakeholder Button */}
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Add Stakeholder
        </Button>
      </div>

      {/* 2x2 Matrix */}
      <div className="space-y-6">
        {/* Y-axis label */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-700 transform -rotate-90 origin-center -ml-6">
            ← Influence →
          </div>
          <div className="flex-1" />
        </div>

        <div className="grid grid-rows-2 gap-4 min-h-[600px]">
          {/* Top Row: High Influence */}
          <div className="grid grid-cols-2 gap-4">
            {/* Keep Satisfied (Low Interest, High Influence) */}
            <div className="border-2 border-blue-200 rounded-lg bg-blue-50 p-4 min-h-[280px]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-blue-900">Keep Satisfied</h3>
                  <p className="text-xs text-blue-700">Low Interest • High Influence</p>
                </div>
                <div className="px-2 py-1 bg-blue-200 text-blue-900 rounded-full text-xs font-semibold">
                  {keepSatisfied.length}
                </div>
              </div>
              <div className="space-y-2">
                {keepSatisfied.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-8">No stakeholders in this quadrant</div>
                ) : (
                  keepSatisfied.map((stakeholder) => (
                    <StakeholderCard
                      key={stakeholder.id}
                      stakeholder={stakeholder}
                      onUpdate={(updated) => updateMutation.mutate({ id: stakeholder.id, stakeholder: updated })}
                      onDelete={() => deleteMutation.mutate(stakeholder.id)}
                      onMove={handleMoveStakeholder}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Key Players (High Interest, High Influence) */}
            <div className="border-2 border-green-200 rounded-lg bg-green-50 p-4 min-h-[280px]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-green-900">Key Players</h3>
                  <p className="text-xs text-green-700">High Interest • High Influence</p>
                </div>
                <div className="px-2 py-1 bg-green-200 text-green-900 rounded-full text-xs font-semibold">
                  {keyPlayers.length}
                </div>
              </div>
              <div className="space-y-2">
                {keyPlayers.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-8">No stakeholders in this quadrant</div>
                ) : (
                  keyPlayers.map((stakeholder) => (
                    <StakeholderCard
                      key={stakeholder.id}
                      stakeholder={stakeholder}
                      onUpdate={(updated) => updateMutation.mutate({ id: stakeholder.id, stakeholder: updated })}
                      onDelete={() => deleteMutation.mutate(stakeholder.id)}
                      onMove={handleMoveStakeholder}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row: Low Influence */}
          <div className="grid grid-cols-2 gap-4">
            {/* Monitor (Low Interest, Low Influence) */}
            <div className="border-2 border-gray-200 rounded-lg bg-gray-50 p-4 min-h-[280px]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">Monitor</h3>
                  <p className="text-xs text-gray-700">Low Interest • Low Influence</p>
                </div>
                <div className="px-2 py-1 bg-gray-200 text-gray-900 rounded-full text-xs font-semibold">
                  {monitor.length}
                </div>
              </div>
              <div className="space-y-2">
                {monitor.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-8">No stakeholders in this quadrant</div>
                ) : (
                  monitor.map((stakeholder) => (
                    <StakeholderCard
                      key={stakeholder.id}
                      stakeholder={stakeholder}
                      onUpdate={(updated) => updateMutation.mutate({ id: stakeholder.id, stakeholder: updated })}
                      onDelete={() => deleteMutation.mutate(stakeholder.id)}
                      onMove={handleMoveStakeholder}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Keep Informed (High Interest, Low Influence) */}
            <div className="border-2 border-orange-200 rounded-lg bg-orange-50 p-4 min-h-[280px]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-orange-900">Keep Informed</h3>
                  <p className="text-xs text-orange-700">High Interest • Low Influence</p>
                </div>
                <div className="px-2 py-1 bg-orange-200 text-orange-900 rounded-full text-xs font-semibold">
                  {keepInformed.length}
                </div>
              </div>
              <div className="space-y-2">
                {keepInformed.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-8">No stakeholders in this quadrant</div>
                ) : (
                  keepInformed.map((stakeholder) => (
                    <StakeholderCard
                      key={stakeholder.id}
                      stakeholder={stakeholder}
                      onUpdate={(updated) => updateMutation.mutate({ id: stakeholder.id, stakeholder: updated })}
                      onDelete={() => deleteMutation.mutate(stakeholder.id)}
                      onMove={handleMoveStakeholder}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* X-axis label */}
        <div className="text-center text-sm font-semibold text-gray-700">← Interest →</div>
      </div>

      {/* Add Stakeholder Modal */}
      <AddStakeholderModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(stakeholder) => addMutation.mutate({ ...stakeholder, created_by: "user" })}
      />
    </div>
  );
}
