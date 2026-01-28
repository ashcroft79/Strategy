'use client';

import React, { useState } from 'react';
import { BookOpen, GraduationCap, FileText, MessageCircle, Play, ChevronRight, HelpCircle } from 'lucide-react';
import Modal from './ui/Modal';

interface HelpHubProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour?: () => void;
  onOpenLearningCenter?: () => void;
  onOpenExamples?: () => void;
  onOpenAICoach?: () => void;
}

interface PathCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
  color: 'blue' | 'purple' | 'green' | 'indigo';
}

function PathCard({ icon, title, description, action, onClick, color }: PathCardProps) {
  const colorStyles = {
    blue: 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100',
    purple: 'bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-100',
    green: 'bg-green-50 border-green-200 hover:border-green-400 hover:bg-green-100',
    indigo: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100',
  };

  const iconColorStyles = {
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100',
    green: 'text-green-600 bg-green-100',
    indigo: 'text-indigo-600 bg-indigo-100',
  };

  const actionColorStyles = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    indigo: 'text-indigo-600',
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full p-5 rounded-xl border-2 transition-all duration-200
        text-left group cursor-pointer
        ${colorStyles[color]}
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${iconColorStyles[color]}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          <div className={`flex items-center text-sm font-medium ${actionColorStyles[color]} group-hover:gap-2 transition-all`}>
            {action}
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </button>
  );
}

export default function HelpHub({
  isOpen,
  onClose,
  onStartTour,
  onOpenLearningCenter,
  onOpenExamples,
  onOpenAICoach,
}: HelpHubProps) {

  const handleStartTour = () => {
    onClose();
    onStartTour?.();
  };

  const handleOpenLearningCenter = () => {
    onClose();
    onOpenLearningCenter?.();
  };

  const handleOpenExamples = () => {
    onClose();
    onOpenExamples?.();
  };

  const handleOpenAICoach = () => {
    onClose();
    onOpenAICoach?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Getting Started" size="lg">
      <div className="space-y-6">
        {/* Introduction */}
        <div className="text-center pb-4 border-b border-gray-100">
          <p className="text-gray-600">
            Choose how you'd like to explore the Strategic Pyramid Builder
          </p>
        </div>

        {/* Path Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PathCard
            icon={<Play className="w-6 h-6" />}
            title="Quick Tour"
            description="A 2-minute guided tour of the key features and navigation"
            action="Start the tour"
            onClick={handleStartTour}
            color="blue"
          />

          <PathCard
            icon={<GraduationCap className="w-6 h-6" />}
            title="Learn the Methodology"
            description="Deep dive into the Strategic Pyramid framework and best practices"
            action="Open Learning Center"
            onClick={handleOpenLearningCenter}
            color="purple"
          />

          <PathCard
            icon={<FileText className="w-6 h-6" />}
            title="Browse Examples"
            description="Explore complete example pyramids across different industries"
            action="View examples"
            onClick={handleOpenExamples}
            color="green"
          />

          <PathCard
            icon={<MessageCircle className="w-6 h-6" />}
            title="Ask the AI Coach"
            description="Get personalized guidance and answers to your questions"
            action="Open AI Coach"
            onClick={handleOpenAICoach}
            color="indigo"
          />
        </div>

        {/* Quick Tips */}
        <div className="bg-gray-50 rounded-xl p-4 mt-6">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-gray-500" />
            Quick Tips
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Click the <strong>?</strong> icons throughout the app for contextual help</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Start with <strong>Context & Discovery</strong> to ground your strategy in reality</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Use <strong>Validate</strong> to check your pyramid for common issues</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            You can access this help anytime via the Help button in the navigation
          </p>
        </div>
      </div>
    </Modal>
  );
}

// Export a button component for use in navigation
export function HelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      title="Getting Started & Help"
      data-tour="help-hub"
    >
      <HelpCircle className="w-5 h-5" />
      <span className="text-sm font-medium">Help</span>
    </button>
  );
}
