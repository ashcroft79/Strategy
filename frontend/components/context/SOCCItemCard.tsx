"use client";

import { useState } from "react";
import { type SOCCItem } from "@/lib/api-client";
import { AddItemModal } from "./AddItemModal";
import { Edit2, Trash2 } from "lucide-react";

interface SOCCItemCardProps {
  item: SOCCItem;
  color: "green" | "blue" | "orange" | "red";
  onUpdate: (item: Partial<SOCCItem>) => void;
  onDelete: () => void;
}

const impactColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
};

const colorStyles = {
  green: "border-green-200 hover:border-green-300 bg-white",
  blue: "border-blue-200 hover:border-blue-300 bg-white",
  orange: "border-orange-200 hover:border-orange-300 bg-white",
  red: "border-red-200 hover:border-red-300 bg-white",
};

export function SOCCItemCard({ item, color, onUpdate, onDelete }: SOCCItemCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
      return;
    }
    onDelete();
  };

  return (
    <>
      <div
        className={`border-2 rounded-lg p-4 ${colorStyles[color]} transition-all hover:shadow-md`}
      >
        {/* Header with Title and Actions */}
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-gray-900 flex-1 pr-2">{item.title}</h4>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Edit item"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className={`p-1.5 rounded transition-colors ${
                showDeleteConfirm
                  ? "text-red-600 bg-red-50"
                  : "text-gray-500 hover:text-red-600 hover:bg-red-50"
              }`}
              title={showDeleteConfirm ? "Click again to confirm" : "Delete item"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
        )}

        {/* Impact Level and Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
              impactColors[item.impact_level]
            }`}
          >
            {item.impact_level.toUpperCase()} Impact
          </span>

          {item.tags && item.tags.length > 0 && (
            <>
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                >
                  {tag}
                </span>
              ))}
            </>
          )}
        </div>

        {/* Delete Confirmation Message */}
        {showDeleteConfirm && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            Click delete again to confirm
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AddItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(updatedItem) => {
          onUpdate(updatedItem);
          setIsEditModalOpen(false);
        }}
        quadrantType={item.quadrant}
        quadrantTitle={item.quadrant}
        color={color}
        existingItem={item}
      />
    </>
  );
}
