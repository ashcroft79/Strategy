"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contextApi, type StrategicTension, type CommonTension } from "@/lib/api-client";
import { usePyramidStore } from "@/lib/store";
import { TensionCard } from "./TensionCard";
import { Button } from "@/components/ui/Button";
import { AlertCircle, Plus, Lightbulb, Scale } from "lucide-react";
import Modal from "@/components/ui/Modal";

export function StrategicTensions() {
  const { sessionId } = usePyramidStore();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Form state
  const [leftPole, setLeftPole] = useState("");
  const [rightPole, setRightPole] = useState("");

  // Fetch tensions
  const { data: tensionData, isLoading } = useQuery({
    queryKey: ["tensions", sessionId],
    queryFn: () => contextApi.getTensions(sessionId),
    enabled: !!sessionId,
  });

  // Fetch common tension templates
  const { data: templatesData } = useQuery({
    queryKey: ["common-tensions"],
    queryFn: () => contextApi.getCommonTensions(),
  });

  // Add tension mutation
  const addMutation = useMutation({
    mutationFn: (tension: Partial<StrategicTension>) => contextApi.addTension(sessionId, tension),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tensions", sessionId] });
      setShowAddModal(false);
      resetForm();
    },
  });

  // Update tension mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, tension }: { id: string; tension: Partial<StrategicTension> }) =>
      contextApi.updateTension(sessionId, id, tension),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tensions", sessionId] });
    },
  });

  // Delete tension mutation
  const deleteMutation = useMutation({
    mutationFn: (tensionId: string) => contextApi.deleteTension(sessionId, tensionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tensions", sessionId] });
    },
  });

  const resetForm = () => {
    setLeftPole("");
    setRightPole("");
  };

  const handleAddTension = () => {
    if (!leftPole.trim() || !rightPole.trim()) return;

    addMutation.mutate({
      name: `${leftPole} vs. ${rightPole}`,
      left_pole: leftPole,
      right_pole: rightPole,
      current_position: 50,
      target_position: 50,
      rationale: "",
      created_by: "user", // TODO: Get from auth
    });
  };

  const handleUseTemplate = (template: CommonTension) => {
    setLeftPole(template.left_pole);
    setRightPole(template.right_pole);
    setShowTemplates(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading strategic tensions...</div>
      </div>
    );
  }

  const tensions = tensionData?.tensions || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Strategic Tensions</h2>
        <p className="text-gray-600 mb-4">
          Identify key trade-offs and map your current vs. desired position. Great strategy requires conscious choices
          about where to position yourself.
        </p>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">About Strategic Tensions</h4>
              <p className="text-sm text-blue-800 mb-2">
                Strategic tensions are opposing forces that require careful balance. Rather than being "problems" to
                solve, they're ongoing trade-offs to manage deliberately.
              </p>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-white rounded p-2">
                  <div className="font-semibold text-blue-700">Growth vs. Profitability</div>
                  <div className="text-gray-600">Invest for future or maximize current returns?</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="font-semibold text-blue-700">Speed vs. Quality</div>
                  <div className="text-gray-600">Ship fast or build it right?</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="font-semibold text-blue-700">Innovation vs. Execution</div>
                  <div className="text-gray-600">Explore new ideas or deliver existing plans?</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{tensions.length}</div>
            <div className="text-sm text-gray-600">Tensions Identified</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">
              {tensions.filter((t) => Math.abs(t.current_position - t.target_position) > 20).length}
            </div>
            <div className="text-sm text-gray-600">Require Significant Shifts</div>
          </div>
        </div>

        {/* Add Tension Button */}
        <div className="flex gap-2">
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Tension
          </Button>
          <Button variant="outline" onClick={() => setShowTemplates(!showTemplates)}>
            <Scale className="w-4 h-4 mr-1" />
            Use Template
          </Button>
        </div>

        {/* Template Selector */}
        {showTemplates && templatesData?.common_tensions && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Common Tension Templates</h4>
            <div className="grid grid-cols-2 gap-2">
              {templatesData.common_tensions.map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUseTemplate(template)}
                  className="text-left p-3 bg-white border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-sm text-gray-900">
                    {template.left_pole} vs. {template.right_pole}
                  </div>
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowTemplates(false)} className="mt-3">
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Tensions List */}
      {tensions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Scale className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Strategic Tensions Identified</h3>
          <p className="text-gray-600 text-center max-w-md mb-4">
            Strategic tensions are trade-offs you need to navigate. Add your first tension to map where you are and
            where you want to be.
          </p>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add First Tension
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tensions.map((tension) => (
            <TensionCard
              key={tension.id}
              tension={tension}
              onUpdate={(updated) => updateMutation.mutate({ id: tension.id, tension: updated })}
              onDelete={() => deleteMutation.mutate(tension.id)}
            />
          ))}
        </div>
      )}

      {/* Add Tension Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Strategic Tension">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Left Pole</label>
            <input
              type="text"
              value={leftPole}
              onChange={(e) => setLeftPole(e.target.value)}
              placeholder="e.g., Growth, Speed, Innovation"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">The first option in the trade-off</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Right Pole</label>
            <input
              type="text"
              value={rightPole}
              onChange={(e) => setRightPole(e.target.value)}
              placeholder="e.g., Profitability, Quality, Execution"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">The opposing option in the trade-off</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            Preview: <span className="font-semibold">{leftPole || "..."} vs. {rightPole || "..."}</span>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAddTension} disabled={!leftPole.trim() || !rightPole.trim()}>
              Add Tension
            </Button>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
