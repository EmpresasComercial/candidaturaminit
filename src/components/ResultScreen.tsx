import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Download,
  Share2,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import type { Simulation, Classification } from "../types";
import {
  formatDuration,
  getClassificationColor,
  getClassificationIcon,
} from "../lib/utils";

export function ResultScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const simulation = (location.state as { simulation?: Simulation })?.simulation;

  if (!simulation) {
    navigate("/", { replace: true });
    return null;
  }

  const showDetails = true;

  const scorePercentage = simulation.score;
  const correctPercentage = (simulation.correct_answers / simulation.total_questions) * 100;
  const wrongPercentage = (simulation.wrong_answers / simulation.total_questions) * 100;
  const unansweredPercentage = (simulation.unanswered / simulation.total_questions) * 100;

  const downloadResult = () => {
    // TODO: Implement PDF generation using jsPDF
    console.log("Downloading result...");
  };

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: "Meu Resultado no MININT Simulados",
        text: `Consegui ${simulation.score}% (${simulation.correct_answers}/${simulation.total_questions}) no simulado de ${simulation.finished_at}!`,
      });
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={item} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simulado Concluído!
          </h1>
          <p className="text-lg text-slate-300">
            Resultados da sua prova
          </p>
        </motion.div>

        {/* Main Score Card */}
        <motion.div
          variants={item}
          className="bg-white border border-slate-200 p-8 md:p-12 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
            {/* Score Circle */}
            <div className="flex justify-center">
              <div className="relative w-48 h-48 md:w-56 md:h-56">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="12"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 565.48 }}
                    animate={{
                      strokeDashoffset: 565.48 - (565.48 * scorePercentage) / 100,
                    }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    strokeDasharray="565.48"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <p className="text-5xl md:text-6xl font-bold text-slate-900">
                      {scorePercentage}%
                    </p>
                    <p className="text-sm text-slate-500 text-center mt-2">
                      Nota: {(scorePercentage / 10).toFixed(1)}
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Classification and Stats */}
            <div className="space-y-6">
              {/* Classification Badge */}
              <motion.div
                variants={item}
                className={`${getClassificationColor(simulation.classification)} text-white p-6 text-center`}
              >
                <p className="text-5xl mb-2">
                  {getClassificationIcon(simulation.classification)}
                </p>
                <p className="text-2xl font-bold">{simulation.classification}</p>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                variants={item}
                className="grid grid-cols-3 gap-4"
              >
                {[
                  {
                    label: "Acertos",
                    value: simulation.correct_answers,
                    icon: "✓",
                    color: "text-green-600",
                  },
                  {
                    label: "Erros",
                    value: simulation.wrong_answers,
                    icon: "✕",
                    color: "text-red-600",
                  },
                  {
                    label: "Não respondidas",
                    value: simulation.unanswered,
                    icon: "-",
                    color: "text-slate-600",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-slate-50 p-4 text-center"
                  >
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-600 mt-2">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Detailed Stats */}
          {showDetails && (
            <motion.div
              variants={item}
              className="border-t pt-8 mt-8"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6">
                Detalhes da Prova
              </h3>

              {/* Chart */}
              <div className="mb-6">
                <div className="flex items-end gap-1 h-24 bg-slate-50 p-4">
                  {[
                    {
                      label: "Acertos",
                      percentage: correctPercentage,
                      color: "bg-green-500",
                    },
                    {
                      label: "Erros",
                      percentage: wrongPercentage,
                      color: "bg-red-500",
                    },
                    {
                      label: "Não respondidas",
                      percentage: unansweredPercentage,
                      color: "bg-slate-400",
                    },
                  ].map((bar) => (
                    <div key={bar.label} className="flex-1 flex flex-col items-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${bar.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className={`w-full ${bar.color} mb-2`}
                      />
                      <p className="text-xs text-slate-600 text-center">
                        {Math.round(bar.percentage)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Stats */}
              <motion.div
                variants={item}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[
                  {
                    label: "Tempo Total",
                    value: formatDuration(simulation.time_spent_seconds),
                    icon: Zap,
                  },
                  {
                    label: "Tempo Médio/Questão",
                    value: `${Math.round(simulation.time_spent_seconds / simulation.total_questions)}s`,
                    icon: TrendingUp,
                  },
                  {
                    label: "Total de Questões",
                    value: simulation.total_questions,
                    icon: Trophy,
                  },
                  {
                    label: "Taxa de Acertos",
                    value: `${correctPercentage.toFixed(1)}%`,
                    icon: TrendingUp,
                  },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-slate-50 p-4">
                      <Icon className="w-5 h-5 text-blue-600 mb-2" />
                      <p className="text-sm text-slate-600">{stat.label}</p>
                      <p className="text-lg font-bold text-slate-900 mt-1">
                        {stat.value}
                      </p>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={item}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <button
            onClick={downloadResult}
            className="flex items-center justify-center gap-2 bg-yellow-400 text-slate-950 py-3 px-4 font-bold hover:bg-yellow-500 transition-colors"
          >
            <Download className="w-5 h-5" />
            Baixar Resultado
          </button>

          <button
            onClick={shareResult}
            className="flex items-center justify-center gap-2 bg-slate-600 text-white py-3 px-4 font-bold hover:bg-slate-700 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Compartilhar
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 bg-yellow-400 text-slate-950 py-3 px-4 font-bold hover:bg-yellow-500 transition-all"
          >
            Voltar para Início
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Footer Tips */}
        <motion.div
          variants={item}
          className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg"
        >
          <h4 className="font-bold text-blue-900 mb-2">💡 Dicas para Melhorar</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Estude os tópicos onde teve mais erros
            </li>
            <li>
              • Procure melhorar seu tempo de resposta
            </li>
            <li>
              • Faça simulados regularmente para acompanhar seu progresso
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
