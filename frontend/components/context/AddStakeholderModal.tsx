"use client";

import { useState } from "react";
import { type Stakeholder } from "@/lib/api-client";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";

interface AddStakeholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (stakeholder: Partial<Stakeholder>) => void;
}

export function AddStakeholderModal({ isOpen, onClose, onAdd }: AddStakeholderModalProps) {
  const [name, setName] = useState("");
  const [interestLevel, setInterestLevel] = useState<"high" | "low">("high");
  const [influenceLevel, setInfluenceLevel] = useState<"high" | "low">("high");
  const [alignment, setAlignment] = useState<"opposed" | "neutral" | "supportive">("neutral");
  const [keyNeeds, setKeyNeeds] = useState("");
  const [concerns, setConcerns] = useState("");
  const [actions, setActions] = useState("");

  const handleAdd = () => {
    onAdd({
      name,
      interest_level: interestLevel,
      influence_level: influenceLevel,
      alignment,
      key_needs: keyNeeds.split("\n").filter((n) => n.trim()),
      concerns: concerns.split("\n").filter((c) => c.trim()),
      required_actions: actions.split("\n").filter((a) => a.trim()),
    });
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setInterestLevel("high");
    setInfluenceLevel("high");
    setAlignment("neutral");
    setKeyNeeds("");
    setConcerns("");
    setActions("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getQuadrantName = () => {
    if (interestLevel === "high" && influenceLevel === "high") return "Key Players";
    if (interestLevel === "low" && influenceLevel === "high") return "Keep Satisfied";
    if (interestLevel === "high" && influenceLevel === "low") return "Keep Informed";
    return "Monitor";
  };

  const alignmentConfig = {
    opposed: { label: "Opposed", color: "bg-red-100 text-red-800" },
    neutral: { label: "Neutral", color: "bg-gray-100 text-gray-800" },
    supportive: { label: "Supportive", color: "bg-green-100 text-green-800" },
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Stakeholder">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., CEO, Engineering Team, Board of Directors"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Interest Level</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setInterestLevel("low")}
              className={`p-3 rounded text-sm font-medium ${
                interestLevel === "low"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Low Interest
            </button>
            <button
              onClick={() => setInterestLevel("high")}
              className={`p-3 rounded text-sm font-medium ${
                interestLevel === "high"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              High Interest
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Influence Level</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setInfluenceLevel("low")}
              className={`p-3 rounded text-sm font-medium ${
                influenceLevel === "low"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Low Influence
            </button>
            <button
              onClick={() => setInfluenceLevel("high")}
              className={`p-3 rounded text-sm font-medium ${
                influenceLevel === "high"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              High Influence
            </button>
          </div>
        </div>

        {/* Quadrant Preview */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs text-blue-700 mb-1">Will be placed in:</div>
          <div className="text-sm font-semibold text-blue-900">{getQuadrantName()}</div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Alignment</label>
          <div className="grid grid-cols-3 gap-2">
            {(["opposed", "neutral", "supportive"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setAlignment(level)}
                className={`p-2 rounded text-sm font-medium ${
                  alignment === level
                    ? alignmentConfig[level].color
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {alignmentConfig[level].label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">How supportive are they of this strategy?</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Key Needs (Optional)</label>
          <Textarea
            value={keyNeeds}
            onChange={(e) => setKeyNeeds(e.target.value)}
            placeholder="One need per line...&#10;e.g., Clear ROI justification&#10;Regular progress updates"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">What does this stakeholder need from this strategy?</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Concerns (Optional)</label>
          <Textarea
            value={concerns}
            onChange={(e) => setConcerns(e.target.value)}
            placeholder="One concern per line...&#10;e.g., Resource constraints&#10;Timeline feasibility"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">What concerns or objections might they have?</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Required Actions (Optional)</label>
          <Textarea
            value={actions}
            onChange={(e) => setActions(e.target.value)}
            placeholder="One action per line...&#10;e.g., Schedule monthly check-ins&#10;Provide detailed business case"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">What actions do you need to take to engage this stakeholder?</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleAdd} disabled={!name.trim()}>
            <Check className="w-4 h-4 mr-1" />
            Add Stakeholder
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
