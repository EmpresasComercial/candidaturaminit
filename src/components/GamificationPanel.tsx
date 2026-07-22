import { motion } from "framer-motion";
import { Trophy, Zap, Star, Flame, Lock, Unlock } from "lucide-react";
import type { UserGameification, UserAchievement, Achievement } from "../types";

interface GamificationProps {
  gamification: UserGameification;
  achievements: UserAchievement[];
  allAchievements: Achievement[];
}

export function GamificationPanel({
  gamification,
  achievements,
  allAchievements,
}: GamificationProps) {
  const xpProgress = (gamification.xp % 1000) / 10; // 0-100 for display
  const unlockedAchievementIds = new Set(
    achievements.map((a) => a.achievement_id)
  );

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
      className="space-y-8"
    >
      {/* Main Stats Card */}
      <motion.div
        variants={item}
        className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-lg p-8 text-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Level */}
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">{gamification.level}</div>
            <p className="text-purple-100 font-medium">Nível</p>
            <div className="mt-4 w-24 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
              <motion.div
                className="h-full bg-yellow-300"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <p className="text-xs text-purple-100 mt-2">
              {gamification.xp} / {gamification.xp_next_level} XP
            </p>
          </div>

          {/* Points */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-8 h-8 text-yellow-300" />
              <div className="text-5xl font-bold">
                {gamification.total_points}
              </div>
            </div>
            <p className="text-purple-100 font-medium">Pontos Totais</p>
          </div>

          {/* Streak */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-8 h-8 text-orange-300" />
              <div className="text-5xl font-bold">
                {gamification.streak_days}
              </div>
            </div>
            <p className="text-purple-100 font-medium">Dias de Sequência</p>
            {gamification.last_activity && (
              <p className="text-xs text-purple-100 mt-2">
                Última atividade: hoje
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Achievements Section */}
      <motion.div variants={item}>
        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          Conquistas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allAchievements.map((achievement) => {
            const isUnlocked = unlockedAchievementIds.has(achievement.id);
            const unlockedData = achievements.find(
              (a) => a.achievement_id === achievement.id
            );

            return (
              <motion.div
                key={achievement.id}
                variants={item}
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                className={`relative rounded-lg p-6 text-center transition-all ${
                  isUnlocked
                    ? "bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 shadow-lg"
                    : "bg-slate-100 border-2 border-slate-300 opacity-60"
                }`}
              >
                {/* Lock indicator */}
                <div className="absolute top-2 right-2">
                  {isUnlocked ? (
                    <Unlock className="w-4 h-4 text-green-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                {/* Icon */}
                <div className="text-4xl mb-3">{achievement.icon}</div>

                {/* Name */}
                <h4 className="font-bold text-slate-900 mb-2">
                  {achievement.name}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-600 mb-3">
                  {achievement.description}
                </p>

                {/* Reward */}
                <div className="flex items-center justify-center gap-1 text-amber-600 font-bold">
                  <Zap className="w-4 h-4" />
                  +{achievement.reward_points}
                </div>

                {/* Unlock date */}
                {isUnlocked && unlockedData && (
                  <p className="text-xs text-green-600 mt-3 font-semibold">
                    ✓ Desbloqueada
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Progress Tips */}
      <motion.div
        variants={item}
        className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6"
      >
        <h4 className="font-bold text-blue-900 mb-3">💡 Como Ganhar Mais XP</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Complete simulados para ganhar pontos de base</li>
          <li>• Mantenha uma sequência diária para multiplica dores</li>
          <li>• Desbloqueie conquistas para ganhar bônus de pontos</li>
          <li>• Acerte todas as questões para bônus especial (+50 XP)</li>
          <li>• Suba de nível a cada 1000 XP</li>
        </ul>
      </motion.div>

      {/* Level Milestones */}
      <motion.div variants={item}>
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Próximos Marcos
        </h3>
        <div className="space-y-3">
          {[
            { level: 10, reward: "Badge Iniciante", icon: "🎖️" },
            { level: 25, reward: "Badge Intermediário", icon: "🏆" },
            { level: 50, reward: "Badge Avançado", icon: "👑" },
            { level: 100, reward: "Badge Mestre", icon: "⭐" },
          ].map((milestone) => {
            const isReached = gamification.level >= milestone.level;

            return (
              <div
                key={milestone.level}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isReached
                    ? "bg-green-50 border-green-300"
                    : "bg-slate-50 border-slate-300 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">
                      {milestone.icon} Nível {milestone.level}
                    </p>
                    <p className="text-sm text-slate-600">
                      {milestone.reward}
                    </p>
                  </div>
                  {isReached && (
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Standalone Gamification Page
export function GamificationPage({
  gamification,
  achievements,
  allAchievements,
}: GamificationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Seu Progresso na Plataforma
          </h1>
          <p className="text-slate-600">
            Acompanhe seu desenvolvimento e desbloqueie novas conquistas
          </p>
        </motion.div>

        <GamificationPanel
          gamification={gamification}
          achievements={achievements}
          allAchievements={allAchievements}
        />
      </div>
    </div>
  );
}
