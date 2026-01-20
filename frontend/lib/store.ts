/**
 * Zustand store for managing Strategic Pyramid state
 */

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { StrategyPyramid, PyramidSummary } from "@/types/pyramid";

interface PyramidStore {
  // State
  sessionId: string;
  pyramid: StrategyPyramid | null;
  summary: PyramidSummary | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSessionId: (id: string) => void;
  setPyramid: (pyramid: StrategyPyramid | null) => void;
  setSummary: (summary: PyramidSummary | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
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

  reset: () => {
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
    });
  },
}));
