/**
 * API client for Strategic Pyramid Builder backend
 */

import axios from "axios";
import type {
  StrategyPyramid,
  CreatePyramidRequest,
  LoadPyramidRequest,
  PyramidSummary,
  ValidationResult,
  ExportRequest,
  StatementType,
  Horizon,
  Value,
  Behaviour,
  StrategicDriver,
  StrategicIntent,
  Enabler,
  IconicCommitment,
  TeamObjective,
  IndividualObjective,
  VisionStatement,
} from "@/types/pyramid";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================================
// PYRAMID OPERATIONS
// ============================================================================

export const pyramidApi = {
  async create(request: CreatePyramidRequest): Promise<StrategyPyramid> {
    const { data } = await api.post("/api/pyramids/create", request);
    return data.pyramid;
  },

  async load(request: LoadPyramidRequest): Promise<StrategyPyramid> {
    const { data } = await api.post("/api/pyramids/load", request);
    return data.pyramid;
  },

  async get(sessionId: string): Promise<StrategyPyramid> {
    const { data } = await api.get(`/api/pyramids/${sessionId}`);
    return data;
  },

  async getSummary(sessionId: string): Promise<PyramidSummary> {
    const { data } = await api.get(`/api/pyramids/${sessionId}/summary`);
    return data;
  },

  async delete(sessionId: string): Promise<void> {
    await api.delete(`/api/pyramids/${sessionId}`);
  },
};

// ============================================================================
// TIER 1: VISION/MISSION/BELIEF
// ============================================================================

export const visionApi = {
  async addStatement(
    sessionId: string,
    statementType: StatementType,
    statement: string,
    order?: number,
    createdBy?: string
  ): Promise<VisionStatement> {
    const { data } = await api.post(`/api/pyramids/${sessionId}/vision/statements`, {
      statement_type: statementType,
      statement,
      order,
      created_by: createdBy,
    });
    return data;
  },

  async updateStatement(
    sessionId: string,
    statementId: string,
    statementType?: StatementType,
    statement?: string
  ): Promise<void> {
    await api.put(`/api/pyramids/${sessionId}/vision/statements`, {
      statement_id: statementId,
      statement_type: statementType,
      statement,
    });
  },

  async removeStatement(sessionId: string, statementId: string): Promise<void> {
    await api.delete(`/api/pyramids/${sessionId}/vision/statements/${statementId}`);
  },
};

// ============================================================================
// TIER 2: VALUES
// ============================================================================

export const valuesApi = {
  async add(
    sessionId: string,
    name: string,
    description?: string,
    createdBy?: string
  ): Promise<Value> {
    const { data } = await api.post(`/api/pyramids/${sessionId}/values`, {
      name,
      description,
      created_by: createdBy,
    });
    return data;
  },

  async update(
    sessionId: string,
    valueId: string,
    name?: string,
    description?: string
  ): Promise<void> {
    await api.put(`/api/pyramids/${sessionId}/values`, {
      value_id: valueId,
      name,
      description,
    });
  },

  async remove(sessionId: string, valueId: string): Promise<void> {
    await api.delete(`/api/pyramids/${sessionId}/values/${valueId}`);
  },
};

// ============================================================================
// TIER 3: BEHAVIOURS
// ============================================================================

export const behavioursApi = {
  async add(
    sessionId: string,
    statement: string,
    valueIds?: string[],
    createdBy?: string
  ): Promise<Behaviour> {
    const { data } = await api.post(`/api/pyramids/${sessionId}/behaviours`, {
      statement,
      value_ids: valueIds,
      created_by: createdBy,
    });
    return data;
  },

  async update(
    sessionId: string,
    behaviourId: string,
    statement?: string,
    valueIds?: string[]
  ): Promise<void> {
    await api.put(`/api/pyramids/${sessionId}/behaviours`, {
      behaviour_id: behaviourId,
      statement,
      value_ids: valueIds,
    });
  },

  async remove(sessionId: string, behaviourId: string): Promise<void> {
    await api.delete(`/api/pyramids/${sessionId}/behaviours/${behaviourId}`);
  },
};

// ============================================================================
// TIER 5: STRATEGIC DRIVERS
// ============================================================================

