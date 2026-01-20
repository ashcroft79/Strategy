'use client';

import React from 'react';
import { StrategyPyramid } from '@/types/pyramid';

interface PyramidVisualizationProps {
  pyramid: StrategyPyramid;
  onTierClick: (tier: string) => void;
  activeTier?: string;
}

interface TierData {
  id: string;
  label: string;
  count: number;
  section: 'purpose' | 'strategy' | 'execution';
  description: string;
  width: number; // Percentage of pyramid width
}

export default function PyramidVisualization({ pyramid, onTierClick, activeTier }: PyramidVisualizationProps) {
  // Calculate tier data with counts
  const tiers: TierData[] = [
    {
      id: 'vision',
      label: 'Vision & Mission',
      count: pyramid.vision?.statements?.length || 0,
      section: 'purpose',
      description: 'The Why - Your aspirational future',
      width: 30,
    },
    {
      id: 'values',
      label: 'Values',
      count: pyramid.values?.length || 0,
      section: 'purpose',
      description: 'Core beliefs that guide behavior',
      width: 40,
    },
    {
      id: 'behaviours',
      label: 'Behaviours',
      count: pyramid.behaviours?.length || 0,
      section: 'purpose',
      description: 'How values show up in action',
      width: 50,
    },
    {
      id: 'drivers',
      label: 'Strategic Drivers',
      count: pyramid.strategic_drivers?.length || 0,
      section: 'strategy',
      description: 'Key forces shaping your strategy',
      width: 60,
    },
    {
      id: 'intents',
      label: 'Strategic Intent',
      count: pyramid.strategic_intents?.length || 0,
      section: 'strategy',
      description: 'Where to play and how to win',
      width: 70,
    },
    {
      id: 'enablers',
      label: 'Enablers',
      count: pyramid.enablers?.length || 0,
      section: 'strategy',
      description: 'Capabilities needed to execute',
      width: 80,
    },
    {
      id: 'commitments',
      label: 'Iconic Commitments',
      count: pyramid.iconic_commitments?.length || 0,
      section: 'execution',
      description: 'Bold moves across time horizons',
      width: 90,
    },
    {
      id: 'team',
      label: 'Team Objectives',
      count: pyramid.team_objectives?.length || 0,
      section: 'execution',
      description: 'What teams need to deliver',
      width: 95,
    },
    {
      id: 'individual',
      label: 'Individual Objectives',
      count: pyramid.individual_objectives?.length || 0,
      section: 'execution',
      description: 'Personal contributions',
      width: 100,
    },
  ];

  // Color schemes by section
  const sectionColors = {
    purpose: {
      bg: 'from-blue-500 to-blue-600',
      bgHover: 'from-blue-600 to-blue-700',
      bgActive: 'from-blue-700 to-blue-800',
      text: 'text-blue-700',
      border: 'border-blue-300',
      glow: 'shadow-blue-500/50',
    },
    strategy: {
      bg: 'from-purple-500 to-purple-600',
      bgHover: 'from-purple-600 to-purple-700',
      bgActive: 'from-purple-700 to-purple-800',
      text: 'text-purple-700',
      border: 'border-purple-300',
      glow: 'shadow-purple-500/50',
    },
    execution: {
      bg: 'from-orange-500 to-orange-600',
      bgHover: 'from-orange-600 to-orange-700',
      bgActive: 'from-orange-700 to-orange-800',
      text: 'text-orange-700',
      border: 'border-orange-300',
      glow: 'shadow-orange-500/50',
    },
  };

  const getCompletionStatus = (count: number): { label: string; color: string } => {
    if (count === 0) return { label: 'Empty', color: 'bg-gray-400' };
    if (count < 3) return { label: 'Started', color: 'bg-yellow-400' };
    return { label: 'Active', color: 'bg-green-400' };
  };

  return (
    <div className="w-full py-8 px-4">
      {/* Section Headers */}
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

      {/* Pyramid Structure */}
      <div className="max-w-5xl mx-auto relative">
        {/* Connection lines background */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
          {tiers.map((tier, index) => {
            if (index === tiers.length - 1) return null;
            return (
              <div
                key={`line-${tier.id}`}
                className="w-0.5 bg-gradient-to-b from-gray-300 to-gray-400"
                style={{ height: '40px', marginTop: index === 0 ? '0' : '8px' }}
              />
            );
          })}
        </div>

        {/* Tiers */}
        <div className="space-y-2 relative z-10">
          {tiers.map((tier, index) => {
            const colors = sectionColors[tier.section];
            const isActive = activeTier === tier.id;
            const status = getCompletionStatus(tier.count);

            return (
              <div
                key={tier.id}
                className="flex justify-center transition-all duration-300 ease-out"
                style={{
                  animation: `slideIn 0.5s ease-out ${index * 0.1}s backwards`,
                }}
              >
                <button
                  onClick={() => onTierClick(tier.id)}
                  className={`
                    group relative
                    bg-gradient-to-r ${isActive ? colors.bgActive : colors.bg}
                    hover:${colors.bgHover}
                    text-white rounded-lg
                    transition-all duration-300 ease-out
                    ${isActive ? 'shadow-2xl scale-105 ' + colors.glow : 'shadow-lg hover:shadow-xl hover:scale-102'}
                    cursor-pointer border-2 border-white/20
                  `}
                  style={{
                    width: `${tier.width}%`,
                    minHeight: '70px',
                  }}
                >
                  {/* Tier Content */}
                  <div className="flex items-center justify-between p-4">
                    {/* Left: Tier info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold tracking-wide">
                          {tier.label}
                        </span>
                        {/* Count Badge */}
                        <span className={`
                          px-2.5 py-1 rounded-full text-xs font-bold
                          bg-white/30 backdrop-blur-sm
                          ${isActive ? 'bg-white/40' : 'group-hover:bg-white/40'}
                          transition-colors duration-300
                        `}>
                          {tier.count}
                        </span>
                        {/* Status Indicator */}
                        <span className={`
                          w-2 h-2 rounded-full ${status.color}
                          ${isActive ? 'animate-pulse' : ''}
                        `} />
                      </div>
                      <div className={`
                        text-xs mt-1 text-white/80
                        ${isActive ? 'text-white/90' : 'group-hover:text-white/90'}
                        transition-colors duration-300
                      `}>
                        {tier.description}
                      </div>
                    </div>

                    {/* Right: Arrow indicator */}
                    <div className={`
                      ml-4 transition-transform duration-300
                      ${isActive ? 'translate-x-0' : 'translate-x-0 group-hover:translate-x-1'}
                    `}>
                      <svg
                        className="w-5 h-5"
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
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-l-lg" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-gray-600">Empty</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-gray-600">Started (1-2 items)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-gray-600">Active (3+ items)</span>
          </div>
        </div>
      </div>

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
      `}</style>
    </div>
  );
}
