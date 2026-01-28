'use client';

import React from 'react';
import { Plus, ChevronLeft, BookOpen } from 'lucide-react';

interface TierHeaderProps {
  tierName: string;
  tierDescription: string;
  itemCount: number;
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'teal';
  onAddNew?: () => void;
  onBack?: () => void;
  onOpenGuide?: () => void;
}

export default function TierHeader({
  tierName,
  tierDescription,
  itemCount,
  variant = 'blue',
  onAddNew,
  onBack,
  onOpenGuide,
}: TierHeaderProps) {
  const variantStyles = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      lightBg: 'bg-green-50',
      border: 'border-green-200',
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
      border: 'border-purple-200',
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      lightBg: 'bg-orange-50',
      border: 'border-orange-200',
    },
    teal: {
      gradient: 'from-teal-500 to-teal-600',
      lightBg: 'bg-teal-50',
      border: 'border-teal-200',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`
        relative overflow-hidden
        bg-gradient-to-r ${styles.gradient}
        rounded-2xl shadow-2xl mb-6
        transform transition-all duration-500 ease-out
      `}
      style={{ animation: 'zoomIn 0.5s ease-out' }}
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
      </div>

      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {/* Back button */}
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium mb-3 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Overview
              </button>
            )}

            {/* Tier name and count */}
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{tierName}</h1>
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                <span className="text-white font-bold text-sm">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/90 text-sm max-w-2xl">{tierDescription}</p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {/* Guide button */}
            {onOpenGuide && (
              <button
                onClick={onOpenGuide}
                className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors"
                title="Open methodology guide"
                data-tour="tier-guide"
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">Guide</span>
              </button>
            )}

            {/* Add button */}
            {onAddNew && (
              <button
                onClick={onAddNew}
                className="flex items-center gap-2 px-4 py-3 bg-white text-gray-900 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>Add New</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <style jsx>{`
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
