import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAllQuestions } from "../lib/hooks";
import { useAuthStore } from "../lib/store";
import { QuestionComponent } from "./QuestionComponent";
import type { Question } from "../types";

export function QuizPage() {
  const navigate = useNavigate();
  const { data: questions = [], isLoading } = useAllQuestions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);
  const [answers, setAnswers] = useState<Array<{ questionId: string; correct: boolean }>>([]);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showReloadWarning, setShowReloadWarning] = useState(false);
  const [quizAborted, setQuizAborted] = useState(false);

  const { user } = useAuthStore();

  useEffect(() => {
    const navigationEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const wasReload = navigationEntries.length > 0
      ? navigationEntries.some((entry) => entry.type === "reload")
      : (performance as Performance & { navigation?: { type: number } }).navigation?.type === 1;

    const isActive = Boolean(sessionStorage.getItem("quiz_active"));
    const hasWarned = Boolean(sessionStorage.getItem("quiz_reloaded_once"));
    let timeoutId: number | undefined;

    if (wasReload && isActive) {
      if (hasWarned) {
        sessionStorage.removeItem("quiz_active");
        sessionStorage.removeItem("quiz_reloaded_once");
        setQuizAborted(true);
        return;
      }

      sessionStorage.setItem("quiz_reloaded_once", "true");
      setShowReloadWarning(true);
      timeoutId = window.setTimeout(() => setShowReloadWarning(false), 5000);
    }

    setCurrentIndex(0);
    setAnswers([]);
    setFeedback(null);
    setFeedbackType(null);
    setIsAnswered(false);
    sessionStorage.setItem("quiz_active", "true");

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      sessionStorage.removeItem("quiz_active");
      sessionStorage.removeItem("quiz_reloaded_once");
    };
  }, [navigate]);

  useEffect(() => {
    if (questions.length === 0) {
      setSessionQuestions([]);
      return;
    }

    if (questions.length < 15) {
      setSessionQuestions([]);
      setFeedback("Precisa haver pelo menos 15 questões para iniciar o simulado.");
      setFeedbackType("error");
      setIsAnswered(false);
      return;
    }

    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setSessionQuestions(shuffled.slice(0, 15));
    setCurrentIndex(0);
    setAnswers([]);
    setFeedback(null);
    setFeedbackType(null);
    setIsAnswered(false);
  }, [questions]);

  const totalQuestions = sessionQuestions.length;
  const currentQuestion = sessionQuestions[currentIndex];

  const handleTimeExpired = () => {
    if (!currentQuestion) return;

    const updatedCorrectCount = answers.filter((item) => item.correct).length;
    const updatedWrongCount = answers.filter((item) => !item.correct).length + 1;
    const updatedTotalTime = totalTimeSpent + 30;

    setIsAnswered(true);
    setFeedback("Tempo expirado. Próxima pergunta.");
    setFeedbackType("error");
    setAnswers((prev) => [...prev, { questionId: currentQuestion.id, correct: false }]);
    setTotalTimeSpent(updatedTotalTime);

    setTimeout(() => {
      setFeedback(null);
      setFeedbackType(null);
      setIsAnswered(false);
      if (currentIndex + 1 >= totalQuestions) {
        sessionStorage.removeItem("quiz_active");
        navigate("/resultado", {
          state: {
            simulation: {
              id: `sim_${Date.now()}`,
              user_id: "local_user",
              category_id: "geral",
              total_questions: totalQuestions,
              correct_answers: updatedCorrectCount,
              wrong_answers: updatedWrongCount,
              unanswered: 0,
              score: Math.round((updatedCorrectCount / totalQuestions) * 100),
              time_spent_seconds: updatedTotalTime,
              started_at: new Date().toISOString(),
              finished_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              classification: "Regular",
            },
          },
        });
        return;
      }
      setCurrentIndex((prev) => prev + 1);
    }, 1400);
  };

  useEffect(() => {
    setTimeLeft(30);
  }, [currentQuestion]);

  useEffect(() => {
    if (!currentQuestion || isAnswered || quizAborted) return;

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [currentQuestion, isAnswered, quizAborted, handleTimeExpired]);

  const handleAnswer = (answer: string) => {
    if (!currentQuestion || isAnswered) return;

    const timeSpent = 30 - timeLeft;
    const correctAnswer = typeof currentQuestion.correct_answer === "boolean"
      ? currentQuestion.correct_answer
        ? "Verdadeiro"
        : "Falso"
      : currentQuestion.correct_answer;
    const correct = answer === correctAnswer;
    const updatedCorrectCount = answers.filter((item) => item.correct).length + (correct ? 1 : 0);
    const updatedWrongCount = answers.filter((item) => !item.correct).length + (correct ? 0 : 1);

    setIsAnswered(true);
    setAnswers((prev) => [...prev, { questionId: currentQuestion.id, correct }]);
    setTotalTimeSpent((prev) => prev + timeSpent);
    setFeedback(correct ? "Parabéns, resposta certa!" : "Resposta errada, vamos para a próxima.");
    setFeedbackType(correct ? "success" : "error");

    const finalTime = totalTimeSpent + timeSpent;

    setTimeout(() => {
      setFeedback(null);
      setFeedbackType(null);
      setIsAnswered(false);

      if (currentIndex + 1 >= totalQuestions) {
        sessionStorage.removeItem("quiz_active");
        navigate("/resultado", {
          state: {
            simulation: {
              id: `sim_${Date.now()}`,
              user_id: "local_user",
              category_id: "geral",
              total_questions: totalQuestions,
              correct_answers: updatedCorrectCount,
              wrong_answers: updatedWrongCount,
              unanswered: 0,
              score: Math.round((updatedCorrectCount / totalQuestions) * 100),
              time_spent_seconds: finalTime,
              started_at: new Date().toISOString(),
              finished_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              classification: correct ? "Bom" : "Regular",
            },
          },
        });
        return;
      }

      setCurrentIndex((prev) => prev + 1);
    }, 1400);
  };

  if (!currentQuestion) {
    const noQuestions = questions.length === 0;
    const messageTitle = noQuestions ? "Nenhuma pergunta disponível" : "Simulado não disponível";
    const messageBody = noQuestions
      ? "Não há questões carregadas no momento. Por favor, adicione perguntas ou tente novamente mais tarde."
      : "São necessárias ao menos 15 questões para iniciar o simulado. Atualize ou adicione mais perguntas e tente novamente.";

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">{messageTitle}</h2>
        <p className="text-slate-600 mb-2">{messageBody}</p>
        {questions.length > 0 && (
          <p className="text-sm text-slate-500 mb-6">Questões atuais: {questions.length}</p>
        )}
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-yellow-400 text-slate-950 font-semibold hover:bg-yellow-500 transition"
        >
          Voltar para início
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate("/")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/90 text-slate-700 shadow-sm transition hover:bg-slate-100"
              aria-label="Voltar para o início"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-600 font-semibold">
                Prova Geral
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                Questão {currentIndex + 1} de {totalQuestions}
              </h1>
            </div>
          </div>

          <div className="absolute right-0 top-0 text-right">
            <div>
              <p className="text-3xl font-bold font-mono text-blue-600">
                {String(timeLeft).padStart(2, "0")}
              </p>
              <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
                tempo restante
              </p>
            </div>
          </div>
        </div>

        {showReloadWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 rounded-2xl bg-amber-100 border border-amber-200 px-5 py-4 text-center text-amber-900 shadow-sm"
          >
            Detectamos que você recarregou a página. Se isso acontecer novamente, a prova será anulada.
          </motion.div>
        )}

        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 border px-5 py-4 text-center font-semibold ${
              feedbackType === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {feedback}
          </motion.div>
        )}

        <QuestionComponent
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={totalQuestions}
          onAnswer={handleAnswer}
          isAnswered={isAnswered}
        />
      </div>
    </div>
  );
}
