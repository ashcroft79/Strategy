'use client';

import React, { useState } from 'react';
import { Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface Connection {
  id: string;
  name: string;
  type: 'upstream' | 'downstream';
}

interface TierCardProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'teal';
  connections?: Connection[];
  onConnectionClick?: (connectionId: string, connectionType: 'upstream' | 'downstream') => void;
}

export default function TierCard({
  children,
  onEdit,
  onDelete,
  variant = 'blue',
  connections = [],
  onConnectionClick,
}: TierCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const variantStyles = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 via-white to-blue-50',
      border: 'border-blue-200',
      hoverBorder: 'hover:border-blue-400',
      shadow: 'shadow-blue-100',
      hoverShadow: 'hover:shadow-blue-200',
      threadColor: '#ef4444', // red for connection threads
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 via-white to-green-50',
      border: 'border-green-200',
      hoverBorder: 'hover:border-green-400',
      shadow: 'shadow-green-100',
      hoverShadow: 'hover:shadow-green-200',
      threadColor: '#ef4444',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 via-white to-purple-50',
      border: 'border-purple-200',
      hoverBorder: 'hover:border-purple-400',
      shadow: 'shadow-purple-100',
      hoverShadow: 'hover:shadow-purple-200',
      threadColor: '#ef4444',
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 via-white to-orange-50',
      border: 'border-orange-200',
      hoverBorder: 'hover:border-orange-400',
      shadow: 'shadow-orange-100',
      hoverShadow: 'hover:shadow-orange-200',
      threadColor: '#ef4444',
    },
    teal: {
      bg: 'bg-gradient-to-br from-teal-50 via-white to-teal-50',
      border: 'border-teal-200',
      hoverBorder: 'hover:border-teal-400',
      shadow: 'shadow-teal-100',
      hoverShadow: 'hover:shadow-teal-200',
      threadColor: '#ef4444',
    },
  };

  const styles = variantStyles[variant];
  const upstreamConnections = connections.filter(c => c.type === 'upstream');
  const downstreamConnections = connections.filter(c => c.type === 'downstream');

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Upstream Connection Breadcrumbs */}
      {upstreamConnections.length > 0 && (
        <div className="mb-2 flex items-center gap-2 text-xs">
          <ArrowUp className="w-3 h-3 text-red-500" />
          <div className="flex flex-wrap gap-1">
            {upstreamConnections.map((conn, idx) => (
              <React.Fragment key={conn.id}>
                {idx > 0 && <span className="text-gray-400">•</span>}
                <button
                  onClick={() => onConnectionClick?.(conn.id, 'upstream')}
                  className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-medium border border-red-200 hover:bg-red-100 hover:shadow-md transition-all cursor-pointer active:scale-95"
                  title={`Click to view: ${conn.name}`}
                >
                  {conn.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Main Card */}
      <div
        className={`
          group relative
          ${styles.bg}
          border-2 ${styles.border} ${styles.hoverBorder}
          rounded-xl
          transition-all duration-300 ease-out
          ${isHovered ? `shadow-xl ${styles.hoverShadow} scale-[1.02]` : `shadow-lg ${styles.shadow}`}
        `}
      >
        {/* Red thread indicator line on left when hovering and has connections */}
        {isHovered && connections.length > 0 && (
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
            style={{
              backgroundColor: styles.threadColor,
              boxShadow: `0 0 8px ${styles.threadColor}`,
            }}
          />
        )}

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {children}
            </div>

            {/* Actions */}
            {(onEdit || onDelete) && (
              <div className={`flex gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="sr-only">Edit</span>
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
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

        {/* Connection count badge at bottom */}
        {connections.length > 0 && (
          <div className="absolute -bottom-2 right-4">
            <div
              className={`
                px-3 py-1 rounded-full text-xs font-bold
                bg-red-500 text-white shadow-lg
                transition-all duration-300
                ${isHovered ? 'scale-110' : 'scale-100'}
              `}
              style={{ boxShadow: isHovered ? `0 4px 12px ${styles.threadColor}60` : 'none' }}
            >
              {connections.length} {connections.length === 1 ? 'thread' : 'threads'}
            </div>
          </div>
        )}
      </div>

      {/* Downstream Connection Breadcrumbs */}
      {downstreamConnections.length > 0 && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          <ArrowDown className="w-3 h-3 text-red-500" />
          <div className="flex flex-wrap gap-1">
            {downstreamConnections.map((conn, idx) => (
              <React.Fragment key={conn.id}>
                {idx > 0 && <span className="text-gray-400">•</span>}
                <button
                  onClick={() => onConnectionClick?.(conn.id, 'downstream')}
                  className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-medium border border-red-200 hover:bg-red-100 hover:shadow-md transition-all cursor-pointer active:scale-95"
                  title={`Click to view: ${conn.name}`}
                >
                  {conn.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
