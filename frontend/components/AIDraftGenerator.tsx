"use client";

import { useState } from "react";
import { aiApi } from "@/lib/api-client";
import { Button } from "./ui/Button";
import Modal from "./ui/Modal";
import { Sparkles, Loader } from "lucide-react";

interface AIDraftGeneratorProps {
  sessionId: string;
  tier: string;
  tierLabel: string;
  context?: any;
  onAccept: (draft: any) => void;
  buttonClassName?: string;
  buttonSize?: "sm" | "md" | "lg";
}

export function AIDraftGenerator({
  sessionId,
  tier,
  tierLabel,
  context,
  onAccept,
  buttonClassName,
  buttonSize = "md",
}: AIDraftGeneratorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [userGuidance, setUserGuidance] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setDraft(null);

    try {
      // Add user guidance to context
      const enrichedContext = {
        ...context,
        user_guidance: userGuidance.trim() || undefined,
      };

      const result = await aiApi.generateDraft(sessionId, tier, enrichedContext);

      if (result.error) {
        setError(result.error);
      } else {
        setDraft(result);
      }
    } catch (err: any) {
      console.error("Draft generation error:", err);
      setError(
        err?.response?.data?.detail ||
          "Failed to generate draft. Check API configuration."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setUserGuidance("");
    setDraft(null);
    setError(null);
  };

  const handleAccept = () => {
    if (draft) {
      onAccept(draft);
      setIsModalOpen(false);
      setDraft(null);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setDraft(null);
    setError(null);
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        size={buttonSize}
        className={buttonClassName}
        variant="secondary"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Generate Draft
      </Button>

      <Modal isOpen={isModalOpen} onClose={handleClose} title={`AI Draft: ${tierLabel}`}>
        {!isGenerating && !draft && !error && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-medium text-blue-800">
                  Guide the AI (Optional)
                </p>
              </div>
              <p className="text-xs text-blue-600 mb-3">
                Tell the AI what you want to focus on. Be specific!
              </p>
              <textarea
                value={userGuidance}
                onChange={(e) => setUserGuidance(e.target.value)}
                placeholder={`e.g., "Focus on operations and quality management" or "Customer retention and loyalty program" or leave blank for AI to decide`}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleGenerate} className="flex-1">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">AI is generating your draft...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
            <Button variant="secondary" onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        )}

        {draft && !error && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-medium text-blue-800">
                  AI-Generated Draft
                </p>
              </div>
              <p className="text-xs text-blue-600">
                Review and edit as needed, then click "Use This Draft" to apply it
              </p>
            </div>

            <div className="space-y-3">
              {draft.name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-800">{draft.name}</p>
                  </div>
                </div>
              )}

              {draft.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                      {draft.description}
                    </p>
                  </div>
                </div>
              )}

              {draft.rationale && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rationale
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-800">{draft.rationale}</p>
                  </div>
                </div>
              )}

              {draft.additional_fields &&
                Object.keys(draft.additional_fields).length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Fields
                    </label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <pre className="text-xs text-gray-800">
                        {JSON.stringify(draft.additional_fields, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setDraft(null);
                  setError(null);
                }}
                className="flex-1"
              >
                ↻ Try Again
              </Button>
              <Button onClick={handleAccept} className="flex-1">
                <Sparkles className="w-4 h-4 mr-2" />
                Use This Draft
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
