'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right';
  fallbackPosition?: { top: number; left: number }; // If element not found
}

interface QuickTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Strategic Pyramid Builder',
    description: 'This quick tour will show you the key features. You can exit anytime by clicking the X or pressing Escape.',
    target: '[data-tour="welcome"]',
    position: 'bottom',
    fallbackPosition: { top: 200, left: 400 },
  },
  {
    id: 'step-navigation',
    title: 'Step Navigation',
    description: 'Navigate between the three phases: Context (understand your reality), Builder (create your pyramid), and Validate (check your work). Start with Context to ground your strategy.',
    target: '[data-tour="step-navigation"]',
    position: 'right',
    fallbackPosition: { top: 150, left: 250 },
  },
  {
    id: 'builder-tiers',
    title: 'The 9-Tier Pyramid',
    description: 'Build your strategy tier by tier - from Vision at the top to Individual Objectives at the bottom. Each tier connects to create a coherent "red thread" from purpose to action.',
    target: '[data-tour="builder-tiers"]',
    position: 'left',
    fallbackPosition: { top: 300, left: 500 },
  },
  {
    id: 'tier-guides',
    title: 'Tier Guides',
    description: 'Click the "Guide" button on any tier to see methodology guidance, examples of good vs. bad entries, common pitfalls, and tips for that specific tier.',
    target: '[data-tour="tier-guide"]',
    position: 'bottom',
    fallbackPosition: { top: 200, left: 600 },
  },
  {
    id: 'tooltips',
    title: 'Contextual Help',
    description: 'Look for (?) icons throughout the app. Click them to see explanations, examples, and guidance for any field or concept.',
    target: '[data-tour="tooltip"]',
    position: 'bottom',
    fallbackPosition: { top: 250, left: 400 },
  },
  {
    id: 'ai-coach',
    title: 'AI Coach',
    description: 'Click the sparkle button to open the AI Coach. Ask questions, get suggestions, use "What\'s next?" for guidance, or "Review" for feedback on your pyramid.',
    target: '[data-tour="ai-coach"]',
    position: 'left',
    fallbackPosition: { top: 500, left: 700 },
  },
  {
    id: 'help-hub',
    title: 'Help Hub',
    description: 'Access the Help button anytime for the Learning Center (full methodology), Example Gallery (learn from complete pyramids), or this tour again.',
    target: '[data-tour="help-hub"]',
    position: 'bottom',
    fallbackPosition: { top: 100, left: 800 },
  },
  {
    id: 'complete',
    title: 'You\'re Ready!',
    description: 'Start by exploring the Context tab to understand your strategic reality, then build your pyramid tier by tier. The AI Coach is always here to help. Good luck!',
    target: '[data-tour="complete"]',
    position: 'bottom',
    fallbackPosition: { top: 300, left: 400 },
  },
];

export default function QuickTour({ isOpen, onClose }: QuickTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  const step = TOUR_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  const updatePosition = useCallback(() => {
    if (!step) return;

    const targetElement = document.querySelector(step.target);

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      setSpotlightRect(rect);

      // Calculate tooltip position based on step.position
      let top = 0;
      let left = 0;
      const tooltipWidth = 320;
      const tooltipHeight = 180;
      const padding = 16;

      switch (step.position) {
        case 'top':
          top = rect.top - tooltipHeight - padding;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'bottom':
          top = rect.bottom + padding;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'left':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.left - tooltipWidth - padding;
          break;
        case 'right':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.right + padding;
          break;
      }

      // Keep tooltip within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (left < padding) left = padding;
      if (left + tooltipWidth > viewportWidth - padding) left = viewportWidth - tooltipWidth - padding;
      if (top < padding) top = padding;
      if (top + tooltipHeight > viewportHeight - padding) top = viewportHeight - tooltipHeight - padding;

      setTooltipPosition({ top, left });
    } else {
      // Use fallback position if element not found
      setSpotlightRect(null);
      setTooltipPosition(step.fallbackPosition || { top: 200, left: 400 });
    }
  }, [step]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [isOpen, currentStep, updatePosition]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && !isLastStep) {
        setCurrentStep(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && !isFirstStep) {
        setCurrentStep(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFirstStep, isLastStep, onClose]);

  // Reset to first step when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Spotlight cutout */}
      {spotlightRect && (
        <div
          className="absolute bg-transparent rounded-lg ring-4 ring-blue-400 ring-opacity-75 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
          style={{
            top: spotlightRect.top - 8,
            left: spotlightRect.left - 8,
            width: spotlightRect.width + 16,
            height: spotlightRect.height + 16,
            transition: 'all 0.3s ease-in-out',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute bg-white rounded-xl shadow-2xl p-5 w-80 transition-all duration-300"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <span className="text-xs text-gray-500 font-medium">
            Step {currentStep + 1} of {TOUR_STEPS.length}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{step.description}</p>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-4">
          {TOUR_STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentStep ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={isFirstStep}
            className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              isFirstStep
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {isLastStep ? (
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
