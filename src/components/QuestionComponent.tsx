import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Lock } from "lucide-react";
import type { Question, SimulationSession } from "../types";
import {
  preventBackButton,
  detectFullscreenExit,
  detectPageReload,
} from "../lib/utils";
import { useUIStore } from "../lib/store";

interface QuestionComponentProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string, timeSpent: number) => void;
  onTimeExpired: () => void;
  isAnswered: boolean;
}

const QUESTION_TIME = 30; // 30 seconds per question

export function QuestionComponent({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onTimeExpired,
  isAnswered,
}: QuestionComponentProps) {
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const [hasPageReloaded, setHasPageReloaded] = useState(false);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef(Date.now());
  const { setShowAntiCheatWarning } = useUIStore();

  // Detecta recarregamento de página
  useEffect(() => {
    if (detectPageReload()) {
      setHasPageReloaded(true);
      setShowAntiCheatWarning(true);
    }

    // Previne voltar
    preventBackButton();
  }, [setShowAntiCheatWarning]);

  // Reset state when a new question loads
  useEffect(() => {
    setTimeLeft(QUESTION_TIME);
    setSelectedAnswer(null);
    setIsTimeExpired(false);
    startTime.current = Date.now();

    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  }, [question.id]);

  // Timer
  useEffect(() => {
    if (isAnswered || isTimeExpired) return;

    timerInterval.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval.current!);
          setIsTimeExpired(true);
          onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
    };
  }, [isAnswered, isTimeExpired, onTimeExpired]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (isTimeExpired || isAnswered) return;

      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      setSelectedAnswer(answer);
      onAnswer(answer, timeSpent);

      // Clear timer
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    },
    [isTimeExpired, isAnswered, onAnswer]
  );

  // Detecta saída de tela cheia
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (detectFullscreenExit()) {
        setShowAntiCheatWarning(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, [setShowAntiCheatWarning]);

  const getTimerColor = () => {
    if (timeLeft > 3) return "text-blue-600";
    if (timeLeft > 1) return "text-orange-500";
    return "text-red-600";
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${remaining.toString().padStart(2, "0")}`;
  };

  const timerVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: { duration: 0.6, repeat: Infinity },
    },
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 flex flex-col">
      {/* Warning Messages */}
      <AnimatePresence>
        {hasPageReloaded && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 bg-red-100 border-l-4 border-red-500 p-4"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-bold text-red-900">Aviso: Página Recarregada</p>
                <p className="text-sm text-red-800">
                  Detectamos que você recarregou a página. Comportamentos suspeitos serão registrados.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            Questão {questionNumber} de {totalQuestions}
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">
            Prova Geral
          </span>
        </div>

        <div className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
          {question.question_text}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-4 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-slate-900 shadow-sm">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-600">
              Tempo restante
            </div>
            <motion.div
              variants={timerVariants}
              animate="animate"
              className={`text-3xl font-bold tabular-nums ${getTimerColor()}`}
            >
              {formatTime(timeLeft)}
            </motion.div>
          </div>
          <div className="text-sm text-slate-600">
            Responda rápido e mantenha o ritmo como na prova real.
          </div>
        </div>

        <div className="w-full bg-slate-200 h-2 overflow-hidden rounded-full">
          <motion.div
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 bg-white border border-slate-200 p-6 mb-8 flex flex-col justify-center"
      >
        <p className="text-xl md:text-2xl font-medium text-slate-900 mb-12 leading-relaxed">
          {question.question_text}
        </p>

        {/* Difficulty Badge */}
        <div className="mb-8 flex gap-2">
          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium">
            Dificuldade:{" "}
            {question.difficulty_level.charAt(0).toUpperCase() +
              question.difficulty_level.slice(1)}
          </span>
        </div>

        {/* Answer Options */}
        <div className="flex flex-col gap-4 md:gap-6">
          {(question.options && question.options.length > 0 ? question.options : ["Verdadeiro", "Falso"]).map((option) => {
            const isSelected = selectedAnswer === option;

            return (
              <motion.button
                key={option}
                whileHover={{ scale: isTimeExpired ? 1 : 1.01 }}
                whileTap={{ scale: isTimeExpired ? 1 : 0.98 }}
                onClick={() => handleAnswer(option)}
                disabled={isTimeExpired || isAnswered}
                className={`w-full p-4 border-2 font-bold text-base transition-all ${
                  isTimeExpired || isAnswered
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:shadow-md"
                } ${
                  isSelected
                    ? "border-yellow-500 bg-yellow-100 text-slate-950"
                    : "border-yellow-300 bg-white text-slate-950 hover:border-yellow-400"
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "border-blue-500 bg-blue-500"
                        : "border-slate-400"
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  {option}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Time Expired Message */}
        {isTimeExpired && !isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-red-100 text-red-700 text-center font-bold flex items-center justify-center gap-2"
          >
            <Lock className="w-5 h-5" />
            Tempo expirou! Resposta será marcada como não respondida.
          </motion.div>
        )}
      </motion.div>

      {/* Footer */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-slate-600 font-medium">
          {isAnswered ? "✓ Respondida" : "Aguardando resposta..."}
        </div>
        <div className="text-sm text-slate-500">O tempo foi movido para o topo.</div>
      </div>

      {/* Lock screen indicator */}
      {isTimeExpired && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/10 pointer-events-none flex items-center justify-center"
        >
          <div className="bg-white border border-slate-200 p-6 text-center">
            <Lock className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-lg font-bold text-slate-900">Tempo Expirado</p>
            <p className="text-sm text-slate-600 mt-2">
              Preparando próxima questão...
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Timer Component (can be used independently)
export function Timer({
  duration = 5,
  onComplete,
  variant = "default",
}: {
  duration?: number;
  onComplete: () => void;
  variant?: "default" | "minimal";
}) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  if (variant === "minimal") {
    return (
      <div
        className={`text-2xl font-bold font-mono ${
          timeLeft > 2 ? "text-slate-700" : "text-red-600"
        }`}
      >
        {timeLeft}s
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={`text-6xl font-bold font-mono ${
          timeLeft > 2 ? "text-blue-600" : "text-red-600"
        }`}
      >
        {String(timeLeft).padStart(2, "0")}
      </div>
      <p className="text-slate-600 text-sm mt-2">segundos restantes</p>
    </div>
  );
}
