"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePyramidStore } from "@/lib/store";
import { pyramidApi } from "@/lib/api-client";
import { readFileAsText } from "@/lib/utils";
import { Upload, Plus } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { sessionId, setPyramid, setLoading, setError, error } = usePyramidStore();

  const [projectName, setProjectName] = useState("");
  const [organization, setOrganization] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [description, setDescription] = useState("");

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

        <div className="grid md:grid-cols-2 gap-8">
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
      </div>
    </div>
  );
}
