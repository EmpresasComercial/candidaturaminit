/**
 * Zustand stores para gerenciar estado global da aplicação
 * Todos os dados são persistidos localmente via localStorage
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  User,
  SimulationSession,
  Question,
  History,
  UserStatistics,
  UserGameification,
  Category,
  SimulationAnswer,
} from "../types";
import {
  userStorage,
  statisticsStorage,
  gamificationStorage,
  categoryStorage,
  questionStorage,
  historyStorage,
} from "./localStorage";

// ============ AUTH STORE ============

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => {
        if (user) {
          userStorage.setUser(user);
        } else {
          userStorage.signOut();
        }
        set({ user });
      },
      setIsLoading: (loading) => set({ isLoading: loading }),
      logout: () => {
        userStorage.signOut();
        set({ user: null });
      },
    }),
    {
      name: "auth-store",
    }
  )
);

// ============ SIMULATION STORE ============

interface SimulationStore {
  currentSession: SimulationSession | null;
  sessionAnswers: SimulationAnswer[];
  startSession: (session: SimulationSession) => void;
  endSession: () => void;
  setAnswer: (questionId: string, answer: boolean | null, timeSpent: number) => void;
  getCurrentQuestion: () => Question | null;
  moveToNextQuestion: () => void;
  addToHistory: (history: History) => void;
  getSession: () => SimulationSession | null;
}

export const useSimulationStore = create<SimulationStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      sessionAnswers: [],

      startSession: (session) => {
        set({ currentSession: session, sessionAnswers: [] });
      },

      endSession: () => {
        set({ currentSession: null, sessionAnswers: [] });
      },

      setAnswer: (questionId: string, answer: boolean | null, timeSpent: number) => {
        const { currentSession } = get();
        if (!currentSession) return;

        const question = currentSession.questions.find((q) => q.id === questionId);
        const isCorrect = answer === question?.correct_answer;

        const newAnswer: SimulationAnswer = {
          id: `ans_${Date.now()}`,
          simulation_id: currentSession.id,
          question_id: questionId,
          user_answer: answer !== null ? answer : undefined,
          is_correct: isCorrect,
          time_spent_seconds: timeSpent,
          answered_at: new Date().toISOString(),
        };

        set((state) => ({
          sessionAnswers: [...state.sessionAnswers, newAnswer],
        }));
      },

      getCurrentQuestion: () => {
        const { currentSession } = get();
        if (!currentSession || currentSession.current_question_index >= currentSession.questions.length) {
          return null;
        }
        return currentSession.questions[currentSession.current_question_index];
      },

      moveToNextQuestion: () => {
        set((state) => {
          if (state.currentSession) {
            return {
              currentSession: {
                ...state.currentSession,
                current_question_index: state.currentSession.current_question_index + 1,
              },
            };
          }
          return state;
        });
      },

      addToHistory: (history: History) => {
        historyStorage.add(history);
      },

      getSession: () => get().currentSession,
    }),
    {
      name: "simulation-store",
    }
  )
);

// ============ STATISTICS STORE ============

interface StatisticsStore {
  stats: UserStatistics | null;
  gamification: UserGameification | null;
  setStats: (stats: UserStatistics | null) => void;
  setGameification: (gamification: UserGameification | null) => void;
  updateStats: (userId: string, updates: Partial<UserStatistics>) => void;
  updateGameification: (userId: string, updates: Partial<UserGameification>) => void;
}

export const useStatisticsStore = create<StatisticsStore>()(
  persist(
    (set) => ({
      stats: null,
      gamification: null,
      setStats: (stats) => set({ stats }),
      setGameification: (gamification) => set({ gamification }),
      updateStats: (userId: string, updates: Partial<UserStatistics>) => {
        statisticsStorage.update(userId, updates);
        const updated = statisticsStorage.getByUser(userId);
        set({ stats: updated });
      },
      updateGameification: (userId: string, updates: Partial<UserGameification>) => {
        gamificationStorage.update(userId, updates);
        const updated = gamificationStorage.getByUser(userId);
        set({ gamification: updated });
      },
    }),
    {
      name: "statistics-store",
    }
  )
);

// ============ UI STORE ============

interface UIStore {
  showAntiCheatWarning: boolean;
  isFullscreen: boolean;
  setShowAntiCheatWarning: (show: boolean) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  showAntiCheatWarning: false,
  isFullscreen: false,
  setShowAntiCheatWarning: (show) => set({ showAntiCheatWarning: show }),
  setIsFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
}));

// ============ CATEGORIES STORE ============

interface CategoriesStore {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  getCategories: () => Category[];
}

export const useCategoriesStore = create<CategoriesStore>((set, get) => ({
  categories: categoryStorage.getAll(),
  setCategories: (categories) => {
    categoryStorage.save(categories);
    set({ categories });
  },
  getCategories: () => get().categories,
}));

// ============ QUESTIONS STORE ============

interface QuestionsStore {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  getQuestionsByCategory: (categoryId: string) => Question[];
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, question: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
}

export const useQuestionsStore = create<QuestionsStore>((set, get) => ({
  questions: questionStorage.getAll(),
  setQuestions: (questions) => {
    questionStorage.addMultiple(questions);
    set({ questions });
  },
  getQuestionsByCategory: (categoryId: string) => {
    return get().questions.filter((q) => q.category_id === categoryId);
  },
  addQuestion: (question: Question) => {
    questionStorage.add(question);
    set((state) => ({ questions: [...state.questions, question] }));
  },
  updateQuestion: (id: string, question: Partial<Question>) => {
    questionStorage.update(id, question);
    set((state) => ({
      questions: state.questions.map((q) => (q.id === id ? { ...q, ...question } : q)),
    }));
  },
  deleteQuestion: (id: string) => {
    questionStorage.delete(id);
    set((state) => ({ questions: state.questions.filter((q) => q.id !== id) }));
  },
}));
