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
import Modal from "@/components/ui/Modal";
import TierHeader from "@/components/ui/TierHeader";
import TierCard from "@/components/ui/TierCard";
import PyramidVisualization from "@/components/visualizations/PyramidVisualization";
import { StatementType, Horizon } from "@/types/pyramid";
import { Save, Home, CheckCircle, FileDown, Eye, Trash2, Edit, Plus } from "lucide-react";

export default function BuilderPage() {
  const router = useRouter();
  const { sessionId, pyramid, setPyramid, setLoading, setError, showToast, isLoading } = usePyramidStore();
  const [activeTier, setActiveTier] = useState<string | undefined>(undefined);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalItemType, setModalItemType] = useState<string>('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

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

  const handleTierClick = (tierId: string) => {
    // Simply set the active tier - content will appear in the right panel
    setActiveTier(tierId);
  };

  const openAddModal = (tierType: string) => {
    setModalMode('add');
    setModalItemType(tierType);
    setEditingItemId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tierType: string, itemId: string, itemData: any) => {
    setModalMode('edit');
    setModalItemType(tierType);
    setEditingItemId(itemId);
    setEditFormData(itemData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalItemType('');
    setEditingItemId(null);
    setEditFormData({});
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
    const itemId = editingItemId || editingId; // Support both modal and inline editing
    if (!itemId) return;

    try {
      setLoading(true);

      switch (type) {
        case "vision":
          await visionApi.updateStatement(
            sessionId,
            itemId,
            editFormData.statement_type,
            editFormData.statement
          );
          break;
        case "value":
          await valuesApi.update(
            sessionId,
            itemId,
            editFormData.name,
            editFormData.description
          );
          break;
        case "behaviour":
          await behavioursApi.update(
            sessionId,
            itemId,
            editFormData.statement,
            editFormData.value_ids
          );
          break;
        case "driver":
          await driversApi.update(
            sessionId,
            itemId,
            editFormData.name,
            editFormData.description,
            editFormData.rationale
          );
          break;
        case "intent":
          await intentsApi.update(
            sessionId,
            itemId,
            editFormData.statement,
            editFormData.driver_id
          );
          break;
        case "enabler":
          await enablersApi.update(
            sessionId,
            itemId,
            editFormData.name,
            editFormData.description,
            editFormData.driver_ids,
            editFormData.enabler_type
          );
          break;
        case "commitment":
          await commitmentsApi.update(
            sessionId,
            itemId,
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
            itemId,
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
            itemId,
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

      // Close modal if in modal mode, otherwise use inline edit cancel
      if (editingItemId) {
        closeModal();
      } else {
        cancelEdit();
      }
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
      closeModal();
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
      closeModal();
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
      closeModal();
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
      closeModal();
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
      closeModal();
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
      closeModal();
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
      closeModal();
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
      closeModal();
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
      closeModal();
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{pyramid.metadata.project_name}</h1>
              <p className="text-sm text-gray-600">{pyramid.metadata.organization}</p>
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
        </div>
      </div>

      {/* Main Content Area - Side by Side */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Fixed Pyramid */}
        <div className="w-96 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 overflow-y-auto">
          <div className="sticky top-0 bg-gradient-to-b from-gray-50 to-white z-10 border-b border-gray-200">
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Strategic Pyramid</h2>
              <p className="text-xs text-gray-600 mb-4">Click any tier to view and edit</p>
              <PyramidVisualization
                pyramid={pyramid}
                onTierClick={handleTierClick}
                activeTier={activeTier}
                compact={true}
              />
            </div>
          </div>
        </div>

        {/* Right Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-5xl mx-auto p-6">

            {/* Welcome message when no tier selected */}
            {!activeTier && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">👈</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Your Strategic Pyramid</h2>
                  <p className="text-gray-600 max-w-md">
                    Click any tier on the left to start building your strategy. Gray tiers are empty and waiting to be filled!
                  </p>
                </div>
              </div>
            )}

            {/* Vision Content */}
            {activeTier === "vision" && (
              <>
                <TierHeader
                  tierName="Vision / Mission / Belief / Passion"
                  tierDescription="Your fundamental purpose statements - why you exist. Create inspiring statements that guide your entire organization."
                  itemCount={pyramid.vision?.statements?.length || 0}
                  variant="blue"
                  onAddNew={() => openAddModal('vision')}
                  onBack={() => setActiveTier(undefined)}
                />

                <div className="space-y-4">
                  {pyramid.vision?.statements.map((stmt) => (
                    <TierCard
                      key={stmt.id}
                      variant="blue"
                      connections={[]} // Vision has no upstream connections
                      onEdit={() => openEditModal('vision', stmt.id, stmt)}
                      onDelete={() => handleDeleteVisionStatement(stmt.id)}
                    >
                      <div>
                        <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">
                          {stmt.statement_type}
                        </div>
                        <div className="text-gray-900 leading-relaxed">
                          {stmt.statement}
                        </div>
                      </div>
                    </TierCard>
                  ))}

                  {pyramid.vision?.statements.length === 0 && (
                    <div className="text-center py-12 bg-blue-50 rounded-xl border-2 border-dashed border-blue-200">
                      <div className="text-4xl mb-3">🎯</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No vision statements yet</h3>
                      <p className="text-gray-600 mb-4">Start by adding your first vision, mission, or purpose statement</p>
                      <Button onClick={() => openAddModal('vision')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Statement
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Values Content */}
            {activeTier === "values" && (
              <>
                <TierHeader
                  tierName="Values"
                  tierDescription="Your core principles - 3-5 values that guide decision-making and behavior. Each value should be clear, memorable, and meaningful."
                  itemCount={pyramid.values.length}
                  variant="blue"
                  onAddNew={() => openAddModal('value')}
                  onBack={() => setActiveTier(undefined)}
                />

                <div className="space-y-4">
                  {pyramid.values.map((value) => {
                    // Calculate downstream connections to behaviours
                    const downstreamConnections = pyramid.behaviours
                      ?.filter((behaviour) => behaviour.value_ids?.includes(value.id))
                      .map((behaviour) => ({
                        id: behaviour.id,
                        name: behaviour.statement.substring(0, 50) + (behaviour.statement.length > 50 ? '...' : ''),
                        type: 'downstream' as const,
                      })) || [];

                    return (
                      <TierCard
                        key={value.id}
                        variant="blue"
                        connections={downstreamConnections}
                        onEdit={() => openEditModal('value', value.id, value)}
                        onDelete={() => handleDeleteValue(value.id)}
                      >
                        <div>
                          <div className="text-lg font-bold text-blue-900 mb-1">
                            {value.name}
                          </div>
                          {value.description && (
                            <div className="text-gray-700 leading-relaxed">
                              {value.description}
                            </div>
                          )}
                        </div>
                      </TierCard>
                    );
                  })}

                  {pyramid.values.length === 0 && (
                    <div className="text-center py-12 bg-blue-50 rounded-xl border-2 border-dashed border-blue-200">
                      <div className="text-4xl mb-3">💎</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No values yet</h3>
                      <p className="text-gray-600 mb-4">Define 3-5 core principles that guide your organization</p>
                      <Button onClick={() => openAddModal('value')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Value
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Behaviours Content */}
            {activeTier === "behaviours" && (
              <>
                <TierHeader
                  tierName="Behaviours"
                  tierDescription="Observable actions that demonstrate your values. Use action language to make them tangible and measurable."
                  itemCount={pyramid.behaviours?.length || 0}
                  variant="green"
                  onAddNew={pyramid.values.length > 0 ? () => openAddModal('behaviour') : undefined}
                  onBack={() => setActiveTier(undefined)}
                />

                {pyramid.values.length > 0 ? (
                  <div className="space-y-4">
                    {pyramid.behaviours?.map((behaviour) => {
                      // Calculate upstream connections to values
                      const upstreamConnections = behaviour.value_ids
                        ?.map((valueId) => {
                          const value = pyramid.values.find((v) => v.id === valueId);
                          return value ? {
                            id: value.id,
                            name: value.name,
                            type: 'upstream' as const,
                          } : null;
                        })
                        .filter((conn): conn is NonNullable<typeof conn> => conn !== null) || [];

                      return (
                        <TierCard
                          key={behaviour.id}
                          variant="green"
                          connections={upstreamConnections}
                          onEdit={() => openEditModal('behaviour', behaviour.id, behaviour)}
                          onDelete={() => handleDeleteBehaviour(behaviour.id)}
                        >
                          <div className="text-gray-900 leading-relaxed">
                            {behaviour.statement}
                          </div>
                        </TierCard>
                      );
                    })}

                    {(!pyramid.behaviours || pyramid.behaviours.length === 0) && (
                      <div className="text-center py-12 bg-green-50 rounded-xl border-2 border-dashed border-green-200">
                        <div className="text-4xl mb-3">🎬</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No behaviours yet</h3>
                        <p className="text-gray-600 mb-4">Define observable actions that bring your values to life</p>
                        <Button onClick={() => openAddModal('behaviour')}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Behaviour
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl text-center">
                    <div className="text-4xl mb-3">⚠️</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Values Required</h3>
                    <p className="text-yellow-800">Add Values first before adding Behaviours.</p>
                    <Button
                      onClick={() => setActiveTier('values')}
                      variant="secondary"
                      className="mt-4"
                    >
                      Go to Values
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Strategic Drivers Content */}
            {activeTier === "drivers" && (
              <>
                <TierHeader
                  tierName="Strategic Drivers"
                  tierDescription="3-5 major themes or pillars where you'll focus your strategic efforts."
                  itemCount={pyramid.strategic_drivers.length}
                  variant="purple"
                  onAddNew={() => openAddModal('driver')}
                  onBack={() => setActiveTier(undefined)}
                />

                <div className="space-y-4">
                  {pyramid.strategic_drivers.map((driver) => {
                    // Calculate downstream connections
                    const intents = pyramid.strategic_intents.filter((intent) => intent.driver_id === driver.id);
                    const enablers = pyramid.enablers?.filter((enabler) => enabler.driver_ids?.includes(driver.id)) || [];
                    const commitments = pyramid.iconic_commitments.filter((c) => c.primary_driver_id === driver.id);

                    const downstreamConnections = [
                      ...intents.map((intent) => ({
                        id: intent.id,
                        name: `Intent: ${intent.statement.substring(0, 40)}...`,
                        type: 'downstream' as const,
                      })),
                      ...enablers.map((enabler) => ({
                        id: enabler.id,
                        name: `Enabler: ${enabler.name}`,
                        type: 'downstream' as const,
                      })),
                      ...commitments.map((commitment) => ({
                        id: commitment.id,
                        name: `Commitment: ${commitment.name}`,
                        type: 'downstream' as const,
                      })),
                    ];

                    return (
                      <TierCard
                        key={driver.id}
                        variant="purple"
                        connections={downstreamConnections}
                        onEdit={() => openEditModal('driver', driver.id, driver)}
                        onDelete={() => handleDeleteDriver(driver.id)}
                      >
                        <div>
                          <div className="text-xl font-bold text-purple-900 mb-2">
                            {driver.name}
                          </div>
                          <div className="text-gray-700 leading-relaxed">
                            {driver.description}
                          </div>
                          {driver.rationale && (
                            <div className="mt-2 text-sm text-gray-600 italic">
                              Rationale: {driver.rationale}
                            </div>
                          )}
                        </div>
                      </TierCard>
                    );
                  })}

                  {pyramid.strategic_drivers.length === 0 && (
                    <div className="text-center py-12 bg-purple-50 rounded-xl border-2 border-dashed border-purple-200">
                      <div className="text-4xl mb-3">🎯</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No strategic drivers yet</h3>
                      <p className="text-gray-600 mb-4">Define 3-5 major themes where you'll focus your strategic efforts</p>
                      <Button onClick={() => openAddModal('driver')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Driver
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Strategic Intents Content */}
            {activeTier === "intents" && (
            <div id="tier-intents" className="card scroll-mt-6">
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
            )}

            {/* Enablers Content */}
            {activeTier === "enablers" && (
            <div id="tier-enablers" className="card scroll-mt-6">
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
            )}

            {/* Iconic Commitments Content */}
            {activeTier === "commitments" && (
            <div id="tier-commitments" className="card scroll-mt-6">
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
            )}

            {/* Team Objectives Content */}
            {activeTier === "team" && (
            <div id="tier-team" className="card scroll-mt-6">
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
            )}

            {/* Individual Objectives Content */}
            {activeTier === "individual" && (
            <div id="tier-individual" className="card scroll-mt-6">
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
            )}

          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Forms */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalMode === 'add'
            ? `Add New ${modalItemType === 'vision' ? 'Vision Statement' :
                modalItemType === 'value' ? 'Value' :
                modalItemType === 'behaviour' ? 'Behaviour' :
                modalItemType === 'driver' ? 'Strategic Driver' :
                modalItemType === 'intent' ? 'Strategic Intent' :
                modalItemType === 'enabler' ? 'Enabler' :
                modalItemType === 'commitment' ? 'Iconic Commitment' :
                modalItemType === 'team_objective' ? 'Team Objective' :
                modalItemType === 'individual_objective' ? 'Individual Objective' : ''}`
            : `Edit ${modalItemType === 'vision' ? 'Vision Statement' :
                modalItemType === 'value' ? 'Value' :
                modalItemType === 'behaviour' ? 'Behaviour' :
                modalItemType === 'driver' ? 'Strategic Driver' :
                modalItemType === 'intent' ? 'Strategic Intent' :
                modalItemType === 'enabler' ? 'Enabler' :
                modalItemType === 'commitment' ? 'Iconic Commitment' :
                modalItemType === 'team_objective' ? 'Team Objective' :
                modalItemType === 'individual_objective' ? 'Individual Objective' : ''}`
        }
        size={modalItemType === 'behaviour' || modalItemType === 'enabler' || modalItemType === 'individual_objective' ? 'lg' : 'md'}
      >
        {/* Vision Form */}
        {modalItemType === 'vision' && (
          <form onSubmit={modalMode === 'add' ? handleAddVision : (e) => { e.preventDefault(); handleSaveEdit('vision'); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statement Type
              </label>
              <select
                className="input"
                value={modalMode === 'edit' ? editFormData.statement_type : visionStatementType}
                onChange={(e) => {
                  if (modalMode === 'edit') {
                    setEditFormData({ ...editFormData, statement_type: e.target.value });
                  } else {
                    setVisionStatementType(e.target.value as StatementType);
                  }
                }}
                required
              >
                <option value={StatementType.VISION}>Vision</option>
                <option value={StatementType.MISSION}>Mission</option>
                <option value={StatementType.BELIEF}>Belief</option>
                <option value={StatementType.PASSION}>Passion</option>
              </select>
            </div>
            <Textarea
              label="Statement"
              value={modalMode === 'edit' ? editFormData.statement : visionStatement}
              onChange={(e) => {
                if (modalMode === 'edit') {
                  setEditFormData({ ...editFormData, statement: e.target.value });
                } else {
                  setVisionStatement(e.target.value);
                }
              }}
              placeholder="Enter your inspiring statement here..."
              rows={4}
              required
            />
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="button" variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {modalMode === 'add' ? 'Add Statement' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}

        {/* Values Form */}
        {modalItemType === 'value' && (
          <form onSubmit={modalMode === 'add' ? handleAddValue : (e) => { e.preventDefault(); handleSaveEdit('value'); }} className="space-y-4">
            <Input
              label="Value Name"
              value={modalMode === 'edit' ? editFormData.name : valueName}
              onChange={(e) => {
                if (modalMode === 'edit') {
                  setEditFormData({ ...editFormData, name: e.target.value });
                } else {
                  setValueName(e.target.value);
                }
              }}
              placeholder="e.g., Trust, Innovation, Excellence"
              required
            />
            <Textarea
              label="Description (Optional)"
              value={modalMode === 'edit' ? editFormData.description : valueDescription}
              onChange={(e) => {
                if (modalMode === 'edit') {
                  setEditFormData({ ...editFormData, description: e.target.value });
                } else {
                  setValueDescription(e.target.value);
                }
              }}
              placeholder="What this value means to your organization..."
              rows={3}
            />
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="button" variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {modalMode === 'add' ? 'Add Value' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}

        {/* Behaviours Form */}
        {modalItemType === 'behaviour' && (
          <form onSubmit={modalMode === 'add' ? handleAddBehaviour : (e) => { e.preventDefault(); handleSaveEdit('behaviour'); }} className="space-y-4">
            <Textarea
              label="Behaviour Statement"
              value={modalMode === 'edit' ? editFormData.statement : behaviourStatement}
              onChange={(e) => {
                if (modalMode === 'edit') {
                  setEditFormData({ ...editFormData, statement: e.target.value });
                } else {
                  setBehaviourStatement(e.target.value);
                }
              }}
              placeholder="e.g., We actively seek diverse perspectives before making decisions..."
              rows={4}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link to Values (select one or more)
              </label>
              <div className="grid md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {pyramid.values.map((value) => (
                  <label key={value.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modalMode === 'edit'
                        ? (editFormData.value_ids || []).includes(value.id)
                        : selectedValueIds.includes(value.id)}
                      onChange={() => {
                        if (modalMode === 'edit') {
                          const currentIds = editFormData.value_ids || [];
                          const newIds = currentIds.includes(value.id)
                            ? currentIds.filter((id: string) => id !== value.id)
                            : [...currentIds, value.id];
                          setEditFormData({ ...editFormData, value_ids: newIds });
                        } else {
                          toggleValueSelection(value.id);
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">{value.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="button" variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {modalMode === 'add' ? 'Add Behaviour' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}

        {/* Driver Form */}
        {modalItemType === 'driver' && (
          <form onSubmit={modalMode === 'add' ? handleAddDriver : (e) => { e.preventDefault(); handleSaveEdit('driver'); }} className="space-y-4">
            <Input
              label="Driver Name (1-3 words recommended)"
              value={modalMode === 'edit' ? editFormData.name : driverName}
              onChange={(e) => {
                if (modalMode === 'edit') {
                  setEditFormData({ ...editFormData, name: e.target.value });
                } else {
                  setDriverName(e.target.value);
                }
              }}
              placeholder="e.g., Customer Experience, Innovation"
              required
            />
            <Textarea
              label="Description"
              value={modalMode === 'edit' ? editFormData.description : driverDescription}
              onChange={(e) => {
                if (modalMode === 'edit') {
                  setEditFormData({ ...editFormData, description: e.target.value });
                } else {
                  setDriverDescription(e.target.value);
                }
              }}
              placeholder="What this driver means and why it matters..."
              rows={3}
              required
            />
            {modalMode === 'edit' && (
              <Textarea
                label="Rationale (Optional)"
                value={editFormData.rationale || ''}
                onChange={(e) => setEditFormData({ ...editFormData, rationale: e.target.value })}
                placeholder="Why this driver was chosen..."
                rows={2}
              />
            )}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="button" variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {modalMode === 'add' ? 'Add Driver' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