export const driversApi = {
  async add(
    sessionId: string,
    name: string,
    description: string,
    rationale?: string,
    createdBy?: string
  ): Promise<StrategicDriver> {
    const { data } = await api.post(`/api/pyramids/${sessionId}/drivers`, {
      name,
      description,
      rationale,
      created_by: createdBy,
    });
    return data;
  },

  async update(
    sessionId: string,
    driverId: string,
    name?: string,
    description?: string,
    rationale?: string
  ): Promise<void> {
    await api.put(`/api/pyramids/${sessionId}/drivers`, {
      driver_id: driverId,
      name,
      description,
      rationale,
    });
  },

  async remove(sessionId: string, driverId: string): Promise<void> {
    await api.delete(`/api/pyramids/${sessionId}/drivers/${driverId}`);
  },
};

// ============================================================================
// TIER 4: STRATEGIC INTENTS
// ============================================================================

export const intentsApi = {
  async add(
    sessionId: string,
    statement: string,
    driverId: string,
    isStakeholderVoice: boolean = false,
    createdBy?: string
  ): Promise<StrategicIntent> {
    const { data } = await api.post(`/api/pyramids/${sessionId}/intents`, {
      statement,
      driver_id: driverId,
      is_stakeholder_voice: isStakeholderVoice,
      created_by: createdBy,
    });
    return data;
  },

  async update(
    sessionId: string,
    intentId: string,
    statement?: string,
    driverId?: string,
    isStakeholderVoice?: boolean
  ): Promise<void> {
    await api.put(`/api/pyramids/${sessionId}/intents`, {
      intent_id: intentId,
      statement,
      driver_id: driverId,
      is_stakeholder_voice: isStakeholderVoice,
    });
  },

  async remove(sessionId: string, intentId: string): Promise<void> {
    await api.delete(`/api/pyramids/${sessionId}/intents/${intentId}`);
  },
};

// ============================================================================
// TIER 6: ENABLERS
// ============================================================================

export const enablersApi = {
  async add(
    sessionId: string,
    name: string,
    description: string,
    driverIds?: string[],
    enablerType?: string,
    createdBy?: string
  ): Promise<Enabler> {
    const { data } = await api.post(`/api/pyramids/${sessionId}/enablers`, {
      name,
      description,
      driver_ids: driverIds,
      enabler_type: enablerType,
      created_by: createdBy,
    });
    return data;
  },

  async update(
    sessionId: string,
    enablerId: string,
    name?: string,
    description?: string,
    driverIds?: string[],
    enablerType?: string
  ): Promise<void> {
    await api.put(`/api/pyramids/${sessionId}/enablers`, {
      enabler_id: enablerId,
      name,
      description,
      driver_ids: driverIds,
      enabler_type: enablerType,
    });
  },

  async remove(sessionId: string, enablerId: string): Promise<void> {
    await api.delete(`/api/pyramids/${sessionId}/enablers/${enablerId}`);
  },
};

// ============================================================================
// TIER 7: ICONIC COMMITMENTS
// ============================================================================

export const commitmentsApi = {
  async add(
    sessionId: string,
    name: string,
    description: string,
    horizon: Horizon,
    primaryDriverId: string,
    primaryIntentIds?: string[],
    targetDate?: string,
    owner?: string,
    createdBy?: string
  ): Promise<IconicCommitment> {
    const { data } = await api.post(`/api/pyramids/${sessionId}/commitments`, {
      name,
      description,
      horizon,
      primary_driver_id: primaryDriverId,
      primary_intent_ids: primaryIntentIds,
      target_date: targetDate,
      owner,
      created_by: createdBy,
    });
    return data;
  },

  async update(
    sessionId: string,
    commitmentId: string,
    name?: string,
    description?: string,
    horizon?: Horizon,
    targetDate?: string,
    primaryDriverId?: string,
    owner?: string
  ): Promise<void> {
    await api.put(`/api/pyramids/${sessionId}/commitments`, {
      commitment_id: commitmentId,
      name,
      description,
      horizon,
      target_date: targetDate,
      primary_driver_id: primaryDriverId,
      owner,
    });
  },

  async remove(sessionId: string, commitmentId: string): Promise<void> {
    await api.delete(`/api/pyramids/${sessionId}/commitments/${commitmentId}`);
  },
};

// ============================================================================
// TIER 8: TEAM OBJECTIVES
// ============================================================================

