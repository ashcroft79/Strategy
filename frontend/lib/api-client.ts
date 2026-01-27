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
    addresses_opportunities?: string[],
    createdBy?: string
  ): Promise<StrategicDriver> {
    const { data } = await api.post(`/api/pyramids/${sessionId}/drivers`, {
      name,
      description,
      rationale,
      addresses_opportunities: addresses_opportunities || [],
      created_by: createdBy,
    });
    return data;
  },

  async update(
    sessionId: string,
    driverId: string,
    name?: string,
    description?: string,
    rationale?: string,
    addresses_opportunities?: string[]
  ): Promise<void> {
    await api.put(`/api/pyramids/${sessionId}/drivers`, {
      driver_id: driverId,
      name,
      description,
      rationale,
      addresses_opportunities,
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
    owner?: string,
    primaryIntentIds?: string[]
  ): Promise<void> {
    await api.put(`/api/pyramids/${sessionId}/commitments`, {
      commitment_id: commitmentId,
      name,
      description,
      horizon,
      target_date: targetDate,
      primary_driver_id: primaryDriverId,
      owner,
      primary_intent_ids: primaryIntentIds,
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

  async aiValidate(sessionId: string): Promise<ValidationResult> {
    const { data } = await api.get(`/api/validation/${sessionId}/ai`);
    return data;
  },

  async aiReview(sessionId: string): Promise<{
    overall_impression: string;
    strengths: string[];
    concerns: string[];
    recommendations: Array<{
      priority: number;
      title: string;
      description: string;
    }>;
    error?: string;
  }> {
    const { data } = await api.get(`/api/validation/${sessionId}/ai-review`);
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

  async downloadAIGuide(): Promise<Blob> {
    const { data } = await api.get(`/api/exports/ai-guide`, {
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

// ============================================================================
// AI COACHING
// ============================================================================

export const aiApi = {
  async suggestField(
    sessionId: string,
    tier: string,
    fieldName: string,
    currentContent: string,
    context?: any
  ): Promise<{
    has_suggestion: boolean;
    severity?: string;
    message?: string;
    suggestion?: string;
    examples?: string[];
    reasoning?: string;
    error?: string;
  }> {
    const { data } = await api.post("/api/ai/suggest-field", {
      session_id: sessionId,
      tier,
      field_name: fieldName,
      current_content: currentContent,
      context,
    });
    return data;
  },

  async generateDraft(
    sessionId: string,
    tier: string,
    context: any
  ): Promise<{
    name: string;
    description: string;
    rationale?: string;
    additional_fields?: any;
    error?: string;
  }> {
    const { data } = await api.post("/api/ai/generate-draft", {
      session_id: sessionId,
      tier,
      context,
    });
    return data;
  },

  async detectJargon(text: string): Promise<{
    has_jargon: boolean;
    jargon_words?: string[];
    severity?: string;
    message?: string;
    alternative?: string;
    error?: string;
  }> {
    const { data } = await api.post("/api/ai/detect-jargon", {
      text,
    });
    return data;
  },

  async chat(
    sessionId: string,
    message: string,
    chatHistory?: Array<{ role: string; content: string }>
  ): Promise<{
    response: string;
  }> {
    const { data } = await api.post("/api/ai/chat", {
      session_id: sessionId,
      message,
      chat_history: chatHistory,
    });
    return data;
  },
};

// ============================================================================
// DOCUMENT IMPORT
// ============================================================================

export interface DocumentParseResult {
  filename: string;
  success: boolean;
  format?: string;
  error?: string;
  num_pages?: number;
  num_slides?: number;
}

export interface ExtractedElements {
  vision?: {
    statement_type: string;
    statement: string;
    confidence: string;
    source_quote: string;
  };
  values?: Array<{
    name: string;
    description: string;
    confidence: string;
    source_quote: string;
  }>;
  behaviours?: Array<{
    statement: string;
    linked_values?: string[];
    confidence: string;
    source_quote: string;
  }>;
  strategic_intents?: Array<{
    name: string;
    description: string;
    confidence: string;
    source_quote: string;
  }>;
  strategic_drivers?: Array<{
    name: string;
    description: string;
    rationale: string;
    confidence: string;
    source_quote: string;
  }>;
  enablers?: Array<{
    name: string;
    description: string;
    linked_drivers?: string[];
    enabler_type?: string;
    confidence: string;
    source_quote: string;
  }>;
  iconic_commitments?: Array<{
    name: string;
    description: string;
    linked_driver?: string;
    horizon?: string;
    confidence: string;
    source_quote: string;
  }>;
  team_objectives?: Array<{
    name: string;
    description: string;
    team_name: string;
    linked_commitment?: string;
    metrics?: string;
    owner?: string;
    confidence: string;
    source_quote: string;
  }>;
  individual_objectives?: Array<{
    name: string;
    description: string;
    individual_name: string;
    linked_team_objective?: string;
    success_criteria?: string;
    confidence: string;
    source_quote: string;
  }>;
  extraction_notes?: string;
}

export interface ImportDocumentsResponse {
  success: boolean;
  documents_processed: number;
  parse_results: DocumentParseResult[];
  extracted_elements?: ExtractedElements;
  validation?: {
    valid: boolean;
    issues: Array<{ tier: string; severity: string; message: string }>;
    warnings: Array<{ tier: string; severity: string; message: string }>;
    summary: {
      vision_found: boolean;
      values_count: number;
      behaviours_count: number;
      intents_count: number;
      drivers_count: number;
      enablers_count: number;
      commitments_count: number;
      team_objectives_count: number;
      individual_objectives_count: number;
    };
  };
  error?: string;
}

export interface BatchImportResults {
  success: boolean;
  results: {
    vision: any;
    values: any[];
    behaviours: any[];
    strategic_intents: any[];
    strategic_drivers: any[];
    enablers: any[];
    iconic_commitments: any[];
    team_objectives: any[];
    individual_objectives: any[];
    errors: string[];
  };
  summary: {
    vision_added: boolean;
    values_added: number;
    behaviours_added: number;
    intents_added: number;
    drivers_added: number;
    enablers_added: number;
    commitments_added: number;
    team_objectives_added: number;
    individual_objectives_added: number;
    errors_count: number;
  };
}

export const documentsApi = {
  async importDocuments(
    files: File[],
    organizationName?: string
  ): Promise<ImportDocumentsResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    if (organizationName) {
      formData.append("organization_name", organizationName);
    }

    const { data } = await api.post("/api/documents/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  async batchImportElements(
    sessionId: string,
    extractedElements: ExtractedElements,
    createdBy?: string
  ): Promise<BatchImportResults> {
    const { data } = await api.post("/api/documents/batch-import", {
      session_id: sessionId,
      extracted_elements: extractedElements,
      created_by: createdBy || "Document Import",
    });
    return data;
  },

  async getSupportedFormats(): Promise<{
    formats: string[];
    max_file_size_mb: number;
    max_files_per_upload: number;
    max_pages_per_pdf: number;
    max_slides_per_pptx: number;
  }> {
    const { data } = await api.get("/api/documents/supported-formats");
    return data;
  },
};

// ============================================================================
// CONTEXT LAYER (TIER 0)
// ============================================================================

import type {
  SOCCItem,
  SOCCAnalysis,
  SOCCConnection,
  OpportunityScore,
  OpportunityScoringAnalysis,
  SortedOpportunity,
  StrategicTension,
  TensionAnalysis,
  CommonTension,
  Stakeholder,
  StakeholderAnalysis,
  ContextSummary,
  ContextExport,
} from "./context-types";

export const contextApi = {
  // SOCC Analysis
  async getSOCC(sessionId: string): Promise<SOCCAnalysis> {
    const { data } = await api.get(`/api/context/${sessionId}/socc`);
    return data;
  },

  async addSOCCItem(sessionId: string, item: Partial<SOCCItem>): Promise<SOCCItem> {
    const { data } = await api.post(`/api/context/${sessionId}/socc/items`, item);
    return data;
  },

  async updateSOCCItem(
    sessionId: string,
    itemId: string,
    item: Partial<SOCCItem>
  ): Promise<SOCCItem> {
    const { data } = await api.put(`/api/context/${sessionId}/socc/items/${itemId}`, item);
    return data;
  },

  async deleteSOCCItem(sessionId: string, itemId: string): Promise<void> {
    await api.delete(`/api/context/${sessionId}/socc/items/${itemId}`);
  },

  async addSOCCConnection(
    sessionId: string,
    connection: Partial<SOCCConnection>
  ): Promise<SOCCConnection> {
    const { data } = await api.post(`/api/context/${sessionId}/socc/connections`, connection);
    return data;
  },

  async deleteSOCCConnection(sessionId: string, connectionId: string): Promise<void> {
    await api.delete(`/api/context/${sessionId}/socc/connections/${connectionId}`);
  },

  // Opportunity Scoring
  async getOpportunityScores(sessionId: string): Promise<OpportunityScoringAnalysis> {
    const { data } = await api.get(`/api/context/${sessionId}/opportunities/scores`);
    return data;
  },

  async scoreOpportunity(
    sessionId: string,
    opportunityId: string,
    score: Partial<OpportunityScore>
  ): Promise<OpportunityScore> {
    const { data } = await api.post(
      `/api/context/${sessionId}/opportunities/${opportunityId}/score`,
      score
    );
    return data;
  },

  async deleteOpportunityScore(sessionId: string, opportunityId: string): Promise<void> {
    await api.delete(`/api/context/${sessionId}/opportunities/${opportunityId}/score`);
  },

  async getSortedOpportunities(sessionId: string): Promise<SortedOpportunity[]> {
    const { data } = await api.get(`/api/context/${sessionId}/opportunities/sorted`);
    return data;
  },

  // Strategic Tensions
  async getTensions(sessionId: string): Promise<TensionAnalysis> {
    const { data } = await api.get(`/api/context/${sessionId}/tensions`);
    return data;
  },

  async getCommonTensions(): Promise<{ common_tensions: CommonTension[] }> {
    const { data } = await api.get("/api/context/tensions/common");
    return data;
  },

  async addTension(
    sessionId: string,
    tension: Partial<StrategicTension>
  ): Promise<StrategicTension> {
    const { data } = await api.post(`/api/context/${sessionId}/tensions`, tension);
    return data;
  },

  async updateTension(
    sessionId: string,
    tensionId: string,
    tension: Partial<StrategicTension>
  ): Promise<StrategicTension> {
    const { data } = await api.put(`/api/context/${sessionId}/tensions/${tensionId}`, tension);
    return data;
  },

  async deleteTension(sessionId: string, tensionId: string): Promise<void> {
    await api.delete(`/api/context/${sessionId}/tensions/${tensionId}`);
  },

  // Stakeholder Mapping
  async getStakeholders(sessionId: string): Promise<StakeholderAnalysis> {
    const { data } = await api.get(`/api/context/${sessionId}/stakeholders`);
    return data;
  },

  async addStakeholder(
    sessionId: string,
    stakeholder: Partial<Stakeholder>
  ): Promise<Stakeholder> {
    const { data } = await api.post(`/api/context/${sessionId}/stakeholders`, stakeholder);
    return data;
  },

  async updateStakeholder(
    sessionId: string,
    stakeholderId: string,
    stakeholder: Partial<Stakeholder>
  ): Promise<Stakeholder> {
    const { data } = await api.put(
      `/api/context/${sessionId}/stakeholders/${stakeholderId}`,
      stakeholder
    );
    return data;
  },

  async deleteStakeholder(sessionId: string, stakeholderId: string): Promise<void> {
    await api.delete(`/api/context/${sessionId}/stakeholders/${stakeholderId}`);
  },

  // Context Summary
  async getContextSummary(sessionId: string): Promise<ContextSummary> {
    const { data } = await api.get(`/api/context/${sessionId}/summary`);
    return data;
  },

  async exportContext(sessionId: string): Promise<ContextExport> {
    const { data } = await api.get(`/api/context/${sessionId}/export`);
    return data;
  },

  async clearContext(sessionId: string): Promise<void> {
    await api.delete(`/api/context/${sessionId}/clear`);
  },
};

// Re-export context types for convenience
export * from "./context-types";
