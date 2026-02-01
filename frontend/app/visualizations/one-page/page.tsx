"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePyramidStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import StrategyOnePage from "@/components/visualizations/StrategyOnePage";
import StrategyOnePageLandscape from "@/components/visualizations/StrategyOnePageLandscape";
import StrategyOnePageCompact from "@/components/visualizations/StrategyOnePageCompact";
import { ArrowLeft, Printer, Download, FileText, Columns3, Columns, LayoutGrid, Settings, ChevronDown, FileOutput } from "lucide-react";
import "../../../styles/strategy-one-page.css";
import "../../../styles/strategy-landscape.css";
import "../../../styles/strategy-compact.css";
import {
  ExportElementSelection,
  DEFAULT_EXPORT_SELECTION,
  cloneSelection,
  getEnabledHorizons,
  getEnabledTiers,
  EXECUTIVE_PRESET,
  LEADERSHIP_PRESET,
  DETAILED_PRESET,
  TEAM_PRESET,
  AudiencePreset,
  PRESET_DESCRIPTIONS,
} from "@/types/export-selection";

type LayoutType = "portrait" | "landscape" | "compact";

// Legacy interface for backward compatibility with visualization components
interface TierSelection {
  vision: boolean;
  values: boolean;
  drivers: boolean;
  enablers: boolean;
  teamObjectives: boolean;
  individualObjectives: boolean;
}

// Extended interface with horizon filtering
interface ExtendedTierSelection extends TierSelection {
  horizons: {
    H1: boolean;
    H2: boolean;
    H3: boolean;
  };
}

// Convert ExportElementSelection to legacy TierSelection
function selectionToTierSelection(selection: ExportElementSelection): ExtendedTierSelection {
  return {
    vision: selection.foundation.enabled,
    values: selection.values.enabled,
    drivers: selection.drivers.enabled,
    enablers: selection.enablers.enabled,
    teamObjectives: selection.teamObjectives.enabled,
    individualObjectives: selection.individualObjectives.enabled,
    horizons: {
      H1: selection.commitments.horizons.H1,
      H2: selection.commitments.horizons.H2,
      H3: selection.commitments.horizons.H3,
    },
  };
}

function OnePageVisualizationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pyramid } = usePyramidStore();
  const [layout, setLayout] = useState<LayoutType>("portrait");
  const [showTierSelector, setShowTierSelector] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<AudiencePreset>(() => {
    const preset = searchParams.get("preset");
    if (preset === "executive" || preset === "leadership" || preset === "detailed" || preset === "team") {
      return preset;
    }
    return "leadership";
  });
  const [selection, setSelection] = useState<ExportElementSelection>(() => {
    // Check for preset from URL params
    const preset = searchParams.get("preset");
    if (preset === "executive") return cloneSelection(EXECUTIVE_PRESET);
    if (preset === "leadership") return cloneSelection(LEADERSHIP_PRESET);
    if (preset === "detailed") return cloneSelection(DETAILED_PRESET);
    if (preset === "team") return cloneSelection(TEAM_PRESET);
    return cloneSelection(DEFAULT_EXPORT_SELECTION);
  });

  // Convert to legacy format for visualization components
  const selectedTiers = selectionToTierSelection(selection);

  useEffect(() => {
    if (!pyramid) {
      router.push("/");
    }
  }, [pyramid, router]);

  if (!pyramid) {
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    // Simple approach: use browser's print to PDF
    window.print();
  };

  // Quick presets
  const applyPreset = (presetName: AudiencePreset) => {
    setSelectedPreset(presetName);
    if (presetName === "executive") setSelection(cloneSelection(EXECUTIVE_PRESET));
    else if (presetName === "leadership") setSelection(cloneSelection(LEADERSHIP_PRESET));
    else if (presetName === "detailed") setSelection(cloneSelection(DETAILED_PRESET));
    else if (presetName === "team") setSelection(cloneSelection(TEAM_PRESET));
    else setSelection(cloneSelection(DEFAULT_EXPORT_SELECTION));
  };

  // Get enabled tiers for display
  const enabledTiers = getEnabledTiers(selection);

  // Toggle tier in selection
  const toggleTier = (tier: keyof TierSelection) => {
    const updated = cloneSelection(selection);
    switch (tier) {
      case "vision":
        updated.foundation.enabled = !updated.foundation.enabled;
        break;
      case "values":
        updated.values.enabled = !updated.values.enabled;
        updated.behaviours.enabled = !updated.behaviours.enabled;
        break;
      case "drivers":
        updated.drivers.enabled = !updated.drivers.enabled;
        updated.intents.enabled = !updated.intents.enabled;
        updated.commitments.enabled = !updated.commitments.enabled;
        break;
      case "enablers":
        updated.enablers.enabled = !updated.enablers.enabled;
        break;
      case "teamObjectives":
        updated.teamObjectives.enabled = !updated.teamObjectives.enabled;
        break;
      case "individualObjectives":
        updated.individualObjectives.enabled = !updated.individualObjectives.enabled;
        break;
    }
    setSelection(updated);
  };

  // Toggle horizon
  const toggleHorizon = (horizon: "H1" | "H2" | "H3") => {
    const updated = cloneSelection(selection);
    updated.commitments.horizons[horizon] = !updated.commitments.horizons[horizon];
    setSelection(updated);
  };

  const enabledHorizons = getEnabledHorizons(selection);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Hidden on print */}
      <div className="no-print bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/visualizations")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Visualizations
              </Button>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-xl font-bold text-gray-800">Strategy Blueprint</h1>
                <p className="text-sm text-gray-600">Single-page strategic overview</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Layout Switcher */}
              <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setLayout("portrait")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    layout === "portrait"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title="Portrait Flow Layout"
                >
                  <Columns className="w-4 h-4" />
                  <span className="hidden sm:inline">Portrait</span>
                </button>
                <button
                  onClick={() => setLayout("landscape")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    layout === "landscape"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title="Landscape Pillars Layout"
                >
                  <Columns3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Landscape</span>
                </button>
                <button
                  onClick={() => setLayout("compact")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    layout === "compact"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title="Compact Dense Layout"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Compact</span>
                </button>
              </div>

              {/* Tier Selector */}
              <div className="relative border-l border-gray-300 pl-3">
                <button
                  onClick={() => setShowTierSelector(!showTierSelector)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  title="Select which tiers to display"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showTierSelector ? 'rotate-180' : ''}`} />
                </button>

                {/* Tier Selector Dropdown - Matching Exports Page Format */}
                {showTierSelector && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 z-50">
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
                            {preset === "executive" && "High-level"}
                            {preset === "leadership" && "Comprehensive"}
                            {preset === "detailed" && "Full detail"}
                            {preset === "team" && "Team focus"}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Preset Description */}
                    <div className="p-2 bg-gray-50 rounded-lg text-xs text-gray-600 mb-3">
                      <span className="font-medium text-gray-700 capitalize">{selectedPreset}:</span>{" "}
                      {PRESET_DESCRIPTIONS[selectedPreset]?.slice(0, 80)}...
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

                    {/* Tiers Section */}
                    <div className="border-t border-gray-200 pt-3 mb-2">
                      <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Customize Tiers</div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedTiers.vision}
                          onChange={() => toggleTier("vision")}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Vision/Mission</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedTiers.values}
                          onChange={() => toggleTier("values")}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Values & Behaviours</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedTiers.drivers}
                          onChange={() => toggleTier("drivers")}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Drivers, Intents & Commitments</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedTiers.enablers}
                          onChange={() => toggleTier("enablers")}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Enablers</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedTiers.teamObjectives}
                          onChange={() => toggleTier("teamObjectives")}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Team Objectives</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedTiers.individualObjectives}
                          onChange={() => toggleTier("individualObjectives")}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Individual Objectives</span>
                      </label>
                    </div>

                    {/* Horizon Filter */}
                    {selectedTiers.drivers && (
                      <>
                        <div className="border-t border-gray-200 pt-3 mt-3 mb-2">
                          <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Horizons</div>
                        </div>
                        <div className="flex gap-2">
                          <label className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border-2 transition-all ${
                            selectedTiers.horizons.H1 ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                          }`}>
                            <input
                              type="checkbox"
                              checked={selectedTiers.horizons.H1}
                              onChange={() => toggleHorizon("H1")}
                              className="w-3.5 h-3.5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                            />
                            <span className="text-xs text-green-700 font-medium">H1</span>
                          </label>
                          <label className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border-2 transition-all ${
                            selectedTiers.horizons.H2 ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                          }`}>
                            <input
                              type="checkbox"
                              checked={selectedTiers.horizons.H2}
                              onChange={() => toggleHorizon("H2")}
                              className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-xs text-blue-700 font-medium">H2</span>
                          </label>
                          <label className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border-2 transition-all ${
                            selectedTiers.horizons.H3 ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"
                          }`}>
                            <input
                              type="checkbox"
                              checked={selectedTiers.horizons.H3}
                              onChange={() => toggleHorizon("H3")}
                              className="w-3.5 h-3.5 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                            />
                            <span className="text-xs text-orange-700 font-medium">H3</span>
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="border-l border-gray-300 pl-3 flex items-center gap-2">
                <Button variant="ghost" onClick={() => router.push("/exports")}>
                  <FileOutput className="w-4 h-4 mr-2" />
                  More Exports
                </Button>
                <Button variant="secondary" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="primary" onClick={handleExportPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner - Hidden on print */}
      <div className="no-print bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-medium">
                {layout === "portrait" && "Portrait Flow: Logical grouping with drivers → intents → commitments (A4 portrait)"}
                {layout === "landscape" && "Landscape Pillars: Side-by-side driver columns for comparison (A4 landscape)"}
                {layout === "compact" && "Compact Dense: Maximum information density in minimal space (A4 portrait)"}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Choose your preferred layout above, then click "Print" or "Export PDF" to generate your document.
                {layout === "portrait" && " Groups commitments under drivers for clear strategic alignment."}
                {layout === "landscape" && " Each driver is a vertical pillar showing its complete story."}
                {layout === "compact" && " Newspaper-style density optimized for single-page overview."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <div className={`mx-auto px-6 ${layout === "landscape" ? "max-w-full" : "max-w-[1400px]"}`}>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {layout === "portrait" && <StrategyOnePage pyramid={pyramid} selectedTiers={selectedTiers} />}
            {layout === "landscape" && <StrategyOnePageLandscape pyramid={pyramid} selectedTiers={selectedTiers} />}
            {layout === "compact" && <StrategyOnePageCompact pyramid={pyramid} selectedTiers={selectedTiers} />}
          </div>
        </div>
      </div>

      {/* Footer - Hidden on print */}
      <div className="no-print py-8 text-center text-sm text-gray-500">
        <p>
          {layout === "portrait" && "Tip: For best results, use \"Print to PDF\" with A4 portrait orientation"}
          {layout === "landscape" && "Tip: For best results, use \"Print to PDF\" with A4 landscape orientation"}
          {layout === "compact" && "Tip: For best results, use \"Print to PDF\" with A4 portrait orientation"}
        </p>
      </div>
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function OnePageVisualizationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <OnePageVisualizationContent />
    </Suspense>
  );
}
