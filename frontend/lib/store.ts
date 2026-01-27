/**
 * Zustand store for managing Strategic Pyramid state
 */

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { StrategyPyramid, PyramidSummary } from "@/types/pyramid";
import { contextApi } from "./api-client";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface PyramidStore {
  // State
  sessionId: string;
  pyramid: StrategyPyramid | null;
  summary: PyramidSummary | null;
  isLoading: boolean;
  error: string | null;
  toasts: Toast[];
  unsavedChanges: number;
  lastSavedAt: Date | null;

  // Actions
  setSessionId: (id: string) => void;
  setPyramid: (pyramid: StrategyPyramid | null) => void;
  setSummary: (summary: PyramidSummary | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  showToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
  incrementUnsavedChanges: () => void;
  resetUnsavedChanges: () => void;
  reset: () => void;
}

export const usePyramidStore = create<PyramidStore>((set) => ({
  // Initial state
  sessionId: typeof window !== "undefined"
    ? (sessionStorage.getItem("pyramid_session_id") || uuidv4())
    : uuidv4(),
  pyramid: null,
  summary: null,
  isLoading: false,
  error: null,
  toasts: [],
  unsavedChanges: 0,
  lastSavedAt: null,

  // Actions
  setSessionId: (id: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pyramid_session_id", id);
    }
    set({ sessionId: id });
  },

  setPyramid: (pyramid: StrategyPyramid | null) => set({ pyramid }),

  setSummary: (summary: PyramidSummary | null) => set({ summary }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  showToast: (message: string, type: Toast["type"] = "info") => {
    const id = uuidv4();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  incrementUnsavedChanges: () => {
    set((state) => ({
      unsavedChanges: state.unsavedChanges + 1,
    }));
  },

  resetUnsavedChanges: () => {
    set({
      unsavedChanges: 0,
      lastSavedAt: new Date(),
    });
  },

  reset: () => {
    // Clear context data for old session (fire and forget)
    const oldSessionId = typeof window !== "undefined"
      ? (sessionStorage.getItem("pyramid_session_id") || "")
      : "";
    if (oldSessionId) {
      contextApi.clearContext(oldSessionId).catch(err =>
        console.error("Failed to clear context:", err)
      );
    }

    const newSessionId = uuidv4();
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pyramid_session_id", newSessionId);
    }
    set({
      sessionId: newSessionId,
      pyramid: null,
      summary: null,
      isLoading: false,
      error: null,
      toasts: [],
      unsavedChanges: 0,
      lastSavedAt: null,
    });
  },
}));
