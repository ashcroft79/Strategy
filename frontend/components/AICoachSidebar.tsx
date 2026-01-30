"use client";

import { useState, useRef, useEffect } from "react";
import { aiApi } from "@/lib/api-client";
import { usePyramidStore } from "@/lib/store";
import { Button } from "./ui/Button";
import { MessageCircle, X, Send, Sparkles, Target, Lightbulb, Plus, Pencil } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Action block types for AI suggestions
export interface SuggestionAction {
  type: "edit" | "add";
  tierType: string;
  entryId?: string; // Only for edit actions
  fieldName: string;
  suggestedText: string;
}

export interface AICoachSidebarProps {
  onApplySuggestion?: (action: SuggestionAction) => void;
}

// Parse action blocks from AI response
function parseActionBlocks(text: string): { cleanText: string; actions: SuggestionAction[] } {
  const actions: SuggestionAction[] = [];

  // Pattern for EDIT blocks: [[EDIT:tier_type:entry_id:field_name]]content[[/EDIT]]
  const editPattern = /\[\[EDIT:(\w+):([^:]+):(\w+)\]\]\n?([\s\S]*?)\[\[\/EDIT\]\]/g;
  // Pattern for ADD blocks: [[ADD:tier_type:field_name]]content[[/ADD]]
  const addPattern = /\[\[ADD:(\w+):(\w+)\]\]\n?([\s\S]*?)\[\[\/ADD\]\]/g;

  let cleanText = text;

  // Extract EDIT blocks
  let match;
  while ((match = editPattern.exec(text)) !== null) {
    actions.push({
      type: "edit",
      tierType: match[1],
      entryId: match[2],
      fieldName: match[3],
      suggestedText: match[4].trim(),
    });
  }

  // Extract ADD blocks
  while ((match = addPattern.exec(text)) !== null) {
    actions.push({
      type: "add",
      tierType: match[1],
      fieldName: match[2],
      suggestedText: match[3].trim(),
    });
  }

  // Remove action blocks from text for clean rendering
  cleanText = cleanText.replace(editPattern, '').replace(addPattern, '').trim();

  return { cleanText, actions };
}

// Get human-readable tier name
function getTierDisplayName(tierType: string): string {
  const names: Record<string, string> = {
    vision: "Purpose Statement",
    value: "Value",
    behaviour: "Behaviour",
    driver: "Strategic Driver",
    intent: "Strategic Intent",
    enabler: "Enabler",
    commitment: "Iconic Commitment",
    team_objective: "Team Objective",
    individual_objective: "Individual Objective",
  };
  return names[tierType] || tierType;
}

// Get human-readable field name
function getFieldDisplayName(fieldName: string): string {
  const names: Record<string, string> = {
    statement: "statement",
    name: "name",
    description: "description",
    rationale: "rationale",
  };
  return names[fieldName] || fieldName;
}

