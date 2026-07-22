import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { Question } from "../types";
import { preventBackButton } from "../lib/utils";

interface QuestionComponentProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
}

export function QuestionComponent({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  isAnswered,
}: QuestionComponentProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    preventBackButton();
  }, []);

  useEffect(() => {
    setSelectedAnswer(null);
  }, [question.id]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (isAnswered) return;
      setSelectedAnswer(answer);
      onAnswer(answer);
    },
    [isAnswered, onAnswer]
  );

  return (
    <div className="bg-white p-4 md:p-6 flex flex-col">
      <div className="mb-6">
        <p className="text-sm text-slate-600 max-w-2xl">
          Leia atentamente a pergunta e marque a resposta correta.
        </p>
      </div>

      {/* Question Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 bg-amber-50 border border-amber-200 p-6 mb-8 flex flex-col shadow-sm"
      >
        <div className="mb-6">
          <p className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug">
            {question.question_text}
          </p>
          <span className="mt-4 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900">
            Dificuldade: {question.difficulty_level.charAt(0).toUpperCase() + question.difficulty_level.slice(1)}
          </span>
        </div>

        {/* Answer Options */}
        <div className="grid gap-4 md:gap-5">
          {(question.options && question.options.length > 0 ? question.options : ["Verdadeiro", "Falso"]).map((option) => {
            const isSelected = selectedAnswer === option;

            return (
              <motion.button
                key={option}
                whileHover={{ scale: isAnswered ? 1 : 1.01 }}
                whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={`w-full rounded-3xl border px-4 py-4 text-left text-base font-semibold transition-all ${
                  isAnswered
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:shadow-lg"
                } ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-slate-900"
                    : "border-slate-200 bg-white text-slate-900 hover:border-blue-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300 bg-white"}`}>
                    {isSelected ? <div className="h-2.5 w-2.5 rounded-full bg-white" /> : null}
                  </div>
                  <span>{option}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        </motion.div>

      {/* Footer */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-slate-600 font-medium">
          {isAnswered ? "✓ Respondida" : "Aguardando resposta..."}
        </div>
      </div>

    </div>
  );
}
