'use client';

import React, { useState } from 'react';
import { Edit, Trash2, Link as LinkIcon } from 'lucide-react';

interface EnhancedCardProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'teal';
  showConnections?: boolean;
  connectionCount?: number;
  onShowConnections?: () => void;
}

export default function EnhancedCard({
  children,
  onEdit,
  onDelete,
  isEditing = false,
  variant = 'blue',
  showConnections = false,
  connectionCount = 0,
  onShowConnections,
}: EnhancedCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const variantStyles = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
      border: 'border-blue-200',
      hoverBorder: 'hover:border-blue-300',
      shadow: 'shadow-blue-100',
      hoverShadow: 'hover:shadow-blue-200',
      accent: 'bg-blue-500',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100/50',
      border: 'border-green-200',
      hoverBorder: 'hover:border-green-300',
      shadow: 'shadow-green-100',
      hoverShadow: 'hover:shadow-green-200',
      accent: 'bg-green-500',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50',
      border: 'border-purple-200',
      hoverBorder: 'hover:border-purple-300',
      shadow: 'shadow-purple-100',
      hoverShadow: 'hover:shadow-purple-200',
      accent: 'bg-purple-500',
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100/50',
      border: 'border-orange-200',
      hoverBorder: 'hover:border-orange-300',
      shadow: 'shadow-orange-100',
      hoverShadow: 'hover:shadow-orange-200',
      accent: 'bg-orange-500',
    },
    teal: {
      bg: 'bg-gradient-to-br from-teal-50 to-teal-100/50',
      border: 'border-teal-200',
      hoverBorder: 'hover:border-teal-300',
      shadow: 'shadow-teal-100',
      hoverShadow: 'hover:shadow-teal-200',
      accent: 'bg-teal-500',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`
        group relative
        ${styles.bg}
        border-2 ${styles.border} ${styles.hoverBorder}
        rounded-xl
        transition-all duration-300 ease-out
        ${isHovered && !isEditing ? `shadow-lg ${styles.hoverShadow} scale-[1.01]` : `shadow-md ${styles.shadow}`}
        ${isEditing ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Accent Bar */}
      {!isEditing && (
        <div className={`absolute top-0 left-0 right-0 h-1 ${styles.accent} rounded-t-xl transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      )}

      {/* Main Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>

          {/* Actions */}
          {(onEdit || onDelete || showConnections) && !isEditing && (
            <div className={`flex gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              {showConnections && connectionCount > 0 && (
                <button
                  onClick={onShowConnections}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white/80 rounded-lg transition-all duration-200 hover:scale-110"
                  title={`View ${connectionCount} connection${connectionCount > 1 ? 's' : ''}`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span className="sr-only">View connections</span>
                </button>
              )}

              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white/80 rounded-lg transition-all duration-200 hover:scale-110"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                  <span className="sr-only">Edit</span>
                </button>
              )}

              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-white/80 rounded-lg transition-all duration-200 hover:scale-110"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">Delete</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Connection Indicator */}
      {showConnections && connectionCount > 0 && !isEditing && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className={`
            px-3 py-1 rounded-full text-xs font-semibold
            ${styles.accent} text-white shadow-lg
            transition-all duration-300
            ${isHovered ? 'scale-110' : 'scale-100'}
          `}>
            {connectionCount} {connectionCount === 1 ? 'link' : 'links'}
          </div>
        </div>
      )}

      {/* Hover Glow Effect */}
      {isHovered && !isEditing && (
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none`} />
      )}
    </div>
  );
}
