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
} from "lucide-react";

export default function ExportsPage() {
  const router = useRouter();
  const { sessionId, pyramid } = usePyramidStore();
  const [selection, setSelection] = useState<ExportElementSelection>(
    cloneSelection(DEFAULT_EXPORT_SELECTION)
  );
  const [isExporting, setIsExporting] = useState(false);
  const [previewCounts, setPreviewCounts] = useState<Record<string, number> | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

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
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadAIGuide = async () => {
    try {
      setIsExporting(true);
      const blob = await exportsApi.downloadAIGuide();
      downloadBlob(blob, "AI_Strategy_Guide.md");
    } catch (err) {
      console.error("Guide download failed:", err);
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
