import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  questionStorage,
  categoryStorage,
  simulationStorage,
  historyStorage,
  statisticsStorage,
  rankingStorage,
  answersStorage,
} from "./localStorage";
import type {
  Question,
  Simulation,
  SimulationAnswer,
  History,
  Category,
  UserStatistics,
  RankingEntry,
} from "../types";

const normalizeRankingEntry = (entry: any): RankingEntry => ({
  id: entry.id || `ranking_${entry.userId || entry.user_id}`,
  user_id: entry.user_id || entry.userId || "",
  user_name: entry.user_name || entry.userName || "Usuário",
  user_email: entry.user_email || entry.userEmail || "",
  total_score: entry.total_score ?? entry.totalScore ?? 0,
  average_score: entry.average_score ?? entry.averageScore ?? 0,
  total_simulations: entry.total_simulations ?? entry.totalSimulations ?? 0,
  total_correct_answers: entry.total_correct_answers ?? entry.totalCorrectAnswers ?? 0,
  total_time_seconds: entry.total_time_seconds ?? entry.totalTimeSeconds ?? 0,
  updated_at: entry.updated_at ?? entry.updatedAt ?? new Date().toISOString(),
});

// Questions
export function useQuestionsByCategory(categoryId: string) {
  return useQuery({
    queryKey: ["questions", categoryId],
    queryFn: async () => questionStorage.getByCategory(categoryId),
    enabled: !!categoryId,
  });
}

export function useAllQuestions() {
  return useQuery({
    queryKey: ["all-questions"],
    queryFn: async () => questionStorage.getAll().sort((a, b) => b.created_at.localeCompare(a.created_at)),
  });
}

// Categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => categoryStorage.getAll().sort((a, b) => a.name.localeCompare(b.name)),
  });
}

// Simulations
export function useCreateSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (simulation: Omit<Simulation, "id" | "created_at">) => {
      const nextSimulation: Simulation = {
        ...simulation,
        id: `sim_${Date.now()}`,
        created_at: new Date().toISOString(),
      } as Simulation;
      simulationStorage.add(nextSimulation);
      return nextSimulation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-simulations"] });
      queryClient.invalidateQueries({ queryKey: ["user-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["ranking"] });
    },
  });
}

export function useUserSimulations(userId: string) {
  return useQuery({
    queryKey: ["user-simulations", userId],
    queryFn: async () => simulationStorage.getByUser(userId),
    enabled: !!userId,
  });
}

// Simulation Answers
export function useCreateSimulationAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (answer: Omit<SimulationAnswer, "id">) => {
      const nextAnswer: SimulationAnswer = {
        ...answer,
        id: `ans_${Date.now()}`,
      } as SimulationAnswer;
      answersStorage.add(answer.simulation_id, nextAnswer);
      return nextAnswer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simulation-answers"] });
    },
  });
}

export function useSimulationAnswers(simulationId: string) {
  return useQuery({
    queryKey: ["simulation-answers", simulationId],
    queryFn: async () => answersStorage.getBySimulation(simulationId),
    enabled: !!simulationId,
  });
}

// History
export function useUserHistory(userId: string) {
  return useQuery({
    queryKey: ["user-history", userId],
    queryFn: async () => historyStorage.getByUser(userId),
    enabled: !!userId,
  });
}

// Statistics
export function useUserStatistics(userId: string) {
  return useQuery({
    queryKey: ["user-statistics", userId],
    queryFn: async () => statisticsStorage.getByUser(userId),
    enabled: !!userId,
  });
}

export function useUpdateUserStatistics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, stats }: { userId: string; stats: Partial<UserStatistics> }) => {
      const current = statisticsStorage.getByUser(userId);
      const next = {
        ...(current || {
          id: `stats_${userId}`,
          user_id: userId,
          total_simulations: 0,
          best_score: 0,
          last_score: 0,
          average_score: 0,
          total_time_seconds: 0,
          total_questions_answered: 0,
          accuracy_rate: 0,
          by_category: [],
          updated_at: new Date().toISOString(),
        }),
        ...stats,
        user_id: userId,
        updated_at: new Date().toISOString(),
      } as UserStatistics;

      statisticsStorage.save(userId, next);
      rankingStorage.update(userId, {
        userId,
        userName: "Usuário",
        userEmail: "",
        totalScore: next.best_score,
        averageScore: next.average_score,
        totalSimulations: next.total_simulations,
        totalCorrectAnswers: next.total_questions_answered,
        totalTimeSeconds: next.total_time_seconds,
      });

      return next;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-statistics", data.user_id] });
      queryClient.invalidateQueries({ queryKey: ["ranking"] });
    },
  });
}

// Ranking
export function useRanking(limit: number = 100) {
  return useQuery({
    queryKey: ["ranking", limit],
    queryFn: async () => {
      const ranking = rankingStorage.getAll().map(normalizeRankingEntry);
      return ranking.sort((a, b) => b.total_score - a.total_score).slice(0, limit);
    },
  });
}

export function useUserRankPosition(userId: string) {
  return useQuery({
    queryKey: ["user-rank-position", userId],
    queryFn: async () => {
      const ranking = rankingStorage.getAll().map(normalizeRankingEntry);
      const ordered = ranking.sort((a, b) => b.total_score - a.total_score);
      const position = ordered.findIndex((entry) => entry.user_id === userId) + 1;

      return {
        position,
        total: ordered.length,
        entry: ordered.find((entry) => entry.user_id === userId),
      };
    },
    enabled: !!userId,
  });
}
