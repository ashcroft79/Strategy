"use client";

import { useEffect, useState, Suspense } from "react";
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
import { LabelWithTooltip } from "@/components/ui/Tooltip";
import { UnsavedChangesIndicator } from "@/components/ui/UnsavedChangesIndicator";
import Modal from "@/components/ui/Modal";
import TierHeader from "@/components/ui/TierHeader";
import TierCard from "@/components/ui/TierCard";
import PyramidVisualization from "@/components/visualizations/PyramidVisualization";
import ExecutionReadinessChecklist from "@/components/visualizations/ExecutionReadinessChecklist";
import { AICoachSidebar } from "@/components/AICoachSidebar";
import { useAIFieldSuggestion } from "@/hooks/useAIFieldSuggestion";
import { AIFieldSuggestion, AIFieldSuggestionIndicator } from "@/components/AIFieldSuggestion";
import { AIDraftGenerator } from "@/components/AIDraftGenerator";
import { StatementType, Horizon } from "@/types/pyramid";
import { Save, Home, CheckCircle, FileDown, Eye, Trash2, Edit, Plus, BarChart3 } from "lucide-react";
import { TIER1_TOOLTIPS, TIER2_TOOLTIPS, TIER3_TOOLTIPS, TIER4_TOOLTIPS, TIER5_TOOLTIPS, TIER6_TOOLTIPS, TIER7_TOOLTIPS, TIER8_TOOLTIPS, TIER9_TOOLTIPS } from "@/config/tooltips";

// Component to handle edit query params
function EditParamsHandler({
  pyramid,
  setActiveTier,
  openEditModal
}: {
  pyramid: any;
  setActiveTier: (tier: string) => void;
  openEditModal: (type: string, id: string, data: any) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!pyramid) return;

    const editType = searchParams.get('edit');
    const editId = searchParams.get('id');

    if (editType && editId) {
      // Find the item and open the edit modal
      if (editType === 'commitment') {
        const commitment = pyramid.iconic_commitments.find((c: any) => c.id === editId);
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
    }
  }, [pyramid, searchParams, router, setActiveTier, openEditModal]);

  return null;
}