export const teamObjectivesApi = {
  async add(
    sessionId: string,
    name: string,
    description: string,
    teamName: string,
    primaryCommitmentId?: string,
    metrics?: string[],
    owner?: string,
    createdBy?: string
  ): Promise<TeamObjective> {
    const { data } = await api.post(`/api/pyramids/${sessionId}/team-objectives`, {
      name,
      description,
      team_name: teamName,
      primary_commitment_id: primaryCommitmentId,
      metrics,
      owner,
      created_by: createdBy,
    });
    return data;
  },

  async update(
    sessionId: string,
    objectiveId: string,
    name?: string,
    description?: string,
    teamName?: string,
    primaryCommitmentId?: string,
    metrics?: string[],
    owner?: string
  ): Promise<void> {
    await api.put(`/api/pyramids/${sessionId}/team-objectives`, {
      objective_id: objectiveId,
      name,
      description,
      team_name: teamName,
      primary_commitment_id: primaryCommitmentId,
      metrics,
      owner,
    });
  },

  async remove(sessionId: string, objectiveId: string): Promise<void> {
    await api.delete(`/api/pyramids/${sessionId}/team-objectives/${objectiveId}`);
  },
};

// ============================================================================
// TIER 9: INDIVIDUAL OBJECTIVES
// ============================================================================

export const individualObjectivesApi = {
  async add(
    sessionId: string,
    name: string,
    description: string,
    individualName: string,
    teamObjectiveIds?: string[],
    successCriteria?: string[],
    createdBy?: string
  ): Promise<IndividualObjective> {
    const { data } = await api.post(`/api/pyramids/${sessionId}/individual-objectives`, {
      name,
      description,
      individual_name: individualName,
      team_objective_ids: teamObjectiveIds,
      success_criteria: successCriteria,
      created_by: createdBy,
    });
    return data;
  },

  async update(
    sessionId: string,
    objectiveId: string,
    name?: string,
    description?: string,
    individualName?: string,
    teamObjectiveIds?: string[],
    successCriteria?: string[]
  ): Promise<void> {
    await api.put(`/api/pyramids/${sessionId}/individual-objectives`, {
      objective_id: objectiveId,
      name,
      description,
      individual_name: individualName,
      team_objective_ids: teamObjectiveIds,
      success_criteria: successCriteria,
    });
  },

  async remove(sessionId: string, objectiveId: string): Promise<void> {
    await api.delete(`/api/pyramids/${sessionId}/individual-objectives/${objectiveId}`);
  },
};

// ============================================================================
// VALIDATION
// ============================================================================

export const validationApi = {
  async validate(sessionId: string): Promise<ValidationResult> {
    const { data } = await api.get(`/api/validation/${sessionId}`);
    return data;
  },

  async quickValidate(sessionId: string): Promise<{
    has_errors: boolean;
    error_count: number;
    errors: any[];
  }> {
    const { data } = await api.get(`/api/validation/${sessionId}/quick`);
    return data;
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

export const exportsApi = {
  async exportWord(sessionId: string, request: ExportRequest): Promise<Blob> {
    const { data } = await api.post(`/api/exports/${sessionId}/word`, request, {
      responseType: "blob",
    });
    return data;
  },

  async exportPowerPoint(sessionId: string, request: ExportRequest): Promise<Blob> {
    const { data } = await api.post(`/api/exports/${sessionId}/powerpoint`, request, {
      responseType: "blob",
    });
    return data;
  },

  async exportMarkdown(sessionId: string, request: ExportRequest): Promise<Blob> {
    const { data } = await api.post(`/api/exports/${sessionId}/markdown`, request, {
      responseType: "blob",
    });
    return data;
  },

  async exportJSON(sessionId: string, request: ExportRequest): Promise<Blob> {
    const { data } = await api.post(`/api/exports/${sessionId}/json`, request, {
      responseType: "blob",
    });
    return data;
  },
};

// ============================================================================
// VISUALIZATIONS
// ============================================================================

export const visualizationsApi = {
  async getPyramidDiagram(sessionId: string, showCounts: boolean = true): Promise<any> {
    const { data } = await api.get(
      `/api/visualizations/${sessionId}/pyramid-diagram?show_counts=${showCounts}`
    );
    return data;
  },

  async getDistributionSunburst(sessionId: string): Promise<any> {
    const { data } = await api.get(`/api/visualizations/${sessionId}/distribution-sunburst`);
    return data;
  },

  async getHorizonTimeline(sessionId: string): Promise<any> {
    const { data } = await api.get(`/api/visualizations/${sessionId}/horizon-timeline`);
    return data;
  },

  async getNetworkDiagram(sessionId: string): Promise<any> {
    const { data } = await api.get(`/api/visualizations/${sessionId}/network-diagram`);
    return data;
  },
};
