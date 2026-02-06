"use client";

import React, { useState } from "react";
import {
  ExportElementSelection,
  cloneSelection,
  getEnabledTiers,
  AudiencePreset,
  PRESET_DESCRIPTIONS,
  EXECUTIVE_PRESET,
  LEADERSHIP_PRESET,
  DETAILED_PRESET,
  TEAM_PRESET,
} from "@/types/export-selection";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  Heart,
  Users,
  Compass,
  Flag,
  Cog,
  CheckCircle,
  Target,
  User,
} from "lucide-react";

interface BlueprintFilterPanelProps {
  selection: ExportElementSelection;
  onChange: (selection: ExportElementSelection) => void;
  selectedPreset: AudiencePreset;
  onPresetChange: (preset: AudiencePreset) => void;
}

interface CompactTierSectionProps {
  title: string;
  icon: React.ReactNode;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children?: React.ReactNode;
  color?: string;
}

const CompactTierSection: React.FC<CompactTierSectionProps> = ({
  title,
  icon,
  enabled,
  onToggle,
  children,
  color = "gray",
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = React.Children.count(children) > 0;

  return (
    <div className={`border rounded-lg ${enabled ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
      <div
        className={`flex items-center justify-between p-2 ${hasChildren ? "cursor-pointer hover:bg-gray-50" : ""}`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(!enabled);
            }}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
              enabled
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {enabled && (
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          <span className={`text-${color}-600`}>{icon}</span>
          <span className="text-sm font-medium text-gray-800">{title}</span>
        </div>
        {hasChildren && (
          expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          )
        )}
      </div>
      {expanded && enabled && hasChildren && (
        <div className="px-2 pb-2 pt-1 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
};

interface CompactCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CompactCheckbox: React.FC<CompactCheckboxProps> = ({
  label,
  checked,
  onChange,
}) => (
  <label className="flex items-center gap-1.5 py-0.5 cursor-pointer hover:bg-gray-50 rounded px-1 text-xs">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <span className="text-gray-700">{label}</span>
  </label>
);

export const BlueprintFilterPanel: React.FC<BlueprintFilterPanelProps> = ({
  selection,
  onChange,
  selectedPreset,
  onPresetChange,
}) => {
  const updateSelection = (
    path: string[],
    value: any
  ): ExportElementSelection => {
    const newSelection = cloneSelection(selection);
    let current: any = newSelection;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    return newSelection;
  };

  const applyPreset = (preset: AudiencePreset) => {
    onPresetChange(preset);
    if (preset === "executive") onChange(cloneSelection(EXECUTIVE_PRESET));
    else if (preset === "leadership") onChange(cloneSelection(LEADERSHIP_PRESET));
    else if (preset === "detailed") onChange(cloneSelection(DETAILED_PRESET));
    else if (preset === "team") onChange(cloneSelection(TEAM_PRESET));
  };

  const enabledTiers = getEnabledTiers(selection);

  return (
    <div className="w-96 max-h-[80vh] overflow-y-auto">
      {/* Audience Preset Section */}
      <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Audience Preset</div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {(["executive", "leadership", "detailed", "team"] as AudiencePreset[]).map((preset) => (
          <button
            key={preset}
            onClick={() => applyPreset(preset)}
            className={`p-2 rounded-lg border-2 text-left transition-all ${
              selectedPreset === preset
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="font-semibold text-gray-800 capitalize text-sm">{preset}</div>
            <div className="text-xs text-gray-500 mt-0.5">
              {preset === "executive" && "High-level summary"}
              {preset === "leadership" && "Comprehensive view"}
              {preset === "detailed" && "Full documentation"}
              {preset === "team" && "Team cascade focus"}
            </div>
          </button>
        ))}
      </div>

      {/* Preset Description */}
      <div className="p-2 bg-gray-50 rounded-lg text-xs text-gray-600 mb-3">
        <span className="font-medium text-gray-700 capitalize">{selectedPreset}:</span>{" "}
        {PRESET_DESCRIPTIONS[selectedPreset]?.slice(0, 100)}...
      </div>

      {/* Enabled Tiers Pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {enabledTiers.map((tier) => (
          <span
            key={tier}
            className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
          >
            {tier.replace(/([A-Z])/g, ' $1').trim()}
          </span>
        ))}
        {enabledTiers.length === 0 && (
          <span className="text-gray-400 text-xs">No tiers selected</span>
        )}
      </div>

      {/* Tier Sections */}
      <div className="border-t border-gray-200 pt-3 mb-2">
        <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Customize Tiers</div>
      </div>

      <div className="space-y-1.5">
        {/* Foundation */}
        <CompactTierSection
          title="Foundation"
          icon={<Eye className="w-3.5 h-3.5" />}
          enabled={selection.foundation.enabled}
          onToggle={(enabled) =>
            onChange(updateSelection(["foundation", "enabled"], enabled))
          }
          color="purple"
        >
          <div className="grid grid-cols-2 gap-x-2">
            {(["vision", "mission", "purpose", "belief", "passion", "aspiration"] as const).map(
              (type) => (
                <CompactCheckbox
                  key={type}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                  checked={selection.foundation.statementTypes[type]}
                  onChange={(checked) =>
                    onChange(
                      updateSelection(
                        ["foundation", "statementTypes", type],
                        checked
                      )
                    )
                  }
                />
              )
            )}
          </div>
        </CompactTierSection>

        {/* Values */}
        <CompactTierSection
          title="Values"
          icon={<Heart className="w-3.5 h-3.5" />}
          enabled={selection.values.enabled}
          onToggle={(enabled) =>
            onChange(updateSelection(["values", "enabled"], enabled))
          }
          color="teal"
        >
          <CompactCheckbox
            label="Include descriptions"
            checked={selection.values.includeDescriptions}
            onChange={(checked) =>
              onChange(updateSelection(["values", "includeDescriptions"], checked))
            }
          />
        </CompactTierSection>

        {/* Behaviours */}
        <CompactTierSection
          title="Behaviours"
          icon={<Users className="w-3.5 h-3.5" />}
          enabled={selection.behaviours.enabled}
          onToggle={(enabled) =>
            onChange(updateSelection(["behaviours", "enabled"], enabled))
          }
          color="cyan"
        >
          <CompactCheckbox
            label="Group by value"
            checked={selection.behaviours.groupByValue}
            onChange={(checked) =>
              onChange(updateSelection(["behaviours", "groupByValue"], checked))
            }
          />
        </CompactTierSection>

        {/* Strategic Drivers */}
        <CompactTierSection
          title="Strategic Drivers"
          icon={<Compass className="w-3.5 h-3.5" />}
          enabled={selection.drivers.enabled}
          onToggle={(enabled) =>
            onChange(updateSelection(["drivers", "enabled"], enabled))
          }
          color="red"
        >
          <div className="space-y-0.5">
            <CompactCheckbox
              label="Include descriptions"
              checked={selection.drivers.includeDescriptions}
              onChange={(checked) =>
                onChange(
                  updateSelection(["drivers", "includeDescriptions"], checked)
                )
              }
            />
            <CompactCheckbox
              label="Include rationale"
              checked={selection.drivers.includeRationale}
              onChange={(checked) =>
                onChange(updateSelection(["drivers", "includeRationale"], checked))
              }
            />
          </div>
        </CompactTierSection>

        {/* Strategic Intents */}
        <CompactTierSection
          title="Strategic Intents"
          icon={<Flag className="w-3.5 h-3.5" />}
          enabled={selection.intents.enabled}
          onToggle={(enabled) =>
            onChange(updateSelection(["intents", "enabled"], enabled))
          }
          color="purple"
        >
          <div className="space-y-0.5">
            <CompactCheckbox
              label="Filter by drivers"
              checked={selection.intents.filterByDrivers}
              onChange={(checked) =>
                onChange(updateSelection(["intents", "filterByDrivers"], checked))
              }
            />
            <CompactCheckbox
              label="Include boldness score"
              checked={selection.intents.includeBoldnessScore}
              onChange={(checked) =>
                onChange(
                  updateSelection(["intents", "includeBoldnessScore"], checked)
                )
              }
            />
          </div>
        </CompactTierSection>

        {/* Enablers */}
        <CompactTierSection
          title="Enablers"
          icon={<Cog className="w-3.5 h-3.5" />}
          enabled={selection.enablers.enabled}
          onToggle={(enabled) =>
            onChange(updateSelection(["enablers", "enabled"], enabled))
          }
          color="slate"
        >
          <div className="space-y-0.5">
            <CompactCheckbox
              label="Include descriptions"
              checked={selection.enablers.includeDescriptions}
              onChange={(checked) =>
                onChange(
                  updateSelection(["enablers", "includeDescriptions"], checked)
                )
              }
            />
            <CompactCheckbox
              label="Group by type"
              checked={selection.enablers.groupByType}
              onChange={(checked) =>
                onChange(updateSelection(["enablers", "groupByType"], checked))
              }
            />
            <CompactCheckbox
              label="Filter by drivers"
              checked={selection.enablers.filterByDrivers}
              onChange={(checked) =>
                onChange(
                  updateSelection(["enablers", "filterByDrivers"], checked)
                )
              }
            />
          </div>
        </CompactTierSection>

        {/* Iconic Commitments */}
        <CompactTierSection
          title="Iconic Commitments"
          icon={<CheckCircle className="w-3.5 h-3.5" />}
          enabled={selection.commitments.enabled}
          onToggle={(enabled) =>
            onChange(updateSelection(["commitments", "enabled"], enabled))
          }
          color="blue"
        >
          <div className="space-y-2">
            {/* Horizon selection */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Horizons:</p>
              <div className="flex gap-2">
                <label className={`flex items-center gap-1 cursor-pointer px-2 py-1 rounded border-2 transition-all ${
                  selection.commitments.horizons.H1 ? "border-green-500 bg-green-50" : "border-gray-200"
                }`}>
                  <input
                    type="checkbox"
                    checked={selection.commitments.horizons.H1}
                    onChange={(e) =>
                      onChange(
                        updateSelection(
                          ["commitments", "horizons", "H1"],
                          e.target.checked
                        )
                      )
                    }
                    className="w-3 h-3 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-xs text-green-700 font-medium">H1</span>
                </label>
                <label className={`flex items-center gap-1 cursor-pointer px-2 py-1 rounded border-2 transition-all ${
                  selection.commitments.horizons.H2 ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}>
                  <input
                    type="checkbox"
                    checked={selection.commitments.horizons.H2}
                    onChange={(e) =>
                      onChange(
                        updateSelection(
                          ["commitments", "horizons", "H2"],
                          e.target.checked
                        )
                      )
                    }
                    className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-blue-700 font-medium">H2</span>
                </label>
                <label className={`flex items-center gap-1 cursor-pointer px-2 py-1 rounded border-2 transition-all ${
                  selection.commitments.horizons.H3 ? "border-orange-500 bg-orange-50" : "border-gray-200"
                }`}>
                  <input
                    type="checkbox"
                    checked={selection.commitments.horizons.H3}
                    onChange={(e) =>
                      onChange(
                        updateSelection(
                          ["commitments", "horizons", "H3"],
                          e.target.checked
                        )
                      )
                    }
                    className="w-3 h-3 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-xs text-orange-700 font-medium">H3</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-2">
              <CompactCheckbox
                label="Descriptions"
                checked={selection.commitments.includeDescriptions}
                onChange={(checked) =>
                  onChange(
                    updateSelection(
                      ["commitments", "includeDescriptions"],
                      checked
                    )
                  )
                }
              />
              <CompactCheckbox
                label="Target dates"
                checked={selection.commitments.includeTargetDates}
                onChange={(checked) =>
                  onChange(
                    updateSelection(["commitments", "includeTargetDates"], checked)
                  )
                }
              />
              <CompactCheckbox
                label="Owners"
                checked={selection.commitments.includeOwners}
                onChange={(checked) =>
                  onChange(
                    updateSelection(["commitments", "includeOwners"], checked)
                  )
                }
              />
              <CompactCheckbox
                label="Metrics"
                checked={selection.commitments.includeMetrics}
                onChange={(checked) =>
                  onChange(
                    updateSelection(["commitments", "includeMetrics"], checked)
                  )
                }
              />
            </div>
            <CompactCheckbox
              label="Filter by selected drivers"
              checked={selection.commitments.filterByDrivers}
              onChange={(checked) =>
                onChange(
                  updateSelection(["commitments", "filterByDrivers"], checked)
                )
              }
            />
          </div>
        </CompactTierSection>

        {/* Team Objectives */}
        <CompactTierSection
          title="Team Objectives"
          icon={<Target className="w-3.5 h-3.5" />}
          enabled={selection.teamObjectives.enabled}
          onToggle={(enabled) =>
            onChange(updateSelection(["teamObjectives", "enabled"], enabled))
          }
          color="teal"
        >
          <div className="grid grid-cols-2 gap-x-2">
            <CompactCheckbox
              label="Descriptions"
              checked={selection.teamObjectives.includeDescriptions}
              onChange={(checked) =>
                onChange(
                  updateSelection(
                    ["teamObjectives", "includeDescriptions"],
                    checked
                  )
                )
              }
            />
            <CompactCheckbox
              label="Metrics"
              checked={selection.teamObjectives.includeMetrics}
              onChange={(checked) =>
                onChange(
                  updateSelection(["teamObjectives", "includeMetrics"], checked)
                )
              }
            />
            <CompactCheckbox
              label="Owners"
              checked={selection.teamObjectives.includeOwners}
              onChange={(checked) =>
                onChange(
                  updateSelection(["teamObjectives", "includeOwners"], checked)
                )
              }
            />
            <CompactCheckbox
              label="Filter by commitments"
              checked={selection.teamObjectives.filterByCommitments}
              onChange={(checked) =>
                onChange(
                  updateSelection(
                    ["teamObjectives", "filterByCommitments"],
                    checked
                  )
                )
              }
            />
          </div>
        </CompactTierSection>

        {/* Individual Objectives */}
        <CompactTierSection
          title="Individual Objectives"
          icon={<User className="w-3.5 h-3.5" />}
          enabled={selection.individualObjectives.enabled}
          onToggle={(enabled) =>
            onChange(updateSelection(["individualObjectives", "enabled"], enabled))
          }
          color="gray"
        >
          <div className="space-y-0.5">
            <CompactCheckbox
              label="Include descriptions"
              checked={selection.individualObjectives.includeDescriptions}
              onChange={(checked) =>
                onChange(
                  updateSelection(
                    ["individualObjectives", "includeDescriptions"],
                    checked
                  )
                )
              }
            />
            <CompactCheckbox
              label="Include success criteria"
              checked={selection.individualObjectives.includeSuccessCriteria}
              onChange={(checked) =>
                onChange(
                  updateSelection(
                    ["individualObjectives", "includeSuccessCriteria"],
                    checked
                  )
                )
              }
            />
            <CompactCheckbox
              label="Filter by team objectives"
              checked={selection.individualObjectives.filterByTeamObjectives}
              onChange={(checked) =>
                onChange(
                  updateSelection(
                    ["individualObjectives", "filterByTeamObjectives"],
                    checked
                  )
                )
              }
            />
          </div>
        </CompactTierSection>
      </div>
    </div>
  );
};

export default BlueprintFilterPanel;
