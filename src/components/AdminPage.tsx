import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Search, Download, Upload, Copy } from "lucide-react";
import { useAllQuestions, useCategories } from "../lib/hooks";
import { questionStorage } from "../lib/localStorage";
import type { Question, CategoryType } from "../types";
import Papa from "papaparse";

interface AdminPanelProps {
  isAdmin: boolean;
}

interface QuestionFormData {
  id?: string;
  category_id: string;
  question_text: string;
  correct_answer: boolean;
  explanation: string;
  difficulty_level: "fácil" | "médio" | "difícil";
}

export function AdminPage({ isAdmin }: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<QuestionFormData>({
    category_id: "",
    question_text: "",
    correct_answer: true,
    explanation: "",
    difficulty_level: "médio",
  });

  const { data: questions, isLoading } = useAllQuestions();
  const { data: categories } = useCategories();
  const queryClient = useQueryClient();

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (data: Omit<QuestionFormData, "id">) => {
      const question: Question = {
        id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        category_id: data.category_id,
        question_text: data.question_text,
        correct_answer: data.correct_answer,
        explanation: data.explanation,
        difficulty_level: data.difficulty_level,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      questionStorage.add(question);
      return question;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-questions"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: QuestionFormData) => {
      if (!data.id) throw new Error("ID is required");

      questionStorage.update(data.id, {
        category_id: data.category_id,
        question_text: data.question_text,
        correct_answer: data.correct_answer,
        explanation: data.explanation,
        difficulty_level: data.difficulty_level,
      });

      return questionStorage.getAll().find((item) => item.id === data.id) as Question;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-questions"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      questionStorage.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-questions"] });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (question: Question) => {
      const duplicate: Question = {
        ...question,
        id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      questionStorage.add(duplicate);
      return duplicate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-questions"] });
    },
  });

  const resetForm = () => {
    setFormData({
      category_id: "",
      question_text: "",
      correct_answer: true,
      explanation: "",
      difficulty_level: "médio",
    });
    setEditingQuestion(null);
    setShowForm(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.category_id || !formData.question_text) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingQuestion) {
      updateMutation.mutate({ ...formData, id: editingQuestion.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      id: question.id,
      category_id: question.category_id,
      question_text: question.question_text,
      correct_answer: question.correct_answer,
      explanation: question.explanation || "",
      difficulty_level: question.difficulty_level,
    });
    setShowForm(true);
  };

  const handleExportCSV = () => {
    if (!questions) return;

    const csvData = questions.map((q) => ({
      "ID": q.id,
      "Categoria": q.category_id,
      "Pergunta": q.question_text,
      "Resposta Correta": q.correct_answer ? "Verdadeiro" : "Falso",
      "Explicação": q.explanation || "",
      "Dificuldade": q.difficulty_level,
      "Data de Criação": q.created_at,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `questoes_${Date.now()}.csv`;
    link.click();
  };

  const handleImportCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: async (results: any) => {
        const questions = results.data
          .filter((row: any) => row.Pergunta) // Filter empty rows
          .map((row: any) => ({
            category_id: row.Categoria,
            question_text: row.Pergunta,
            correct_answer: row["Resposta Correta"] === "Verdadeiro",
            explanation: row.Explicação || "",
            difficulty_level: row.Dificuldade || "médio",
          }));

        try {
          questionStorage.addMultiple(questions);
          queryClient.invalidateQueries({ queryKey: ["all-questions"] });
          alert(`${questions.length} questões importadas com sucesso!`);
        } catch (error) {
          alert("Erro ao importar questões: " + (error as any).message);
        }
      },
    });
  };

  // Filter questions
  const filteredQuestions = questions?.filter((q) => {
    const matchesSearch = q.question_text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || q.category_id === selectedCategory;
    const matchesDifficulty =
      filterDifficulty === "all" || q.difficulty_level === filterDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-bold">
          Acesso negado. Apenas administradores podem acessar esta área.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 p-6 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Painel de Administração
          </h1>
          <p className="text-slate-600">Gerencie as questões da plataforma</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar questões..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as Categorias</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as Dificuldades</option>
              <option value="fácil">Fácil</option>
              <option value="médio">Médio</option>
              <option value="difícil">Difícil</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
            >
              <Plus className="w-5 h-5" />
              Nova Questão
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
            >
              <Download className="w-5 h-5" />
              Exportar CSV
            </button>

            <label className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold cursor-pointer">
              <Upload className="w-5 h-5" />
              Importar CSV
              <input
                type="file"
                accept=".csv"
                onChange={(e) => e.target.files?.[0] && handleImportCSV(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {editingQuestion ? "Editar Questão" : "Nova Questão"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Pergunta *
                  </label>
                  <textarea
                    value={formData.question_text}
                    onChange={(e) =>
                      setFormData({ ...formData, question_text: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite a pergunta..."
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Dificuldade
                  </label>
                  <select
                    value={formData.difficulty_level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty_level: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fácil">Fácil</option>
                    <option value="médio">Médio</option>
                    <option value="difícil">Difícil</option>
                  </select>
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Resposta Correta
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.correct_answer === true}
                        onChange={() =>
                          setFormData({ ...formData, correct_answer: true })
                        }
                      />
                      Verdadeiro
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.correct_answer === false}
                        onChange={() =>
                          setFormData({ ...formData, correct_answer: false })
                        }
                      />
                      Falso
                    </label>
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Explicação (opcional)
                  </label>
                  <textarea
                    value={formData.explanation}
                    onChange={(e) =>
                      setFormData({ ...formData, explanation: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Explique por que essa é a resposta correta..."
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 justify-end pt-6 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border rounded-lg text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {editingQuestion ? "Atualizar" : "Criar"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : filteredQuestions && filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 mb-2">
                      {question.question_text}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                        Resposta: {question.correct_answer ? "Verdadeiro" : "Falso"}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {question.difficulty_level}
                      </span>
                    </div>
                    {question.explanation && (
                      <p className="text-sm text-slate-600 mt-2">
                        <strong>Explicação:</strong> {question.explanation}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => duplicateMutation.mutate(question)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Duplicar"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(question)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        deleteMutation.mutate(question.id)
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Deletar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-slate-600">Nenhuma questão encontrada</p>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-8 bg-white rounded-lg shadow p-6 text-center">
          <p className="text-slate-600">
            Total de questões: <strong>{questions?.length || 0}</strong> | Exibindo:{" "}
            <strong>{filteredQuestions?.length || 0}</strong>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
