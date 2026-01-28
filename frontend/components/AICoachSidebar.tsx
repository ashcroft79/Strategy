"use client";

import { useState, useRef, useEffect } from "react";
import { aiApi } from "@/lib/api-client";
import { usePyramidStore } from "@/lib/store";
import { Button } from "./ui/Button";
import { MessageCircle, X, Send, Sparkles, Target, Lightbulb } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
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

export function AICoachSidebar() {
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
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
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
