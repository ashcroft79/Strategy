'use client';

import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  refCode: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: string;
}

export default function Tooltip({
  content,
  refCode,
  position = 'top',
  maxWidth = '320px'
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800',
  };

  return (
    <div className="relative inline-block">
      {/* Icon trigger */}
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-full"
        aria-label="More information"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {/* Tooltip content */}
      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
          style={{ maxWidth }}
          role="tooltip"
        >
          <div className="bg-gray-800 text-white text-sm rounded-lg shadow-2xl p-3 border border-gray-700">
            <div className="leading-relaxed">{content}</div>
            <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400 font-mono">
              {refCode}
            </div>
          </div>
          {/* Arrow */}
          <div
            className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  );
}
