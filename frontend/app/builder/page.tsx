"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePyramidStore } from "@/lib/store";
import { pyramidApi, visionApi, valuesApi, driversApi, intentsApi, commitmentsApi } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { StatementType, Horizon } from "@/types/pyramid";
import { Save, Home, CheckCircle, FileDown, Eye } from "lucide-react";

export default function BuilderPage() {
  const router = useRouter();
  const { sessionId, pyramid, setPyramid, setLoading, setError } = usePyramidStore();
  const [activeTab, setActiveTab] = useState<"purpose" | "strategy" | "execution">("purpose");

  // Form states
  const [visionStatement, setVisionStatement] = useState("");
  const [valueName, setValueName] = useState("");
  const [valueDescription, setValueDescription] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverDescription, setDriverDescription] = useState("");
  const [intentStatement, setIntentStatement] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [commitmentName, setCommitmentName] = useState("");
  const [commitmentDescription, setCommitmentDescription] = useState("");
  const [commitmentHorizon, setCommitmentHorizon] = useState<Horizon>(Horizon.H1);

  useEffect(() => {
    if (!pyramid) {
      // Redirect to home if no pyramid loaded
      router.push("/");
    }
  }, [pyramid, router]);

  const refreshPyramid = async () => {
    try {
      const updated = await pyramidApi.get(sessionId);
      setPyramid(updated);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to refresh pyramid");
    }
  };

  const handleAddVision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visionStatement.trim()) return;

    try {
      setLoading(true);
      await visionApi.addStatement(sessionId, StatementType.VISION, visionStatement);
      setVisionStatement("");
      await refreshPyramid();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to add vision");
    } finally {
      setLoading(false);
    }
  };

  const handleAddValue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valueName.trim()) return;

    try {
      setLoading(true);
      await valuesApi.add(sessionId, valueName, valueDescription);
      setValueName("");
      setValueDescription("");
      await refreshPyramid();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to add value");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName.trim() || !driverDescription.trim()) return;

    try {
      setLoading(true);
      await driversApi.add(sessionId, driverName, driverDescription);
      setDriverName("");
      setDriverDescription("");
      await refreshPyramid();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to add driver");
    } finally {
      setLoading(false);
    }
  };

  const handleAddIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intentStatement.trim() || !selectedDriver) return;

    try {
      setLoading(true);
      await intentsApi.add(sessionId, intentStatement, selectedDriver);
      setIntentStatement("");
      await refreshPyramid();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to add intent");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCommitment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitmentName.trim() || !commitmentDescription.trim() || !selectedDriver) return;

    try {
      setLoading(true);
      await commitmentsApi.add(
        sessionId,
        commitmentName,
        commitmentDescription,
        commitmentHorizon,
        selectedDriver
      );
      setCommitmentName("");
      setCommitmentDescription("");
      await refreshPyramid();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to add commitment");
    } finally {
      setLoading(false);
    }
  };

  if (!pyramid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{pyramid.metadata.project_name}</h1>
              <p className="text-gray-600">{pyramid.metadata.organization}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => router.push("/")}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button variant="secondary" onClick={() => router.push("/validation")}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Validate
              </Button>
              <Button variant="secondary" onClick={() => router.push("/exports")}>
                <FileDown className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mt-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{pyramid.values.length}</div>
              <div className="text-sm text-gray-600">Values</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{pyramid.strategic_drivers.length}</div>
              <div className="text-sm text-gray-600">Drivers</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{pyramid.strategic_intents.length}</div>
              <div className="text-sm text-gray-600">Intents</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{pyramid.iconic_commitments.length}</div>
              <div className="text-sm text-gray-600">Commitments</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{pyramid.team_objectives.length}</div>
              <div className="text-sm text-gray-600">Objectives</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 bg-white rounded-lg shadow-md p-2">
          <button
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              activeTab === "purpose"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("purpose")}
          >
            PURPOSE (The Why)
          </button>
          <button
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              activeTab === "strategy"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("strategy")}
          >
            STRATEGY (The How)
          </button>
          <button
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              activeTab === "execution"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("execution")}
          >
            EXECUTION (The What)
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === "purpose" && (
          <div className="space-y-6">
            {/* Vision */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Tier 1: Vision/Mission/Belief</h2>
              <p className="text-gray-600 mb-4">Why we exist - our purpose and aspirations</p>

              {pyramid.vision?.statements.map((stmt) => (
                <div key={stmt.id} className="p-4 bg-blue-50 rounded-lg mb-3">
                  <div className="font-medium text-blue-900 capitalize">{stmt.statement_type}</div>
                  <div className="text-gray-700">{stmt.statement}</div>
                </div>
              ))}

              <form onSubmit={handleAddVision} className="space-y-3">
                <Textarea
                  label="Vision Statement (minimum 10 characters)"
                  value={visionStatement}
                  onChange={(e) => setVisionStatement(e.target.value)}
                  placeholder="Our vision is to transform the way organizations..."
                  rows={3}
                  required
                />
                <div className="text-sm text-gray-600">
                  {visionStatement.length}/10 characters (minimum)
                </div>
                <Button type="submit" disabled={visionStatement.length < 10}>
                  Add Vision Statement
                </Button>
              </form>
            </div>

            {/* Values */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Tier 2: Values</h2>
              <p className="text-gray-600 mb-4">What matters to us - 3-5 core principles</p>

              <div className="grid md:grid-cols-2 gap-3 mb-4">
                {pyramid.values.map((value) => (
                  <div key={value.id} className="p-4 bg-blue-50 rounded-lg">
                    <div className="font-bold text-blue-900">{value.name}</div>
                    {value.description && (
                      <div className="text-sm text-gray-700 mt-1">{value.description}</div>
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddValue} className="space-y-3">
                <Input
                  label="Value Name"
                  value={valueName}
                  onChange={(e) => setValueName(e.target.value)}
                  placeholder="e.g., Trust, Innovation, Excellence"
                />
                <Textarea
                  label="Description (Optional)"
                  value={valueDescription}
                  onChange={(e) => setValueDescription(e.target.value)}
                  placeholder="What this value means..."
                  rows={2}
                />
                <Button type="submit">Add Value</Button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "strategy" && (
          <div className="space-y-6">
            {/* Strategic Drivers */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Tier 5: Strategic Drivers</h2>
              <p className="text-gray-600 mb-4">Where we focus - 3-5 major themes/pillars</p>

              <div className="space-y-3 mb-4">
                {pyramid.strategic_drivers.map((driver) => (
                  <div key={driver.id} className="p-4 bg-blue-50 rounded-lg">
                    <div className="font-bold text-blue-900 text-lg">{driver.name}</div>
                    <div className="text-gray-700 mt-1">{driver.description}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddDriver} className="space-y-3">
                <Input
                  label="Driver Name (1-3 words recommended)"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g., Customer Experience, Innovation"
                  required
                />
                <Textarea
                  label="Description (minimum 10 characters)"
                  value={driverDescription}
                  onChange={(e) => setDriverDescription(e.target.value)}
                  placeholder="What this driver means and why it matters..."
                  rows={3}
                  required
                />
                <div className="text-sm text-gray-600">
                  {driverDescription.length}/10 characters (minimum)
                </div>
                <Button type="submit" disabled={!driverName.trim() || driverDescription.length < 10}>
                  Add Strategic Driver
                </Button>
              </form>
            </div>

            {/* Strategic Intents */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Tier 4: Strategic Intent</h2>
              <p className="text-gray-600 mb-4">What success looks like - aspirational statements</p>

              <div className="space-y-3 mb-4">
                {pyramid.strategic_intents.map((intent) => {
                  const driver = pyramid.strategic_drivers.find(d => d.id === intent.driver_id);
                  return (
                    <div key={intent.id} className="p-4 bg-green-50 rounded-lg">
                      <div className="text-xs text-green-700 font-medium mb-1">
                        {driver?.name || "Unknown Driver"}
                      </div>
                      <div className="text-gray-700">{intent.statement}</div>
                    </div>
                  );
                })}
              </div>

              {pyramid.strategic_drivers.length > 0 ? (
                <form onSubmit={handleAddIntent} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Strategic Driver
                    </label>
                    <select
                      className="input"
                      value={selectedDriver}
                      onChange={(e) => setSelectedDriver(e.target.value)}
                      required
                    >
                      <option value="">Select a driver...</option>
                      {pyramid.strategic_drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Textarea
                    label="Intent Statement (minimum 20 characters)"
                    value={intentStatement}
                    onChange={(e) => setIntentStatement(e.target.value)}
                    placeholder="What does success look like for this driver? Describe the aspirational future state..."
                    rows={3}
                    required
                  />
                  <div className="text-sm text-gray-600">
                    {intentStatement.length}/20 characters (minimum)
                  </div>
                  <Button type="submit" disabled={!selectedDriver || intentStatement.length < 20}>
                    Add Strategic Intent
                  </Button>
                </form>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  Add Strategic Drivers first before adding Intents.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "execution" && (
          <div className="space-y-6">
            {/* Iconic Commitments */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Tier 7: Iconic Commitments</h2>
              <p className="text-gray-600 mb-4">Time-bound milestones that bring strategy to life</p>

              <div className="space-y-3 mb-4">
                {pyramid.iconic_commitments.map((commitment) => {
                  const driver = pyramid.strategic_drivers.find(d => d.id === commitment.primary_driver_id);
                  return (
                    <div key={commitment.id} className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-purple-900">{commitment.name}</div>
                        <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm">
                          {commitment.horizon}
                        </span>
                      </div>
                      <div className="text-gray-700 mb-1">{commitment.description}</div>
                      <div className="text-xs text-purple-700">Driver: {driver?.name}</div>
                    </div>
                  );
                })}
              </div>

              {pyramid.strategic_drivers.length > 0 ? (
                <form onSubmit={handleAddCommitment} className="space-y-3">
                  <Input
                    label="Commitment Name"
                    value={commitmentName}
                    onChange={(e) => setCommitmentName(e.target.value)}
                    placeholder="e.g., Launch New Platform"
                  />
                  <Textarea
                    label="Description"
                    value={commitmentDescription}
                    onChange={(e) => setCommitmentDescription(e.target.value)}
                    placeholder="What will be delivered..."
                    rows={3}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Driver
                      </label>
                      <select
                        className="input"
                        value={selectedDriver}
                        onChange={(e) => setSelectedDriver(e.target.value)}
                        required
                      >
                        <option value="">Select a driver...</option>
                        {pyramid.strategic_drivers.map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Horizon
                      </label>
                      <select
                        className="input"
                        value={commitmentHorizon}
                        onChange={(e) => setCommitmentHorizon(e.target.value as Horizon)}
                      >
                        <option value={Horizon.H1}>H1 (0-12 months)</option>
                        <option value={Horizon.H2}>H2 (12-24 months)</option>
                        <option value={Horizon.H3}>H3 (24-36 months)</option>
                      </select>
                    </div>
                  </div>
                  <Button type="submit">Add Commitment</Button>
                </form>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  Add Strategic Drivers first before adding Commitments.
                </div>
              )}
            </div>

            {/* Team and Individual Objectives Section Placeholder */}
            <div className="card bg-gray-50">
              <h3 className="text-xl font-bold text-gray-700 mb-2">Tier 8 & 9: Team and Individual Objectives</h3>
              <p className="text-gray-600">
                Similar forms for Team and Individual Objectives can be added here following the same pattern.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
