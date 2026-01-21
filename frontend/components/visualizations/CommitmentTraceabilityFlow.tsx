import { useState } from "react";
import { StrategyPyramid, IconicCommitment, Horizon } from "@/types/pyramid";
import { Sparkles, AlertCircle, TrendingUp, Layers, ChevronRight, Edit, X, Save } from "lucide-react";
import { commitmentsApi } from "@/lib/api-client";
import { usePyramidStore } from "@/lib/store";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface CommitmentTraceabilityFlowProps {
  pyramid: StrategyPyramid;
}

interface TraceabilityScore {
  commitmentId: string;
  commitmentName: string;
  driverName: string;
  intentCount: number;
  hasVision: boolean;
  valueConnections: string[];
  score: "golden" | "good" | "weak" | "orphan";
  issues: string[];
}

export default function CommitmentTraceabilityFlow({ pyramid }: CommitmentTraceabilityFlowProps) {
  const { sessionId, setPyramid, showToast, setLoading, isLoading } = usePyramidStore();
  const [selectedCommitmentId, setSelectedCommitmentId] = useState<string | null>(null);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCommitment, setEditingCommitment] = useState<IconicCommitment | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    horizon: Horizon.H1,
    target_date: "",
    primary_driver_id: "",
    owner: ""
  });

  // Open edit modal
  const handleEditClick = (commitment: IconicCommitment) => {
    setEditingCommitment(commitment);
    setEditForm({
      name: commitment.name,
      description: commitment.description,
      horizon: commitment.horizon,
      target_date: commitment.target_date || "",
      primary_driver_id: commitment.primary_driver_id,
      owner: commitment.owner || ""
    });
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCommitment(null);
    setEditForm({
      name: "",
      description: "",
      horizon: Horizon.H1,
      target_date: "",
      primary_driver_id: "",
      owner: ""
    });
  };

  // Handle form submission
  const handleUpdateCommitment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCommitment || !sessionId) return;

    try {
      setLoading(true);
      await commitmentsApi.update(
        sessionId,
        editingCommitment.id,
        editForm.name,
        editForm.description,
        editForm.horizon,
        editForm.target_date || undefined,
        editForm.primary_driver_id,
        editForm.owner || undefined
      );

      // Refresh pyramid data
      const { pyramidApi } = await import("@/lib/api-client");
      const updated = await pyramidApi.get(sessionId);
      setPyramid(updated);

      showToast("Commitment updated successfully", "success");
      closeEditModal();
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to update commitment", "error");
    } finally {
      setLoading(false);
    }
  };

  // Calculate traceability scores for all commitments
  const calculateTraceability = (): TraceabilityScore[] => {
    return pyramid.iconic_commitments.map(commitment => {
      const driver = pyramid.strategic_drivers.find(d => d.id === commitment.primary_driver_id);
      const intents = pyramid.strategic_intents.filter(i =>
        commitment.primary_intent_ids.includes(i.id)
      );

      // Check value connections (through behaviours that reference the driver's values)
      const valueConnections: string[] = [];
      const issues: string[] = [];

      // Check if commitment has intents
      const intentCount = intents.length;
      if (intentCount === 0) {
        issues.push("No strategic intents linked");
      }

      // Check if vision exists
      const hasVision = pyramid.vision ? pyramid.vision.statements.length > 0 : false;
      if (!hasVision) {
        issues.push("No vision defined");
      }

      // Check driver connection
      if (!driver) {
        issues.push("Driver not found");
      }

      // Determine traceability score
      let score: "golden" | "good" | "weak" | "orphan";
      if (issues.length === 0 && hasVision && intentCount >= 2) {
        score = "golden";
      } else if (issues.length === 0 && intentCount >= 1) {
        score = "good";
      } else if (intentCount >= 1) {
        score = "weak";
      } else {
        score = "orphan";
      }

      return {
        commitmentId: commitment.id,
        commitmentName: commitment.name,
        driverName: driver?.name || "Unknown Driver",
        intentCount,
        hasVision,
        valueConnections,
        score,
        issues
      };
    });
  };

  const traceabilityData = calculateTraceability();

  // Get selected commitment details
  const getCommitmentTrace = (commitmentId: string) => {
    const commitment = pyramid.iconic_commitments.find(c => c.id === commitmentId);
    if (!commitment) return null;

    const driver = pyramid.strategic_drivers.find(d => d.id === commitment.primary_driver_id);
    const intents = pyramid.strategic_intents.filter(i =>
      commitment.primary_intent_ids.includes(i.id)
    );

    return {
      commitment,
      driver,
      intents,
      vision: pyramid.vision
    };
  };

  const selectedTrace = selectedCommitmentId ? getCommitmentTrace(selectedCommitmentId) : null;

  // Summary stats
  const goldenCount = traceabilityData.filter(t => t.score === "golden").length;
  const goodCount = traceabilityData.filter(t => t.score === "good").length;
  const weakCount = traceabilityData.filter(t => t.score === "weak").length;
  const orphanCount = traceabilityData.filter(t => t.score === "orphan").length;

  const getScoreColor = (score: "golden" | "good" | "weak" | "orphan") => {
    switch (score) {
      case "golden":
        return {
          bg: "bg-amber-50",
          border: "border-amber-300",
          text: "text-amber-900",
          badge: "bg-amber-100 text-amber-800",
          icon: "text-amber-500"
        };
      case "good":
        return {
          bg: "bg-green-50",
          border: "border-green-300",
          text: "text-green-900",
          badge: "bg-green-100 text-green-800",
          icon: "text-green-500"
        };
      case "weak":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-300",
          text: "text-yellow-900",
          badge: "bg-yellow-100 text-yellow-800",
          icon: "text-yellow-500"
        };
      case "orphan":
        return {
          bg: "bg-red-50",
          border: "border-red-300",
          text: "text-red-900",
          badge: "bg-red-100 text-red-800",
          icon: "text-red-500"
        };
    }
  };

  const getScoreLabel = (score: "golden" | "good" | "weak" | "orphan") => {
    switch (score) {
      case "golden":
        return "✨ Golden Thread";
      case "good":
        return "✅ Good Trace";
      case "weak":
        return "⚠️ Weak Trace";
      case "orphan":
        return "🔴 Orphaned";
    }
  };

  const getScoreDescription = (score: "golden" | "good" | "weak" | "orphan") => {
    switch (score) {
      case "golden":
        return "Strongly connected to vision with multiple intents";
      case "good":
        return "Well-connected with clear strategic alignment";
      case "weak":
        return "Has basic connections but missing some links";
      case "orphan":
        return "Poorly connected to strategic framework";
    }
  };

  if (pyramid.iconic_commitments.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <div className="text-5xl mb-4">🔗</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No commitments to trace</h3>
        <p className="text-gray-600">
          Add iconic commitments to see their traceability to vision
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">Traceability Summary</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center bg-white bg-opacity-60 rounded-lg p-4 border border-purple-200">
            <div className="text-3xl font-bold text-amber-600">{goldenCount}</div>
            <div className="text-xs text-gray-700 font-medium mt-1">Golden Threads</div>
          </div>
          <div className="text-center bg-white bg-opacity-60 rounded-lg p-4 border border-purple-200">
            <div className="text-3xl font-bold text-green-600">{goodCount}</div>
            <div className="text-xs text-gray-700 font-medium mt-1">Good Traces</div>
          </div>
          <div className="text-center bg-white bg-opacity-60 rounded-lg p-4 border border-purple-200">
            <div className="text-3xl font-bold text-yellow-600">{weakCount}</div>
            <div className="text-xs text-gray-700 font-medium mt-1">Weak Traces</div>
          </div>
          <div className="text-center bg-white bg-opacity-60 rounded-lg p-4 border border-purple-200">
            <div className="text-3xl font-bold text-red-600">{orphanCount}</div>
            <div className="text-xs text-gray-700 font-medium mt-1">Orphaned</div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-700">
          <p className="font-medium">
            {goldenCount > 0 && (
              <span className="text-amber-700">
                🎉 Great! You have {goldenCount} golden thread{goldenCount === 1 ? '' : 's'} with strong strategic alignment.
              </span>
            )}
            {orphanCount > 0 && (
              <span className="text-red-700 ml-2">
                {orphanCount} commitment{orphanCount === 1 ? '' : 's'} need{orphanCount === 1 ? 's' : ''} better strategic connections.
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:h-[700px]">
        {/* Commitment List */}
        <div className="lg:w-1/2 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-4">All Commitments</h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {traceabilityData.map(trace => {
            const colors = getScoreColor(trace.score);
            const isSelected = selectedCommitmentId === trace.commitmentId;

            return (
              <div
                key={trace.commitmentId}
                className={`${colors.border} ${colors.bg} border-2 rounded-lg p-4 hover:shadow-lg transition-all ${
                  isSelected ? 'ring-2 ring-purple-500 shadow-lg' : ''
                }`}
              >
                <button
                  onClick={() => setSelectedCommitmentId(trace.commitmentId)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {trace.score === "golden" && <Sparkles className={`w-4 h-4 ${colors.icon}`} />}
                        {trace.score === "orphan" && <AlertCircle className={`w-4 h-4 ${colors.icon}`} />}
                        {trace.score === "good" && <TrendingUp className={`w-4 h-4 ${colors.icon}`} />}
                        <h4 className={`font-bold ${colors.text}`}>{trace.commitmentName}</h4>
                      </div>

                      <div className="text-xs text-gray-700 space-y-1">
                        <div>
                          <span className="font-medium">Driver:</span> {trace.driverName}
                        </div>
                        <div>
                          <span className="font-medium">Intents:</span> {trace.intentCount}
                        </div>
                      </div>

                      <div className={`mt-2 inline-block px-2 py-1 ${colors.badge} rounded text-xs font-semibold`}>
                        {getScoreLabel(trace.score)}
                      </div>

                      {trace.issues.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {trace.issues.map((issue, idx) => (
                            <div key={idx} className="text-xs text-red-700">
                              • {issue}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <ChevronRight className={`w-5 h-5 ${colors.icon} ${isSelected ? 'rotate-90' : ''} transition-transform`} />
                  </div>
                </button>

                {/* Edit Button */}
                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const commitment = pyramid.iconic_commitments.find(c => c.id === trace.commitmentId);
                      if (commitment) handleEditClick(commitment);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-xs font-medium transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Trace Detail */}
        <div className="lg:w-1/2 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Strategic Trace</h3>
          <div className="flex-1 overflow-y-auto pr-2">
          {selectedTrace ? (
            <div className="bg-white rounded-xl border-2 border-purple-200 p-6 shadow-lg">
              <p className="text-sm text-gray-600 mb-6">
                Following the thread from vision to execution
              </p>

              {/* Trace Flow */}
              <div className="space-y-4">
                {/* Vision */}
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      1
                    </div>
                    <h4 className="font-bold text-purple-900">Vision</h4>
                  </div>
                  {selectedTrace.vision && selectedTrace.vision.statements.length > 0 ? (
                    <div className="ml-10 space-y-1">
                      {selectedTrace.vision.statements.slice(0, 2).map((stmt, idx) => (
                        <p key={idx} className="text-sm text-gray-700 italic">
                          "{stmt.statement}"
                        </p>
                      ))}
                      {selectedTrace.vision.statements.length > 2 && (
                        <p className="text-xs text-gray-500">
                          +{selectedTrace.vision.statements.length - 2} more...
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="ml-10 text-sm text-red-600">No vision defined</p>
                  )}
                </div>

                <div className="flex justify-center">
                  <div className="w-0.5 h-6 bg-purple-300"></div>
                </div>

                {/* Driver */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      2
                    </div>
                    <h4 className="font-bold text-blue-900">Strategic Driver</h4>
                  </div>
                  {selectedTrace.driver ? (
                    <div className="ml-10">
                      <p className="text-sm font-semibold text-gray-900">{selectedTrace.driver.name}</p>
                      <p className="text-xs text-gray-700 mt-1">{selectedTrace.driver.description}</p>
                    </div>
                  ) : (
                    <p className="ml-10 text-sm text-red-600">No driver linked</p>
                  )}
                </div>

                <div className="flex justify-center">
                  <div className="w-0.5 h-6 bg-purple-300"></div>
                </div>

                {/* Intents */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      3
                    </div>
                    <h4 className="font-bold text-green-900">Strategic Intents</h4>
                  </div>
                  {selectedTrace.intents.length > 0 ? (
                    <div className="ml-10 space-y-2">
                      {selectedTrace.intents.map((intent, idx) => (
                        <div key={idx} className="bg-white bg-opacity-70 rounded p-2">
                          <p className="text-sm text-gray-900">{intent.statement}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="ml-10 text-sm text-red-600">No intents linked</p>
                  )}
                </div>

                <div className="flex justify-center">
                  <div className="w-0.5 h-6 bg-purple-300"></div>
                </div>

                {/* Commitment */}
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      4
                    </div>
                    <h4 className="font-bold text-orange-900">Iconic Commitment</h4>
                  </div>
                  <div className="ml-10">
                    <p className="text-sm font-semibold text-gray-900">{selectedTrace.commitment.name}</p>
                    <p className="text-xs text-gray-700 mt-1">{selectedTrace.commitment.description}</p>
                    <div className="mt-2 flex gap-2">
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-semibold">
                        {selectedTrace.commitment.horizon}
                      </span>
                      {selectedTrace.commitment.target_date && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                          {new Date(selectedTrace.commitment.target_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-12 text-center h-full flex flex-col items-center justify-center">
              <Layers className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600">
                Click on any commitment to see its full strategic trace
              </p>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Edit Iconic Commitment">
        <form onSubmit={handleUpdateCommitment} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commitment Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              placeholder="Enter commitment name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              placeholder="Describe this commitment"
              rows={3}
              required
            />
          </div>

          {/* Horizon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Horizon <span className="text-red-500">*</span>
            </label>
            <select
              value={editForm.horizon}
              onChange={(e) => setEditForm({ ...editForm, horizon: e.target.value as Horizon })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value={Horizon.H1}>H1 (0-12 months)</option>
              <option value={Horizon.H2}>H2 (12-24 months)</option>
              <option value={Horizon.H3}>H3 (24-36 months)</option>
            </select>
          </div>

          {/* Strategic Driver */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Strategic Driver <span className="text-red-500">*</span>
            </label>
            <select
              value={editForm.primary_driver_id}
              onChange={(e) => setEditForm({ ...editForm, primary_driver_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a driver</option>
              {pyramid.strategic_drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </div>

          {/* Target Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Date (Optional)
            </label>
            <Input
              type="date"
              value={editForm.target_date}
              onChange={(e) => setEditForm({ ...editForm, target_date: e.target.value })}
            />
          </div>

          {/* Owner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner (Optional)
            </label>
            <Input
              value={editForm.owner}
              onChange={(e) => setEditForm({ ...editForm, owner: e.target.value })}
              placeholder="Who owns this commitment?"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeEditModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