// Render an action block as a clickable card
function ActionBlock({
  action,
  onApply,
  actionKey
}: {
  action: SuggestionAction;
  onApply?: (action: SuggestionAction) => void;
  actionKey: number;
}) {
  const tierName = getTierDisplayName(action.tierType);
  const fieldName = getFieldDisplayName(action.fieldName);
  const isEdit = action.type === "edit";

  return (
    <div
      key={actionKey}
      className="my-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <div className="flex items-center gap-2 text-xs text-blue-600 font-medium mb-2">
        {isEdit ? (
          <>
            <Pencil className="w-3 h-3" />
            <span>Suggested edit for {tierName} {fieldName}</span>
          </>
        ) : (
          <>
            <Plus className="w-3 h-3" />
            <span>Suggested new {tierName}</span>
          </>
        )}
      </div>
      <div className="text-sm text-gray-800 bg-white p-2 rounded border border-blue-100 mb-2 whitespace-pre-wrap">
        {action.suggestedText}
      </div>
      {onApply && (
        <button
          onClick={() => onApply(action)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
        >
          {isEdit ? (
            <>
              <Pencil className="w-3 h-3" />
              Apply Edit
            </>
          ) : (
            <>
              <Plus className="w-3 h-3" />
              Add This
            </>
          )}
        </button>
      )}
    </div>
  );
}

// Simple markdown renderer for AI responses
function renderMarkdown(
  text: string,
  onApplySuggestion?: (action: SuggestionAction) => void
): React.ReactNode {
  // First, parse out any action blocks
  const { cleanText, actions } = parseActionBlocks(text);

  // Split into lines for processing
  const lines = cleanText.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const ListTag = listType === 'ul' ? 'ul' : 'ol';
      elements.push(
        <ListTag key={elements.length} className={listType === 'ul' ? 'list-disc list-inside my-2' : 'list-decimal list-inside my-2'}>
          {listItems.map((item, i) => (
            <li key={i} className="ml-2">{renderInlineMarkdown(item)}</li>
          ))}
        </ListTag>
      );
      listItems = [];
      listType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headers
    if (line.startsWith('### ')) {
      flushList();
      elements.push(<h4 key={elements.length} className="font-semibold text-gray-900 mt-3 mb-1">{renderInlineMarkdown(line.slice(4))}</h4>);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h3 key={elements.length} className="font-bold text-gray-900 mt-3 mb-1">{renderInlineMarkdown(line.slice(3))}</h3>);
    } else if (line.startsWith('# ')) {
      flushList();
      elements.push(<h2 key={elements.length} className="font-bold text-gray-900 text-lg mt-3 mb-1">{renderInlineMarkdown(line.slice(2))}</h2>);
    }
    // Unordered list
    else if (line.match(/^[\-\*]\s/)) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      listItems.push(line.slice(2));
    }
    // Ordered list
    else if (line.match(/^\d+\.\s/)) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      listItems.push(line.replace(/^\d+\.\s/, ''));
    }
    // Empty line
    else if (line.trim() === '') {
      flushList();
      elements.push(<br key={elements.length} />);
    }
    // Regular paragraph
    else {
      flushList();
      elements.push(<p key={elements.length} className="mb-2">{renderInlineMarkdown(line)}</p>);
    }
  }

  flushList();

  // Append action blocks at the end
  if (actions.length > 0) {
    actions.forEach((action, idx) => {
      elements.push(
        <ActionBlock
          key={`action-${idx}`}
          action={action}
          onApply={onApplySuggestion}
          actionKey={idx}
        />
      );
    });
  }

  return <>{elements}</>;
}

// Render inline markdown (bold, italic, code)
function renderInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold with **
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Italic with *
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
    // Code with `
    const codeMatch = remaining.match(/`([^`]+)`/);

    // Find the earliest match
    const matches = [
      boldMatch ? { match: boldMatch, type: 'bold' as const, index: boldMatch.index! } : null,
      italicMatch ? { match: italicMatch, type: 'italic' as const, index: italicMatch.index! } : null,
      codeMatch ? { match: codeMatch, type: 'code' as const, index: codeMatch.index! } : null,
    ].filter(Boolean).sort((a, b) => a!.index - b!.index);

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    const earliest = matches[0]!;

    // Add text before the match
    if (earliest.index > 0) {
      parts.push(remaining.slice(0, earliest.index));
    }

    // Add the formatted element
    if (earliest.type === 'bold') {
      parts.push(<strong key={key++} className="font-semibold">{earliest.match[1]}</strong>);
      remaining = remaining.slice(earliest.index + earliest.match[0].length);
    } else if (earliest.type === 'italic') {
      parts.push(<em key={key++}>{earliest.match[1]}</em>);
      remaining = remaining.slice(earliest.index + earliest.match[0].length);
    } else if (earliest.type === 'code') {
      parts.push(<code key={key++} className="bg-gray-200 px-1 rounded text-sm font-mono">{earliest.match[1]}</code>);
      remaining = remaining.slice(earliest.index + earliest.match[0].length);
    }
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

// Helper to generate pyramid summary for AI context
function getPyramidSummary(pyramid: any): string {
  if (!pyramid) return "No pyramid loaded yet.";

  const visionCount = pyramid.vision?.statements?.length || 0;
  const valuesCount = pyramid.values?.length || 0;
  const behavioursCount = pyramid.behaviours?.length || 0;
  const driversCount = pyramid.strategic_drivers?.length || 0;
  const intentsCount = pyramid.strategic_intents?.length || 0;
  const enablersCount = pyramid.enablers?.length || 0;
  const commitmentsCount = pyramid.iconic_commitments?.length || 0;
  const teamCount = pyramid.team_objectives?.length || 0;
  const individualCount = pyramid.individual_objectives?.length || 0;

  const parts = [];
  if (visionCount > 0) parts.push(`${visionCount} vision/mission statement(s)`);
  if (valuesCount > 0) parts.push(`${valuesCount} value(s)`);
  if (behavioursCount > 0) parts.push(`${behavioursCount} behaviour(s)`);
  if (driversCount > 0) parts.push(`${driversCount} strategic driver(s)`);
  if (intentsCount > 0) parts.push(`${intentsCount} strategic intent(s)`);
  if (enablersCount > 0) parts.push(`${enablersCount} enabler(s)`);
  if (commitmentsCount > 0) parts.push(`${commitmentsCount} iconic commitment(s)`);
  if (teamCount > 0) parts.push(`${teamCount} team objective(s)`);
  if (individualCount > 0) parts.push(`${individualCount} individual objective(s)`);

  if (parts.length === 0) return "The pyramid is empty - no tiers have content yet.";

  return `Current pyramid has: ${parts.join(", ")}.`;
}

export function AICoachSidebar({ onApplySuggestion }: AICoachSidebarProps) {
  const { sessionId, pyramid } = usePyramidStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm your AI strategy coach. I can help you build better pyramid elements, suggest improvements, and answer questions. What would you like to work on?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);

    setIsLoading(true);

    try {
      // Get AI response
      const response = await aiApi.chat(
        sessionId,
        userMessage,
        newMessages.slice(0, -1) // Send history without the just-added user message
      );

      setMessages([
        ...newMessages,
        { role: "assistant", content: response.response },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please check your API configuration and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick action: What should I do next?
  const handleWhatsNext = async () => {
    if (isLoading) return;

    const pyramidContext = getPyramidSummary(pyramid);
    const prompt = `Based on my current pyramid state, what should I focus on next? ${pyramidContext}

