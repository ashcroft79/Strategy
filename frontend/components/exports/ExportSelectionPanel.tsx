"use client";

import React, { useState, useEffect } from "react";
import {
  ExportElementSelection,
  AudiencePreset,
  AUDIENCE_PRESETS,
  PRESET_DESCRIPTIONS,
  DEFAULT_EXPORT_SELECTION,
  cloneSelection,
  getEnabledTiers,
} from "@/types/export-selection";
import { TierSelectionAccordion } from "./TierSelectionAccordion";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import { ChevronDown, ChevronUp, Settings2, Layers } from "lucide-react";
import type { StrategyPyramid } from "@/types/pyramid";

interface ExportSelectionPanelProps {
  /** Current selection state */
  selection: ExportElementSelection;
  /** Callback when selection changes */
  onSelectionChange: (selection: ExportElementSelection) => void;
  /** Pyramid data for showing available items */
  pyramid: StrategyPyramid;
  /** Whether the panel is in loading state */
  isLoading?: boolean;
}

export const ExportSelectionPanel: React.FC<ExportSelectionPanelProps> = ({
  selection,
  onSelectionChange,
  pyramid,
  isLoading = false,
}) => {
  const [mode, setMode] = useState<"preset" | "custom">("preset");
  const [selectedPreset, setSelectedPreset] = useState<AudiencePreset>("leadership");
  const [showCustomize, setShowCustomize] = useState(false);

  // Determine current preset if selection matches one
  useEffect(() => {
    // Check if current selection matches a preset
    const matchingPreset = (Object.keys(AUDIENCE_PRESETS) as AudiencePreset[]).find(
      (presetName) => {
        if (presetName === "custom") return false;
        const preset = AUDIENCE_PRESETS[presetName];
        if (!preset) return false;
        // Simple comparison of enabled tiers
        const selectionTiers = getEnabledTiers(selection).sort().join(",");
        const presetTiers = getEnabledTiers(preset).sort().join(",");
        return selectionTiers === presetTiers;
      }
    );
    if (matchingPreset && mode === "preset") {
      setSelectedPreset(matchingPreset);
    }
  }, [selection, mode]);

  const handlePresetChange = (preset: AudiencePreset) => {
    setSelectedPreset(preset);
    setMode("preset");
    const presetSelection = AUDIENCE_PRESETS[preset];
    if (presetSelection) {
      onSelectionChange(cloneSelection(presetSelection));
    }
  };

  const handleCustomize = () => {
    setMode("custom");
    setShowCustomize(true);
  };

  const handleResetToPreset = () => {
    setMode("preset");
    setShowCustomize(false);
    const presetSelection = AUDIENCE_PRESETS[selectedPreset];
    if (presetSelection) {
      onSelectionChange(cloneSelection(presetSelection));
    }
  };

  const enabledTiers = getEnabledTiers(selection);

  return (
    <div className="space-y-4">
      {/* Preset Selection */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Audience Preset
          </h3>
          {mode === "custom" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetToPreset}
              className="text-sm"
            >
              Reset to Preset
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(["executive", "leadership", "detailed", "team"] as AudiencePreset[]).map(
            (preset) => (
              <button
                key={preset}
                onClick={() => handlePresetChange(preset)}
                disabled={isLoading}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  selectedPreset === preset && mode === "preset"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="font-semibold text-gray-800 capitalize">
                  {preset}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {preset === "executive" && "High-level summary"}
                  {preset === "leadership" && "Comprehensive view"}
                  {preset === "detailed" && "Complete documentation"}
                  {preset === "team" && "Team cascade focus"}
                </div>
              </button>
            )
          )}
        </div>

        {/* Preset description */}
        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <strong className="text-gray-700">{selectedPreset}:</strong>{" "}
          {PRESET_DESCRIPTIONS[selectedPreset]}
        </div>

        {/* Quick summary of what's included */}
        <div className="mt-3 flex flex-wrap gap-2">
          {enabledTiers.map((tier) => (
            <span
              key={tier}
              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
            >
              {tier.replace("_", " ")}
            </span>
          ))}
          {enabledTiers.length === 0 && (
            <span className="text-gray-400 text-sm">No tiers selected</span>
          )}
        </div>
      </div>

      {/* Customize Toggle */}
      <button
        onClick={() => setShowCustomize(!showCustomize)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <span className="flex items-center gap-2 text-gray-700 font-medium">
          <Settings2 className="w-4 h-4" />
          Customize Selection
          {mode === "custom" && (
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
              Modified
            </span>
          )}
        </span>
        {showCustomize ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* Custom Selection Accordion */}
      {showCustomize && (
        <div className="card border-2 border-primary/20">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-1">
              Fine-tune Your Export
            </h4>
            <p className="text-sm text-gray-500">
              Select specific elements to include or exclude from your export.
            </p>
          </div>

          <TierSelectionAccordion
            selection={selection}
            onChange={(newSelection) => {
              setMode("custom");
              onSelectionChange(newSelection);
            }}
            pyramid={pyramid}
          />
        </div>
      )}
    </div>
  );
};

export default ExportSelectionPanel;
