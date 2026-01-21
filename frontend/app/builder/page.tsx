"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import ExecutionReadinessChecklist from "@/components/visualizations/ExecutionReadinessChecklist";
import { StatementType, Horizon } from "@/types/pyramid";
import { Save, Home, CheckCircle, FileDown, Eye, Trash2, Edit, Plus, BarChart3 } from "lucide-react";

export default function BuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sessionId, pyramid, setPyramid, setLoading, setError, showToast, isLoading } = usePyramidStore();
  const [activeTier, setActiveTier] = useState<string | undefined>(undefined);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalItemType, setModalItemType] = useState<string>('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showHomeConfirmation, setShowHomeConfirmation] = useState(false);

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

  // Handle edit query params from other pages
  useEffect(() => {
    if (!pyramid) return;

    const editType = searchParams.get('edit');
    const editId = searchParams.get('id');

    if (editType && editId) {
      // Find the item and open the edit modal
      if (editType === 'commitment') {
        const commitment = pyramid.iconic_commitments.find(c => c.id === editId);
        if (commitment) {
          setActiveTier('commitments');
          // Wait for tier to render, then open modal
          setTimeout(() => {
            openEditModal('commitment', editId, commitment);
            // Clear query params
            router.replace('/builder');
          }, 100);
        }
      }
      // Can add more types here if needed (vision, value, driver, etc.)
    }
  }, [pyramid, searchParams, router]);

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

  // Navigate to a specific item by ID across all tiers
  const handleConnectionClick = (connectionId: string, connectionType: 'upstream' | 'downstream') => {
    if (!pyramid) return;

    // Search through all tiers to find the item
    if (pyramid.vision?.statements.find(s => s.id === connectionId)) {
      setActiveTier('vision');
      // Scroll to item after tier loads
      setTimeout(() => {
        const element = document.getElementById(`item-${connectionId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else if (pyramid.values.find(v => v.id === connectionId)) {
      setActiveTier('values');
      setTimeout(() => {
        const element = document.getElementById(`item-${connectionId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else if (pyramid.behaviours?.find(b => b.id === connectionId)) {
      setActiveTier('behaviours');
      setTimeout(() => {
        const element = document.getElementById(`item-${connectionId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else if (pyramid.strategic_drivers.find(d => d.id === connectionId)) {
      setActiveTier('drivers');
      setTimeout(() => {
        const element = document.getElementById(`item-${connectionId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else if (pyramid.strategic_intents.find(i => i.id === connectionId)) {
      setActiveTier('intents');
      setTimeout(() => {
        const element = document.getElementById(`item-${connectionId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else if (pyramid.enablers?.find(e => e.id === connectionId)) {
      setActiveTier('enablers');
      setTimeout(() => {
        const element = document.getElementById(`item-${connectionId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else if (pyramid.iconic_commitments.find(c => c.id === connectionId)) {
      setActiveTier('commitments');
      setTimeout(() => {
        const element = document.getElementById(`item-${connectionId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else if (pyramid.team_objectives?.find(t => t.id === connectionId)) {
      setActiveTier('team');
      setTimeout(() => {
        const element = document.getElementById(`item-${connectionId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else if (pyramid.individual_objectives?.find(i => i.id === connectionId)) {
      setActiveTier('individual');
      setTimeout(() => {
        const element = document.getElementById(`item-${connectionId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const handleHomeClick = () => {
    setShowHomeConfirmation(true);
  };

  const confirmHomeNavigation = () => {
    setShowHomeConfirmation(false);
    router.push("/");
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
              <Button variant="ghost" onClick={handleHomeClick}>
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
        </div>
      </div>

      {/* Main Content Area - Side by Side */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Fixed Pyramid */}
        <div className="w-96 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Pyramid Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Strategic Pyramid</h2>
              <p className="text-xs text-gray-600 mb-4">Click any tier to view and edit</p>
              <PyramidVisualization
                pyramid={pyramid}
                onTierClick={handleTierClick}
                activeTier={activeTier}
                compact={true}
              />
            </div>

            {/* Execution Readiness Checklist */}
            <ExecutionReadinessChecklist pyramid={pyramid} />
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
                    <div key={stmt.id} id={`item-${stmt.id}`}>
                      <TierCard
                        variant="blue"
                        connections={[]} // Vision has no upstream connections
                        onEdit={() => openEditModal('vision', stmt.id, stmt)}
                        onDelete={() => handleDeleteVisionStatement(stmt.id)}
                        onConnectionClick={handleConnectionClick}
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
                    </div>
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
                      <div key={value.id} id={`item-${value.id}`}>
                        <TierCard
                          variant="blue"
                          connections={downstreamConnections}
                          onEdit={() => openEditModal('value', value.id, value)}
                          onDelete={() => handleDeleteValue(value.id)}
                          onConnectionClick={handleConnectionClick}
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
                      </div>
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
                        <div key={behaviour.id} id={`item-${behaviour.id}`}>
                          <TierCard
                            variant="green"
                            connections={upstreamConnections}
                            onEdit={() => openEditModal('behaviour', behaviour.id, behaviour)}
                            onDelete={() => handleDeleteBehaviour(behaviour.id)}
                            onConnectionClick={handleConnectionClick}
                          >
                            <div className="text-gray-900 leading-relaxed">
                              {behaviour.statement}
                            </div>
                          </TierCard>
                        </div>
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
                      <div key={driver.id} id={`item-${driver.id}`}>
                        <TierCard
                          variant="purple"
                          connections={downstreamConnections}
                          onEdit={() => openEditModal('driver', driver.id, driver)}
                          onDelete={() => handleDeleteDriver(driver.id)}
                          onConnectionClick={handleConnectionClick}
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
                      </div>
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
              <>
                <TierHeader
                  tierName="Strategic Intent"
                  tierDescription="Aspirational statements that define what success looks like for each strategic driver."
                  itemCount={pyramid.strategic_intents.length}
                  variant="purple"
                  onAddNew={pyramid.strategic_drivers.length > 0 ? () => openAddModal('intent') : undefined}
                  onBack={() => setActiveTier(undefined)}
                />

                {pyramid.strategic_drivers.length > 0 ? (
                  <div className="space-y-4">
                    {pyramid.strategic_intents.map((intent) => {
                      // Upstream: the driver it belongs to
                      const driver = pyramid.strategic_drivers.find(d => d.id === intent.driver_id);
                      const upstreamConnections = driver ? [{
                        id: driver.id,
                        name: driver.name,
                        type: 'upstream' as const,
                      }] : [];

                      // Downstream: commitments that reference this intent
                      const downstreamConnections = pyramid.iconic_commitments
                        .filter((c) => c.primary_intent_ids?.includes(intent.id))
                        .map((c) => ({
                          id: c.id,
                          name: c.name,
                          type: 'downstream' as const,
                        }));

                      return (
                        <div key={intent.id} id={`item-${intent.id}`}>
                          <TierCard
                            variant="purple"
                            onConnectionClick={handleConnectionClick}
                            connections={[...upstreamConnections, ...downstreamConnections]}
                            onEdit={() => openEditModal('intent', intent.id, intent)}
                            onDelete={() => handleDeleteIntent(intent.id)}
                          >
                            <div className="text-gray-900 leading-relaxed">
                              {intent.statement}
                            </div>
                          </TierCard>
                        </div>
                      );
                    })}

                    {pyramid.strategic_intents.length === 0 && (
                      <div className="text-center py-12 bg-purple-50 rounded-xl border-2 border-dashed border-purple-200">
                        <div className="text-4xl mb-3">🎯</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No strategic intents yet</h3>
                        <p className="text-gray-600 mb-4">Define what success looks like for each strategic driver</p>
                        <Button onClick={() => openAddModal('intent')}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Intent
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl text-center">
                    <div className="text-4xl mb-3">⚠️</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Strategic Drivers Required</h3>
                    <p className="text-yellow-800">Add Strategic Drivers first before adding Intents.</p>
                    <Button
                      onClick={() => setActiveTier('drivers')}
                      variant="secondary"
                      className="mt-4"
                    >
                      Go to Drivers
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Enablers Content */}
            {activeTier === "enablers" && (
              <>
                <TierHeader
                  tierName="Enablers"
                  tierDescription="Foundational capabilities required to execute your strategy - people, processes, technology, and partnerships."
                  itemCount={pyramid.enablers?.length || 0}
                  variant="purple"
                  onAddNew={() => openAddModal('enabler')}
                  onBack={() => setActiveTier(undefined)}
                />

                <div className="space-y-4">
                  {pyramid.enablers?.map((enabler) => {
                    // Upstream connections to drivers
                    const upstreamConnections = enabler.driver_ids
                      ?.map((driverId) => {
                        const driver = pyramid.strategic_drivers.find((d) => d.id === driverId);
                        return driver ? {
                          id: driver.id,
                          name: driver.name,
                          type: 'upstream' as const,
                        } : null;
                      })
                      .filter((conn): conn is NonNullable<typeof conn> => conn !== null) || [];

                    return (
                      <div key={enabler.id} id={`item-${enabler.id}`}>
                        <TierCard
                          variant="purple"
                          connections={upstreamConnections}
                          onEdit={() => openEditModal('enabler', enabler.id, enabler)}
                          onDelete={() => handleDeleteEnabler(enabler.id)}
                          onConnectionClick={handleConnectionClick}
                        >
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div className="text-lg font-bold text-purple-900">{enabler.name}</div>
                              {enabler.enabler_type && (
                                <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium">
                                  {enabler.enabler_type}
                                </span>
                              )}
                            </div>
                            <div className="text-gray-700 leading-relaxed">
                              {enabler.description}
                            </div>
                          </div>
                        </TierCard>
                      </div>
                    );
                  })}

                  {(!pyramid.enablers || pyramid.enablers.length === 0) && (
                    <div className="text-center py-12 bg-purple-50 rounded-xl border-2 border-dashed border-purple-200">
                      <div className="text-4xl mb-3">🛠️</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No enablers yet</h3>
                      <p className="text-gray-600 mb-4">Define the capabilities needed to execute your strategy</p>
                      <Button onClick={() => openAddModal('enabler')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Enabler
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Iconic Commitments Content */}
            {activeTier === "commitments" && (
              <>
                <TierHeader
                  tierName="Iconic Commitments"
                  tierDescription="Time-bound milestones that bring your strategy to life. Each commitment should be specific, measurable, and linked to strategic drivers."
                  itemCount={pyramid.iconic_commitments.length}
                  variant="orange"
                  onAddNew={pyramid.strategic_drivers.length > 0 ? () => openAddModal('commitment') : undefined}
                  onBack={() => setActiveTier(undefined)}
                />

                {pyramid.strategic_drivers.length > 0 ? (
                  <div className="space-y-4">
                    {pyramid.iconic_commitments.map((commitment) => {
                      // Upstream: driver and possibly intents
                      const driver = pyramid.strategic_drivers.find(d => d.id === commitment.primary_driver_id);
                      const upstreamConnections = driver ? [{
                        id: driver.id,
                        name: driver.name,
                        type: 'upstream' as const,
                      }] : [];

                      // Downstream: team objectives linked to this commitment
                      const downstreamConnections = pyramid.team_objectives
                        ?.filter((obj) => obj.primary_commitment_id === commitment.id)
                        .map((obj) => ({
                          id: obj.id,
                          name: `${obj.team_name}: ${obj.name}`,
                          type: 'downstream' as const,
                        })) || [];

                      return (
                        <div key={commitment.id} id={`item-${commitment.id}`}>
                          <TierCard
                            variant="orange"
                            connections={[...upstreamConnections, ...downstreamConnections]}
                            onEdit={() => openEditModal('commitment', commitment.id, commitment)}
                            onDelete={() => handleDeleteCommitment(commitment.id)}
                            onConnectionClick={handleConnectionClick}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-lg font-bold text-orange-900">{commitment.name}</div>
                                <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-sm font-medium">
                                  {commitment.horizon}
                                </span>
                              </div>
                              <div className="text-gray-700 leading-relaxed">
                                {commitment.description}
                              </div>
                              {commitment.target_date && (
                                <div className="mt-2 text-sm text-gray-600">
                                  Target: {new Date(commitment.target_date).toLocaleDateString()}
                                </div>
                              )}
                              {commitment.owner && (
                                <div className="mt-1 text-sm text-gray-600">
                                  Owner: {commitment.owner}
                                </div>
                              )}
                            </div>
                          </TierCard>
                        </div>
                      );
                    })}

                    {pyramid.iconic_commitments.length === 0 && (
                      <div className="text-center py-12 bg-orange-50 rounded-xl border-2 border-dashed border-orange-200">
                        <div className="text-4xl mb-3">🎯</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No iconic commitments yet</h3>
                        <p className="text-gray-600 mb-4">Define time-bound milestones that bring your strategy to life</p>
                        <Button onClick={() => openAddModal('commitment')}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Commitment
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl text-center">
                    <div className="text-4xl mb-3">⚠️</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Strategic Drivers Required</h3>
                    <p className="text-yellow-800">Add Strategic Drivers first before adding Commitments.</p>
                    <Button
                      onClick={() => setActiveTier('drivers')}
                      variant="secondary"
                      className="mt-4"
                    >
                      Go to Drivers
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Team Objectives Content */}
            {activeTier === "team" && (
              <>
                <TierHeader
                  tierName="Team Objectives"
                  tierDescription="Team-level goals that break down iconic commitments. Each objective should be specific, measurable, and owned by a team."
                  itemCount={pyramid.team_objectives?.length || 0}
                  variant="orange"
                  onAddNew={() => openAddModal('team_objective')}
                  onBack={() => setActiveTier(undefined)}
                />

                <div className="space-y-4">
                  {pyramid.team_objectives?.map((objective) => {
                    // Upstream: commitment
                    const commitment = pyramid.iconic_commitments.find((c) => c.id === objective.primary_commitment_id);
                    const upstreamConnections = commitment ? [{
                      id: commitment.id,
                      name: commitment.name,
                      type: 'upstream' as const,
                    }] : [];

                    // Downstream: individual objectives linked to this team objective
                    const downstreamConnections = pyramid.individual_objectives
                      ?.filter((ind) => ind.team_objective_ids?.includes(objective.id))
                      .map((ind) => ({
                        id: ind.id,
                        name: `${ind.individual_name}: ${ind.name}`,
                        type: 'downstream' as const,
                      })) || [];

                    return (
                      <div key={objective.id} id={`item-${objective.id}`}>
                        <TierCard
                          variant="orange"
                          connections={[...upstreamConnections, ...downstreamConnections]}
                          onEdit={() => openEditModal('team_objective', objective.id, objective)}
                          onDelete={() => handleDeleteTeamObjective(objective.id)}
                          onConnectionClick={handleConnectionClick}
                        >
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div className="text-lg font-bold text-orange-900">{objective.name}</div>
                              <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-medium">
                                {objective.team_name}
                              </span>
                            </div>
                            <div className="text-gray-700 leading-relaxed">
                              {objective.description}
                            </div>
                            {objective.metrics && (
                              <div className="mt-2 text-sm text-gray-600">
                                Metrics: {objective.metrics}
                              </div>
                            )}
                            {objective.owner && (
                              <div className="mt-1 text-sm text-gray-600">
                                Owner: {objective.owner}
                              </div>
                            )}
                          </div>
                        </TierCard>
                      </div>
                    );
                  })}

                  {(!pyramid.team_objectives || pyramid.team_objectives.length === 0) && (
                    <div className="text-center py-12 bg-orange-50 rounded-xl border-2 border-dashed border-orange-200">
                      <div className="text-4xl mb-3">👥</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No team objectives yet</h3>
                      <p className="text-gray-600 mb-4">Define team-level goals that cascade from your commitments</p>
                      <Button onClick={() => openAddModal('team_objective')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Team Objective
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Individual Objectives Content */}
            {activeTier === "individual" && (
              <>
                <TierHeader
                  tierName="Individual Objectives"
                  tierDescription="Personal goals that connect individual work to team objectives. Each objective should be clear, achievable, and show direct contribution."
                  itemCount={pyramid.individual_objectives?.length || 0}
                  variant="teal"
                  onAddNew={() => openAddModal('individual_objective')}
                  onBack={() => setActiveTier(undefined)}
                />

                <div className="space-y-4">
                  {pyramid.individual_objectives?.map((objective) => {
                    // Upstream: team objectives
                    const upstreamConnections = objective.team_objective_ids
                      ?.map((teamObjId) => {
                        const teamObj = pyramid.team_objectives?.find((t) => t.id === teamObjId);
                        return teamObj ? {
                          id: teamObj.id,
                          name: `${teamObj.team_name}: ${teamObj.name}`,
                          type: 'upstream' as const,
                        } : null;
                      })
                      .filter((conn): conn is NonNullable<typeof conn> => conn !== null) || [];

                    return (
                      <div key={objective.id} id={`item-${objective.id}`}>
                        <TierCard
                          variant="teal"
                          connections={upstreamConnections}
                          onEdit={() => openEditModal('individual_objective', objective.id, objective)}
                          onDelete={() => handleDeleteIndividualObjective(objective.id)}
                          onConnectionClick={handleConnectionClick}
                        >
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div className="text-lg font-bold text-teal-900">{objective.name}</div>
                              <span className="px-3 py-1 bg-teal-200 text-teal-800 rounded-full text-xs font-medium">
                                {objective.individual_name}
                              </span>
                            </div>
                            <div className="text-gray-700 leading-relaxed">
                              {objective.description}
                            </div>
                            {objective.success_criteria && (
                              <div className="mt-2 text-sm text-gray-600">
                                Success criteria: {objective.success_criteria}
                              </div>
                            )}
                          </div>
                        </TierCard>
                      </div>
                    );
                  })}

                  {(!pyramid.individual_objectives || pyramid.individual_objectives.length === 0) && (
                    <div className="text-center py-12 bg-teal-50 rounded-xl border-2 border-dashed border-teal-200">
                      <div className="text-4xl mb-3">👤</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No individual objectives yet</h3>
                      <p className="text-gray-600 mb-4">Define personal goals that connect to team objectives</p>
                      <Button onClick={() => openAddModal('individual_objective')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Individual Objective
                      </Button>
                    </div>
                  )}
                </div>
              </>
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

        {/* Intent Form */}
        {modalItemType === 'intent' && (
          <form onSubmit={modalMode === 'add' ? handleAddIntent : (e) => { e.preventDefault(); handleSaveEdit('intent'); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Strategic Driver
              </label>
              <select
                className="input"
                value={modalMode === 'edit' ? editFormData.driver_id : selectedDriver}
                onChange={(e) => {
                  if (modalMode === 'edit') {
                    setEditFormData({ ...editFormData, driver_id: e.target.value });
                  } else {
                    setSelectedDriver(e.target.value);
                  }
                }}
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
              label="Intent Statement"
              value={modalMode === 'edit' ? editFormData.statement : intentStatement}
              onChange={(e) => {
                if (modalMode === 'edit') {
                  setEditFormData({ ...editFormData, statement: e.target.value });
                } else {
                  setIntentStatement(e.target.value);
                }
              }}
              placeholder="What does success look like for this driver? Describe the aspirational future state..."
              rows={4}
              required
            />
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="button" variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {modalMode === 'add' ? 'Add Intent' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}

        {/* Enabler Form */}
        {modalItemType === 'enabler' && (
          <form onSubmit={modalMode === 'add' ? handleAddEnabler : (e) => { e.preventDefault(); handleSaveEdit('enabler'); }} className="space-y-4">
            <Input
              label="Enabler Name"
              value={modalMode === 'edit' ? editFormData.name : enablerName}
              onChange={(e) => {
                if (modalMode === 'edit') {
                  setEditFormData({ ...editFormData, name: e.target.value });
                } else {
                  setEnablerName(e.target.value);
                }
              }}
              placeholder="e.g., Advanced Analytics Platform"
              required
            />
            <Textarea
              label="Description"
              value={modalMode === 'edit' ? editFormData.description : enablerDescription}
              onChange={(e) => {
                if (modalMode === 'edit') {
                  setEditFormData({ ...editFormData, description: e.target.value });
                } else {
                  setEnablerDescription(e.target.value);
                }
              }}
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
                value={modalMode === 'edit' ? editFormData.enabler_type : enablerType}
                onChange={(e) => {
                  if (modalMode === 'edit') {
                    setEditFormData({ ...editFormData, enabler_type: e.target.value });
                  } else {
                    setEnablerType(e.target.value);
                  }
                }}
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
                <div className="grid md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {pyramid.strategic_drivers.map((driver) => (
                    <label key={driver.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={modalMode === 'edit'
                          ? (editFormData.driver_ids || []).includes(driver.id)
                          : selectedDriverIds.includes(driver.id)}
                        onChange={() => {
                          if (modalMode === 'edit') {
                            const currentIds = editFormData.driver_ids || [];
                            const newIds = currentIds.includes(driver.id)
                              ? currentIds.filter((id: string) => id !== driver.id)
                              : [...currentIds, driver.id];
                            setEditFormData({ ...editFormData, driver_ids: newIds });
                          } else {
                            toggleDriverSelection(driver.id);
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">{driver.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="button" variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {modalMode === 'add' ? 'Add Enabler' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}

        {/* Commitment Form */}
        {modalItemType === 'commitment' && (
          <form onSubmit={modalMode === 'add' ? handleAddCommitment : (e) => { e.preventDefault(); handleSaveEdit('commitment'); }} className="space-y-4">
            <Input
              label="Commitment Name"
              value={modalMode === 'edit' ? editFormData.name : commitmentName}
              onChange={(e) => {
                if (modalMode === 'edit') {
                  setEditFormData({ ...editFormData, name: e.target.value });
                } else {
                  setCommitmentName(e.target.value);
                }
              }}
              placeholder="e.g., Launch New Platform"
              required
            />
            <Textarea
              label="Description"
              value={modalMode === 'edit' ? editFormData.description : commitmentDescription}
              onChange={(e) => {
                if (modalMode === 'edit') {
                  setEditFormData({ ...editFormData, description: e.target.value });
                } else {
                  setCommitmentDescription(e.target.value);
                }
              }}
              placeholder="What will be delivered..."
              rows={3}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Driver
                </label>
                <select
                  className="input"
                  value={modalMode === 'edit' ? editFormData.primary_driver_id : selectedDriver}
                  onChange={(e) => {
                    if (modalMode === 'edit') {
                      setEditFormData({ ...editFormData, primary_driver_id: e.target.value });
                    } else {
                      setSelectedDriver(e.target.value);
                    }
                  }}
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
                  value={modalMode === 'edit' ? editFormData.horizon : commitmentHorizon}
                  onChange={(e) => {
                    if (modalMode === 'edit') {
                      setEditFormData({ ...editFormData, horizon: e.target.value as Horizon });
                    } else {
                      setCommitmentHorizon(e.target.value as Horizon);
                    }
                  }}
                >
                  <option value={Horizon.H1}>H1 (0-12 months)</option>
                  <option value={Horizon.H2}>H2 (12-24 months)</option>
                  <option value={Horizon.H3}>H3 (24-36 months)</option>
                </select>
              </div>
            </div>
            {modalMode === 'edit' && (
              <>
                <Input
                  label="Owner (Optional)"
                  value={editFormData.owner || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, owner: e.target.value })}
                  placeholder="Person or team responsible"
                />
                <Input
                  label="Target Date (Optional)"
                  type="date"
                  value={editFormData.target_date || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, target_date: e.target.value })}
                />
              </>
            )}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="button" variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {modalMode === 'add' ? 'Add Commitment' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}

        {/* Team Objective Form */}
        {modalItemType === 'team_objective' && (
          <form onSubmit={modalMode === 'add' ? handleAddTeamObjective : (e) => { e.preventDefault(); handleSaveEdit('team_objective'); }} className="space-y-4">
            <Input
              label="Objective Name"
              value={modalMode === 'edit' ? editFormData.name : teamObjectiveName}
              onChange={(e) => {
                if (modalMode === 'edit') {
                  setEditFormData({ ...editFormData, name: e.target.value });
                } else {
                  setTeamObjectiveName(e.target.value);
                }
              }}
              placeholder="e.g., Launch MVP in Q2"
              required
            />
            <Textarea
              label="Description"
              value={modalMode === 'edit' ? editFormData.description : teamObjectiveDescription}
              onChange={(e) => {
                if (modalMode === 'edit') {
                  setEditFormData({ ...editFormData, description: e.target.value });
                } else {
                  setTeamObjectiveDescription(e.target.value);
                }
              }}
              placeholder="What will be achieved..."
              rows={3}
              required
            />
            <Input
              label="Team Name"
              value={modalMode === 'edit' ? editFormData.team_name : teamName}
              onChange={(e) => {
                if (modalMode === 'edit') {
                  setEditFormData({ ...editFormData, team_name: e.target.value });
                } else {
                  setTeamName(e.target.value);
                }
              }}
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
                  value={modalMode === 'edit' ? editFormData.primary_commitment_id : selectedCommitment}
                  onChange={(e) => {
                    if (modalMode === 'edit') {
                      setEditFormData({ ...editFormData, primary_commitment_id: e.target.value });
                    } else {
                      setSelectedCommitment(e.target.value);
                    }
                  }}
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
            {modalMode === 'edit' && (
              <>
                <Input
                  label="Owner (Optional)"
                  value={editFormData.owner || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, owner: e.target.value })}
                  placeholder="Person responsible"
                />
                <Textarea
                  label="Metrics (Optional)"
                  value={editFormData.metrics || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, metrics: e.target.value })}
                  rows={2}
                  placeholder="How success will be measured"
                />
              </>
            )}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="button" variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {modalMode === 'add' ? 'Add Team Objective' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}

        {/* Individual Objective Form */}
        {modalItemType === 'individual_objective' && (
          <form onSubmit={modalMode === 'add' ? handleAddIndividualObjective : (e) => { e.preventDefault(); handleSaveEdit('individual_objective'); }} className="space-y-4">
            <Input
              label="Objective Name"
              value={modalMode === 'edit' ? editFormData.name : individualObjectiveName}
              onChange={(e) => {
                if (modalMode === 'edit') {
                  setEditFormData({ ...editFormData, name: e.target.value });
                } else {
                  setIndividualObjectiveName(e.target.value);
                }
              }}
              placeholder="e.g., Complete certification in Q1"
              required
            />
            <Textarea
              label="Description"
              value={modalMode === 'edit' ? editFormData.description : individualObjectiveDescription}
              onChange={(e) => {
                if (modalMode === 'edit') {
                  setEditFormData({ ...editFormData, description: e.target.value });
                } else {
                  setIndividualObjectiveDescription(e.target.value);
                }
              }}
              placeholder="What will be achieved and how it contributes..."
              rows={3}
              required
            />
            <Input
              label="Individual Name"
              value={modalMode === 'edit' ? editFormData.individual_name : individualName}
              onChange={(e) => {
                if (modalMode === 'edit') {
                  setEditFormData({ ...editFormData, individual_name: e.target.value });
                } else {
                  setIndividualName(e.target.value);
                }
              }}
              placeholder="e.g., John Smith"
              required
            />
            {pyramid.team_objectives && pyramid.team_objectives.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link to Team Objectives (optional)
                </label>
                <div className="grid md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {pyramid.team_objectives.map((teamObj) => (
                    <label key={teamObj.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={modalMode === 'edit'
                          ? (editFormData.team_objective_ids || []).includes(teamObj.id)
                          : selectedTeamObjectiveIds.includes(teamObj.id)}
                        onChange={() => {
                          if (modalMode === 'edit') {
                            const currentIds = editFormData.team_objective_ids || [];
                            const newIds = currentIds.includes(teamObj.id)
                              ? currentIds.filter((id: string) => id !== teamObj.id)
                              : [...currentIds, teamObj.id];
                            setEditFormData({ ...editFormData, team_objective_ids: newIds });
                          } else {
                            toggleTeamObjectiveSelection(teamObj.id);
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">{teamObj.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {modalMode === 'edit' && (
              <Textarea
                label="Success Criteria (Optional)"
                value={editFormData.success_criteria || ''}
                onChange={(e) => setEditFormData({ ...editFormData, success_criteria: e.target.value })}
                rows={2}
                placeholder="How success will be measured"
              />
            )}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="button" variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {modalMode === 'add' ? 'Add Individual Objective' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Home Confirmation Modal */}
      {showHomeConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowHomeConfirmation(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-slideUp">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Home className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Return to Home?</h3>
              <p className="text-gray-600 mb-6">
                You'll leave the current builder session. Make sure you've exported your work if needed.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowHomeConfirmation(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmHomeNavigation}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                >
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
