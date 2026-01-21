"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePyramidStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import StrategyOnePage from "@/components/visualizations/StrategyOnePage";
import StrategyOnePageLandscape from "@/components/visualizations/StrategyOnePageLandscape";
import StrategyOnePageCompact from "@/components/visualizations/StrategyOnePageCompact";
import { ArrowLeft, Printer, Download, FileText, Columns3, Columns, LayoutGrid } from "lucide-react";
import "../../../styles/strategy-one-page.css";
import "../../../styles/strategy-landscape.css";
import "../../../styles/strategy-compact.css";

type LayoutType = "portrait" | "landscape" | "compact";

export default function OnePageVisualizationPage() {
  const router = useRouter();
  const { pyramid } = usePyramidStore();
  const [layout, setLayout] = useState<LayoutType>("portrait");

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

              <div className="border-l border-gray-300 pl-3 flex items-center gap-2">
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
            {layout === "portrait" && <StrategyOnePage pyramid={pyramid} />}
            {layout === "landscape" && <StrategyOnePageLandscape pyramid={pyramid} />}
            {layout === "compact" && <StrategyOnePageCompact pyramid={pyramid} />}
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
