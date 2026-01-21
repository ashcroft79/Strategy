'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface TooltipContent {
  id: string; // Reference code (e.g., TT-001)
  title?: string; // Optional title for the tooltip
  content: string; // Main guidance text
  example?: string; // Optional example to show
  dos?: string[]; // Optional list of dos
  donts?: string[]; // Optional list of don'ts
}

interface TooltipProps {
  tooltipContent: TooltipContent;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  tooltipContent,
  placement = 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        buttonRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowExample(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleTooltip = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setShowExample(false);
    }
  };

  const getPopoverPosition = () => {
    switch (placement) {
      case 'top':
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
      case 'bottom':
        return 'top-full mt-2 left-1/2 -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 -translate-y-1/2';
      case 'right':
      default:
        return 'left-full ml-2 top-1/2 -translate-y-1/2';
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleTooltip}
        className="inline-flex items-center justify-center w-4 h-4 text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-full border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 ml-1.5"
        aria-label="Show guidance"
      >
        ?
      </button>

      {isOpen && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 ${getPopoverPosition()} w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4`}
        >
          {/* Title */}
          {tooltipContent.title && (
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {tooltipContent.title}
            </h4>
          )}

          {/* Main content */}
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            {tooltipContent.content}
          </p>

          {/* Dos and Don'ts */}
          {(tooltipContent.dos || tooltipContent.donts) && (
            <div className="mb-3 space-y-2">
              {tooltipContent.dos && tooltipContent.dos.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                    ✓ Best Practices:
                  </p>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5 pl-4">
                    {tooltipContent.dos.map((item, idx) => (
                      <li key={idx} className="list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tooltipContent.donts && tooltipContent.donts.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">
                    ✗ Avoid:
                  </p>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5 pl-4">
                    {tooltipContent.donts.map((item, idx) => (
                      <li key={idx} className="list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Example toggle */}
          {tooltipContent.example && (
            <div className="mb-3">
              <button
                type="button"
                onClick={() => setShowExample(!showExample)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1"
              >
                {showExample ? '▼' : '▶'} {showExample ? 'Hide' : 'Show'} Example
              </button>
              {showExample && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  {tooltipContent.example}
                </div>
              )}
            </div>
          )}

          {/* Reference code footer */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-[10px] text-gray-400 dark:text-gray-600 font-mono">
              Ref: {tooltipContent.id}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Label wrapper component that includes the tooltip inline with the label
interface LabelWithTooltipProps {
  label: string;
  tooltipContent: TooltipContent;
  required?: boolean;
  htmlFor?: string;
}

export const LabelWithTooltip: React.FC<LabelWithTooltipProps> = ({
  label,
  tooltipContent,
  required = false,
  htmlFor,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      <span className="inline-flex items-center">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        <Tooltip tooltipContent={tooltipContent} placement="right" />
      </span>
    </label>
  );
};
