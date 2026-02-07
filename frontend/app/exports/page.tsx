"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePyramidStore } from "@/lib/store";
import { exportsApi } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import { UnsavedChangesIndicator } from "@/components/ui/UnsavedChangesIndicator";
import { ExportSelectionPanel } from "@/components/exports";
import { EXPORTS_TOOLTIPS } from "@/config/tooltips";
import { downloadBlob } from "@/lib/utils";
import {
  ExportElementSelection,
  DEFAULT_EXPORT_SELECTION,
  cloneSelection,
  getEnabledTiers,
} from "@/types/export-selection";
import type { ExportRequest } from "@/types/pyramid";
import {
  FileText,
  Presentation,
  FileCode,
  Download,
  ArrowLeft,
  Sparkles,
  BarChart3,
  Eye,
  Loader2,
  Monitor,
  ChevronDown,
  ChevronUp,
  Building2,
  MessageSquareQuote,
  Pyramid,
  GitBranch,
} from "lucide-react";

/** Presentation customization options matching the backend PresentationOptions model */
interface PresentationConfig {
  purpose_slide: {
    include_vision: boolean;
    include_mission: boolean;
    include_values: boolean;
    max_values_shown: number;
    include_purpose_statements: boolean;
  };
  diagrams: {
    include_pyramid: boolean;
    interactive_pyramid: boolean;
    include_strategy_house: boolean;
    include_golden_threads: boolean;
  };
  narrative: {
    include_elevator_pitch: boolean;
    include_narrative: boolean;
    custom_elevator_pitch: string | null;
    custom_narrative: string | null;
  };
  slides: {
    include_cover: boolean;
    include_executive_summary: boolean;
    include_purpose_section: boolean;
    include_vision_detail: boolean;
    include_values: boolean;
    include_behaviours: boolean;
    include_strategy_overview: boolean;
    include_driver_deep_dives: boolean;
    include_enablers: boolean;
    include_execution: boolean;
    include_horizons: boolean;
    include_team_cascade: boolean;
    include_individual_cascade: boolean;
    include_alignment: boolean;
    include_context: boolean;
    include_closing: boolean;
  };
}

const DEFAULT_PRESENTATION_CONFIG: PresentationConfig = {
  purpose_slide: {
    include_vision: true,
    include_mission: true,
    include_values: true,
    max_values_shown: 5,
    include_purpose_statements: true,
  },
  diagrams: {
    include_pyramid: true,
    interactive_pyramid: true,
    include_strategy_house: true,
    include_golden_threads: true,
  },
  narrative: {
    include_elevator_pitch: true,
    include_narrative: true,
    custom_elevator_pitch: null,
    custom_narrative: null,
  },
  slides: {
    include_cover: true,
    include_executive_summary: true,
    include_purpose_section: true,
    include_vision_detail: true,
    include_values: true,
    include_behaviours: true,
    include_strategy_overview: true,
    include_driver_deep_dives: true,
    include_enablers: true,
    include_execution: true,
    include_horizons: true,
    include_team_cascade: true,
    include_individual_cascade: true,
    include_alignment: true,
    include_context: true,
    include_closing: true,
  },
};

