"use client";

import { useState } from "react";
import { type Stakeholder } from "@/lib/api-client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Edit, Trash2, MoveIcon, Check, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/textarea";

interface StakeholderCardProps {
  stakeholder: Stakeholder;
  onUpdate: (updated: Partial<Stakeholder>) => void;
  onDelete: () => void;
  onMove: (stakeholderId: string, newInterest: "high" | "low", newInfluence: "high" | "low") => void;
}

export function StakeholderCard({ stakeholder, onUpdate, onDelete, onMove }: StakeholderCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMoveOptions, setShowMoveOptions] = useState(false);

  // Form state
  const [name, setName] = useState(stakeholder.name);
  const [alignment, setAlignment] = useState(stakeholder.alignment);
  const [keyNeeds, setKeyNeeds] = useState(stakeholder.key_needs.join("\n"));
  const [concerns, setConcerns] = useState(stakeholder.concerns.join("\n"));
  const [actions, setActions] = useState(stakeholder.required_actions.join("\n"));

  const alignmentConfig = {
    opposed: { label: "Opposed", color: "bg-red-100 text-red-800" },
    neutral: { label: "Neutral", color: "bg-gray-100 text-gray-800" },
    supportive: { label: "Supportive", color: "bg-green-100 text-green-800" },
  };

  const config = alignmentConfig[stakeholder.alignment];

  const handleSave = () => {
    onUpdate({
      name,
      alignment,
      key_needs: keyNeeds.split("\n").filter((n) => n.trim()),
      concerns: concerns.split("\n").filter((c) => c.trim()),
      required_actions: actions.split("\n").filter((a) => a.trim()),
    });
    setShowEditModal(false);
  };

  const handleMove = (newInterest: "high" | "low", newInfluence: "high" | "low") => {
    onMove(stakeholder.id, newInterest, newInfluence);
    setShowMoveOptions(false);
  };

  return (
    <>
      <Card className="p-3 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm text-gray-900">{stakeholder.name}</h4>
              <Badge variant="secondary" className={`text-xs ${config.color}`}>
                {config.label}
              </Badge>
            </div>
            {stakeholder.key_needs.length > 0 && (
              <p className="text-xs text-gray-600">
                <span className="font-medium">Needs:</span> {stakeholder.key_needs[0]}
                {stakeholder.key_needs.length > 1 && ` +${stakeholder.key_needs.length - 1} more`}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => setShowMoveOptions(!showMoveOptions)}>
              <MoveIcon className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowEditModal(true)}>
              <Edit className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Move Options */}
        {showMoveOptions && (
          <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
            <div className="text-xs font-semibold text-gray-700 mb-2">Move to:</div>
            <div className="grid grid-cols-2 gap-2">
              {stakeholder.interest_level !== "low" || stakeholder.influence_level !== "high" ? (
                <button
                  onClick={() => handleMove("low", "high")}
                  className="text-xs p-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                >
                  Keep Satisfied
                </button>
              ) : null}
              {stakeholder.interest_level !== "high" || stakeholder.influence_level !== "high" ? (
                <button
                  onClick={() => handleMove("high", "high")}
                  className="text-xs p-2 bg-green-100 text-green-800 rounded hover:bg-green-200"
                >
                  Key Players
                </button>
              ) : null}
              {stakeholder.interest_level !== "low" || stakeholder.influence_level !== "low" ? (
                <button
                  onClick={() => handleMove("low", "low")}
                  className="text-xs p-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                >
                  Monitor
                </button>
              ) : null}
              {stakeholder.interest_level !== "high" || stakeholder.influence_level !== "low" ? (
                <button
                  onClick={() => handleMove("high", "low")}
                  className="text-xs p-2 bg-orange-100 text-orange-800 rounded hover:bg-orange-200"
                >
                  Keep Informed
                </button>
              ) : null}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowMoveOptions(false)} className="w-full text-xs">
              Cancel
            </Button>
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Stakeholder">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Key Needs</label>
            <Textarea
              value={keyNeeds}
              onChange={(e) => setKeyNeeds(e.target.value)}
              placeholder="One need per line..."
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">What does this stakeholder need from this strategy?</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Concerns</label>
            <Textarea
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              placeholder="One concern per line..."
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">What concerns or objections might they have?</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Required Actions</label>
            <Textarea
              value={actions}
              onChange={(e) => setActions(e.target.value)}
              placeholder="One action per line..."
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">What actions do you need to take to engage this stakeholder?</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!name.trim()}>
              <Check className="w-4 h-4 mr-1" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="ghost" onClick={onDelete} className="ml-auto text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
