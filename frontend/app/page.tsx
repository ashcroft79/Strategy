"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePyramidStore } from "@/lib/store";
import { pyramidApi, exportsApi, documentsApi, type ExtractedElements } from "@/lib/api-client";
import { readFileAsText, downloadBlob } from "@/lib/utils";
import { Upload, Plus, Sparkles, FileText, Zap, Shield, TrendingUp, BookOpen } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - Compact */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Strategic Pyramid Builder
          </h1>
          <p className="text-lg text-gray-600">
            Build coherent strategies that cascade from purpose to execution
          </p>
        </div>

        {/* Bento Box Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6 auto-rows-[minmax(120px,auto)]">

          {/* Hero Card - Welcome & Quick Stats */}
          <div className="lg:col-span-8 lg:row-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] group">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Get Started</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Transform Your Strategy
                </h2>
                <p className="text-blue-100 text-lg max-w-2xl">
                  Create a comprehensive 9-tier strategic pyramid that aligns your organization from vision to individual objectives.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-3xl font-bold mb-1">9</div>
                  <div className="text-sm text-blue-100">Strategic Tiers</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-3xl font-bold mb-1">AI</div>
                  <div className="text-sm text-blue-100">Powered Import</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-3xl font-bold mb-1">∞</div>
                  <div className="text-sm text-blue-100">Possibilities</div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Warning Card - Compact */}
          <div className="lg:col-span-4 lg:row-span-2 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-6 border-2 border-orange-200 shadow-lg hover:shadow-orange-200/50 transition-all duration-300 group">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1 text-lg">Session Storage</h3>
                <p className="text-sm text-gray-700">
                  No server storage - your data stays private in your browser session
                </p>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-orange-100">
              <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span>📥</span> Save Your Work
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Download JSON backups regularly. Closing your browser or clearing cache will lose unsaved data.
              </p>
            </div>
          </div>

          {/* Create New Pyramid - Main Action Card */}
          <div className="lg:col-span-5 lg:row-span-4 bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Create New</h2>
            </div>

            <form onSubmit={handleCreatePyramid} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., HR Strategy 2026"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organization *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Acme Corp"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Created By *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Your name"
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows={3}
                  placeholder="Brief description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Create Pyramid
              </button>
            </form>
          </div>

          {/* AI Import Card */}
          <div className="lg:col-span-4 lg:row-span-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform border border-white/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">AI Import</h2>
            </div>

            <p className="text-purple-100 mb-6 leading-relaxed">
              Upload strategic documents and let AI extract vision, values, drivers, and commitments automatically.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
              <ul className="space-y-2 text-sm text-purple-100">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  PDF, Word, PowerPoint supported
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  Max 5 files, 10MB each
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  Review before importing
                </li>
              </ul>
            </div>

            <button
              onClick={() => setShowImportModal(true)}
              disabled={!projectName || !organization}
              className="w-full bg-white text-purple-600 font-semibold py-3 rounded-xl hover:bg-purple-50 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:bg-white/20 disabled:text-white/50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Import Documents
            </button>

            {(!projectName || !organization) && (
              <p className="text-xs text-purple-200 text-center mt-3">
                Fill in the form first →
              </p>
            )}
          </div>

          {/* Load Pyramid Card */}
          <div className="lg:col-span-3 lg:row-span-3 bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Load</h2>
            </div>

            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Import a saved pyramid from JSON to continue working.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all group/upload">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3 group-hover/upload:text-blue-500 transition-colors" />
              <p className="text-sm text-gray-600 mb-4">
                Drop JSON file or click to browse
              </p>
              <label className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold px-6 py-3 rounded-xl cursor-pointer hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-md">
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

          {/* AI Guide Card */}
          <div className="lg:col-span-6 lg:row-span-2 bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl p-6 border-2 border-violet-200 shadow-lg hover:shadow-violet-200/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  AI Strategy Guide
                </h2>
                <p className="text-sm text-gray-700">
                  Generate strategies with ChatGPT or Claude
                </p>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
              Complete JSON schema, tier-by-tier prompts, and import instructions included.
            </p>
            <button
              onClick={handleDownloadAIGuide}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-violet-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              Download Free Guide
            </button>
          </div>

          {/* About Pyramid Card */}
          <div className="lg:col-span-6 lg:row-span-2 bg-gradient-to-br from-slate-800 to-gray-900 rounded-3xl p-6 text-white shadow-xl hover:shadow-slate-800/30 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold">9-Tier Framework</h2>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="font-semibold text-blue-300 mb-2">PURPOSE</div>
                <ul className="space-y-1 text-gray-300">
                  <li>• Vision</li>
                  <li>• Values</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="font-semibold text-purple-300 mb-2">STRATEGY</div>
                <ul className="space-y-1 text-gray-300">
                  <li>• Behaviours</li>
                  <li>• Intent</li>
                  <li>• Drivers</li>
                  <li>• Enablers</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="font-semibold text-emerald-300 mb-2">EXECUTION</div>
                <ul className="space-y-1 text-gray-300">
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
          <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 shadow-lg animate-slide-up">
            <div className="flex items-center gap-2">
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
