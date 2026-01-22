"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePyramidStore } from "@/lib/store";
import { pyramidApi, exportsApi, documentsApi, type ExtractedElements } from "@/lib/api-client";
import { readFileAsText, downloadBlob } from "@/lib/utils";
import { Upload, Plus, Sparkles, FileText, Zap, Shield, TrendingUp } from "lucide-react";
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
    if (!projectName || !organization) {
      setError("Please fill in Project Name and Organization first before importing");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const pyramid = await pyramidApi.create({
        session_id: sessionId,
        project_name: projectName,
        organization,
        created_by: createdBy || "Imported",
        description: description || "Imported from documents",
      });

      const importResults = await documentsApi.batchImportElements(
        sessionId,
        extractedElements,
        createdBy || "Document Import"
      );

      const updatedPyramid = await pyramidApi.get(sessionId);
      setPyramid(updatedPyramid);

      router.push("/builder");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to import pyramid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
            Strategic Pyramid Builder
          </h1>
          <p className="text-gray-600">
            Build coherent strategies that cascade from purpose to execution
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">

          {/* Hero Banner - Full Width */}
          <div className="lg:col-span-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm mb-3">
              <Sparkles className="w-3 h-3" />
              Get Started
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Transform Your Strategy
            </h2>
            <p className="text-blue-100 mb-4 max-w-xl">
              Create a comprehensive 9-tier strategic pyramid that aligns your organization from vision to individual objectives.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-2xl font-bold">9</div>
                <div className="text-xs text-blue-100">Strategic Tiers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-2xl font-bold">AI</div>
                <div className="text-xs text-blue-100">Powered</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-2xl font-bold">∞</div>
                <div className="text-xs text-blue-100">Possibilities</div>
              </div>
            </div>
          </div>

          {/* Session Warning - Compact */}
          <div className="lg:col-span-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border-2 border-orange-200 shadow-md">
            <div className="flex items-start gap-2 mb-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Session Storage</h3>
                <p className="text-xs text-gray-700 mb-2">
                  No server storage - data stays private
                </p>
              </div>
            </div>
            <div className="bg-white/70 rounded-lg p-3 border border-orange-100">
              <p className="text-xs font-semibold text-gray-900 mb-1">📥 Save Your Work</p>
              <p className="text-xs text-gray-600">
                Download JSON backups regularly. Closing your browser will lose unsaved data.
              </p>
            </div>
          </div>

        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

          {/* Create New */}
          <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Create New</h2>
            </div>

            <form onSubmit={handleCreatePyramid} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., HR Strategy 2026"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Organization *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Acme Corp"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Created By *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Your name"
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 text-sm bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows={2}
                  placeholder="Brief description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all shadow-md text-sm"
              >
                Create Pyramid
              </button>
            </form>
          </div>

          {/* AI Import */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold">AI Import</h2>
            </div>

            <p className="text-purple-100 text-sm mb-4 leading-relaxed">
              Upload strategic documents and let AI extract vision, values, drivers, and commitments automatically.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4 border border-white/20">
              <ul className="space-y-1.5 text-xs text-purple-100">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  PDF, Word, PowerPoint supported
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  Max 5 files, 10MB each
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  Review before importing
                </li>
              </ul>
            </div>

            <button
              onClick={() => setShowImportModal(true)}
              disabled={!projectName || !organization}
              className="w-full bg-white text-purple-600 font-semibold py-2.5 rounded-lg hover:bg-purple-50 transform hover:scale-[1.02] transition-all shadow-md disabled:bg-white/20 disabled:text-white/50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm"
            >
              <FileText className="w-4 h-4" />
              Import Documents
            </button>

            {(!projectName || !organization) && (
              <p className="text-xs text-purple-200 text-center mt-2">
                Fill in the form first →
              </p>
            )}
          </div>

          {/* Load Pyramid */}
          <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Load</h2>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              Import a saved pyramid from JSON to continue working.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all mb-3">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-3">
                Drop JSON file or click to browse
              </p>
              <label className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-md text-sm">
                Choose File
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleLoadPyramid}
                />
              </label>
            </div>
          </div>

        </div>

        {/* Bottom Row - Supporting Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* AI Guide */}
          <div className="bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl p-5 border-2 border-violet-200 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  AI Strategy Guide
                </h2>
                <p className="text-xs text-gray-700">
                  Generate strategies with ChatGPT or Claude
                </p>
              </div>
            </div>
            <p className="text-gray-700 text-xs mb-3 leading-relaxed">
              Complete JSON schema, tier-by-tier prompts, and import instructions included.
            </p>
            <button
              onClick={handleDownloadAIGuide}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:from-violet-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-md text-sm"
            >
              <Sparkles className="w-3 h-3" />
              Download Free Guide
            </button>
          </div>

          {/* 9-Tier Framework */}
          <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl p-5 text-white shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-base font-bold">9-Tier Framework</h2>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
                <div className="font-semibold text-blue-300 mb-1.5">PURPOSE</div>
                <ul className="space-y-0.5 text-gray-300">
                  <li>• Vision</li>
                  <li>• Values</li>
                  <li>• Behaviours</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
                <div className="font-semibold text-purple-300 mb-1.5">STRATEGY</div>
                <ul className="space-y-0.5 text-gray-300">
                  <li>• Drivers</li>
                  <li>• Intent</li>
                  <li>• Enablers</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
                <div className="font-semibold text-emerald-300 mb-1.5">EXECUTION</div>
                <ul className="space-y-0.5 text-gray-300">
                  <li>• Commitments</li>
                  <li>• Team Goals</li>
                  <li>• Individual</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 shadow-md animate-slide-up">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              {error}
            </div>
          </div>
        )}

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
