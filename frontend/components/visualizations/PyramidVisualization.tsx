'use client';

import React from 'react';
import { StrategyPyramid } from '@/types/pyramid';

interface PyramidVisualizationProps {
  pyramid: StrategyPyramid;
  onTierClick: (tier: string) => void;
  activeTier?: string;
  compact?: boolean;
}

interface TierData {
  id: string;
  label: string;
  shortLabel: string;
  count: number;
  section: 'purpose' | 'strategy' | 'execution';
  description: string;
  width: number;
  maxRecommended?: number;
}

export default function PyramidVisualization({ pyramid, onTierClick, activeTier, compact = false }: PyramidVisualizationProps) {
  const tiers: TierData[] = [
    {
      id: 'vision',
      label: 'Vision & Mission',
      shortLabel: 'Vision',
      count: pyramid.vision?.statements?.length || 0,
      section: 'purpose',
      description: 'Your aspirational future',
      width: 30,
      maxRecommended: 3,
    },
    {
      id: 'values',
      label: 'Values',
      shortLabel: 'Values',
      count: pyramid.values?.length || 0,
      section: 'purpose',
      description: 'Core beliefs',
      width: 40,
      maxRecommended: 5,
    },
    {
      id: 'behaviours',
      label: 'Behaviours',
      shortLabel: 'Behaviours',
      count: pyramid.behaviours?.length || 0,
      section: 'purpose',
      description: 'Values in action',
      width: 50,
      maxRecommended: 7,
    },
    {
      id: 'drivers',
      label: 'Strategic Drivers',
      shortLabel: 'Drivers',
      count: pyramid.strategic_drivers?.length || 0,
      section: 'strategy',
      description: 'Key focus areas',
      width: 60,
      maxRecommended: 5,
    },
    {
      id: 'intents',
      label: 'Strategic Intent',
      shortLabel: 'Intent',
      count: pyramid.strategic_intents?.length || 0,
      section: 'strategy',
      description: 'Where to win',
      width: 70,
    },
    {
      id: 'enablers',
      label: 'Enablers',
      shortLabel: 'Enablers',
      count: pyramid.enablers?.length || 0,
      section: 'strategy',
      description: 'Required capabilities',
      width: 80,
    },
    {
      id: 'commitments',
      label: 'Iconic Commitments',
      shortLabel: 'Commitments',
      count: pyramid.iconic_commitments?.length || 0,
      section: 'execution',
      description: 'Bold moves',
      width: 90,
    },
    {
      id: 'team',
      label: 'Team Objectives',
      shortLabel: 'Team Obj',
      count: pyramid.team_objectives?.length || 0,
      section: 'execution',
      description: 'Team deliverables',
      width: 95,
    },
    {
      id: 'individual',
      label: 'Individual Objectives',
      shortLabel: 'Individual',
      count: pyramid.individual_objectives?.length || 0,
      section: 'execution',
      description: 'Personal goals',
      width: 100,
    },
  ];

  const sectionColors = {
    purpose: {
      bg: 'from-blue-500 to-blue-600',
      bgLight: 'from-blue-400 to-blue-500',
      bgEmpty: 'from-gray-300 to-gray-400',
      glow: 'shadow-blue-500/30',
      glowActive: 'shadow-blue-500/50',
    },
    strategy: {
      bg: 'from-purple-500 to-purple-600',
      bgLight: 'from-purple-400 to-purple-500',
      bgEmpty: 'from-gray-300 to-gray-400',
      glow: 'shadow-purple-500/30',
      glowActive: 'shadow-purple-500/50',
    },
    execution: {
      bg: 'from-orange-500 to-orange-600',
      bgLight: 'from-orange-400 to-orange-500',
      bgEmpty: 'from-gray-300 to-gray-400',
      glow: 'shadow-orange-500/30',
      glowActive: 'shadow-orange-500/50',
    },
  };

  const getCompletionPercentage = (tier: TierData): number => {
    if (tier.count === 0) return 0;
    if (!tier.maxRecommended) return tier.count > 0 ? 80 : 0;
    return Math.min((tier.count / tier.maxRecommended) * 100, 100);
  };

  const getStatusColor = (tier: TierData): string => {
    if (tier.count === 0) return 'bg-gray-400';
    const percentage = getCompletionPercentage(tier);
    if (percentage >= 60) return 'bg-green-400';
    if (percentage >= 30) return 'bg-yellow-400';
    return 'bg-orange-400';
  };

  return (
    <div className={`w-full ${compact ? 'py-4 px-2' : 'py-8 px-4'}`}>
      {/* Section Headers - Only show in non-compact mode */}
      {!compact && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="text-sm font-semibold text-blue-900 uppercase tracking-wide">Purpose</div>
              <div className="text-xs text-blue-600 mt-1">The Why</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div className="text-sm font-semibold text-purple-900 uppercase tracking-wide">Strategy</div>
              <div className="text-xs text-purple-600 mt-1">The How</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border-2 border-orange-200">
              <div className="text-sm font-semibold text-orange-900 uppercase tracking-wide">Execution</div>
              <div className="text-xs text-orange-600 mt-1">The What</div>
            </div>
          </div>
        </div>
      )}

      {/* Pyramid Structure */}
      <div className={`${compact ? 'max-w-md' : 'max-w-5xl'} mx-auto relative`}>
        {/* Connection lines background */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-10">
          {tiers.map((tier, index) => {
            if (index === tiers.length - 1) return null;
            return (
              <div
                key={`line-${tier.id}`}
                className="w-0.5 bg-gradient-to-b from-gray-400 to-gray-500"
                style={{ height: compact ? '20px' : '40px', marginTop: index === 0 ? '0' : compact ? '4px' : '8px' }}
              />
            );
          })}
        </div>

        {/* Tiers */}
        <div className={`${compact ? 'space-y-1' : 'space-y-2'} relative z-10`}>
          {tiers.map((tier, index) => {
            const colors = sectionColors[tier.section];
            const isActive = activeTier === tier.id;
            const isEmpty = tier.count === 0;
            const completion = getCompletionPercentage(tier);
            const statusColor = getStatusColor(tier);

            return (
              <div
                key={tier.id}
                className="flex justify-center transition-all duration-300 ease-out"
                style={{
                  animation: `slideIn 0.5s ease-out ${index * 0.08}s backwards`,
                }}
              >
                <button
                  onClick={() => onTierClick(tier.id)}
                  className={`
                    group relative overflow-hidden
                    ${isActive ? 'ring-4 ring-white ring-offset-2' : ''}
                    text-white rounded-lg
                    transition-all duration-300 ease-out
                    ${isActive
                      ? `shadow-2xl scale-105 ${colors.glowActive}`
                      : `shadow-md hover:shadow-xl hover:scale-[1.02] ${colors.glow}`
                    }
                    cursor-pointer border-2 border-white/20
                  `}
                  style={{
                    width: `${tier.width}%`,
                    minHeight: compact ? '50px' : '70px',
                  }}
                >
                  {/* Background with completion fill effect */}
                  <div className="absolute inset-0">
                    {/* Empty state background */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${colors.bgEmpty}`} />

                    {/* Filled portion */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${isEmpty ? colors.bgEmpty : colors.bg} transition-all duration-700 ease-out`}
                      style={{
                        width: `${isEmpty ? 100 : completion}%`,
                      }}
                    />

                    {/* Shimmer effect for active/hover */}
                    <div className={`
                      absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                      ${isActive ? 'animate-shimmer' : 'opacity-0 group-hover:opacity-100'}
                      transition-opacity duration-300
                    `} style={{
                      backgroundSize: '200% 100%',
                    }} />
                  </div>

                  {/* Tier Content */}
                  <div className={`relative z-10 flex items-center justify-between ${compact ? 'p-3' : 'p-4'}`}>
                    {/* Left: Tier info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className={`${compact ? 'text-sm' : 'text-lg'} font-bold tracking-wide`}>
                          {compact ? tier.shortLabel : tier.label}
                        </span>

                        {/* Count Badge */}
                        <span className={`
                          px-2 py-0.5 rounded-full ${compact ? 'text-xs' : 'text-sm'} font-bold
                          bg-white/30 backdrop-blur-sm
                          ${isActive ? 'bg-white/40 scale-110' : 'group-hover:bg-white/40'}
                          transition-all duration-300
                        `}>
                          {tier.count}
                          {tier.maxRecommended && `/${tier.maxRecommended}`}
                        </span>

                        {/* Status Indicator */}
                        <span className={`
                          w-2 h-2 rounded-full ${statusColor}
                          ${isActive ? 'animate-pulse' : ''}
                          transition-colors duration-300
                        `} />
                      </div>

                      {!compact && (
                        <div className={`
                          text-xs mt-1 text-white/80
                          ${isActive ? 'text-white/90' : 'group-hover:text-white/90'}
                          transition-colors duration-300
                        `}>
                          {tier.description}
                        </div>
                      )}
                    </div>

                    {/* Right: Arrow indicator */}
                    <div className={`
                      ml-2 transition-transform duration-300
                      ${isActive ? 'translate-x-0' : 'translate-x-0 group-hover:translate-x-1'}
                    `}>
                      <svg
                        className={compact ? 'w-4 h-4' : 'w-5 h-5'}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white rounded-l-lg shadow-lg" />
                  )}

                  {/* Completion percentage indicator */}
                  {!isEmpty && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
                      <div
                        className="h-full bg-white/40 transition-all duration-700 ease-out"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend - Only show in non-compact mode */}
      {!compact && (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-center gap-6 text-xs flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-gray-600">Empty</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-gray-600">Started</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-gray-600">Building</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-gray-600">Complete</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