export default function ExportsPage() {
  const router = useRouter();
  const { sessionId, pyramid, showToast } = usePyramidStore();
  const [selection, setSelection] = useState<ExportElementSelection>(
    cloneSelection(DEFAULT_EXPORT_SELECTION)
  );
  const [isExporting, setIsExporting] = useState(false);
  const [previewCounts, setPreviewCounts] = useState<Record<string, number> | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [presentationConfig, setPresentationConfig] = useState<PresentationConfig>(
    DEFAULT_PRESENTATION_CONFIG
  );
  const [showPresentationOptions, setShowPresentationOptions] = useState(false);

  useEffect(() => {
    if (!pyramid) {
      router.push("/");
    }
  }, [pyramid, router]);

  // Fetch preview when selection changes
  useEffect(() => {
    if (!sessionId || !pyramid) return;

    const fetchPreview = async () => {
      setIsLoadingPreview(true);
      try {
        const request: ExportRequest = {
          mode: "custom",
          selection,
        };
        const preview = await exportsApi.previewExport(sessionId, request);
        setPreviewCounts({
          foundation: preview.summary.foundation?.count || 0,
          values: preview.summary.values?.count || 0,
          behaviours: preview.summary.behaviours?.count || 0,
          drivers: preview.summary.drivers?.count || 0,
          intents: preview.summary.intents?.count || 0,
          enablers: preview.summary.enablers?.count || 0,
          commitments: preview.summary.commitments?.count || 0,
          team_objectives: preview.summary.team_objectives?.count || 0,
          individual_objectives: preview.summary.individual_objectives?.count || 0,
          total: preview.total_elements,
        });
      } catch (err) {
        console.error("Preview failed:", err);
        setPreviewCounts(null);
      } finally {
        setIsLoadingPreview(false);
      }
    };

    // Debounce preview requests
    const timer = setTimeout(fetchPreview, 300);
    return () => clearTimeout(timer);
  }, [sessionId, pyramid, selection]);

  const handleExportPresentation = async () => {
    if (!pyramid) return;

    try {
      setIsExporting(true);
      const hasNarrative =
        presentationConfig.narrative.include_elevator_pitch ||
        presentationConfig.narrative.include_narrative;
      const blob = await exportsApi.exportPresentation(sessionId, {
        options: presentationConfig,
        generate_narrative: hasNarrative,
      });
      downloadBlob(blob, `${pyramid.metadata.project_name}_presentation.html`);
    } catch (err: any) {
      console.error("Presentation export failed:", err);
      showToast(
        err.response?.data?.detail || "Presentation export failed. Please try again.",
        "error"
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = async (format: "word" | "powerpoint" | "markdown" | "json") => {
    if (!pyramid) return;

    try {
      setIsExporting(true);

      const exportRequest: ExportRequest = {
        mode: "custom",
        selection,
      };

      let blob: Blob;
      let filename: string;

      switch (format) {
        case "word":
          blob = await exportsApi.exportWord(sessionId, exportRequest);
          filename = `${pyramid.metadata.project_name}_export.docx`;
          break;
        case "powerpoint":
          blob = await exportsApi.exportPowerPoint(sessionId, exportRequest);
          filename = `${pyramid.metadata.project_name}_export.pptx`;
          break;
        case "markdown":
          blob = await exportsApi.exportMarkdown(sessionId, exportRequest);
          filename = `${pyramid.metadata.project_name}_export.md`;
          break;
        case "json":
          blob = await exportsApi.exportJSON(sessionId, exportRequest);
          filename = `${pyramid.metadata.project_name}.json`;
          break;
      }

      downloadBlob(blob, filename);
    } catch (err: any) {
      console.error("Export failed:", err);
      showToast(
        err.response?.data?.detail || "Export failed. Please try again.",
        "error"
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadAIGuide = async () => {
    try {
      setIsExporting(true);
      const blob = await exportsApi.downloadAIGuide();
      downloadBlob(blob, "AI_Strategy_Guide.md");
    } catch (err: any) {
      console.error("Guide download failed:", err);
      showToast(
        err.response?.data?.detail || "Guide download failed. Please try again.",
        "error"
      );
    } finally {
      setIsExporting(false);
    }
  };

  if (!pyramid) {
    return null;
  }

  const enabledTiers = getEnabledTiers(selection);

  return (
    <div className="min-h-screen p-4">
      <UnsavedChangesIndicator />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex gap-3">
          <Button variant="ghost" onClick={() => router.push("/builder")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Builder
          </Button>
          <Button variant="secondary" onClick={() => router.push("/visualizations")}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Visualizations
          </Button>
          <Button variant="primary" onClick={() => router.push("/visualizations/one-page")}>
            <FileText className="w-4 h-4 mr-2" />
            Strategy Blueprint
          </Button>
        </div>

        <div className="card mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Export Your Strategy</h1>
          <p className="text-gray-600">
            Customize what to include in your export and download in your preferred format.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Selection Panel */}
          <div className="lg:col-span-2">
            {/* AI Guide Section */}
            <div className="card mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Use AI to Build Your Strategy
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Download our comprehensive guide to generate strategic pyramids using ChatGPT, Claude, or any AI tool.
                  </p>
                  <Button
                    onClick={handleDownloadAIGuide}
                    disabled={isExporting}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download AI Strategy Guide
                  </Button>
                </div>
              </div>
            </div>

            {/* Presentation Mode */}
            <div className="card mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Interactive Presentation Mode
                  </h2>
                  <p className="text-gray-700 mb-3">
                    Generate a professional, consultant-quality HTML presentation with
                    keyboard/swipe navigation, drill-down panels, interactive pyramid,
                    strategy house diagram, and AI-generated narrative.
                  </p>

                  <div className="flex items-center gap-3 mb-3">
                    <Button
                      onClick={handleExportPresentation}
                      disabled={isExporting}
                      className="bg-blue-700 hover:bg-blue-800"
                    >
                      {isExporting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      Download Presentation
                    </Button>
                    <button
                      onClick={() => setShowPresentationOptions(!showPresentationOptions)}
                      className="text-sm text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1"
                    >
                      Customise
                      {showPresentationOptions ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Presentation Options Panel */}
                  {showPresentationOptions && (
                    <div className="mt-4 border-t border-blue-200 pt-4 space-y-4">
                      {/* AI Narrative Options */}
                      <div className="bg-white/60 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <MessageSquareQuote className="w-4 h-4 text-blue-600" />
                          AI-Generated Content
                        </h4>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={presentationConfig.narrative.include_elevator_pitch}
                              onChange={(e) =>
                                setPresentationConfig((prev) => ({
                                  ...prev,
                                  narrative: { ...prev.narrative, include_elevator_pitch: e.target.checked },
                                }))
                              }
                              className="rounded border-gray-300"
                            />
                            <span>Elevator pitch (AI-generated 30-second summary)</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={presentationConfig.narrative.include_narrative}
                              onChange={(e) =>
                                setPresentationConfig((prev) => ({
                                  ...prev,
                                  narrative: { ...prev.narrative, include_narrative: e.target.checked },
                                }))
                              }
                              className="rounded border-gray-300"
                            />
                            <span>Strategic narrative (AI-generated executive summary)</span>
                          </label>
                        </div>
                      </div>

                      {/* Diagram Options */}
                      <div className="bg-white/60 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          Diagrams
                        </h4>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={presentationConfig.diagrams.include_strategy_house}
                              onChange={(e) =>
                                setPresentationConfig((prev) => ({
                                  ...prev,
                                  diagrams: { ...prev.diagrams, include_strategy_house: e.target.checked },
                                }))
                              }
                              className="rounded border-gray-300"
                            />
                            <span>Strategy house diagram (roof / pillars / foundation)</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={presentationConfig.diagrams.interactive_pyramid}
                              onChange={(e) =>
                                setPresentationConfig((prev) => ({
                                  ...prev,
                                  diagrams: { ...prev.diagrams, interactive_pyramid: e.target.checked },
                                }))
                              }
                              className="rounded border-gray-300"
                            />
                            <span>Interactive pyramid (click tiers to explore)</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={presentationConfig.diagrams.include_golden_threads}
                              onChange={(e) =>
                                setPresentationConfig((prev) => ({
                                  ...prev,
                                  diagrams: { ...prev.diagrams, include_golden_threads: e.target.checked },
                                }))
                              }
                              className="rounded border-gray-300"
                            />
                            <span>Golden threads alignment flow</span>
                          </label>
                        </div>
                      </div>

                      {/* Purpose Page Options */}
                      <div className="bg-white/60 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Pyramid className="w-4 h-4 text-blue-600" />
                          Purpose Summary Page
                        </h4>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={presentationConfig.purpose_slide.include_vision}
                              onChange={(e) =>
                                setPresentationConfig((prev) => ({
                                  ...prev,
                                  purpose_slide: { ...prev.purpose_slide, include_vision: e.target.checked },
                                }))
                              }
                              className="rounded border-gray-300"
                            />
                            <span>Vision statement</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={presentationConfig.purpose_slide.include_mission}
                              onChange={(e) =>
                                setPresentationConfig((prev) => ({
                                  ...prev,
                                  purpose_slide: { ...prev.purpose_slide, include_mission: e.target.checked },
                                }))
                              }
                              className="rounded border-gray-300"
                            />
                            <span>Mission statement</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={presentationConfig.purpose_slide.include_purpose_statements}
                              onChange={(e) =>
                                setPresentationConfig((prev) => ({
                                  ...prev,
                                  purpose_slide: {
                                    ...prev.purpose_slide,
                                    include_purpose_statements: e.target.checked,
                                  },
                                }))
                              }
                              className="rounded border-gray-300"
                            />
                            <span>Other purpose statements (belief, passion, aspiration)</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={presentationConfig.purpose_slide.include_values}
                              onChange={(e) =>
                                setPresentationConfig((prev) => ({
                                  ...prev,
                                  purpose_slide: { ...prev.purpose_slide, include_values: e.target.checked },
                                }))
                              }
                              className="rounded border-gray-300"
                            />
                            <span>Values summary</span>
                          </label>
                          {presentationConfig.purpose_slide.include_values && (
                            <div className="ml-6 flex items-center gap-2 text-sm">
                              <span className="text-gray-600">Max values shown:</span>
                              <select
                                value={presentationConfig.purpose_slide.max_values_shown}
                                onChange={(e) =>
                                  setPresentationConfig((prev) => ({
                                    ...prev,
                                    purpose_slide: {
                                      ...prev.purpose_slide,
                                      max_values_shown: parseInt(e.target.value),
                                    },
                                  }))
                                }
                                className="border rounded px-2 py-1 text-sm"
                              >
                                {[3, 4, 5, 6, 7, 8].map((n) => (
                                  <option key={n} value={n}>
                                    {n}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Slide Selection */}
                      <div className="bg-white/60 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-blue-600" />
                          Slides to Include
                        </h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          {([
                            ["include_cover", "Cover slide"],
                            ["include_executive_summary", "Executive summary"],
                            ["include_purpose_section", "Purpose overview"],
                            ["include_vision_detail", "Vision detail"],
                            ["include_values", "Values"],
                            ["include_behaviours", "Behaviours"],
                            ["include_strategy_overview", "Strategy overview"],
                            ["include_driver_deep_dives", "Driver deep dives"],
                            ["include_enablers", "Enablers"],
                            ["include_execution", "Execution overview"],
                            ["include_horizons", "Horizons roadmap"],
                            ["include_team_cascade", "Team cascade"],
                            ["include_individual_cascade", "Individual cascade"],
                            ["include_alignment", "Strategic alignment"],
                            ["include_context", "Context & discovery (Tier 0)"],
                            ["include_closing", "Closing slide"],
                          ] as const).map(([key, label]) => (
                            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={presentationConfig.slides[key as keyof typeof presentationConfig.slides]}
                                onChange={(e) =>
                                  setPresentationConfig((prev) => ({
                                    ...prev,
                                    slides: { ...prev.slides, [key]: e.target.checked },
                                  }))
                                }
                                className="rounded border-gray-300"
                              />
                              <span>{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Selection Panel */}
            <ExportSelectionPanel
              selection={selection}
              onSelectionChange={setSelection}
              pyramid={pyramid}
              isLoading={isExporting}
            />
          </div>

          {/* Right Column: Export Formats & Preview */}
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="card bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Export Preview
                {isLoadingPreview && (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                )}
              </h3>
              {previewCounts ? (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    {previewCounts.total} elements
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {enabledTiers.map((tier) => (
                      <div key={tier} className="flex justify-between">
                        <span className="capitalize">{tier.replace("_", " ")}</span>
                        <span className="font-medium">
                          {previewCounts[tier] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Select elements to see preview
                </div>
              )}
            </div>

            {/* Export Formats */}
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4">Choose Format</h3>
              <div className="space-y-3">
                {/* Word */}
                <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-semibold inline-flex items-center">
                        Word Document
                        <Tooltip tooltipContent={EXPORTS_TOOLTIPS.FORMAT_WORD} placement="right" />
                      </h4>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Professional DOCX format with cover page and tables.
                  </p>
                  <Button
                    onClick={() => handleExport("word")}
                    disabled={isExporting || enabledTiers.length === 0}
                    className="w-full"
                    size="sm"
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Export Word
                  </Button>
                </div>

                {/* PowerPoint */}
                <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <Presentation className="w-6 h-6 text-orange-600" />
                    <div className="flex-1">
                      <h4 className="font-semibold inline-flex items-center">
                        PowerPoint
                        <Tooltip tooltipContent={EXPORTS_TOOLTIPS.FORMAT_POWERPOINT} placement="right" />
                      </h4>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Presentation deck ready for meetings.
                  </p>
                  <Button
                    onClick={() => handleExport("powerpoint")}
                    disabled={isExporting || enabledTiers.length === 0}
                    className="w-full"
                    size="sm"
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Export PowerPoint
                  </Button>
                </div>

                {/* Markdown */}
                <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <FileCode className="w-6 h-6 text-green-600" />
                    <div className="flex-1">
                      <h4 className="font-semibold inline-flex items-center">
                        Markdown
                        <Tooltip tooltipContent={EXPORTS_TOOLTIPS.FORMAT_MARKDOWN} placement="right" />
                      </h4>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Clean documentation for GitHub or wikis.
                  </p>
                  <Button
                    onClick={() => handleExport("markdown")}
                    disabled={isExporting || enabledTiers.length === 0}
                    className="w-full"
                    size="sm"
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Export Markdown
                  </Button>
                </div>

                {/* JSON */}
                <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <FileCode className="w-6 h-6 text-purple-600" />
                    <div className="flex-1">
                      <h4 className="font-semibold inline-flex items-center">
                        JSON
                        <Tooltip tooltipContent={EXPORTS_TOOLTIPS.FORMAT_JSON} placement="right" />
                      </h4>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Complete data backup for re-importing.
                  </p>
                  <Button
                    onClick={() => handleExport("json")}
                    disabled={isExporting}
                    className="w-full"
                    size="sm"
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Export JSON
                  </Button>
                </div>
              </div>

              {enabledTiers.length === 0 && (
                <p className="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  Please select at least one tier to export.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
