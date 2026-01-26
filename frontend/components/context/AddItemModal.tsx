"use client";

import { useState, useEffect } from "react";
import { type SOCCItem, type QuadrantType, type ImpactLevel } from "@/lib/api-client";
import { X, Plus, Trash2 } from "lucide-react";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Partial<SOCCItem>) => void;
  quadrantType: QuadrantType;
  quadrantTitle: string;
  color: "green" | "blue" | "orange" | "red";
  existingItem?: SOCCItem;
}

const colorStyles = {
  green: {
    bg: "bg-green-600 hover:bg-green-700",
    text: "text-green-700",
    border: "border-green-300",
  },
  blue: {
    bg: "bg-blue-600 hover:bg-blue-700",
    text: "text-blue-700",
    border: "border-blue-300",
  },
  orange: {
    bg: "bg-orange-600 hover:bg-orange-700",
    text: "text-orange-700",
    border: "border-orange-300",
  },
  red: {
    bg: "bg-red-600 hover:bg-red-700",
    text: "text-red-700",
    border: "border-red-300",
  },
};

export function AddItemModal({
  isOpen,
  onClose,
  onSubmit,
  quadrantType,
  quadrantTitle,
  color,
  existingItem,
}: AddItemModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [impactLevel, setImpactLevel] = useState<ImpactLevel>("medium");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");

  const styles = colorStyles[color];
  const isEditing = !!existingItem;

  // Populate form when editing
  useEffect(() => {
    if (existingItem) {
      setTitle(existingItem.title);
      setDescription(existingItem.description || "");
      setImpactLevel(existingItem.impact_level);
      setTags(existingItem.tags || []);
    } else {
      // Reset form when adding new
      setTitle("");
      setDescription("");
      setImpactLevel("medium");
      setTags([]);
    }
    setError("");
  }, [existingItem, isOpen]);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }
    if (title.trim().length > 200) {
      setError("Title must be less than 200 characters");
      return;
    }

    // Submit
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      impact_level: impactLevel,
      tags: tags,
      quadrant: quadrantType,
      created_by: "user", // In a real app, get from auth
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit" : "Add"} {quadrantTitle.slice(0, -1)}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief, descriptive title"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={200}
            />
            <p className="mt-1 text-xs text-gray-500">{title.length}/200 characters</p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details, context, or rationale"
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={1000}
            />
            <p className="mt-1 text-xs text-gray-500">{description.length}/1000 characters</p>
          </div>

          {/* Impact Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Impact Level <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["low", "medium", "high"] as ImpactLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setImpactLevel(level)}
                  className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                    impactLevel === level
                      ? `${styles.border} ${styles.text} bg-opacity-10`
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags (optional)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag"
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={30}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-300"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-6 py-3 ${styles.bg} text-white rounded-lg font-semibold transition-colors`}
            >
              {isEditing ? "Update" : "Add"} Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