export default function BuilderPage() {
  const router = useRouter();
  const { sessionId, pyramid, setPyramid, setLoading, setError, showToast, isLoading, incrementUnsavedChanges } = usePyramidStore();
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
  const [driverRationale, setDriverRationale] = useState("");
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

  // Grouping preferences
  const [commitmentGroupBy, setCommitmentGroupBy] = useState<'driver' | 'intent'>('driver');

  // Display preferences
  const [showThreadLabels, setShowThreadLabels] = useState(true);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editType, setEditType] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  // AI field suggestions (enabled in both add and edit modes)
  const driverNameSuggestion = useAIFieldSuggestion(
    modalMode === 'edit' ? editFormData.name || '' : driverName,
    {
      sessionId,
      tier: "strategic_driver",
      fieldName: "name",
      enabled: isModalOpen && modalItemType === 'driver',
      minLength: 3,
    }
  );

  const driverDescSuggestion = useAIFieldSuggestion(
    modalMode === 'edit' ? editFormData.description || '' : driverDescription,
    {
      sessionId,
      tier: "strategic_driver",
      fieldName: "description",
      enabled: isModalOpen && modalItemType === 'driver',
      minLength: 10,
      context: {
        name: modalMode === 'edit' ? editFormData.name : driverName
      },
    }
  );

  const driverRationaleSuggestion = useAIFieldSuggestion(
    modalMode === 'edit' ? editFormData.rationale || '' : driverRationale,
    {
      sessionId,
      tier: "strategic_driver",
      fieldName: "rationale",
      enabled: isModalOpen && modalItemType === 'driver',
      minLength: 10,
      context: {
        name: modalMode === 'edit' ? editFormData.name : driverName,
        description: modalMode === 'edit' ? editFormData.description : driverDescription,
      },
    }
  );

  const intentSuggestion = useAIFieldSuggestion(
    modalMode === 'edit' ? editFormData.statement || '' : intentStatement,
    {
      sessionId,
      tier: "strategic_intent",
      fieldName: "statement",
      enabled: isModalOpen && modalItemType === 'intent',
      minLength: 10,
      context: {
        driver_id: modalMode === 'edit' ? editFormData.driver_id : selectedDriver
      },
    }
  );

  const commitmentNameSuggestion = useAIFieldSuggestion(
    modalMode === 'edit' ? editFormData.name || '' : commitmentName,
    {
      sessionId,
      tier: "iconic_commitment",
      fieldName: "name",
      enabled: isModalOpen && modalItemType === 'commitment',
      minLength: 5,
    }
  );

  const commitmentDescSuggestion = useAIFieldSuggestion(
    modalMode === 'edit' ? editFormData.description || '' : commitmentDescription,
    {
      sessionId,
      tier: "iconic_commitment",
      fieldName: "description",
      enabled: isModalOpen && modalItemType === 'commitment',
      minLength: 15,
      context: {
        name: modalMode === 'edit' ? editFormData.name : commitmentName,
        primary_driver_id: modalMode === 'edit' ? editFormData.primary_driver_id : selectedDriver
      },
    }
  );

  // Vision, Value, Behaviour AI suggestions
  const visionStatementSuggestion = useAIFieldSuggestion(
    modalMode === 'edit' ? editFormData.statement || '' : visionStatement,
    {
      sessionId,
      tier: "vision",
      fieldName: "statement",
      enabled: isModalOpen && modalItemType === 'vision',
      minLength: 10,
      context: {
        statement_type: modalMode === 'edit' ? editFormData.statement_type : visionStatementType
      },
    }
  );

  const valueNameSuggestion = useAIFieldSuggestion(
    modalMode === 'edit' ? editFormData.name || '' : valueName,
    {
      sessionId,
      tier: "value",
      fieldName: "name",
      enabled: isModalOpen && modalItemType === 'value',
      minLength: 2,
    }
  );

  const valueDescSuggestion = useAIFieldSuggestion(
    modalMode === 'edit' ? editFormData.description || '' : valueDescription,
    {
      sessionId,
      tier: "value",
      fieldName: "description",
      enabled: isModalOpen && modalItemType === 'value',
      minLength: 10,
      context: {
        name: modalMode === 'edit' ? editFormData.name : valueName
      },
    }
  );

  const behaviourStatementSuggestion = useAIFieldSuggestion(
    modalMode === 'edit' ? editFormData.statement || '' : behaviourStatement,
    {
      sessionId,
      tier: "behaviour",
      fieldName: "statement",
      enabled: isModalOpen && modalItemType === 'behaviour',
      minLength: 10,
      context: {
        values: selectedValueIds.map(id => pyramid?.values?.find(v => v.id === id)?.name).filter(Boolean)
      },
    }
  );

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
      incrementUnsavedChanges();
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
      incrementUnsavedChanges();
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
      incrementUnsavedChanges();
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
      incrementUnsavedChanges();
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
      incrementUnsavedChanges();
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
      incrementUnsavedChanges();
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
      incrementUnsavedChanges();
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
      incrementUnsavedChanges();
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
      incrementUnsavedChanges();
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
            editFormData.owner,
            editFormData.primary_intent_ids
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
      incrementUnsavedChanges();

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
      incrementUnsavedChanges();
      incrementUnsavedChanges();
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
      incrementUnsavedChanges();
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
      incrementUnsavedChanges();
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
      await driversApi.add(sessionId, driverName, driverDescription, driverRationale || undefined);
      setDriverName("");
      setDriverDescription("");
      setDriverRationale("");
      await refreshPyramid();
      showToast("Strategic driver added successfully", "success");
      incrementUnsavedChanges();
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
      incrementUnsavedChanges();
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
      incrementUnsavedChanges();
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
      incrementUnsavedChanges();
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
      incrementUnsavedChanges();
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
      incrementUnsavedChanges();
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
      {/* Edit params handler */}
      <Suspense fallback={null}>
        <EditParamsHandler
          pyramid={pyramid}
          setActiveTier={setActiveTier}
          openEditModal={openEditModal}
        />
      </Suspense>

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
            {/* Unsaved Changes Indicator */}
            <UnsavedChangesIndicator variant="inline" />

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

                {/* Thread Labels Toggle */}
                <div className="mb-4 flex items-center justify-end p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">Show thread labels</span>
                    <button
                      onClick={() => setShowThreadLabels(!showThreadLabels)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showThreadLabels ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showThreadLabels ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                </div>

                <div className="space-y-4">
                  {pyramid.vision?.statements.map((stmt) => (
                    <div key={stmt.id} id={`item-${stmt.id}`}>
                      <TierCard
                        variant="blue"
                        connections={[]} // Vision has no upstream connections
                        onEdit={() => openEditModal('vision', stmt.id, stmt)}
                        onDelete={() => handleDeleteVisionStatement(stmt.id)}
                        onConnectionClick={handleConnectionClick}
                        showConnections={showThreadLabels}
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

                {/* Thread Labels Toggle */}
                <div className="mb-4 flex items-center justify-end p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">Show thread labels</span>
                    <button
                      onClick={() => setShowThreadLabels(!showThreadLabels)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showThreadLabels ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showThreadLabels ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                </div>

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
                          showConnections={showThreadLabels}
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

                {/* Thread Labels Toggle */}
                <div className="mb-4 flex items-center justify-end p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">Show thread labels</span>
                    <button
                      onClick={() => setShowThreadLabels(!showThreadLabels)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showThreadLabels ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showThreadLabels ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                </div>

                {pyramid.values.length > 0 ? (
                  <div className="space-y-6">
                    {(() => {
                      // Group behaviours by value
                      const behavioursByValue = new Map<string, any[]>();
                      const orphanedBehaviours: any[] = [];

                      pyramid.behaviours?.forEach((behaviour) => {
                        if (!behaviour.value_ids || behaviour.value_ids.length === 0) {
                          orphanedBehaviours.push(behaviour);
                        } else {
                          behaviour.value_ids.forEach((valueId) => {
                            if (!behavioursByValue.has(valueId)) {
                              behavioursByValue.set(valueId, []);
                            }
                            behavioursByValue.get(valueId)!.push(behaviour);
                          });
                        }
                      });

                      return (
                        <>
                          {/* Render behaviours grouped by value */}
                          {pyramid.values.map((value) => {
                            const behaviours = behavioursByValue.get(value.id) || [];
                            if (behaviours.length === 0) return null;

                            return (
                              <div key={value.id}>
                                <div className="mb-3 pb-2 border-b-2 border-blue-200">
                                  <h3 className="text-md font-bold text-blue-900 flex items-center gap-2">
                                    <span className="text-blue-600">↑</span>
                                    {value.name}
                                    <span className="ml-auto text-xs font-normal text-gray-500">
                                      {behaviours.length} behaviour{behaviours.length !== 1 ? 's' : ''}
                                    </span>
                                  </h3>
                                </div>
                                <div className="space-y-4 ml-4">
                                  {behaviours.map((behaviour) => {
                                    const upstreamConnections = behaviour.value_ids
                                      ?.map((valueId: string) => {
                                        const val = pyramid.values.find((v) => v.id === valueId);
                                        return val ? {
                                          id: val.id,
                                          name: val.name,
                                          type: 'upstream' as const,
                                        } : null;
                                      })
                                      .filter((conn: any): conn is NonNullable<typeof conn> => conn !== null) || [];

                                    return (
                                      <div key={behaviour.id} id={`item-${behaviour.id}`}>
                                        <TierCard
                                          variant="green"
                                          connections={upstreamConnections}
                                          onEdit={() => openEditModal('behaviour', behaviour.id, behaviour)}
                                          onDelete={() => handleDeleteBehaviour(behaviour.id)}
                                          onConnectionClick={handleConnectionClick}
                        showConnections={showThreadLabels}
                                        >
                                          <div className="text-gray-900 leading-relaxed">
                                            {behaviour.statement}
                                          </div>
                                        </TierCard>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}

                          {/* Render orphaned behaviours if any */}
                          {orphanedBehaviours.length > 0 && (
                            <div>
                              <div className="mb-3 pb-2 border-b-2 border-gray-300">
                                <h3 className="text-md font-bold text-gray-700 flex items-center gap-2">
                                  <span className="text-amber-600">⚠️</span>
                                  Not Linked to Any Value
                                  <span className="ml-auto text-xs font-normal text-gray-500">
                                    {orphanedBehaviours.length} behaviour{orphanedBehaviours.length !== 1 ? 's' : ''}
                                  </span>
                                </h3>
                              </div>
                              <div className="space-y-4 ml-4">
                                {orphanedBehaviours.map((behaviour) => (
                                  <div key={behaviour.id} id={`item-${behaviour.id}`}>
                                    <TierCard
                                      variant="green"
                                      connections={[]}
                                      onEdit={() => openEditModal('behaviour', behaviour.id, behaviour)}
                                      onDelete={() => handleDeleteBehaviour(behaviour.id)}
                                      onConnectionClick={handleConnectionClick}
                        showConnections={showThreadLabels}
                                    >
                                      <div className="text-gray-900 leading-relaxed">
                                        {behaviour.statement}
                                      </div>
                                    </TierCard>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

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
                        </>
                      );
                    })()}
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

                {/* Thread Labels Toggle */}
                <div className="mb-4 flex items-center justify-end p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">Show thread labels</span>
                    <button
                      onClick={() => setShowThreadLabels(!showThreadLabels)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showThreadLabels ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showThreadLabels ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                </div>

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
                        showConnections={showThreadLabels}
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

                {/* Thread Labels Toggle */}
                <div className="mb-4 flex items-center justify-end p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">Show thread labels</span>
                    <button
                      onClick={() => setShowThreadLabels(!showThreadLabels)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showThreadLabels ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showThreadLabels ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                </div>

                {pyramid.strategic_drivers.length > 0 ? (
                  <div className="space-y-6">
                    {(() => {
                      // Group intents by driver
                      const intentsByDriver = new Map<string, any[]>();
                      const orphanedIntents: any[] = [];

                      pyramid.strategic_intents.forEach((intent) => {
                        if (!intent.driver_id) {
                          orphanedIntents.push(intent);
                        } else {
                          if (!intentsByDriver.has(intent.driver_id)) {
                            intentsByDriver.set(intent.driver_id, []);
                          }
                          intentsByDriver.get(intent.driver_id)!.push(intent);
                        }
                      });

                      return (
                        <>
                          {/* Render intents grouped by driver */}
                          {pyramid.strategic_drivers.map((driver) => {
                            const intents = intentsByDriver.get(driver.id) || [];
                            if (intents.length === 0) return null;

                            return (
                              <div key={driver.id}>
                                <div className="mb-3 pb-2 border-b-2 border-purple-300">
                                  <h3 className="text-md font-bold text-purple-900 flex items-center gap-2">
                                    <span className="text-purple-600">↑</span>
                                    {driver.name}
                                    <span className="ml-auto text-xs font-normal text-gray-500">
                                      {intents.length} intent{intents.length !== 1 ? 's' : ''}
                                    </span>
                                  </h3>
                                </div>
                                <div className="space-y-4 ml-4">
                                  {intents.map((intent) => {
                                    const upstreamConnections = [{
                                      id: driver.id,
                                      name: driver.name,
                                      type: 'upstream' as const,
                                    }];

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
                        showConnections={showThreadLabels}
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
                                </div>
                              </div>
                            );
                          })}

                          {/* Render orphaned intents if any */}
                          {orphanedIntents.length > 0 && (
                            <div>
                              <div className="mb-3 pb-2 border-b-2 border-gray-300">
                                <h3 className="text-md font-bold text-gray-700 flex items-center gap-2">
                                  <span className="text-amber-600">⚠️</span>
                                  Not Linked to Any Driver
                                  <span className="ml-auto text-xs font-normal text-gray-500">
                                    {orphanedIntents.length} intent{orphanedIntents.length !== 1 ? 's' : ''}
                                  </span>
                                </h3>
                              </div>
                              <div className="space-y-4 ml-4">
                                {orphanedIntents.map((intent) => {
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
                        showConnections={showThreadLabels}
                                        connections={downstreamConnections}
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
                              </div>
                            </div>
                          )}

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
                        </>
                      );
                    })()}
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

                {/* Thread Labels Toggle */}
                <div className="mb-4 flex items-center justify-end p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">Show thread labels</span>
                    <button
                      onClick={() => setShowThreadLabels(!showThreadLabels)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showThreadLabels ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showThreadLabels ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                </div>

                <div className="space-y-6">
                  {(() => {
                    // Group enablers by strategic driver
                    const enablersByDriver = new Map<string, any[]>();
                    const orphanedEnablers: any[] = [];

                    pyramid.enablers?.forEach((enabler) => {
                      if (!enabler.driver_ids || enabler.driver_ids.length === 0) {
                        orphanedEnablers.push(enabler);
                      } else {
                        enabler.driver_ids.forEach((driverId) => {
                          if (!enablersByDriver.has(driverId)) {
                            enablersByDriver.set(driverId, []);
                          }
                          enablersByDriver.get(driverId)!.push(enabler);
                        });
                      }
                    });

                    return (
                      <>
                        {/* Render enablers grouped by driver */}
                        {pyramid.strategic_drivers.map((driver) => {
                          const enablers = enablersByDriver.get(driver.id) || [];
                          if (enablers.length === 0) return null;

                          return (
                            <div key={driver.id}>
                              <div className="mb-3 pb-2 border-b-2 border-purple-300">
                                <h3 className="text-md font-bold text-purple-900 flex items-center gap-2">
                                  <span className="text-purple-600">↑</span>
                                  {driver.name}
                                  <span className="ml-auto text-xs font-normal text-gray-500">
                                    {enablers.length} enabler{enablers.length !== 1 ? 's' : ''}
                                  </span>
                                </h3>
                              </div>
                              <div className="space-y-4 ml-4">
                                {enablers.map((enabler) => {
                                  const upstreamConnections = enabler.driver_ids
                                    ?.map((driverId: string) => {
                                      const drv = pyramid.strategic_drivers.find((d) => d.id === driverId);
                                      return drv ? {
                                        id: drv.id,
                                        name: drv.name,
                                        type: 'upstream' as const,
                                      } : null;
                                    })
                                    .filter((conn: any): conn is NonNullable<typeof conn> => conn !== null) || [];

                                  return (
                                    <div key={enabler.id} id={`item-${enabler.id}`}>
                                      <TierCard
                                        variant="purple"
                                        connections={upstreamConnections}
                                        onEdit={() => openEditModal('enabler', enabler.id, enabler)}
                                        onDelete={() => handleDeleteEnabler(enabler.id)}
                                        onConnectionClick={handleConnectionClick}
                                        showConnections={showThreadLabels}
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
                              </div>
                            </div>
                          );
                        })}

                        {/* Render orphaned enablers if any */}
                        {orphanedEnablers.length > 0 && (
                          <div>
                            <div className="mb-3 pb-2 border-b-2 border-gray-300">
                              <h3 className="text-md font-bold text-gray-700 flex items-center gap-2">
                                <span className="text-amber-600">⚠️</span>
                                Not Linked to Any Driver
                                <span className="ml-auto text-xs font-normal text-gray-500">
                                  {orphanedEnablers.length} enabler{orphanedEnablers.length !== 1 ? 's' : ''}
                                </span>
                              </h3>
                            </div>
                            <div className="space-y-4 ml-4">
                              {orphanedEnablers.map((enabler) => (
                                <div key={enabler.id} id={`item-${enabler.id}`}>
                                  <TierCard
                                    variant="purple"
                                    connections={[]}
                                    onEdit={() => openEditModal('enabler', enabler.id, enabler)}
                                    onDelete={() => handleDeleteEnabler(enabler.id)}
                                    onConnectionClick={handleConnectionClick}
                                    showConnections={showThreadLabels}
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
                              ))}
                            </div>
                          </div>
                        )}

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
                      </>
                    );
                  })()}
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
                    {/* Control Panel - Grouping and Thread Labels Toggles */}
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Group by:</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCommitmentGroupBy('driver')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              commitmentGroupBy === 'driver'
                                ? 'bg-orange-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-orange-100 border border-orange-300'
                            }`}
                          >
                            Strategic Driver
                          </button>
                          <button
                            onClick={() => setCommitmentGroupBy('intent')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              commitmentGroupBy === 'intent'
                                ? 'bg-orange-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-orange-100 border border-orange-300'
                            }`}
                          >
                            Strategic Intent
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-end border-t border-orange-200 pt-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <span className="text-sm font-medium text-gray-700">Show thread labels</span>
                          <button
                            onClick={() => setShowThreadLabels(!showThreadLabels)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              showThreadLabels ? 'bg-orange-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                showThreadLabels ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </label>
                      </div>
                    </div>

                    {/* Grouped Commitments */}
                    <div className="space-y-6">
                      {(() => {
                        if (commitmentGroupBy === 'driver') {
                          // Group by driver
                          const commitmentsByDriver = new Map<string, any[]>();
                          const orphanedCommitments: any[] = [];

                          pyramid.iconic_commitments.forEach((commitment) => {
                            if (!commitment.primary_driver_id) {
                              orphanedCommitments.push(commitment);
                            } else {
                              if (!commitmentsByDriver.has(commitment.primary_driver_id)) {
                                commitmentsByDriver.set(commitment.primary_driver_id, []);
                              }
                              commitmentsByDriver.get(commitment.primary_driver_id)!.push(commitment);
                            }
                          });

                          return (
                            <>
                              {pyramid.strategic_drivers.map((driver) => {
                                const commitments = commitmentsByDriver.get(driver.id) || [];
                                if (commitments.length === 0) return null;

                                return (
                                  <div key={driver.id}>
                                    <div className="mb-3 pb-2 border-b-2 border-purple-300">
                                      <h3 className="text-md font-bold text-purple-900 flex items-center gap-2">
                                        <span className="text-purple-600">↑</span>
                                        {driver.name}
                                        <span className="ml-auto text-xs font-normal text-gray-500">
                                          {commitments.length} commitment{commitments.length !== 1 ? 's' : ''}
                                        </span>
                                      </h3>
                                    </div>
                                    <div className="space-y-4 ml-4">
                                      {commitments.map((commitment) => {
                                        const upstreamConnections = [{
                                          id: driver.id,
                                          name: driver.name,
                                          type: 'upstream' as const,
                                        }];

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
                        showConnections={showThreadLabels}
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
                                    </div>
                                  </div>
                                );
                              })}

                              {orphanedCommitments.length > 0 && (
                                <div>
                                  <div className="mb-3 pb-2 border-b-2 border-gray-300">
                                    <h3 className="text-md font-bold text-gray-700 flex items-center gap-2">
                                      <span className="text-amber-600">⚠️</span>
                                      Not Linked to Any Driver
                                      <span className="ml-auto text-xs font-normal text-gray-500">
                                        {orphanedCommitments.length} commitment{orphanedCommitments.length !== 1 ? 's' : ''}
                                      </span>
                                    </h3>
                                  </div>
                                  <div className="space-y-4 ml-4">
                                    {orphanedCommitments.map((commitment) => {
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
                                            connections={downstreamConnections}
                                            onEdit={() => openEditModal('commitment', commitment.id, commitment)}
                                            onDelete={() => handleDeleteCommitment(commitment.id)}
                                            onConnectionClick={handleConnectionClick}
                        showConnections={showThreadLabels}
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
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        } else {
                          // Group by intent
                          const commitmentsByIntent = new Map<string, any[]>();
                          const orphanedCommitments: any[] = [];

                          pyramid.iconic_commitments.forEach((commitment) => {
                            if (!commitment.primary_intent_ids || commitment.primary_intent_ids.length === 0) {
                              orphanedCommitments.push(commitment);
                            } else {
                              commitment.primary_intent_ids.forEach((intentId) => {
                                if (!commitmentsByIntent.has(intentId)) {
                                  commitmentsByIntent.set(intentId, []);
                                }
                                commitmentsByIntent.get(intentId)!.push(commitment);
                              });
                            }
                          });

                          return (
                            <>
                              {pyramid.strategic_intents.map((intent) => {
                                const commitments = commitmentsByIntent.get(intent.id) || [];
                                if (commitments.length === 0) return null;

                                const driver = pyramid.strategic_drivers.find(d => d.id === intent.driver_id);

                                return (
                                  <div key={intent.id}>
                                    <div className="mb-3 pb-2 border-b-2 border-purple-300">
                                      <h3 className="text-md font-bold text-purple-900 flex items-center gap-2">
                                        <span className="text-purple-600">↑</span>
                                        {intent.statement.substring(0, 80)}{intent.statement.length > 80 ? '...' : ''}
                                        <span className="ml-auto text-xs font-normal text-gray-500">
                                          {commitments.length} commitment{commitments.length !== 1 ? 's' : ''}
                                        </span>
                                      </h3>
                                      {driver && (
                                        <p className="text-xs text-purple-700 mt-1 ml-6">
                                          Driver: {driver.name}
                                        </p>
                                      )}
                                    </div>
                                    <div className="space-y-4 ml-4">
                                      {commitments.map((commitment) => {
                                        const upstreamConnections = [{
                                          id: intent.id,
                                          name: intent.statement.substring(0, 50) + '...',
                                          type: 'upstream' as const,
                                        }];

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
                        showConnections={showThreadLabels}
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
                                    </div>
                                  </div>
                                );
                              })}

                              {orphanedCommitments.length > 0 && (
                                <div>
                                  <div className="mb-3 pb-2 border-b-2 border-gray-300">
                                    <h3 className="text-md font-bold text-gray-700 flex items-center gap-2">
                                      <span className="text-amber-600">⚠️</span>
                                      Not Linked to Any Intent
                                      <span className="ml-auto text-xs font-normal text-gray-500">
                                        {orphanedCommitments.length} commitment{orphanedCommitments.length !== 1 ? 's' : ''}
                                      </span>
                                    </h3>
                                  </div>
                                  <div className="space-y-4 ml-4">
                                    {orphanedCommitments.map((commitment) => {
                                      const driver = pyramid.strategic_drivers.find(d => d.id === commitment.primary_driver_id);
                                      const upstreamConnections = driver ? [{
                                        id: driver.id,
                                        name: driver.name,
                                        type: 'upstream' as const,
                                      }] : [];

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
                        showConnections={showThreadLabels}
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
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        }
                      })()}

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

                {/* Thread Labels Toggle */}
                <div className="mb-4 flex items-center justify-end p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">Show thread labels</span>
                    <button
                      onClick={() => setShowThreadLabels(!showThreadLabels)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showThreadLabels ? 'bg-orange-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showThreadLabels ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                </div>

                <div className="space-y-6">
                  {(() => {
                    // Group team objectives by commitment
                    const objectivesByCommitment = new Map<string, any[]>();
                    const orphanedObjectives: any[] = [];

                    pyramid.team_objectives?.forEach((objective) => {
                      if (!objective.primary_commitment_id) {
                        orphanedObjectives.push(objective);
                      } else {
                        if (!objectivesByCommitment.has(objective.primary_commitment_id)) {
                          objectivesByCommitment.set(objective.primary_commitment_id, []);
                        }
                        objectivesByCommitment.get(objective.primary_commitment_id)!.push(objective);
                      }
                    });

                    return (
                      <>
                        {/* Render objectives grouped by commitment */}
                        {pyramid.iconic_commitments.map((commitment) => {
                          const objectives = objectivesByCommitment.get(commitment.id) || [];
                          if (objectives.length === 0) return null;

                          return (
                            <div key={commitment.id}>
                              <div className="mb-3 pb-2 border-b-2 border-orange-300">
                                <h3 className="text-md font-bold text-orange-900 flex items-center gap-2">
                                  <span className="text-orange-600">↑</span>
                                  {commitment.name}
                                  <span className="ml-auto text-xs font-normal text-gray-500">
                                    {objectives.length} objective{objectives.length !== 1 ? 's' : ''}
                                  </span>
                                </h3>
                                <p className="text-xs text-orange-700 mt-1 ml-6">
                                  {commitment.horizon} • {commitment.description.substring(0, 60)}
                                  {commitment.description.length > 60 ? '...' : ''}
                                </p>
                              </div>
                              <div className="space-y-4 ml-4">
                                {objectives.map((objective) => {
                                  const upstreamConnections = [{
                                    id: commitment.id,
                                    name: commitment.name,
                                    type: 'upstream' as const,
                                  }];

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
                        showConnections={showThreadLabels}
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
                              </div>
                            </div>
                          );
                        })}

                        {/* Render orphaned objectives if any */}
                        {orphanedObjectives.length > 0 && (
                          <div>
                            <div className="mb-3 pb-2 border-b-2 border-gray-300">
                              <h3 className="text-md font-bold text-gray-700 flex items-center gap-2">
                                <span className="text-amber-600">⚠️</span>
                                Not Linked to Any Commitment
                                <span className="ml-auto text-xs font-normal text-gray-500">
                                  {orphanedObjectives.length} objective{orphanedObjectives.length !== 1 ? 's' : ''}
                                </span>
                              </h3>
                            </div>
                            <div className="space-y-4 ml-4">
                              {orphanedObjectives.map((objective) => {
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
                                      connections={downstreamConnections}
                                      onEdit={() => openEditModal('team_objective', objective.id, objective)}
                                      onDelete={() => handleDeleteTeamObjective(objective.id)}
                                      onConnectionClick={handleConnectionClick}
                        showConnections={showThreadLabels}
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
                            </div>
                          </div>
                        )}

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
                      </>
                    );
                  })()}
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

                {/* Thread Labels Toggle */}
                <div className="mb-4 flex items-center justify-end p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">Show thread labels</span>
                    <button
                      onClick={() => setShowThreadLabels(!showThreadLabels)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showThreadLabels ? 'bg-teal-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showThreadLabels ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                </div>

                <div className="space-y-6">
                  {(() => {
                    // Group individual objectives by team objective
                    const objectivesByTeamObjective = new Map<string, any[]>();
                    const orphanedObjectives: any[] = [];

                    pyramid.individual_objectives?.forEach((objective) => {
                      if (!objective.team_objective_ids || objective.team_objective_ids.length === 0) {
                        orphanedObjectives.push(objective);
                      } else {
                        objective.team_objective_ids.forEach((teamObjId) => {
                          if (!objectivesByTeamObjective.has(teamObjId)) {
                            objectivesByTeamObjective.set(teamObjId, []);
                          }
                          objectivesByTeamObjective.get(teamObjId)!.push(objective);
                        });
                      }
                    });

                    return (
                      <>
                        {/* Render objectives grouped by team objective */}
                        {pyramid.team_objectives?.map((teamObj) => {
                          const objectives = objectivesByTeamObjective.get(teamObj.id) || [];
                          if (objectives.length === 0) return null;

                          return (
                            <div key={teamObj.id}>
                              <div className="mb-3 pb-2 border-b-2 border-orange-300">
                                <h3 className="text-md font-bold text-orange-900 flex items-center gap-2">
                                  <span className="text-orange-600">↑</span>
                                  {teamObj.name}
                                  <span className="ml-auto text-xs font-normal text-gray-500">
                                    {objectives.length} objective{objectives.length !== 1 ? 's' : ''}
                                  </span>
                                </h3>
                                <p className="text-xs text-orange-700 mt-1 ml-6">
                                  {teamObj.team_name} • {teamObj.description.substring(0, 60)}
                                  {teamObj.description.length > 60 ? '...' : ''}
                                </p>
                              </div>
                              <div className="space-y-4 ml-4">
                                {objectives.map((objective) => {
                                  const upstreamConnections = objective.team_objective_ids
                                    ?.map((teamObjId: string) => {
                                      const tObj = pyramid.team_objectives?.find((t) => t.id === teamObjId);
                                      return tObj ? {
                                        id: tObj.id,
                                        name: `${tObj.team_name}: ${tObj.name}`,
                                        type: 'upstream' as const,
                                      } : null;
                                    })
                                    .filter((conn: any): conn is NonNullable<typeof conn> => conn !== null) || [];

                                  return (
                                    <div key={objective.id} id={`item-${objective.id}`}>
                                      <TierCard
                                        variant="teal"
                                        connections={upstreamConnections}
                                        onEdit={() => openEditModal('individual_objective', objective.id, objective)}
                                        onDelete={() => handleDeleteIndividualObjective(objective.id)}
                                        onConnectionClick={handleConnectionClick}
                        showConnections={showThreadLabels}
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
                              </div>
                            </div>
                          );
                        })}

                        {/* Render orphaned objectives if any */}
                        {orphanedObjectives.length > 0 && (
                          <div>
                            <div className="mb-3 pb-2 border-b-2 border-gray-300">
                              <h3 className="text-md font-bold text-gray-700 flex items-center gap-2">
                                <span className="text-amber-600">⚠️</span>
                                Not Linked to Any Team Objective
                                <span className="ml-auto text-xs font-normal text-gray-500">
                                  {orphanedObjectives.length} objective{orphanedObjectives.length !== 1 ? 's' : ''}
                                </span>
                              </h3>
                            </div>
                            <div className="space-y-4 ml-4">
                              {orphanedObjectives.map((objective) => (
                                <div key={objective.id} id={`item-${objective.id}`}>
                                  <TierCard
                                    variant="teal"
                                    connections={[]}
                                    onEdit={() => openEditModal('individual_objective', objective.id, objective)}
                                    onDelete={() => handleDeleteIndividualObjective(objective.id)}
                                    onConnectionClick={handleConnectionClick}
                        showConnections={showThreadLabels}
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
                              ))}
                            </div>
                          </div>
                        )}

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
                      </>
                    );
                  })()}
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
          <>
            {/* Draft Generation Button */}
            <div className="mb-4 flex justify-end">
              <AIDraftGenerator
                sessionId={sessionId}
                tier="vision"
                tierLabel={(modalMode === 'edit' ? editFormData.statement_type : visionStatementType) || "Vision"}
                context={{
                  statement_type: modalMode === 'edit' ? editFormData.statement_type : visionStatementType,
                }}
                onAccept={(draft) => {
                  if (draft.statement || draft.description) {
                    const generatedValue = draft.statement || draft.description || "";
                    if (modalMode === 'edit') {
                      setEditFormData((prev: any) => ({ ...prev, statement: generatedValue }));
                    } else {
                      setVisionStatement(generatedValue);
                    }
                    visionStatementSuggestion.markAsAiGenerated(generatedValue);
                  }
                }}
                buttonSize="sm"
              />
            </div>

          <form onSubmit={modalMode === 'add' ? handleAddVision : (e) => { e.preventDefault(); handleSaveEdit('vision'); }} className="space-y-4">
            <div>
              <LabelWithTooltip
                label="Statement Type"
                tooltipContent={TIER1_TOOLTIPS.STATEMENT_TYPE}
                required={true}
              />
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
            <div>
              <div className="relative">
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
              tooltipContent={
                (modalMode === 'edit' ? editFormData.statement_type : visionStatementType) === StatementType.VISION
                  ? TIER1_TOOLTIPS.VISION
                  : (modalMode === 'edit' ? editFormData.statement_type : visionStatementType) === StatementType.MISSION
                  ? TIER1_TOOLTIPS.MISSION
                  : (modalMode === 'edit' ? editFormData.statement_type : visionStatementType) === StatementType.BELIEF
                  ? TIER1_TOOLTIPS.BELIEF
                  : TIER1_TOOLTIPS.VISION
              }
                  rows={4}
                  required
                />
                <AIFieldSuggestionIndicator
                  isLoading={visionStatementSuggestion.isLoading}
                  hasSuggestion={visionStatementSuggestion.hasSuggestion}
                />
              </div>
              {visionStatementSuggestion.hasSuggestion && visionStatementSuggestion.suggestion?.has_suggestion && (
                <AIFieldSuggestion
                  severity={visionStatementSuggestion.suggestion.severity || "info"}
                  message={visionStatementSuggestion.suggestion.message || ""}
                  suggestion={visionStatementSuggestion.suggestion.suggestion}
                  examples={visionStatementSuggestion.suggestion.examples}
                  reasoning={visionStatementSuggestion.suggestion.reasoning}
                  onDismiss={visionStatementSuggestion.dismissSuggestion}
                  onApply={(text) => {
                    if (modalMode === 'edit') {
                      setEditFormData({ ...editFormData, statement: text });
                    } else {
                      setVisionStatement(text);
                    }
                    visionStatementSuggestion.dismissSuggestion();
                  }}
                />
              )}
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="button" variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {modalMode === 'add' ? 'Add Statement' : 'Save Changes'}
              </Button>
            </div>
          </form>
          </>
        )}

        {/* Values Form */}
        {modalItemType === 'value' && (
          <>
            {/* Draft Generation Button */}
            <div className="mb-4 flex justify-end">
              <AIDraftGenerator
                sessionId={sessionId}
                tier="value"
                tierLabel="Value"
                context={{
                  existing_values: pyramid?.values?.map(v => v.name) || [],
                }}
                onAccept={(draft) => {
                  if (modalMode === 'edit') {
                    if (draft.name) {
                      setEditFormData((prev: any) => ({ ...prev, name: draft.name }));
                      valueNameSuggestion.markAsAiGenerated(draft.name);
                    }
                    if (draft.description) {
                      setEditFormData((prev: any) => ({ ...prev, description: draft.description }));
                      valueDescSuggestion.markAsAiGenerated(draft.description);
                    }
                  } else {
                    if (draft.name) {
                      setValueName(draft.name);
                      valueNameSuggestion.markAsAiGenerated(draft.name);
                    }
                    if (draft.description) {
                      setValueDescription(draft.description);
                      valueDescSuggestion.markAsAiGenerated(draft.description);
                    }
                  }
                }}
                buttonSize="sm"
              />
            </div>

          <form onSubmit={modalMode === 'add' ? handleAddValue : (e) => { e.preventDefault(); handleSaveEdit('value'); }} className="space-y-4">
            <div>
              <div className="relative">
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
                  placeholder="e.g., Speed Over Perfection, Transparent by Default"
                  tooltipContent={TIER2_TOOLTIPS.VALUE_NAME}
                  required
                />
                <AIFieldSuggestionIndicator
                  isLoading={valueNameSuggestion.isLoading}
                  hasSuggestion={valueNameSuggestion.hasSuggestion}
                />
              </div>
              {valueNameSuggestion.hasSuggestion && valueNameSuggestion.suggestion?.has_suggestion && (
                <AIFieldSuggestion
                  severity={valueNameSuggestion.suggestion.severity || "info"}
                  message={valueNameSuggestion.suggestion.message || ""}
                  suggestion={valueNameSuggestion.suggestion.suggestion}
                  examples={valueNameSuggestion.suggestion.examples}
                  reasoning={valueNameSuggestion.suggestion.reasoning}
                  onDismiss={valueNameSuggestion.dismissSuggestion}
                  onApply={(text) => {
                    if (modalMode === 'edit') {
                      setEditFormData({ ...editFormData, name: text });
                    } else {
                      setValueName(text);
                    }
                    valueNameSuggestion.dismissSuggestion();
                  }}
                />
              )}
            </div>

            <div>
              <div className="relative">
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
                  tooltipContent={TIER2_TOOLTIPS.VALUE_DESCRIPTION}
                  rows={3}
                />
                <AIFieldSuggestionIndicator
                  isLoading={valueDescSuggestion.isLoading}
                  hasSuggestion={valueDescSuggestion.hasSuggestion}
                />
              </div>
              {valueDescSuggestion.hasSuggestion && valueDescSuggestion.suggestion?.has_suggestion && (
                <AIFieldSuggestion
                  severity={valueDescSuggestion.suggestion.severity || "info"}
                  message={valueDescSuggestion.suggestion.message || ""}
                  suggestion={valueDescSuggestion.suggestion.suggestion}
                  examples={valueDescSuggestion.suggestion.examples}
                  reasoning={valueDescSuggestion.suggestion.reasoning}
                  onDismiss={valueDescSuggestion.dismissSuggestion}
                  onApply={(text) => {
                    if (modalMode === 'edit') {
                      setEditFormData({ ...editFormData, description: text });
                    } else {
                      setValueDescription(text);
                    }
                    valueDescSuggestion.dismissSuggestion();
                  }}
                />
              )}
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="button" variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {modalMode === 'add' ? 'Add Value' : 'Save Changes'}
              </Button>
            </div>
          </form>
          </>
        )}

        {/* Behaviours Form */}
        {modalItemType === 'behaviour' && (
          <>
            {/* Draft Generation Button */}
            <div className="mb-4 flex justify-end">
              <AIDraftGenerator
                sessionId={sessionId}
                tier="behaviour"
                tierLabel="Behaviour"
                context={{
                  values: selectedValueIds.map(id => pyramid?.values?.find(v => v.id === id)?.name).filter(Boolean),
                }}
                onAccept={(draft) => {
                  if (draft.statement || draft.description) {
                    const generatedValue = draft.statement || draft.description || "";
                    if (modalMode === 'edit') {
                      setEditFormData((prev: any) => ({ ...prev, statement: generatedValue }));
                    } else {
                      setBehaviourStatement(generatedValue);
                    }
                    behaviourStatementSuggestion.markAsAiGenerated(generatedValue);
                  }
                }}
                buttonSize="sm"
              />
            </div>

          <form onSubmit={modalMode === 'add' ? handleAddBehaviour : (e) => { e.preventDefault(); handleSaveEdit('behaviour'); }} className="space-y-4">
            <div>
              <div className="relative">
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
                  placeholder="e.g., We share work-in-progress early and often, inviting feedback..."
                  tooltipContent={TIER3_TOOLTIPS.BEHAVIOUR_STATEMENT}
                  rows={4}
                  required
                />
                <AIFieldSuggestionIndicator
                  isLoading={behaviourStatementSuggestion.isLoading}
                  hasSuggestion={behaviourStatementSuggestion.hasSuggestion}
                />
              </div>
              {behaviourStatementSuggestion.hasSuggestion && behaviourStatementSuggestion.suggestion?.has_suggestion && (
                <AIFieldSuggestion
                  severity={behaviourStatementSuggestion.suggestion.severity || "info"}
                  message={behaviourStatementSuggestion.suggestion.message || ""}
                  suggestion={behaviourStatementSuggestion.suggestion.suggestion}
                  examples={behaviourStatementSuggestion.suggestion.examples}
                  reasoning={behaviourStatementSuggestion.suggestion.reasoning}
                  onDismiss={behaviourStatementSuggestion.dismissSuggestion}
                  onApply={(text) => {
                    if (modalMode === 'edit') {
                      setEditFormData({ ...editFormData, statement: text });
                    } else {
                      setBehaviourStatement(text);
                    }
                    behaviourStatementSuggestion.dismissSuggestion();
                  }}
                />
              )}
            </div>
            <div>
              <LabelWithTooltip
                label="Link to Values (select one or more)"
                tooltipContent={TIER3_TOOLTIPS.BEHAVIOUR_LINKS}
              />
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
          </>
        )}

        {/* Driver Form */}
        {modalItemType === 'driver' && (
          <>
            {/* Draft Generation Button */}
            <div className="mb-4 flex justify-end">
              <AIDraftGenerator
                  sessionId={sessionId}
                  tier="strategic_driver"
                  tierLabel="Strategic Driver"
                  context={{
                    vision: pyramid?.vision?.statements?.[0]?.statement || "",
                    existing_drivers: pyramid?.strategic_drivers?.map(d => d.name) || [],
                  }}
                  onAccept={(draft) => {
                    if (modalMode === 'edit') {
                      if (draft.name) {
                        setEditFormData((prev: any) => ({ ...prev, name: draft.name }));
                        driverNameSuggestion.markAsAiGenerated(draft.name);
                      }
                      if (draft.description) {
                        setEditFormData((prev: any) => ({ ...prev, description: draft.description }));
                        driverDescSuggestion.markAsAiGenerated(draft.description);
                      }
                      if (draft.rationale) {
                        setEditFormData((prev: any) => ({ ...prev, rationale: draft.rationale }));
                        driverRationaleSuggestion.markAsAiGenerated(draft.rationale);
                      }
                    } else {
                      if (draft.name) {
                        setDriverName(draft.name);
                        driverNameSuggestion.markAsAiGenerated(draft.name);
                      }
                      if (draft.description) {
                        setDriverDescription(draft.description);
                        driverDescSuggestion.markAsAiGenerated(draft.description);
                      }
                      if (draft.rationale) {
                        setDriverRationale(draft.rationale);
                        driverRationaleSuggestion.markAsAiGenerated(draft.rationale);
                      }
                    }
                  }}
                  buttonSize="sm"
                />
            </div>

            <form onSubmit={modalMode === 'add' ? handleAddDriver : (e) => { e.preventDefault(); handleSaveEdit('driver'); }} className="space-y-4">
              {/* Driver Name with AI */}
              <div>
                <div className="relative">
                  <Input
                    label="Driver Name"
                    value={modalMode === 'edit' ? editFormData.name : driverName}
                    onChange={(e) => {
                      if (modalMode === 'edit') {
                        setEditFormData({ ...editFormData, name: e.target.value });
                      } else {
                        setDriverName(e.target.value);
                      }
                    }}
                    placeholder="e.g., Customer Excellence, Digital Innovation"
                    tooltipContent={TIER4_TOOLTIPS.DRIVER_NAME}
                    required
                  />
                  <AIFieldSuggestionIndicator
                    isLoading={driverNameSuggestion.isLoading}
                    hasSuggestion={driverNameSuggestion.hasSuggestion}
                  />
                </div>
                {driverNameSuggestion.hasSuggestion && driverNameSuggestion.suggestion?.has_suggestion && (
                  <AIFieldSuggestion
                    severity={driverNameSuggestion.suggestion.severity || "info"}
                    message={driverNameSuggestion.suggestion.message || ""}
                    suggestion={driverNameSuggestion.suggestion.suggestion}
                    examples={driverNameSuggestion.suggestion.examples}
                    reasoning={driverNameSuggestion.suggestion.reasoning}
                    onDismiss={driverNameSuggestion.dismissSuggestion}
                    onApply={(text) => {
                      if (modalMode === 'edit') {
                        setEditFormData({ ...editFormData, name: text });
                      } else {
                        setDriverName(text);
                      }
                      driverNameSuggestion.dismissSuggestion();
                    }}
                  />
                )}
              </div>

              {/* Driver Description with AI */}
              <div>
                <div className="relative">
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
                    tooltipContent={TIER4_TOOLTIPS.DRIVER_DESCRIPTION}
                    rows={3}
                    required
                  />
                  <AIFieldSuggestionIndicator
                    isLoading={driverDescSuggestion.isLoading}
                    hasSuggestion={driverDescSuggestion.hasSuggestion}
                  />
                </div>
                {driverDescSuggestion.hasSuggestion && driverDescSuggestion.suggestion?.has_suggestion && (
                  <AIFieldSuggestion
                    severity={driverDescSuggestion.suggestion.severity || "info"}
                    message={driverDescSuggestion.suggestion.message || ""}
                    suggestion={driverDescSuggestion.suggestion.suggestion}
                    examples={driverDescSuggestion.suggestion.examples}
                    reasoning={driverDescSuggestion.suggestion.reasoning}
                    onDismiss={driverDescSuggestion.dismissSuggestion}
                    onApply={(text) => {
                      if (modalMode === 'edit') {
                        setEditFormData({ ...editFormData, description: text });
                      } else {
                        setDriverDescription(text);
                      }
                      driverDescSuggestion.dismissSuggestion();
                    }}
                  />
                )}
              </div>

              {/* Driver Rationale with AI */}
              <div>
                <div className="relative">
                  <Textarea
                    label="Rationale (Optional)"
                    value={modalMode === 'edit' ? editFormData.rationale || '' : driverRationale}
                    onChange={(e) => {
                      if (modalMode === 'edit') {
                        setEditFormData({ ...editFormData, rationale: e.target.value });
                      } else {
                        setDriverRationale(e.target.value);
                      }
                    }}
                    placeholder="Why this driver was chosen..."
                    tooltipContent={TIER4_TOOLTIPS.DRIVER_RATIONALE}
                    rows={2}
                  />
                  <AIFieldSuggestionIndicator
                    isLoading={driverRationaleSuggestion.isLoading}
                    hasSuggestion={driverRationaleSuggestion.hasSuggestion}
                  />
                </div>
                {driverRationaleSuggestion.hasSuggestion && driverRationaleSuggestion.suggestion?.has_suggestion && (
                  <AIFieldSuggestion
                    severity={driverRationaleSuggestion.suggestion.severity || "info"}
                    message={driverRationaleSuggestion.suggestion.message || ""}
                    suggestion={driverRationaleSuggestion.suggestion.suggestion}
                    examples={driverRationaleSuggestion.suggestion.examples}
                    reasoning={driverRationaleSuggestion.suggestion.reasoning}
                    onDismiss={driverRationaleSuggestion.dismissSuggestion}
                    onApply={(text) => {
                      if (modalMode === 'edit') {
                        setEditFormData({ ...editFormData, rationale: text });
                      } else {
                        setDriverRationale(text);
                      }
                      driverRationaleSuggestion.dismissSuggestion();
                    }}
                  />
                )}
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button type="button" variant="ghost" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {modalMode === 'add' ? 'Add Driver' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </>
        )}

        {/* Intent Form */}
        {modalItemType === 'intent' && (
          <>
            {/* Draft Generation Button */}
            {(modalMode === 'add' ? selectedDriver : editFormData.driver_id) && (
              <div className="mb-4 flex justify-end">
                <AIDraftGenerator
                  sessionId={sessionId}
                  tier="strategic_intent"
                  tierLabel="Strategic Intent"
                  context={{
                    driver_id: modalMode === 'edit' ? editFormData.driver_id : selectedDriver,
                    driver_name: pyramid?.strategic_drivers?.find(d => d.id === (modalMode === 'edit' ? editFormData.driver_id : selectedDriver))?.name,
                    vision: pyramid?.vision?.statements?.[0]?.statement || "",
                  }}
                  onAccept={(draft) => {
                    if (draft.name || draft.statement) {
                      const generatedValue = draft.name || draft.statement || draft.description;
                      if (modalMode === 'edit') {
                        setEditFormData((prev: any) => ({ ...prev, statement: generatedValue }));
                      } else {
                        setIntentStatement(generatedValue);
                      }
                      intentSuggestion.markAsAiGenerated(generatedValue);
                    }
                  }}
                  buttonSize="sm"
                />
              </div>
            )}

            <form onSubmit={modalMode === 'add' ? handleAddIntent : (e) => { e.preventDefault(); handleSaveEdit('intent'); }} className="space-y-4">
              <div>
                <LabelWithTooltip
                  label="Strategic Driver"
                  tooltipContent={TIER5_TOOLTIPS.INTENT_DRIVER_LINK}
                  required={true}
                />
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

              {/* Intent Statement with AI */}
              <div>
                <div className="relative">
                  <Textarea
                    label="Intent Statement"
                    tooltipContent={TIER5_TOOLTIPS.INTENT_STATEMENT}
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
                  <AIFieldSuggestionIndicator
                    isLoading={intentSuggestion.isLoading}
                    hasSuggestion={intentSuggestion.hasSuggestion}
                  />
                </div>
                {intentSuggestion.hasSuggestion && intentSuggestion.suggestion?.has_suggestion && (
                  <AIFieldSuggestion
                    severity={intentSuggestion.suggestion.severity || "info"}
                    message={intentSuggestion.suggestion.message || ""}
                    suggestion={intentSuggestion.suggestion.suggestion}
                    examples={intentSuggestion.suggestion.examples}
                    reasoning={intentSuggestion.suggestion.reasoning}
                    onDismiss={intentSuggestion.dismissSuggestion}
                    onApply={(text) => {
                      if (modalMode === 'edit') {
                        setEditFormData({ ...editFormData, statement: text });
                      } else {
                        setIntentStatement(text);
                      }
                      intentSuggestion.dismissSuggestion();
                    }}
                  />
                )}
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button type="button" variant="ghost" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {modalMode === 'add' ? 'Add Intent' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </>
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
              placeholder="e.g., Real-Time Data Platform, Cloud Infrastructure"
              tooltipContent={TIER6_TOOLTIPS.ENABLER_NAME}
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
              tooltipContent={TIER6_TOOLTIPS.ENABLER_DESCRIPTION}
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
          <>
            {/* Draft Generation Button */}
            {(modalMode === 'add' ? selectedDriver : editFormData.primary_driver_id) && (
              <div className="mb-4 flex justify-end">
                <AIDraftGenerator
                  sessionId={sessionId}
                  tier="iconic_commitment"
                  tierLabel="Iconic Commitment"
                  context={{
                    vision: pyramid?.vision?.statements?.[0]?.statement || "",
                    drivers: pyramid?.strategic_drivers?.map(d => ({ id: d.id, name: d.name })) || [],
                    intents: pyramid?.strategic_intents?.filter(i => i.driver_id === (modalMode === 'edit' ? editFormData.primary_driver_id : selectedDriver)).map(i => ({ id: i.id, statement: i.statement })) || [],
                    primary_driver_id: modalMode === 'edit' ? editFormData.primary_driver_id : selectedDriver,
                    primary_driver_name: pyramid?.strategic_drivers?.find(d => d.id === (modalMode === 'edit' ? editFormData.primary_driver_id : selectedDriver))?.name,
                    horizon: modalMode === 'edit' ? editFormData.target_horizon : commitmentHorizon,
                  }}
                  onAccept={(draft) => {
                    if (modalMode === 'edit') {
                      if (draft.name) {
                        setEditFormData((prev: any) => ({ ...prev, name: draft.name }));
                        commitmentNameSuggestion.markAsAiGenerated(draft.name);
                      }
                      if (draft.description) {
                        setEditFormData((prev: any) => ({ ...prev, description: draft.description }));
                        commitmentDescSuggestion.markAsAiGenerated(draft.description);
                      }
                    } else {
                      if (draft.name) {
                        setCommitmentName(draft.name);
                        commitmentNameSuggestion.markAsAiGenerated(draft.name);
                      }
                      if (draft.description) {
                        setCommitmentDescription(draft.description);
                        commitmentDescSuggestion.markAsAiGenerated(draft.description);
                      }
                    }
                  }}
                  buttonSize="sm"
                />
              </div>
            )}

            <form onSubmit={modalMode === 'add' ? handleAddCommitment : (e) => { e.preventDefault(); handleSaveEdit('commitment'); }} className="space-y-4">
              {/* Commitment Name with AI */}
              <div>
                <div className="relative">
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
                    tooltipContent={TIER7_TOOLTIPS.COMMITMENT_NAME}
                    required
                  />
                  <AIFieldSuggestionIndicator
                    isLoading={commitmentNameSuggestion.isLoading}
                    hasSuggestion={commitmentNameSuggestion.hasSuggestion}
                  />
                </div>
                {commitmentNameSuggestion.hasSuggestion && commitmentNameSuggestion.suggestion?.has_suggestion && (
                  <AIFieldSuggestion
                    severity={commitmentNameSuggestion.suggestion.severity || "info"}
                    message={commitmentNameSuggestion.suggestion.message || ""}
                    suggestion={commitmentNameSuggestion.suggestion.suggestion}
                    examples={commitmentNameSuggestion.suggestion.examples}
                    reasoning={commitmentNameSuggestion.suggestion.reasoning}
                    onDismiss={commitmentNameSuggestion.dismissSuggestion}
                    onApply={(text) => {
                      if (modalMode === 'edit') {
                        setEditFormData({ ...editFormData, name: text });
                      } else {
                        setCommitmentName(text);
                      }
                      commitmentNameSuggestion.dismissSuggestion();
                    }}
                  />
                )}
              </div>

              {/* Commitment Description with AI */}
              <div>
                <div className="relative">
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
                    tooltipContent={TIER7_TOOLTIPS.COMMITMENT_DESCRIPTION}
                    rows={3}
                    required
                  />
                  <AIFieldSuggestionIndicator
                    isLoading={commitmentDescSuggestion.isLoading}
                    hasSuggestion={commitmentDescSuggestion.hasSuggestion}
                  />
                </div>
                {commitmentDescSuggestion.hasSuggestion && commitmentDescSuggestion.suggestion?.has_suggestion && (
                  <AIFieldSuggestion
                    severity={commitmentDescSuggestion.suggestion.severity || "info"}
                    message={commitmentDescSuggestion.suggestion.message || ""}
                    suggestion={commitmentDescSuggestion.suggestion.suggestion}
                    examples={commitmentDescSuggestion.suggestion.examples}
                    reasoning={commitmentDescSuggestion.suggestion.reasoning}
                    onDismiss={commitmentDescSuggestion.dismissSuggestion}
                    onApply={(text) => {
                      if (modalMode === 'edit') {
                        setEditFormData({ ...editFormData, description: text });
                      } else {
                        setCommitmentDescription(text);
                      }
                      commitmentDescSuggestion.dismissSuggestion();
                    }}
                  />
                )}
              </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <LabelWithTooltip
                  label="Primary Driver"
                  tooltipContent={TIER7_TOOLTIPS.PRIMARY_DRIVER}
                  required={true}
                />
                <select
                  className="input"
                  value={modalMode === 'edit' ? editFormData.primary_driver_id : selectedDriver}
                  onChange={(e) => {
                    if (modalMode === 'edit') {
                      // Reset intent selection when driver changes in edit mode
                      setEditFormData({
                        ...editFormData,
                        primary_driver_id: e.target.value,
                        primary_intent_ids: []
                      });
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
                <LabelWithTooltip
                  label="Horizon"
                  tooltipContent={TIER7_TOOLTIPS.HORIZON}
                />
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

            {/* Strategic Intents - Only show in edit mode for now */}
            {modalMode === 'edit' && editFormData.primary_driver_id && (
              <div>
                <div className="mb-2">
                  <LabelWithTooltip
                    label="Strategic Intents"
                    tooltipContent={TIER7_TOOLTIPS.STRATEGIC_INTENTS}
                    required={true}
                  />
                  <span className="text-xs text-gray-500 ml-2">(Select at least one)</span>
                </div>
                <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2 bg-gray-50">
                  {pyramid.strategic_intents
                    .filter(intent => intent.driver_id === editFormData.primary_driver_id)
                    .map((intent) => (
                      <label
                        key={intent.id}
                        className="flex items-start gap-2 p-2 hover:bg-white rounded cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={(editFormData.primary_intent_ids || []).includes(intent.id)}
                          onChange={(e) => {
                            const currentIntents = editFormData.primary_intent_ids || [];
                            if (e.target.checked) {
                              setEditFormData({
                                ...editFormData,
                                primary_intent_ids: [...currentIntents, intent.id]
                              });
                            } else {
                              setEditFormData({
                                ...editFormData,
                                primary_intent_ids: currentIntents.filter((id: string) => id !== intent.id)
                              });
                            }
                          }}
                          className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700 flex-1">{intent.statement}</span>
                      </label>
                    ))}
                  {pyramid.strategic_intents.filter(intent => intent.driver_id === editFormData.primary_driver_id).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      No strategic intents for this driver yet
                    </p>
                  )}
                </div>
                {(!editFormData.primary_intent_ids || editFormData.primary_intent_ids.length === 0) && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ This commitment will be marked as "orphaned" without intent linkage
                  </p>
                )}
              </div>
            )}

            {modalMode === 'edit' && (
              <>
                <Input
                  label="Owner (Optional)"
                  value={editFormData.owner || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, owner: e.target.value })}
                  placeholder="Person or team responsible"
                  tooltipContent={TIER7_TOOLTIPS.OWNER}
                />
                <Input
                  label="Target Date (Optional)"
                  type="date"
                  value={editFormData.target_date || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, target_date: e.target.value })}
                  tooltipContent={TIER7_TOOLTIPS.TARGET_DATE}
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
          </>
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
              placeholder="e.g., Complete Mobile Backend API"
              tooltipContent={TIER8_TOOLTIPS.TEAM_OBJECTIVE_NAME}
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
              placeholder="e.g., Backend Engineering, Customer Success Team"
              tooltipContent={TIER8_TOOLTIPS.TEAM_NAME}
              required
            />
            {pyramid.iconic_commitments.length > 0 && (
              <div>
                <LabelWithTooltip
                  label="Link to Commitment (Optional)"
                  tooltipContent={TIER8_TOOLTIPS.LINK_TO_COMMITMENT}
                />
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
              placeholder="e.g., Implement OAuth 2.0 Authentication"
              tooltipContent={TIER9_TOOLTIPS.INDIVIDUAL_OBJECTIVE_NAME}
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
              tooltipContent={TIER9_TOOLTIPS.INDIVIDUAL_NAME}
              required
            />
            {pyramid.team_objectives && pyramid.team_objectives.length > 0 && (
              <div>
                <LabelWithTooltip
                  label="Link to Team Objectives (optional)"
                  tooltipContent={TIER9_TOOLTIPS.LINK_TO_TEAM_OBJECTIVES}
                />
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

      {/* AI Coach Sidebar */}
      <AICoachSidebar />
    </div>
  );
}
