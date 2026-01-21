"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePyramidStore } from "@/lib/store";
import { exportsApi } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { downloadBlob } from "@/lib/utils";
import { FileText, Presentation, FileCode, Download, ArrowLeft, Sparkles } from "lucide-react";

type AudienceType = "executive" | "leadership" | "detailed" | "team";

export default function ExportsPage() {
  const router = useRouter();
  const { sessionId, pyramid } = usePyramidStore();
  const [audience, setAudience] = useState<AudienceType>("leadership");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!pyramid) {
      router.push("/");
    }
  }, [pyramid, router]);

  const handleExport = async (format: "word" | "powerpoint" | "markdown" | "json") => {
    try {
      setIsExporting(true);

      const exportRequest = {
        audience,
        include_metadata: true,
        include_cover_page: true,
        include_distribution: true,
      };

      let blob: Blob;
      let filename: string;

      switch (format) {
        case "word":
          blob = await exportsApi.exportWord(sessionId, exportRequest);
          filename = `${pyramid?.metadata.project_name}_${audience}.docx`;
          break;
        case "powerpoint":
          blob = await exportsApi.exportPowerPoint(sessionId, exportRequest);
          filename = `${pyramid?.metadata.project_name}_${audience}.pptx`;
          break;
        case "markdown":
          blob = await exportsApi.exportMarkdown(sessionId, exportRequest);
          filename = `${pyramid?.metadata.project_name}_${audience}.md`;
          break;
        case "json":
          blob = await exportsApi.exportJSON(sessionId, exportRequest);
          filename = `${pyramid?.metadata.project_name}.json`;
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

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/builder")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Builder
          </Button>
        </div>

        <div className="card mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Export Your Strategy</h1>
          <p className="text-gray-600">
            Download your strategic pyramid in different formats for various audiences.
          </p>
        </div>

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
                Includes complete JSON schema, tier-by-tier prompt templates, and import instructions.
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

        {/* Audience Selection */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Select Audience</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: "executive", label: "Executive", desc: "High-level summary" },
              { value: "leadership", label: "Leadership", desc: "Detailed strategy" },
              { value: "detailed", label: "Detailed", desc: "Complete documentation" },
              { value: "team", label: "Team Cascade", desc: "Team-focused view" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setAudience(option.value as AudienceType)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  audience === option.value
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold text-gray-800">{option.label}</div>
                <div className="text-sm text-gray-600">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Export Formats */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Choose Format</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Word */}
            <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary transition-all">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-bold text-lg">Word Document</h3>
                  <p className="text-sm text-gray-600">Professional DOCX format</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Formatted document with cover page, tables, and full content. Perfect for
                sharing and printing.
              </p>
              <Button
                onClick={() => handleExport("word")}
                disabled={isExporting}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Word
              </Button>
            </div>

            {/* PowerPoint */}
            <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Presentation className="w-8 h-8 text-orange-600" />
                <div>
                  <h3 className="font-bold text-lg">PowerPoint</h3>
                  <p className="text-sm text-gray-600">Presentation deck (PPTX)</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Slide deck with professional layout, charts, and visualizations. Ready
                for presentations.
              </p>
              <Button
                onClick={() => handleExport("powerpoint")}
                disabled={isExporting}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PowerPoint
              </Button>
            </div>

            {/* Markdown */}
            <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary transition-all">
              <div className="flex items-center gap-3 mb-3">
                <FileCode className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-bold text-lg">Markdown</h3>
                  <p className="text-sm text-gray-600">Clean documentation (.md)</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Clean, readable documentation for GitHub, wikis, or documentation sites.
              </p>
              <Button
                onClick={() => handleExport("markdown")}
                disabled={isExporting}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Markdown
              </Button>
            </div>

            {/* JSON */}
            <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary transition-all">
              <div className="flex items-center gap-3 mb-3">
                <FileCode className="w-8 h-8 text-purple-600" />
                <div>
                  <h3 className="font-bold text-lg">JSON</h3>
                  <p className="text-sm text-gray-600">Machine-readable format</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Complete data backup for archiving or loading back into the application.
              </p>
              <Button
                onClick={() => handleExport("json")}
                disabled={isExporting}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
