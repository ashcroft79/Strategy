"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePyramidStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import StrategyOnePage from "@/components/visualizations/StrategyOnePage";
import { ArrowLeft, Printer, Download, FileText } from "lucide-react";
import "../../../styles/strategy-one-page.css";

export default function OnePageVisualizationPage() {
  const router = useRouter();
  const { pyramid } = usePyramidStore();

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

            <div className="flex items-center gap-2">
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

      {/* Info Banner - Hidden on print */}
      <div className="no-print bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-medium">
                This page is optimized for printing and PDF export (A4 portrait)
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Click "Print" or "Export PDF" above to generate a professional strategy document.
                The layout groups commitments under their strategic drivers for clear alignment.
                Minimum 11pt body text ensures readability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <StrategyOnePage pyramid={pyramid} />
          </div>
        </div>
      </div>

      {/* Footer - Hidden on print */}
      <div className="no-print py-8 text-center text-sm text-gray-500">
        <p>
          Tip: For best results, use "Print to PDF" in your browser with A4 portrait orientation
        </p>
      </div>
    </div>
  );
}