Please analyze what I have and suggest the most important next step. Consider:
- Which tiers are empty or underdeveloped?
- What's the logical next step in building a coherent strategy?
- Are there any obvious gaps I should address?

Give me one clear, actionable recommendation.`;

    // Add user message (showing the quick action)
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: "🎯 What should I do next?" },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await aiApi.chat(sessionId, prompt, messages);
      setMessages([
        ...newMessages,
        { role: "assistant", content: response.response },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please check your API configuration and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick action: Review my pyramid
  const handleReviewPyramid = async () => {
    if (isLoading) return;

    const pyramidContext = getPyramidSummary(pyramid);

    // Get more detailed info for the review
    let detailedContext = pyramidContext;
    if (pyramid) {
      const details = [];

      // Check driver count (should be 3-5)
      const driverCount = pyramid.strategic_drivers?.length || 0;
      if (driverCount > 0) {
        details.push(`Drivers (${driverCount}): ${pyramid.strategic_drivers.map((d: any) => d.name).join(", ")}`);
      }

      // Check horizon balance
      const commitments = pyramid.iconic_commitments || [];
      const h1 = commitments.filter((c: any) => c.horizon === "H1").length;
      const h2 = commitments.filter((c: any) => c.horizon === "H2").length;
      const h3 = commitments.filter((c: any) => c.horizon === "H3").length;
      if (commitments.length > 0) {
        details.push(`Horizon balance: H1=${h1}, H2=${h2}, H3=${h3}`);
      }

      if (details.length > 0) {
        detailedContext += "\n\nDetails:\n" + details.join("\n");
      }
    }

    const prompt = `Please review my strategic pyramid and give me constructive feedback. ${detailedContext}

Analyze the current state and provide observations in a conversational, helpful tone:
- What's strong about the current structure?
- What could be improved or refined?
- Are there any common pitfalls I might be falling into?

Use ✓ for strengths and ⚠ for suggestions. Keep it brief and actionable.`;

    // Add user message
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: "💡 Review my pyramid" },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await aiApi.chat(sessionId, prompt, messages);
      setMessages([
        ...newMessages,
        { role: "assistant", content: response.response },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please check your API configuration and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-50"
        aria-label="Open AI Coach"
        data-tour="ai-coach"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-96 h-[600px] bg-white border-l border-t border-gray-200 shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">AI Strategy Coach</h3>
            <p className="text-xs text-blue-100">Powered by Claude</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-blue-800 p-1 rounded transition-colors"
          aria-label="Close coach"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <button
            onClick={handleWhatsNext}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Target className="w-4 h-4" />
            <span>What's next?</span>
          </button>
          <button
            onClick={handleReviewPyramid}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Review</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.role === "user" ? (
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div className="text-sm">{renderMarkdown(msg.content, onApplySuggestion)}</div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your strategy..."
            className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
