"use client";

import React, { useState } from "react";
import {
  ExportElementSelection,
  cloneSelection,
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
import type { StrategyPyramid } from "@/types/pyramid";

interface TierSelectionAccordionProps {
  selection: ExportElementSelection;
  onChange: (selection: ExportElementSelection) => void;
  pyramid: StrategyPyramid;
}

interface TierSectionProps {
  title: string;
  icon: React.ReactNode;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children: React.ReactNode;
  count?: number;
  color?: string;
}

const TierSection: React.FC<TierSectionProps> = ({
  title,
  icon,
  enabled,
  onToggle,
  children,
  count,
  color = "gray",
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border rounded-lg ${enabled ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(!enabled);
            }}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              enabled
                ? "bg-primary border-primary text-white"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {enabled && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          <span className={`text-${color}-600`}>{icon}</span>
          <span className="font-medium text-gray-800">{title}</span>
          {count !== undefined && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {count}
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </div>
      {expanded && enabled && (
        <div className="px-3 pb-3 pt-1 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
};

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  description,
}) => (
  <label className="flex items-start gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded px-1">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
    />
    <div>
      <span className="text-sm text-gray-700">{label}</span>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  </label>
);

export const TierSelectionAccordion: React.FC<TierSelectionAccordionProps> = ({
  selection,
  onChange,
  pyramid,
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

  return (
    <div className="space-y-2">
      {/* Foundation (Vision/Mission) */}
      <TierSection
        title="Foundation"
        icon={<Eye className="w-4 h-4" />}
        enabled={selection.foundation.enabled}
        onToggle={(enabled) =>
          onChange(updateSelection(["foundation", "enabled"], enabled))
        }
        count={pyramid.vision?.statements.length || 0}
        color="purple"
      >
        <div className="space-y-1">
          <p className="text-xs text-gray-500 mb-2">Statement types to include:</p>
          {(["vision", "mission", "purpose", "belief", "passion", "aspiration"] as const).map(
            (type) => (
              <Checkbox
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
      </TierSection>

      {/* Values */}
      <TierSection
        title="Values"
        icon={<Heart className="w-4 h-4" />}
        enabled={selection.values.enabled}
        onToggle={(enabled) =>
          onChange(updateSelection(["values", "enabled"], enabled))
        }
        count={pyramid.values.length}
        color="teal"
      >
        <Checkbox
          label="Include descriptions"
          checked={selection.values.includeDescriptions}
          onChange={(checked) =>
            onChange(updateSelection(["values", "includeDescriptions"], checked))
          }
          description="Show value descriptions in export"
        />
      </TierSection>

      {/* Behaviours */}
      <TierSection
        title="Behaviours"
        icon={<Users className="w-4 h-4" />}
        enabled={selection.behaviours.enabled}
        onToggle={(enabled) =>
          onChange(updateSelection(["behaviours", "enabled"], enabled))
        }
        count={pyramid.behaviours.length}
        color="cyan"
      >
        <Checkbox
          label="Group by value"
          checked={selection.behaviours.groupByValue}
          onChange={(checked) =>
            onChange(updateSelection(["behaviours", "groupByValue"], checked))
          }
          description="Group behaviours under their associated values"
        />
      </TierSection>

      {/* Strategic Drivers */}
      <TierSection
        title="Strategic Drivers"
        icon={<Compass className="w-4 h-4" />}
        enabled={selection.drivers.enabled}
        onToggle={(enabled) =>
          onChange(updateSelection(["drivers", "enabled"], enabled))
        }
        count={pyramid.strategic_drivers.length}
        color="red"
      >
        <div className="space-y-1">
          <Checkbox
            label="Include descriptions"
            checked={selection.drivers.includeDescriptions}
            onChange={(checked) =>
              onChange(
                updateSelection(["drivers", "includeDescriptions"], checked)
              )
            }
          />
          <Checkbox
            label="Include rationale"
            checked={selection.drivers.includeRationale}
            onChange={(checked) =>
              onChange(updateSelection(["drivers", "includeRationale"], checked))
            }
            description="Show why each driver was chosen"
          />

          {/* Individual driver selection */}
          {pyramid.strategic_drivers.length > 0 && (
            <div className="mt-3 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Select specific drivers:</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {pyramid.strategic_drivers.map((driver) => {
                  const isSelected =
                    !selection.drivers.selectedIds ||
                    selection.drivers.selectedIds.includes(driver.id);
                  return (
                    <Checkbox
                      key={driver.id}
                      label={driver.name}
                      checked={isSelected}
                      onChange={(checked) => {
                        let newIds: string[] | undefined;
                        if (checked) {
                          // Add to selection or clear filter
                          if (selection.drivers.selectedIds) {
                            newIds = [...selection.drivers.selectedIds, driver.id];
                            // If all are selected, clear the filter
                            if (newIds.length === pyramid.strategic_drivers.length) {
                              newIds = undefined;
                            }
                          } else {
                            newIds = undefined;
                          }
                        } else {
                          // Remove from selection
                          if (selection.drivers.selectedIds) {
                            newIds = selection.drivers.selectedIds.filter(
                              (id) => id !== driver.id
                            );
                          } else {
                            // Create filter with all except this one
                            newIds = pyramid.strategic_drivers
                              .filter((d) => d.id !== driver.id)
                              .map((d) => d.id);
                          }
                        }
                        onChange(
                          updateSelection(["drivers", "selectedIds"], newIds)
                        );
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </TierSection>

      {/* Strategic Intents */}
      <TierSection
        title="Strategic Intents"
        icon={<Flag className="w-4 h-4" />}
        enabled={selection.intents.enabled}
        onToggle={(enabled) =>
          onChange(updateSelection(["intents", "enabled"], enabled))
        }
        count={pyramid.strategic_intents.length}
        color="purple"
      >
        <div className="space-y-1">
          <Checkbox
            label="Filter by selected drivers"
            checked={selection.intents.filterByDrivers}
            onChange={(checked) =>
              onChange(updateSelection(["intents", "filterByDrivers"], checked))
            }
            description="Only show intents for drivers included above"
          />
          <Checkbox
            label="Include boldness score"
            checked={selection.intents.includeBoldnessScore}
            onChange={(checked) =>
              onChange(
                updateSelection(["intents", "includeBoldnessScore"], checked)
              )
            }
          />
        </div>
      </TierSection>

      {/* Enablers */}
      <TierSection
        title="Enablers"
        icon={<Cog className="w-4 h-4" />}
        enabled={selection.enablers.enabled}
        onToggle={(enabled) =>
          onChange(updateSelection(["enablers", "enabled"], enabled))
        }
        count={pyramid.enablers.length}
        color="slate"
      >
        <div className="space-y-1">
          <Checkbox
            label="Include descriptions"
            checked={selection.enablers.includeDescriptions}
            onChange={(checked) =>
              onChange(
                updateSelection(["enablers", "includeDescriptions"], checked)
              )
            }
          />
          <Checkbox
            label="Group by type"
            checked={selection.enablers.groupByType}
            onChange={(checked) =>
              onChange(updateSelection(["enablers", "groupByType"], checked))
            }
            description="Group enablers by their type (System, Capability, etc.)"
          />
          <Checkbox
            label="Filter by selected drivers"
            checked={selection.enablers.filterByDrivers}
            onChange={(checked) =>
              onChange(
                updateSelection(["enablers", "filterByDrivers"], checked)
              )
            }
          />
        </div>
      </TierSection>

      {/* Iconic Commitments */}
      <TierSection
        title="Iconic Commitments"
        icon={<CheckCircle className="w-4 h-4" />}
        enabled={selection.commitments.enabled}
        onToggle={(enabled) =>
          onChange(updateSelection(["commitments", "enabled"], enabled))
        }
        count={pyramid.iconic_commitments.length}
        color="blue"
      >
        <div className="space-y-2">
          {/* Horizon selection */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Horizons:</p>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
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
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-green-700 font-medium">H1</span>
                <span className="text-xs text-gray-500">(0-12mo)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
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
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-blue-700 font-medium">H2</span>
                <span className="text-xs text-gray-500">(12-24mo)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
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
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-orange-700 font-medium">H3</span>
                <span className="text-xs text-gray-500">(24-36mo)</span>
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <Checkbox
              label="Include descriptions"
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
            <Checkbox
              label="Include target dates"
              checked={selection.commitments.includeTargetDates}
              onChange={(checked) =>
                onChange(
                  updateSelection(["commitments", "includeTargetDates"], checked)
                )
              }
            />
            <Checkbox
              label="Include owners"
              checked={selection.commitments.includeOwners}
              onChange={(checked) =>
                onChange(
                  updateSelection(["commitments", "includeOwners"], checked)
                )
              }
            />
            <Checkbox
              label="Include metrics"
              checked={selection.commitments.includeMetrics}
              onChange={(checked) =>
                onChange(
                  updateSelection(["commitments", "includeMetrics"], checked)
                )
              }
              description="Show is_time_bound, is_tangible, is_measurable flags"
            />
            <Checkbox
              label="Filter by selected drivers"
              checked={selection.commitments.filterByDrivers}
              onChange={(checked) =>
                onChange(
                  updateSelection(["commitments", "filterByDrivers"], checked)
                )
              }
            />
          </div>
        </div>
      </TierSection>

      {/* Team Objectives */}
      <TierSection
        title="Team Objectives"
        icon={<Target className="w-4 h-4" />}
        enabled={selection.teamObjectives.enabled}
        onToggle={(enabled) =>
          onChange(updateSelection(["teamObjectives", "enabled"], enabled))
        }
        count={pyramid.team_objectives.length}
        color="teal"
      >
        <div className="space-y-1">
          <Checkbox
            label="Include descriptions"
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
          <Checkbox
            label="Include metrics"
            checked={selection.teamObjectives.includeMetrics}
            onChange={(checked) =>
              onChange(
                updateSelection(["teamObjectives", "includeMetrics"], checked)
              )
            }
          />
          <Checkbox
            label="Include owners"
            checked={selection.teamObjectives.includeOwners}
            onChange={(checked) =>
              onChange(
                updateSelection(["teamObjectives", "includeOwners"], checked)
              )
            }
          />
          <Checkbox
            label="Filter by selected commitments"
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
      </TierSection>

      {/* Individual Objectives */}
      <TierSection
        title="Individual Objectives"
        icon={<User className="w-4 h-4" />}
        enabled={selection.individualObjectives.enabled}
        onToggle={(enabled) =>
          onChange(updateSelection(["individualObjectives", "enabled"], enabled))
        }
        count={pyramid.individual_objectives.length}
        color="gray"
      >
        <div className="space-y-1">
          <Checkbox
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
          <Checkbox
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
          <Checkbox
            label="Filter by selected team objectives"
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
      </TierSection>

      {/* Supplementary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Supplementary Elements
        </h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <Checkbox
            label="Cover page"
            checked={selection.supplementary.coverPage}
            onChange={(checked) =>
              onChange(updateSelection(["supplementary", "coverPage"], checked))
            }
          />
          <Checkbox
            label="Table of contents"
            checked={selection.supplementary.tableOfContents}
            onChange={(checked) =>
              onChange(
                updateSelection(["supplementary", "tableOfContents"], checked)
              )
            }
          />
          <Checkbox
            label="Distribution analysis"
            checked={selection.supplementary.distribution}
            onChange={(checked) =>
              onChange(
                updateSelection(["supplementary", "distribution"], checked)
              )
            }
          />
          <Checkbox
            label="Metadata"
            checked={selection.supplementary.metadata}
            onChange={(checked) =>
              onChange(updateSelection(["supplementary", "metadata"], checked))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default TierSelectionAccordion;
