"use client";

import { useState } from "react";
import { type SOCCItem, type QuadrantType } from "@/lib/api-client";
import { SOCCItemCard } from "./SOCCItemCard";
import { AddItemModal } from "./AddItemModal";
import { Plus } from "lucide-react";

interface QuadrantPanelProps {
  type: QuadrantType;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: "green" | "blue" | "orange" | "red";
  items: SOCCItem[];
  onAddItem: (item: Partial<SOCCItem>) => void;
  onUpdateItem: (id: string, item: Partial<SOCCItem>) => void;
  onDeleteItem: (id: string) => void;
}

const colorStyles = {
  green: {
    border: "border-green-200",
    bg: "bg-green-50",
    headerBg: "bg-green-100",
    text: "text-green-800",
    iconBg: "bg-green-200",
    buttonBg: "bg-green-600 hover:bg-green-700",
    buttonText: "text-white",
  },
  blue: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    headerBg: "bg-blue-100",
    text: "text-blue-800",
    iconBg: "bg-blue-200",
    buttonBg: "bg-blue-600 hover:bg-blue-700",
    buttonText: "text-white",
  },
  orange: {
    border: "border-orange-200",
    bg: "bg-orange-50",
    headerBg: "bg-orange-100",
    text: "text-orange-800",
    iconBg: "bg-orange-200",
    buttonBg: "bg-orange-600 hover:bg-orange-700",
    buttonText: "text-white",
  },
  red: {
    border: "border-red-200",
    bg: "bg-red-50",
    headerBg: "bg-red-100",
    text: "text-red-800",
    iconBg: "bg-red-200",
    buttonBg: "bg-red-600 hover:bg-red-700",
    buttonText: "text-white",
  },
};

export function QuadrantPanel({
  type,
  title,
  subtitle,
  description,
  icon,
  color,
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: QuadrantPanelProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const styles = colorStyles[color];

  return (
    <div className={`rounded-xl border-2 ${styles.border} ${styles.bg} overflow-hidden`}>
      {/* Header */}
      <div className={`${styles.headerBg} p-4 border-b-2 ${styles.border}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={`${styles.iconBg} p-2 rounded-lg ${styles.text}`}>
              {icon}
            </div>
            <div>
              <h3 className={`text-lg font-bold ${styles.text}`}>{title}</h3>
              <p className={`text-sm ${styles.text} opacity-75`}>{subtitle}</p>
            </div>
          </div>
          <div className={`${styles.text} font-bold text-2xl`}>{items.length}</div>
        </div>
        <p className={`text-sm ${styles.text} opacity-90`}>{description}</p>
      </div>

      {/* Items List */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No items yet</p>
            <p className="text-sm text-gray-400">Click "Add Item" to get started</p>
          </div>
        ) : (
          items.map((item) => (
            <SOCCItemCard
              key={item.id}
              item={item}
              color={color}
              onUpdate={(updatedItem) => onUpdateItem(item.id, updatedItem)}
              onDelete={() => onDeleteItem(item.id)}
            />
          ))
        )}
      </div>

      {/* Add Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg ${styles.buttonBg} ${styles.buttonText} font-semibold transition-colors`}
        >
          <Plus className="w-5 h-5" />
          Add {title.slice(0, -1)} {/* Remove 's' from plural */}
        </button>
      </div>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(item) => {
          onAddItem(item);
          setIsAddModalOpen(false);
        }}
        quadrantType={type}
        quadrantTitle={title}
        color={color}
      />
    </div>
  );
}
