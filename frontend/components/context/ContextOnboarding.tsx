"use client";

import { useState, useEffect } from "react";
import { contextApi } from "@/lib/api-client";
import { usePyramidStore } from "@/lib/store";
import { Lightbulb, ArrowRight, CheckCircle2 } from "lucide-react";

interface ContextOnboardingProps {
  onDismiss: () => void;
  onStartContext: () => void;
}

export function ContextOnboarding({ onDismiss, onStartContext }: ContextOnboardingProps) {
  const { sessionId } = usePyramidStore();
  const [contextStatus, setContextStatus] = useState<{
    hasItems: boolean;
    itemCount: number;
    isComplete: boolean;
  }>({ hasItems: false, itemCount: 0, isComplete: false });

  useEffect(() => {
    if (!sessionId) return;

    const checkContextStatus = async () => {
      try {
        const analysis = await contextApi.getSOCC(sessionId);
        const itemCount = analysis.items?.length || 0;
        setContextStatus({
          hasItems: itemCount > 0,
          itemCount,
          isComplete: itemCount >= 20, // 20+ items recommended
        });
      } catch (err) {
        console.error("Failed to check context status:", err);
      }
    };

    checkContextStatus();
  }, [sessionId]);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="bg-purple-500 text-white p-3 rounded-lg">
          <Lightbulb className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Start with Context (Tier 0)
          </h3>
          <p className="text-gray-700 mb-4">
            <strong>Strategy without context is hope, not strategy.</strong> Before building your pyramid,
            establish the foundation by capturing your current reality using the SOCC framework.
          </p>

          <div className="bg-white rounded-lg p-4 mb-4 border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-2">The Three-Step Framework:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  contextStatus.hasItems ? 'bg-green-500 text-white' : 'bg-purple-100 text-purple-700'
                }`}>
                  {contextStatus.hasItems ? <CheckCircle2 className="w-4 h-4" /> : '1'}
                </div>
                <span className={contextStatus.hasItems ? 'text-green-700 font-semibold' : 'text-gray-700'}>
                  Step 1: Context & Discovery (Tier 0)
                </span>
              </div>
              <div className="flex items-center gap-2 ml-8">
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Capture your SOCC: Strengths, Opportunities, Considerations, Constraints
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold bg-gray-100 text-gray-500">
                  2
                </div>
                <span className="text-gray-500">
                  Step 2: Strategy & Plan (The Pyramid - Tiers 1-9)
                </span>
              </div>
              <div className="flex items-center gap-2 ml-8">
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Build your strategy from Vision to Individual objectives
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold bg-gray-100 text-gray-500">
                  3
                </div>
                <span className="text-gray-500">
                  Step 3: Execution & Learning
                </span>
              </div>
            </div>
          </div>

          {!contextStatus.hasItems ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>⚠️ You haven't started your Context analysis yet.</strong>
              </p>
              <p className="text-sm text-yellow-700">
                We recommend completing your SOCC analysis (20+ items) before building the pyramid.
                This ensures your strategy is grounded in reality, not hope.
              </p>
            </div>
          ) : !contextStatus.isComplete ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 mb-2">
                <strong>✓ Context Started ({contextStatus.itemCount} items)</strong>
              </p>
              <p className="text-sm text-blue-700">
                Good progress! We recommend 20+ items total (5-7 per quadrant) for a solid foundation.
                You can add more items as you build your strategy.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-800 mb-2">
                <strong>✓ Context Complete ({contextStatus.itemCount} items)</strong>
              </p>
              <p className="text-sm text-green-700">
                Excellent! Your foundation is solid. You're ready to build your Strategic Pyramid with
                confidence. Your context will guide your strategic choices.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            {!contextStatus.hasItems ? (
              <button
                onClick={onStartContext}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                Start Context Analysis
              </button>
            ) : (
              <button
                onClick={onStartContext}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
              >
                Continue Context Analysis
              </button>
            )}
            <button
              onClick={onDismiss}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
