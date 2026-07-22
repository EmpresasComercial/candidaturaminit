import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAllQuestions } from "../lib/hooks";
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

  const categoryName = "Prova Aleatória";

  useEffect(() => {
    const wasReload = performance.getEntriesByType("navigation").some((entry) => entry.type === "reload");
    if (wasReload && sessionStorage.getItem("quiz_active")) {
      sessionStorage.removeItem("quiz_active");
      alert("Prova anulada por recarregar a página.");
      navigate("/", { replace: true });
      return;
    }

    setCurrentIndex(0);
    setAnswers([]);
    setFeedback(null);
    setFeedbackType(null);
    setIsAnswered(false);
    sessionStorage.setItem("quiz_active", "true");

    return () => {
      sessionStorage.removeItem("quiz_active");
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

  const handleAnswer = (answer: string, timeSpent: number) => {
    if (!currentQuestion || isAnswered) return;

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

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
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-600 font-semibold mb-2">
              Prova Geral
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
              Questão {currentIndex + 1} de {totalQuestions}
            </h1>
          </div>

          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 shadow transition hover:bg-slate-200"
          >
            Voltar ao início
          </button>
        </div>

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
          onTimeExpired={handleTimeExpired}
          isAnswered={isAnswered}
        />
      </div>
    </div>
  );
}
