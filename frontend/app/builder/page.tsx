"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePyramidStore } from "@/lib/store";
import {
  pyramidApi,
  visionApi,
  valuesApi,
  behavioursApi,
  driversApi,
  intentsApi,
  enablersApi,
  commitmentsApi,
  teamObjectivesApi,
  individualObjectivesApi
} from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { StatementType, Horizon } from "@/types/pyramid";
import { Save, Home, CheckCircle, FileDown, Eye, Trash2, Edit, BarChart3 } from "lucide-react";

export default function BuilderPage() {
  const router = useRouter();
  const { sessionId, pyramid, setPyramid, setLoading, setError, showToast, isLoading } = usePyramidStore();
  const [activeTab, setActiveTab] = useState<"purpose" | "strategy" | "execution">("purpose");

  // Form states
  const [visionStatementType, setVisionStatementType] = useState<StatementType>(StatementType.VISION);
  const [visionStatement, setVisionStatement] = useState("");
  const [valueName, setValueName] = useState("");
  const [valueDescription, setValueDescription] = useState("");
  const [behaviourStatement, setBehaviourStatement] = useState("");
  const [selectedValueIds, setSelectedValueIds] = useState<string[]>([]);
  const [driverName, setDriverName] = useState("");
  const [driverDescription, setDriverDescription] = useState("");
  const [intentStatement, setIntentStatement] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [enablerName, setEnablerName] = useState("");
  const [enablerDescription, setEnablerDescription] = useState("");
  const [enablerType, setEnablerType] = useState("");
  const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>([]);
  const [commitmentName, setCommitmentName] = useState("");
  const [commitmentDescription, setCommitmentDescription] = useState("");
  const [commitmentHorizon, setCommitmentHorizon] = useState<Horizon>(Horizon.H1);
  const [teamObjectiveName, setTeamObjectiveName] = useState("");
  const [teamObjectiveDescription, setTeamObjectiveDescription] = useState("");
  const [teamName, setTeamName] = useState("");
  const [selectedCommitment, setSelectedCommitment] = useState("");
  const [individualObjectiveName, setIndividualObjectiveName] = useState("");
  const [individualObjectiveDescription, setIndividualObjectiveDescription] = useState("");
  const [individualName, setIndividualName] = useState("");
  const [selectedTeamObjectiveIds, setSelectedTeamObjectiveIds] = useState<string[]>([]);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editType, setEditType] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

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

  const handleDeleteVisionStatement = async (statementId: string) => {
    if (!confirm("Are you sure you want to delete this statement?")) return;

    try {
      setLoading(true);
      await visionApi.removeStatement(sessionId, statementId);
      await refreshPyramid();
      showToast("Vision statement deleted", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to delete vision statement", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteValue = async (valueId: string) => {
    if (!confirm("Are you sure you want to delete this value?")) return;

    try {
      setLoading(true);
      await valuesApi.remove(sessionId, valueId);
      await refreshPyramid();
      showToast("Value deleted", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to delete value", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBehaviour = async (behaviourId: string) => {
    if (!confirm("Are you sure you want to delete this behaviour?")) return;

    try {
      setLoading(true);
      await behavioursApi.remove(sessionId, behaviourId);
      await refreshPyramid();
      showToast("Behaviour deleted", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to delete behaviour", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDriver = async (driverId: string) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;

    try {
      setLoading(true);
      await driversApi.remove(sessionId, driverId);
      await refreshPyramid();
      showToast("Driver deleted", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to delete driver", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIntent = async (intentId: string) => {
    if (!confirm("Are you sure you want to delete this intent?")) return;

    try {
      setLoading(true);
      await intentsApi.remove(sessionId, intentId);
      await refreshPyramid();
      showToast("Intent deleted", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to delete intent", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEnabler = async (enablerId: string) => {
    if (!confirm("Are you sure you want to delete this enabler?")) return;

    try {
      setLoading(true);
      await enablersApi.remove(sessionId, enablerId);
      await refreshPyramid();
      showToast("Enabler deleted", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to delete enabler", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCommitment = async (commitmentId: string) => {
    if (!confirm("Are you sure you want to delete this commitment?")) return;

    try {
      setLoading(true);
      await commitmentsApi.remove(sessionId, commitmentId);
      await refreshPyramid();
      showToast("Commitment deleted", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to delete commitment", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeamObjective = async (objectiveId: string) => {
    if (!confirm("Are you sure you want to delete this team objective?")) return;

    try {
      setLoading(true);
      await teamObjectivesApi.remove(sessionId, objectiveId);
      await refreshPyramid();
      showToast("Team objective deleted", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to delete team objective", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIndividualObjective = async (objectiveId: string) => {
    if (!confirm("Are you sure you want to delete this individual objective?")) return;

    try {
      setLoading(true);
      await individualObjectivesApi.remove(sessionId, objectiveId);
      await refreshPyramid();
      showToast("Individual objective deleted", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to delete individual objective", "error");
    } finally {
      setLoading(false);
    }
  };

  // Edit mode helpers
  const startEdit = (id: string, type: string, currentData: any) => {
    setEditingId(id);
    setEditType(type);
    setEditFormData(currentData);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditType(null);
    setEditFormData({});
  };

  const handleSaveEdit = async (type: string) => {
    if (!editingId) return;

    try {
      setLoading(true);

      switch (type) {
        case "vision":
          await visionApi.updateStatement(
            sessionId,
            editingId,
            editFormData.statement_type,
            editFormData.statement
          );
          break;
        case "value":
          await valuesApi.update(
            sessionId,
            editingId,
            editFormData.name,
            editFormData.description
          );
          break;
        case "behaviour":
          await behavioursApi.update(
            sessionId,
            editingId,
            editFormData.statement,
            editFormData.value_ids
          );
          break;
        case "driver":
          await driversApi.update(
            sessionId,
            editingId,
            editFormData.name,
            editFormData.description,
            editFormData.rationale
          );
          break;
        case "intent":
          await intentsApi.update(
            sessionId,
            editingId,
            editFormData.statement,
            editFormData.driver_id
          );
          break;
        case "enabler":
          await enablersApi.update(
            sessionId,
            editingId,
            editFormData.name,
            editFormData.description,
            editFormData.driver_ids,
            editFormData.enabler_type
          );
          break;
        case "commitment":
          await commitmentsApi.update(
            sessionId,
            editingId,
            editFormData.name,
            editFormData.description,
            editFormData.horizon,
            editFormData.target_date,
            editFormData.primary_driver_id,
            editFormData.owner
          );
          break;
        case "team_objective":
          await teamObjectivesApi.update(
            sessionId,
            editingId,
            editFormData.name,
            editFormData.description,
            editFormData.team_name,
            editFormData.primary_commitment_id,
            editFormData.metrics,
            editFormData.owner
          );
          break;
        case "individual_objective":
          await individualObjectivesApi.update(
            sessionId,
            editingId,
            editFormData.name,
            editFormData.description,
            editFormData.individual_name,
            editFormData.team_objective_ids,
            editFormData.success_criteria
          );
          break;
      }

      await refreshPyramid();
      showToast("Successfully updated", "success");
      cancelEdit();
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to update", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visionStatement.trim()) return;

    try {
      setLoading(true);
      await visionApi.addStatement(sessionId, visionStatementType, visionStatement);
      setVisionStatement("");
      setVisionStatementType(StatementType.VISION);
      await refreshPyramid();
      showToast("Vision statement added successfully", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to add vision", "error");
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
      showToast("Value added successfully", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to add value", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBehaviour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!behaviourStatement.trim()) return;

    try {
      setLoading(true);
      await behavioursApi.add(sessionId, behaviourStatement, selectedValueIds);
      setBehaviourStatement("");
      setSelectedValueIds([]);
      await refreshPyramid();
      showToast("Behaviour added successfully", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to add behaviour", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleValueSelection = (valueId: string) => {
    setSelectedValueIds((prev) =>
      prev.includes(valueId) ? prev.filter((id) => id !== valueId) : [...prev, valueId]
    );
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
      showToast("Strategic driver added successfully", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to add driver", "error");
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
      showToast("Strategic intent added successfully", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to add intent", "error");
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
      showToast("Iconic commitment added successfully", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to add commitment", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEnabler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enablerName.trim() || !enablerDescription.trim()) return;

    try {
      setLoading(true);
      await enablersApi.add(
        sessionId,
        enablerName,
        enablerDescription,
        selectedDriverIds,
        enablerType
      );
      setEnablerName("");
      setEnablerDescription("");
      setEnablerType("");
      setSelectedDriverIds([]);
      await refreshPyramid();
      showToast("Enabler added successfully", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to add enabler", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleDriverSelection = (driverId: string) => {
    setSelectedDriverIds((prev) =>
      prev.includes(driverId) ? prev.filter((id) => id !== driverId) : [...prev, driverId]
    );
  };

  const handleAddTeamObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamObjectiveName.trim() || !teamObjectiveDescription.trim() || !teamName.trim()) return;

    try {
      setLoading(true);
      await teamObjectivesApi.add(
        sessionId,
        teamObjectiveName,
        teamObjectiveDescription,
        teamName,
        selectedCommitment || undefined
      );
      setTeamObjectiveName("");
      setTeamObjectiveDescription("");
      setTeamName("");
      setSelectedCommitment("");
      await refreshPyramid();
      showToast("Team objective added successfully", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to add team objective", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddIndividualObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!individualObjectiveName.trim() || !individualObjectiveDescription.trim() || !individualName.trim()) return;

    try {
      setLoading(true);
      await individualObjectivesApi.add(
        sessionId,
        individualObjectiveName,
        individualObjectiveDescription,
        individualName,
        selectedTeamObjectiveIds.length > 0 ? selectedTeamObjectiveIds : undefined
      );
      setIndividualObjectiveName("");
      setIndividualObjectiveDescription("");
      setIndividualName("");
      setSelectedTeamObjectiveIds([]);
      await refreshPyramid();
      showToast("Individual objective added successfully", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to add individual objective", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleTeamObjectiveSelection = (objectiveId: string) => {
    setSelectedTeamObjectiveIds((prev) =>
      prev.includes(objectiveId) ? prev.filter((id) => id !== objectiveId) : [...prev, objectiveId]
    );
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
              <Button variant="secondary" onClick={() => router.push("/visualizations")}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Visualizations
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
          <div className="grid grid-cols-6 gap-3 mt-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{pyramid.values.length}</div>
              <div className="text-sm text-gray-600">Values</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{pyramid.behaviours?.length || 0}</div>
              <div className="text-sm text-gray-600">Behaviours</div>
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
              <div className="text-2xl font-bold text-blue-600">{pyramid.team_objectives?.length || 0}</div>
              <div className="text-sm text-gray-600">Team Obj.</div>
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
              <h2 className="text-2xl font-bold mb-2">Tier 1: Vision / Mission / Belief / Passion</h2>
              <p className="text-gray-600 mb-4">Your fundamental purpose statements - why you exist</p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>💡 Guidance:</strong> Your purpose defines why you exist. It's permanent and enduring.
                  You can add multiple types: <strong>Vision</strong> (where you're going), <strong>Mission</strong> (what you do),
                  <strong>Belief</strong> (what you stand for), or <strong>Passion</strong> (what drives you).
                  Take time to craft statements that inspire and provide direction.
                </p>
              </div>

              {pyramid.vision?.statements.map((stmt) => (
                <div key={stmt.id} className="p-4 bg-blue-50 rounded-lg mb-3">
                  {editingId === stmt.id && editType === "vision" ? (
                    // Edit mode
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Statement Type
                        </label>
                        <select
                          className="input"
                          value={editFormData.statement_type || StatementType.VISION}
                          onChange={(e) => setEditFormData({ ...editFormData, statement_type: e.target.value as StatementType })}
                        >
                          <option value={StatementType.VISION}>Vision - Where we're going</option>
                          <option value={StatementType.MISSION}>Mission - What we do</option>
                          <option value={StatementType.BELIEF}>Belief - What we stand for</option>
                          <option value={StatementType.PASSION}>Passion - What drives us</option>
                          <option value={StatementType.PURPOSE}>Purpose - Why we exist</option>
                          <option value={StatementType.ASPIRATION}>Aspiration - What we aim for</option>
                        </select>
                      </div>
                      <Textarea
                        label="Statement"
                        value={editFormData.statement || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, statement: e.target.value })}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => handleSaveEdit("vision")} size="sm">
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button onClick={cancelEdit} variant="ghost" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Display mode
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-blue-900 capitalize">{stmt.statement_type}</div>
                        <div className="text-gray-700">{stmt.statement}</div>
                      </div>
                      <div className="flex gap-1 ml-3">
                        <button
                          onClick={() => startEdit(stmt.id, "vision", stmt)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Edit statement"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVisionStatement(stmt.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="Delete statement"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <form onSubmit={handleAddVision} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statement Type
                  </label>
                  <select
                    className="input"
                    value={visionStatementType}
                    onChange={(e) => setVisionStatementType(e.target.value as StatementType)}
                  >
                    <option value={StatementType.VISION}>Vision - Where we're going</option>
                    <option value={StatementType.MISSION}>Mission - What we do</option>
                    <option value={StatementType.BELIEF}>Belief - What we stand for</option>
                    <option value={StatementType.PASSION}>Passion - What drives us</option>
                    <option value={StatementType.PURPOSE}>Purpose - Why we exist</option>
                    <option value={StatementType.ASPIRATION}>Aspiration - What we aim for</option>
                  </select>
                </div>
                <Textarea
                  label="Statement (minimum 10 characters)"
                  value={visionStatement}
                  onChange={(e) => setVisionStatement(e.target.value)}
                  placeholder="Our vision is to transform the way organizations build strategy..."
                  rows={3}
                  required
                />
                <div className="text-sm text-gray-600">
                  {visionStatement.length}/10 characters (minimum)
                </div>
                <Button type="submit" disabled={visionStatement.length < 10}>
                  Add Statement
                </Button>
              </form>
            </div>

            {/* Values */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Tier 2: Values</h2>
              <p className="text-gray-600 mb-4">What matters to us - 3-5 core principles</p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>💡 Guidance:</strong> Values are the principles that guide decision-making and behavior.
                  Keep to 3-5 core values. Each value should be clear, memorable, and meaningful to your organization.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mb-4">
                {pyramid.values.map((value) => (
                  <div key={value.id} className="p-4 bg-blue-50 rounded-lg">
                    {editingId === value.id && editType === "value" ? (
                      // Edit mode
                      <div className="space-y-3">
                        <Input
                          label="Value Name"
                          value={editFormData.name || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        />
                        <Textarea
                          label="Description"
                          value={editFormData.description || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => handleSaveEdit("value")} size="sm">
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button onClick={cancelEdit} variant="ghost" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Display mode
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-bold text-blue-900">{value.name}</div>
                          {value.description && (
                            <div className="text-sm text-gray-700 mt-1">{value.description}</div>
                          )}
                        </div>
                        <div className="flex gap-1 ml-3 flex-shrink-0">
                          <button
                            onClick={() => startEdit(value.id, "value", value)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Edit value"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteValue(value.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete value"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
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

            {/* Behaviours */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Tier 3: Behaviours</h2>
              <p className="text-gray-600 mb-4">How we live our values - observable actions</p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-900">
                  <strong>💡 Guidance:</strong> Behaviours are specific, observable actions that demonstrate your values.
                  Each behaviour should clearly link to one or more values. Use action language ("We listen actively",
                  "We challenge ideas constructively") to make them tangible and measurable.
                </p>
              </div>

              <div className="space-y-3 mb-4">
                {pyramid.behaviours?.map((behaviour) => (
                  <div key={behaviour.id} className="p-4 bg-green-50 rounded-lg">
                    {editingId === behaviour.id && editType === "behaviour" ? (
                      // Edit mode
                      <div className="space-y-3">
                        <Textarea
                          label="Behaviour Statement"
                          value={editFormData.statement || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, statement: e.target.value })}
                          rows={3}
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Link to Values
                          </label>
                          <div className="grid md:grid-cols-2 gap-2">
                            {pyramid.values.map((value) => (
                              <label key={value.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={(editFormData.value_ids || []).includes(value.id)}
                                  onChange={(e) => {
                                    const currentIds = editFormData.value_ids || [];
                                    const newIds = e.target.checked
                                      ? [...currentIds, value.id]
                                      : currentIds.filter((id: string) => id !== value.id);
                                    setEditFormData({ ...editFormData, value_ids: newIds });
                                  }}
                                  className="rounded"
                                />
                                <span className="text-sm font-medium">{value.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleSaveEdit("behaviour")} size="sm">
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button onClick={cancelEdit} variant="ghost" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Display mode
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-gray-700 mb-2">{behaviour.statement}</div>
                          {behaviour.value_ids && behaviour.value_ids.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {behaviour.value_ids.map((valueId) => {
                                const value = pyramid.values.find((v) => v.id === valueId);
                                return value ? (
                                  <span
                                    key={valueId}
                                    className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs"
                                  >
                                    {value.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 ml-3 flex-shrink-0">
                          <button
                            onClick={() => startEdit(behaviour.id, "behaviour", behaviour)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Edit behaviour"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBehaviour(behaviour.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete behaviour"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {pyramid.values.length > 0 ? (
                <form onSubmit={handleAddBehaviour} className="space-y-3">
                  <Textarea
                    label="Behaviour Statement"
                    value={behaviourStatement}
                    onChange={(e) => setBehaviourStatement(e.target.value)}
                    placeholder="e.g., We actively seek diverse perspectives before making decisions..."
                    rows={3}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link to Values (select one or more)
                    </label>
                    <div className="grid md:grid-cols-2 gap-2">
                      {pyramid.values.map((value) => (
                        <label key={value.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedValueIds.includes(value.id)}
                            onChange={() => toggleValueSelection(value.id)}
                            className="rounded"
                          />
                          <span className="text-sm font-medium">{value.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Button type="submit">Add Behaviour</Button>
                </form>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  Add Values first before adding Behaviours.
                </div>
              )}
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
                    {editingId === driver.id && editType === "driver" ? (
                      // Edit mode
                      <div className="space-y-3">
                        <Input
                          label="Driver Name"
                          value={editFormData.name || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        />
                        <Textarea
                          label="Description"
                          value={editFormData.description || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                          rows={3}
                        />
                        <Textarea
                          label="Rationale (Optional)"
                          value={editFormData.rationale || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, rationale: e.target.value })}
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => handleSaveEdit("driver")} size="sm">
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button onClick={cancelEdit} variant="ghost" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Display mode
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-bold text-blue-900 text-lg">{driver.name}</div>
                          <div className="text-gray-700 mt-1">{driver.description}</div>
                        </div>
                        <div className="flex gap-1 ml-3 flex-shrink-0">
                          <button
                            onClick={() => startEdit(driver.id, "driver", driver)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Edit driver"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDriver(driver.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete driver"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
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
                      {editingId === intent.id && editType === "intent" ? (
                        // Edit mode
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Strategic Driver
                            </label>
                            <select
                              className="input"
                              value={editFormData.driver_id || ""}
                              onChange={(e) => setEditFormData({ ...editFormData, driver_id: e.target.value })}
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
                            label="Intent Statement"
                            value={editFormData.statement || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, statement: e.target.value })}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button onClick={() => handleSaveEdit("intent")} size="sm">
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </Button>
                            <Button onClick={cancelEdit} variant="ghost" size="sm">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Display mode
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-xs text-green-700 font-medium mb-1">
                              {driver?.name || "Unknown Driver"}
                            </div>
                            <div className="text-gray-700">{intent.statement}</div>
                          </div>
                          <div className="flex gap-1 ml-3 flex-shrink-0">
                            <button
                              onClick={() => startEdit(intent.id, "intent", intent)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                              title="Edit intent"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteIntent(intent.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Delete intent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
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

            {/* Enablers */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Tier 6: Enablers</h2>
              <p className="text-gray-600 mb-4">What capabilities we need - people, processes, technology</p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-purple-900">
                  <strong>💡 Guidance:</strong> Enablers are the foundational capabilities required to execute your strategy.
                  They typically fall into categories like People & Culture, Processes & Operations, Technology & Data,
                  or Partnerships & Resources. Link enablers to the strategic drivers they support.
                </p>
              </div>

              <div className="space-y-3 mb-4">
                {pyramid.enablers?.map((enabler) => (
                  <div key={enabler.id} className="p-4 bg-purple-50 rounded-lg">
                    {editingId === enabler.id && editType === "enabler" ? (
                      // Edit mode
                      <div className="space-y-3">
                        <Input
                          label="Enabler Name"
                          value={editFormData.name || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        />
                        <Textarea
                          label="Description"
                          value={editFormData.description || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                          rows={3}
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enabler Type (Optional)
                          </label>
                          <select
                            className="input"
                            value={editFormData.enabler_type || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, enabler_type: e.target.value })}
                          >
                            <option value="">Select type...</option>
                            <option value="People & Culture">People & Culture</option>
                            <option value="Process & Operations">Process & Operations</option>
                            <option value="Technology & Data">Technology & Data</option>
                            <option value="Partnerships & Resources">Partnerships & Resources</option>
                          </select>
                        </div>
                        {pyramid.strategic_drivers.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Link to Strategic Drivers (optional)
                            </label>
                            <div className="grid md:grid-cols-2 gap-2">
                              {pyramid.strategic_drivers.map((driver) => (
                                <label key={driver.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={(editFormData.driver_ids || []).includes(driver.id)}
                                    onChange={(e) => {
                                      const currentIds = editFormData.driver_ids || [];
                                      const newIds = e.target.checked
                                        ? [...currentIds, driver.id]
                                        : currentIds.filter((id: string) => id !== driver.id);
                                      setEditFormData({ ...editFormData, driver_ids: newIds });
                                    }}
                                    className="rounded"
                                  />
                                  <span className="text-sm font-medium">{driver.name}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button onClick={() => handleSaveEdit("enabler")} size="sm">
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button onClick={cancelEdit} variant="ghost" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Display mode
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-bold text-purple-900">{enabler.name}</div>
                            {enabler.enabler_type && (
                              <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs">
                                {enabler.enabler_type}
                              </span>
                            )}
                          </div>
                          <div className="text-gray-700 mb-2">{enabler.description}</div>
                          {enabler.driver_ids && enabler.driver_ids.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {enabler.driver_ids.map((driverId) => {
                                const driver = pyramid.strategic_drivers.find((d) => d.id === driverId);
                                return driver ? (
                                  <span
                                    key={driverId}
                                    className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs"
                                  >
                                    {driver.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 ml-3 flex-shrink-0">
                          <button
                            onClick={() => startEdit(enabler.id, "enabler", enabler)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Edit enabler"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEnabler(enabler.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete enabler"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddEnabler} className="space-y-3">
                <Input
                  label="Enabler Name"
                  value={enablerName}
                  onChange={(e) => setEnablerName(e.target.value)}
                  placeholder="e.g., Advanced Analytics Platform"
                  required
                />
                <Textarea
                  label="Description"
                  value={enablerDescription}
                  onChange={(e) => setEnablerDescription(e.target.value)}
                  placeholder="What this enabler provides and why it's needed..."
                  rows={3}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enabler Type (Optional)
                  </label>
                  <select
                    className="input"
                    value={enablerType}
                    onChange={(e) => setEnablerType(e.target.value)}
                  >
                    <option value="">Select type...</option>
                    <option value="People & Culture">People & Culture</option>
                    <option value="Process & Operations">Process & Operations</option>
                    <option value="Technology & Data">Technology & Data</option>
                    <option value="Partnerships & Resources">Partnerships & Resources</option>
                  </select>
                </div>
                {pyramid.strategic_drivers.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link to Strategic Drivers (optional, select one or more)
                    </label>
                    <div className="grid md:grid-cols-2 gap-2">
                      {pyramid.strategic_drivers.map((driver) => (
                        <label key={driver.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedDriverIds.includes(driver.id)}
                            onChange={() => toggleDriverSelection(driver.id)}
                            className="rounded"
                          />
                          <span className="text-sm font-medium">{driver.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <Button type="submit">Add Enabler</Button>
              </form>
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
                      {editingId === commitment.id && editType === "commitment" ? (
                        // Edit mode
                        <div className="space-y-3">
                          <Input
                            label="Commitment Name"
                            value={editFormData.name || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          />
                          <Textarea
                            label="Description"
                            value={editFormData.description || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            rows={3}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Primary Driver
                              </label>
                              <select
                                className="input"
                                value={editFormData.primary_driver_id || ""}
                                onChange={(e) => setEditFormData({ ...editFormData, primary_driver_id: e.target.value })}
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
                                value={editFormData.horizon || Horizon.H1}
                                onChange={(e) => setEditFormData({ ...editFormData, horizon: e.target.value as Horizon })}
                              >
                                <option value={Horizon.H1}>H1 (0-12 months)</option>
                                <option value={Horizon.H2}>H2 (12-24 months)</option>
                                <option value={Horizon.H3}>H3 (24-36 months)</option>
                              </select>
                            </div>
                          </div>
                          <Input
                            label="Owner (Optional)"
                            value={editFormData.owner || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, owner: e.target.value })}
                            placeholder="Person or team responsible"
                          />
                          <Input
                            label="Target Date (Optional)"
                            type="date"
                            value={editFormData.target_date || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, target_date: e.target.value })}
                          />
                          <div className="flex gap-2">
                            <Button onClick={() => handleSaveEdit("commitment")} size="sm">
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </Button>
                            <Button onClick={cancelEdit} variant="ghost" size="sm">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Display mode
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-bold text-purple-900">{commitment.name}</div>
                              <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm">
                                {commitment.horizon}
                              </span>
                            </div>
                            <div className="text-gray-700 mb-1">{commitment.description}</div>
                            <div className="text-xs text-purple-700">Driver: {driver?.name}</div>
                          </div>
                          <div className="flex gap-1 ml-3 flex-shrink-0">
                            <button
                              onClick={() => startEdit(commitment.id, "commitment", commitment)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                              title="Edit commitment"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCommitment(commitment.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Delete commitment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
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

            {/* Team Objectives */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Tier 8: Team Objectives</h2>
              <p className="text-gray-600 mb-4">What each team will deliver - cascaded from commitments</p>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-orange-900">
                  <strong>💡 Guidance:</strong> Team objectives break down iconic commitments into team-level goals.
                  Each objective should be specific, measurable, and owned by a team. Objectives can link to
                  commitments to show the cascade from strategy to execution.
                </p>
              </div>

              <div className="space-y-3 mb-4">
                {pyramid.team_objectives?.map((objective) => {
                  const commitment = pyramid.iconic_commitments.find(
                    (c) => c.id === objective.primary_commitment_id
                  );
                  return (
                    <div key={objective.id} className="p-4 bg-orange-50 rounded-lg">
                      {editingId === objective.id && editType === "team_objective" ? (
                        // Edit mode
                        <div className="space-y-3">
                          <Input
                            label="Objective Name"
                            value={editFormData.name || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          />
                          <Textarea
                            label="Description"
                            value={editFormData.description || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            rows={3}
                          />
                          <Input
                            label="Team Name"
                            value={editFormData.team_name || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, team_name: e.target.value })}
                            placeholder="e.g., Product Team, Engineering"
                          />
                          {pyramid.iconic_commitments.length > 0 && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Link to Commitment (Optional)
                              </label>
                              <select
                                className="input"
                                value={editFormData.primary_commitment_id || ""}
                                onChange={(e) => setEditFormData({ ...editFormData, primary_commitment_id: e.target.value })}
                              >
                                <option value="">Select a commitment...</option>
                                {pyramid.iconic_commitments.map((commitment) => (
                                  <option key={commitment.id} value={commitment.id}>
                                    {commitment.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                          <Input
                            label="Owner (Optional)"
                            value={editFormData.owner || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, owner: e.target.value })}
                            placeholder="Person responsible"
                          />
                          <Textarea
                            label="Metrics (Optional)"
                            value={editFormData.metrics || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, metrics: e.target.value })}
                            rows={2}
                            placeholder="How success will be measured"
                          />
                          <div className="flex gap-2">
                            <Button onClick={() => handleSaveEdit("team_objective")} size="sm">
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </Button>
                            <Button onClick={cancelEdit} variant="ghost" size="sm">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Display mode
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div className="font-bold text-orange-900">{objective.name}</div>
                              <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-xs">
                                {objective.team_name}
                              </span>
                            </div>
                            <div className="text-gray-700 mb-1">{objective.description}</div>
                            {commitment && (
                              <div className="text-xs text-orange-700 mt-2">
                                Commitment: {commitment.name}
                              </div>
                            )}
                            {objective.owner && (
                              <div className="text-xs text-gray-600 mt-1">Owner: {objective.owner}</div>
                            )}
                          </div>
                          <div className="flex gap-1 ml-3 flex-shrink-0">
                            <button
                              onClick={() => startEdit(objective.id, "team_objective", objective)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                              title="Edit team objective"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTeamObjective(objective.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Delete team objective"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleAddTeamObjective} className="space-y-3">
                <Input
                  label="Objective Name"
                  value={teamObjectiveName}
                  onChange={(e) => setTeamObjectiveName(e.target.value)}
                  placeholder="e.g., Launch MVP in Q2"
                  required
                />
                <Textarea
                  label="Description"
                  value={teamObjectiveDescription}
                  onChange={(e) => setTeamObjectiveDescription(e.target.value)}
                  placeholder="What will be achieved..."
                  rows={3}
                  required
                />
                <Input
                  label="Team Name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g., Product Team, Engineering"
                  required
                />
                {pyramid.iconic_commitments.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link to Commitment (Optional)
                    </label>
                    <select
                      className="input"
                      value={selectedCommitment}
                      onChange={(e) => setSelectedCommitment(e.target.value)}
                    >
                      <option value="">Select a commitment...</option>
                      {pyramid.iconic_commitments.map((commitment) => (
                        <option key={commitment.id} value={commitment.id}>
                          {commitment.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <Button type="submit">Add Team Objective</Button>
              </form>
            </div>

            {/* Individual Objectives */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Tier 9: Individual Objectives</h2>
              <p className="text-gray-600 mb-4">Personal goals that support team objectives</p>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-teal-900">
                  <strong>💡 Guidance:</strong> Individual objectives are personal commitments that connect people's
                  work to team goals. They should be clear, achievable, and directly contribute to team success.
                  Link individual objectives to team objectives to show alignment.
                </p>
              </div>

              <div className="space-y-3 mb-4">
                {pyramid.individual_objectives?.map((objective) => (
                  <div key={objective.id} className="p-4 bg-teal-50 rounded-lg">
                    {editingId === objective.id && editType === "individual_objective" ? (
                      // Edit mode
                      <div className="space-y-3">
                        <Input
                          label="Objective Name"
                          value={editFormData.name || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        />
                        <Textarea
                          label="Description"
                          value={editFormData.description || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                          rows={3}
                        />
                        <Input
                          label="Individual Name"
                          value={editFormData.individual_name || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, individual_name: e.target.value })}
                          placeholder="e.g., John Smith"
                        />
                        {pyramid.team_objectives && pyramid.team_objectives.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Link to Team Objectives (optional)
                            </label>
                            <div className="grid md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                              {pyramid.team_objectives.map((teamObj) => (
                                <label key={teamObj.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={(editFormData.team_objective_ids || []).includes(teamObj.id)}
                                    onChange={(e) => {
                                      const currentIds = editFormData.team_objective_ids || [];
                                      const newIds = e.target.checked
                                        ? [...currentIds, teamObj.id]
                                        : currentIds.filter((id: string) => id !== teamObj.id);
                                      setEditFormData({ ...editFormData, team_objective_ids: newIds });
                                    }}
                                    className="rounded"
                                  />
                                  <span className="text-sm font-medium">{teamObj.name}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                        <Textarea
                          label="Success Criteria (Optional)"
                          value={editFormData.success_criteria || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, success_criteria: e.target.value })}
                          rows={2}
                          placeholder="How success will be measured"
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => handleSaveEdit("individual_objective")} size="sm">
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button onClick={cancelEdit} variant="ghost" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Display mode
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-bold text-teal-900">{objective.name}</div>
                            <span className="px-2 py-1 bg-teal-200 text-teal-800 rounded text-xs">
                              {objective.individual_name}
                            </span>
                          </div>
                          <div className="text-gray-700 mb-2">{objective.description}</div>
                          {objective.team_objective_ids && objective.team_objective_ids.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {objective.team_objective_ids.map((teamObjId) => {
                                const teamObj = pyramid.team_objectives?.find((t) => t.id === teamObjId);
                                return teamObj ? (
                                  <span
                                    key={teamObjId}
                                    className="px-2 py-1 bg-teal-200 text-teal-800 rounded text-xs"
                                  >
                                    {teamObj.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 ml-3 flex-shrink-0">
                          <button
                            onClick={() => startEdit(objective.id, "individual_objective", objective)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Edit individual objective"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteIndividualObjective(objective.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete individual objective"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddIndividualObjective} className="space-y-3">
                <Input
                  label="Objective Name"
                  value={individualObjectiveName}
                  onChange={(e) => setIndividualObjectiveName(e.target.value)}
                  placeholder="e.g., Complete certification in Q1"
                  required
                />
                <Textarea
                  label="Description"
                  value={individualObjectiveDescription}
                  onChange={(e) => setIndividualObjectiveDescription(e.target.value)}
                  placeholder="What will be achieved and how it contributes..."
                  rows={3}
                  required
                />
                <Input
                  label="Individual Name"
                  value={individualName}
                  onChange={(e) => setIndividualName(e.target.value)}
                  placeholder="e.g., John Smith"
                  required
                />
                {pyramid.team_objectives && pyramid.team_objectives.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link to Team Objectives (optional, select one or more)
                    </label>
                    <div className="grid md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {pyramid.team_objectives.map((teamObj) => (
                        <label key={teamObj.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedTeamObjectiveIds.includes(teamObj.id)}
                            onChange={() => toggleTeamObjectiveSelection(teamObj.id)}
                            className="rounded"
                          />
                          <span className="text-sm font-medium">{teamObj.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <Button type="submit">Add Individual Objective</Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
