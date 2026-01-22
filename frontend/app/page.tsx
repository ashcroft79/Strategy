"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePyramidStore } from "@/lib/store";
import { pyramidApi, exportsApi, type ExtractedElements } from "@/lib/api-client";
import { readFileAsText, downloadBlob } from "@/lib/utils";
import { Upload, Plus, Sparkles, FileText } from "lucide-react";
import { DocumentImportModal } from "@/components/DocumentImportModal";

export default function HomePage() {
  const router = useRouter();
  const { sessionId, setPyramid, setLoading, setError, error } = usePyramidStore();

  const [projectName, setProjectName] = useState("");
  const [organization, setOrganization] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [description, setDescription] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

  const handleCreatePyramid = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName || !organization || !createdBy) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const pyramid = await pyramidApi.create({
        session_id: sessionId,
        project_name: projectName,
        organization,
        created_by: createdBy,
        description,
      });

      setPyramid(pyramid);
      router.push("/builder");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create pyramid");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPyramid = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      const content = await readFileAsText(file);
      const pyramidData = JSON.parse(content);

      const pyramid = await pyramidApi.load({
        session_id: sessionId,
        pyramid_data: pyramidData,
      });

      setPyramid(pyramid);
      router.push("/builder");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load pyramid");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAIGuide = async () => {
    try {
      setLoading(true);
      setError(null);
      const blob = await exportsApi.downloadAIGuide();
      downloadBlob(blob, "AI_Strategy_Guide.md");
    } catch (err: any) {
      setError("Failed to download AI guide");
    } finally {
      setLoading(false);
    }
  };

  const handleImportComplete = async (extractedElements: ExtractedElements) => {
    // Must have project name and organization to import
    if (!projectName || !organization) {
      setError("Please fill in Project Name and Organization first before importing");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create new pyramid
      const pyramid = await pyramidApi.create({
        session_id: sessionId,
        project_name: projectName,
        organization,
        created_by: createdBy || "Imported",
        description: description || "Imported from documents",
      });

      // TODO: Add extracted elements to pyramid
      // This would require API endpoints to batch-add elements
      // For now, we'll navigate to builder and user can manually review/add

      setPyramid(pyramid);
      router.push("/builder");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to import pyramid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
            Strategic Pyramid Builder
          </h1>
          <p className="text-xl text-gray-600">
            Build coherent strategies that cascade from purpose to execution
          </p>
        </div>

        {/* No Persistence Warning */}
        <div className="card mb-8 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                ⚠️ Important: No Server-Side Storage
              </h2>
              <p className="text-gray-700 mb-3">
                Your strategic pyramid data is stored <strong>only in your browser session</strong>. We deliberately don't use a database to avoid storing potentially sensitive commercial information.
              </p>
              <div className="bg-white/70 rounded-lg p-3 border border-orange-200">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  📥 Save Your Work Regularly
                </p>
                <p className="text-sm text-gray-700">
                  Download JSON backups frequently to preserve your strategy. You'll see an indicator showing unsaved changes as you work. Closing your browser or clearing cache will lose unsaved data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Guide Banner */}
        <div className="card mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ✨ Build Your Strategy with AI
              </h2>
              <p className="text-gray-700 mb-4">
                Download our comprehensive guide to generate strategic pyramids using ChatGPT, Claude, or any AI tool.
                Includes complete JSON schema, tier-by-tier prompt templates, and import instructions.
              </p>
              <button
                onClick={handleDownloadAIGuide}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Download Free AI Strategy Guide
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Create New Pyramid */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Create New Pyramid</h2>
            </div>

            <form onSubmit={handleCreatePyramid} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., HR Strategy 2026"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization *
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Acme Corp"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created By *
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Your name"
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Brief description of this strategy..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Create Pyramid
              </button>
            </form>
          </div>

          {/* Import from Documents (NEW - Phase 3) */}
          <div className="card bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Import from Documents</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white/70 rounded-lg p-4 border border-purple-200">
                <div className="flex items-start gap-3 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-purple-900 mb-1">AI-Powered Extraction</h3>
                    <p className="text-sm text-gray-700">
                      Upload strategic documents (PDF, DOCX, PPTX) and let AI extract vision, values, drivers, and commitments.
                    </p>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 ml-8">
                  <li>• Max 5 files, 10MB each</li>
                  <li>• Supports PDF, Word, PowerPoint</li>
                  <li>• Review and edit before importing</li>
                </ul>
              </div>

              <button
                onClick={() => setShowImportModal(true)}
                disabled={!projectName || !organization}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                title={!projectName || !organization ? "Fill in Project Name and Organization first" : ""}
              >
                <FileText className="w-5 h-5" />
                Import Documents
              </button>

              {(!projectName || !organization) && (
                <p className="text-xs text-gray-600 text-center">
                  Fill in Project Name and Organization in the left form first
                </p>
              )}
            </div>
          </div>

          {/* Load Existing Pyramid */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Load Existing Pyramid</h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                Import a previously saved pyramid from a JSON file to continue working on it.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500 mb-4">JSON files only</p>
                <label className="btn-primary cursor-pointer inline-block">
                  Choose File
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleLoadPyramid}
                  />
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Example Files</h3>
                <p className="text-sm text-blue-700">
                  Check the <code className="bg-blue-100 px-2 py-1 rounded">examples/</code> folder
                  in the repository for sample pyramid JSON files.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* About Section */}
        <div className="mt-12 text-center text-gray-600">
          <h3 className="font-semibold text-lg mb-2">The 9-Tier Strategic Pyramid</h3>
          <div className="grid grid-cols-3 gap-6 mt-6 text-sm">
            <div>
              <div className="font-semibold text-blue-600 mb-2">PURPOSE (The Why)</div>
              <ul className="space-y-1 text-left">
                <li>• Vision/Mission/Belief</li>
                <li>• Values</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-blue-600 mb-2">STRATEGY (The How)</div>
              <ul className="space-y-1 text-left">
                <li>• Behaviours</li>
                <li>• Strategic Intent</li>
                <li>• Strategic Drivers</li>
                <li>• Enablers</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-blue-600 mb-2">EXECUTION (The What)</div>
              <ul className="space-y-1 text-left">
                <li>• Iconic Commitments</li>
                <li>• Team Objectives</li>
                <li>• Individual Objectives</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Document Import Modal */}
        <DocumentImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImportComplete={handleImportComplete}
          organizationName={organization}
        />
      </div>
    </div>
  );
}
