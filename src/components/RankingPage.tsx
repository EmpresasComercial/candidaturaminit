import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Medal, Trophy, Zap } from "lucide-react";
import { useRanking } from "../lib/hooks";
import type { RankingEntry } from "../types";

interface RankingComponentProps {
  limit?: number;
  currentUserId?: string;
  showTopOnly?: boolean;
}

export function RankingList({
  limit = 50,
  currentUserId,
  showTopOnly = false,
}: RankingComponentProps) {
  const { data: rankingData, isLoading } = useRanking(limit);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!rankingData || rankingData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Nenhum dado de ranking ainda</p>
      </div>
    );
  }

  const displayData = showTopOnly ? rankingData.slice(0, 5) : rankingData;
  const userPosition = rankingData.findIndex((r) => r.user_id === currentUserId) + 1;

  const getMedalColor = (position: number): string => {
    switch (position) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-slate-400";
      case 3:
        return "text-amber-700";
      default:
        return "text-slate-600";
    }
  };

  const getMedalBgColor = (position: number): string => {
    switch (position) {
      case 1:
        return "bg-yellow-50";
      case 2:
        return "bg-slate-50";
      case 3:
        return "bg-amber-50";
      default:
        return "bg-white";
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      {/* Current User Position */}
      {currentUserId && userPosition > 0 && (
        <motion.div variants={item} className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-600 font-medium">Sua Posição</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold text-blue-900">#{userPosition}</span>
            <span className="text-lg font-semibold text-blue-700">
              {rankingData[userPosition - 1]?.total_score} pontos
            </span>
          </div>
        </motion.div>
      )}

      {/* Ranking List */}
      <div className="space-y-3">
        {displayData.map((entry, idx) => {
          const position = idx + 1;
          const isCurrentUser = entry.user_id === currentUserId;

          return (
            <motion.div
              key={entry.id}
              variants={item}
              className={`rounded-lg shadow transition-all hover:shadow-md ${getMedalBgColor(position)} ${
                isCurrentUser ? "border-2 border-blue-500" : "border border-slate-200"
              }`}
            >
              <div className="p-4 md:p-6 flex items-center gap-4">
                {/* Position Medal */}
                <div className="flex-shrink-0">
                  {position === 1 ? (
                    <Trophy className={`w-8 h-8 ${getMedalColor(position)}`} />
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold ${getMedalColor(position)}`}
                    >
                      {position}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">
                    {entry.user_name}
                    {isCurrentUser && (
                      <span className="ml-2 inline-block px-2 py-1 bg-blue-500 text-white text-xs rounded font-medium">
                        Você
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-slate-500 truncate">{entry.user_email}</p>
                </div>

                {/* Stats - Desktop */}
                <div className="hidden md:flex items-center gap-6 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-xs text-slate-600">Simulados</p>
                    <p className="text-lg font-bold text-slate-900">
                      {entry.total_simulations}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-slate-600">Média</p>
                    <p className="text-lg font-bold text-slate-900">
                      {entry.average_score}%
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-slate-600">Acertos</p>
                    <p className="text-lg font-bold text-green-600">
                      {entry.total_correct_answers}
                    </p>
                  </div>
                </div>

                {/* Main Score */}
                <div className="flex-shrink-0 text-right">
                  <div className="flex items-center gap-1 justify-end mb-1">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <p className="text-2xl md:text-3xl font-bold text-slate-900">
                      {entry.total_score}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500">pontos</p>
                </div>
              </div>

              {/* Mobile Stats */}
              <div className="md:hidden border-t border-slate-200 p-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-slate-600">Simulados</p>
                  <p className="font-bold text-slate-900">{entry.total_simulations}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-600">Média</p>
                  <p className="font-bold text-slate-900">{entry.average_score}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-600">Acertos</p>
                  <p className="font-bold text-green-600">{entry.total_correct_answers}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Show More Button */}
      {showTopOnly && rankingData.length > 5 && (
        <motion.div variants={item} className="mt-6 text-center">
          <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
            Ver Ranking Completo
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Standalone Ranking Page
export function RankingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 md:p-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div variants={item} className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-amber-500" />
            <h1 className="text-4xl font-bold text-slate-900">Ranking Geral</h1>
          </div>
          <p className="text-slate-600">
            Veja como você se compara com os outros candidatos
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          variants={item}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              label: "Critério de Ordenação",
              value: "Maior Nota",
            },
            {
              label: "Desempate",
              value: "Menor Tempo",
            },
            {
              label: "Segundo Desempate",
              value: "Maior Acertos",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-6 text-center"
            >
              <p className="text-sm text-slate-600 font-medium mb-2">
                {stat.label}
              </p>
              <p className="text-lg font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Ranking Table */}
        <motion.div variants={item} className="bg-white rounded-lg shadow">
          <RankingList limit={100} showTopOnly={false} />
        </motion.div>
      </div>
    </motion.div>
  );
}
