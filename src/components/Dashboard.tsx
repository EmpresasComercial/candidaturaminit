import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  TrendingUp,
  Calendar,
  Target,
  Clock,
  Award,
  Zap,
  Activity,
} from "lucide-react";
import type { History, UserStatistics, CategoryStatistics } from "../types";

interface DashboardProps {
  history: History[];
  statistics: UserStatistics | null;
  userName: string;
}

export function Dashboard({ history, statistics, userName }: DashboardProps) {
  // Calculate trend data (last 10 simulations)
  const trendData = useMemo(() => {
    return history
      .slice(0, 10)
      .reverse()
      .map((h, idx) => ({
        simulation: `Sim ${idx + 1}`,
        score: h.score,
        tempo: h.time_spent_seconds,
      }));
  }, [history]);

  // Category performance data
  const categoryData = useMemo(() => {
    if (!statistics?.by_category) return [];
    return statistics.by_category.map((cat: CategoryStatistics) => ({
      name: cat.category,
      acertos: cat.total_correct,
      total: cat.total_questions,
      taxa: cat.accuracy_rate,
    }));
  }, [statistics]);

  // Score distribution
  const scoreDistribution = useMemo(() => {
    if (!statistics) return { excellent: 0, good: 0, regular: 0, poor: 0 };

    return {
      excellent: history.filter((h) => h.score >= 90).length,
      good: history.filter((h) => h.score >= 70 && h.score < 90).length,
      regular: history.filter((h) => h.score >= 50 && h.score < 70).length,
      poor: history.filter((h) => h.score < 50).length,
    };
  }, [history, statistics]);

  const scoreDistributionData = [
    { name: "Excelente (90+)", value: scoreDistribution.excellent, fill: "#10b981" },
    { name: "Bom (70-89)", value: scoreDistribution.good, fill: "#3b82f6" },
    { name: "Regular (50-69)", value: scoreDistribution.regular, fill: "#f59e0b" },
    { name: "Insuficiente (<50)", value: scoreDistribution.poor, fill: "#ef4444" },
  ].filter((item) => item.value > 0);

  // Average time per simulation
  const avgTimePerSimulation = statistics
    ? Math.round(statistics.total_time_seconds / statistics.total_simulations)
    : 0;

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

  if (!statistics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="text-center py-12">
          <p className="text-lg text-slate-600">
            Sem dados ainda. Complete um simulado para ver suas estatísticas!
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={item} className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Bem-vindo, {userName}! 👋
          </h1>
          <p className="text-slate-600">
            Aqui está um resumo do seu desempenho nos simulados
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          variants={item}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              label: "Total de Provas",
              value: statistics.total_simulations,
              icon: Calendar,
              color: "blue",
            },
            {
              label: "Melhor Nota",
              value: `${statistics.best_score}%`,
              icon: Award,
              color: "green",
            },
            {
              label: "Última Nota",
              value: statistics.last_score ? `${statistics.last_score}%` : "-",
              icon: TrendingUp,
              color: "purple",
            },
            {
              label: "Média Geral",
              value: `${statistics.average_score}%`,
              icon: Target,
              color: "amber",
            },
          ].map((metric, idx) => {
            const Icon = metric.icon;
            const colorClasses: Record<string, string> = {
              blue: "bg-blue-100 text-blue-600",
              green: "bg-green-100 text-green-600",
              purple: "bg-purple-100 text-purple-600",
              amber: "bg-amber-100 text-amber-600",
            };

            return (
              <motion.div
                key={idx}
                variants={item}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className={`w-12 h-12 rounded-lg ${colorClasses[metric.color]} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-slate-600 text-sm font-medium mb-1">
                  {metric.label}
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {metric.value}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts */}
        <motion.div
          variants={item}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Trend Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              📈 Evolução das Notas (Últimos 10)
            </h3>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="simulation" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Nota (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500 text-center py-12">
                Sem dados de simulados yet
              </p>
            )}
          </div>

          {/* Score Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              📊 Distribuição de Notas
            </h3>
            {scoreDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scoreDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {scoreDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500 text-center py-12">
                Sem dados de simulados
              </p>
            )}
          </div>
        </motion.div>

        {/* Category Performance */}
        <motion.div variants={item} className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            📚 Desempenho por Categoria
          </h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="acertos" stackId="a" fill="#10b981" name="Acertos" />
                <Bar dataKey="total" stackId="a" fill="#e5e7eb" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-12">
              Sem dados de categorias
            </p>
          )}
        </motion.div>

        {/* Additional Stats */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Tempo Total Estudado",
              value: formatDurationLong(statistics.total_time_seconds),
              icon: Clock,
            },
            {
              label: "Total de Questões Respondidas",
              value: statistics.total_questions_answered,
              icon: Activity,
            },
            {
              label: "Taxa de Acertos Geral",
              value: `${statistics.accuracy_rate}%`,
              icon: Zap,
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-lg shadow p-6">
                <Icon className="w-8 h-8 text-blue-600 mb-3" />
                <p className="text-slate-600 text-sm font-medium mb-2">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}

function formatDurationLong(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}
