"use client";

import { useState, useCallback } from "react";
import {
  X,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileWarning,
  Sparkles,
} from "lucide-react";
import {
  documentsApi,
  type ImportDocumentsResponse,
  type ExtractedElements,
} from "@/lib/api-client";

interface DocumentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (extractedElements: ExtractedElements) => void;
  organizationName?: string;
}

export function DocumentImportModal({
  isOpen,
  onClose,
  onImportComplete,
  organizationName,
}: DocumentImportModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportDocumentsResponse | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      return [".pdf", ".docx", ".pptx"].includes(ext);
    });

    setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [handleFileSelect]
  );

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    if (selectedFiles.length === 0) return;

    setImporting(true);
    setImportResult(null);

    try {
      const result = await documentsApi.importDocuments(
        selectedFiles,
        organizationName
      );
      setImportResult(result);
    } catch (error: any) {
      setImportResult({
        success: false,
        documents_processed: selectedFiles.length,
        parse_results: [],
        error: error.response?.data?.detail || error.message || "Import failed",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleAcceptAndImport = () => {
    if (importResult?.extracted_elements) {
      onImportComplete(importResult.extracted_elements);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setImportResult(null);
    setImporting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Import from Documents
              </h2>
              <p className="text-sm text-gray-600">
                Upload strategic documents to extract pyramid elements using AI
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!importResult ? (
            // Upload Stage
            <div className="space-y-6">
              {/* Drag & Drop Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <Upload
                  className={`w-12 h-12 mx-auto mb-4 ${
                    dragActive ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop documents here or click to browse
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Supports PDF, DOCX, and PPTX files (max 10MB each, 5 files total)
                </p>
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept=".pdf,.docx,.pptx"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Select Files
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">
                    Selected Files ({selectedFiles.length}/5)
                  </h3>
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Results Stage
            <div className="space-y-6">
              {/* Status Banner */}
              {importResult.success ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-green-900">
                      Extraction Successful!
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      {importResult.documents_processed} document(s) processed and
                      analyzed. Review the extracted elements below.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-red-900">Extraction Failed</h3>
                    <p className="text-sm text-red-700 mt-1">
                      {importResult.error || "Failed to extract elements from documents"}
                    </p>
                  </div>
                </div>
              )}

              {/* Parse Results */}
              {importResult.parse_results.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Document Processing</h3>
                  {importResult.parse_results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg flex items-start gap-3 ${
                        result.success
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      {result.success ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <FileWarning className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            result.success ? "text-green-900" : "text-red-900"
                          }`}
                        >
                          {result.filename}
                        </p>
                        {result.error ? (
                          <p className="text-xs text-red-700 mt-1">{result.error}</p>
                        ) : (
                          <p className="text-xs text-green-700 mt-1">
                            {result.format?.toUpperCase()}{" "}
                            {result.num_pages && `• ${result.num_pages} pages`}
                            {result.num_slides && `• ${result.num_slides} slides`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Extraction Summary */}
              {importResult.success && importResult.validation && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Extraction Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {importResult.validation.summary.vision_found ? "1" : "0"}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Vision</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {importResult.validation.summary.values_count}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Values</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {importResult.validation.summary.drivers_count}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Drivers</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {importResult.validation.summary.intents_count}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Intents</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {importResult.validation.summary.commitments_count}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Commitments</div>
                    </div>
                  </div>

                  {/* Warnings */}
                  {importResult.validation.warnings &&
                    importResult.validation.warnings.length > 0 && (
                      <div className="space-y-2">
                        {importResult.validation.warnings.map((warning, index) => (
                          <div
                            key={index}
                            className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2"
                          >
                            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-yellow-800">{warning.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {!importResult ? (
              <button
                onClick={handleImport}
                disabled={selectedFiles.length === 0 || importing}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Extract Elements
                  </>
                )}
              </button>
            ) : (
              <>
                {importResult.success && (
                  <button
                    onClick={handleAcceptAndImport}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Accept & Import
                  </button>
                )}
                <button
                  onClick={() => setImportResult(null)}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
