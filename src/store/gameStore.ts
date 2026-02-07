import { create } from 'zustand';

export interface DialogueLine {
  speaker: string;
  avatar: string;
  text: string;
  action?: string;
}

interface GameState {
  // Global
  currentLesson: number;
  currentStep: number;
  isTransitioning: boolean;

  // Entropy (L1)
  entropy: number;
  
  // Dopamine (L1)
  dopamine: number;
  survivalRate: number;
  
  // General metrics
  producerScore: number;
  lessonsCompleted: number[];

  // Actions
  setLesson: (lesson: number) => void;
  nextStep: () => void;
  setStep: (step: number) => void;
  setTransitioning: (v: boolean) => void;
  setEntropy: (v: number) => void;
  setDopamine: (v: number) => void;
  setSurvivalRate: (v: number) => void;
  addProducerScore: (v: number) => void;
  completeLesson: (lesson: number) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentLesson: 1,
  currentStep: 0,
  isTransitioning: false,
  entropy: 0,
  dopamine: 50,
  survivalRate: 100,
  producerScore: 0,
  lessonsCompleted: [],

  setLesson: (lesson) => set({ currentLesson: lesson, currentStep: 0 }),
  nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
  setStep: (step) => set({ currentStep: step }),
  setTransitioning: (v) => set({ isTransitioning: v }),
  setEntropy: (v) => set({ entropy: Math.max(0, Math.min(100, v)) }),
  setDopamine: (v) => set({ dopamine: Math.max(0, Math.min(200, v)) }),
  setSurvivalRate: (v) => set({ survivalRate: Math.max(0, Math.min(100, v)) }),
  addProducerScore: (v) => set((s) => ({ producerScore: s.producerScore + v })),
  completeLesson: (lesson) =>
    set((s) => ({
      lessonsCompleted: [...new Set([...s.lessonsCompleted, lesson])],
    })),
  reset: () =>
    set({
      currentStep: 0,
      entropy: 0,
      dopamine: 50,
      survivalRate: 100,
    }),
}));
