// User Management
export interface User {
  id: string;
  email: string;
  phone?: string;
  password?: string;
  full_name: string;
  avatar_url?: string;
  active_plan?: "iniciante" | "medio" | "pro";
  created_at: string;
  updated_at: string;
}

// Categories
export type CategoryType =
  | "Língua Portuguesa"
  | "Matemática"
  | "Cultura Geral"
  | "Conhecimentos Gerais"
  | "História de Angola"
  | "Constituição"
  | "Direitos Humanos"
  | "Atualidades"
  | "Informática"
  | "Raciocínio Lógico"
  | "Polícia Nacional"
  | "Bombeiros"
  | "Serviços Penitenciários"
  | "Serviço de Investigação Criminal";

export interface Category {
  id: string;
  name: CategoryType;
  description: string;
  icon: string;
  created_at: string;
}

// Questions
export type DifficultyLevel = "fácil" | "médio" | "difícil";

export interface Question {
  id: string;
  category_id: string;
  question_text: string;
  correct_answer: string | boolean;
  options?: string[];
  explanation?: string;
  difficulty_level: DifficultyLevel;
  created_at: string;
  updated_at: string;
}

// Simulations
export interface Simulation {
  id: string;
  user_id: string;
  category_id: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  unanswered: number;
  score: number; // percentage 0-100
  time_spent_seconds: number;
  started_at: string;
  finished_at: string;
  created_at: string;
  classification: Classification;
}

export type Classification =
  | "Excelente"
  | "Muito Bom"
  | "Bom"
  | "Regular"
  | "Insuficiente";

export function getClassification(score: number): Classification {
  if (score >= 90) return "Excelente";
  if (score >= 80) return "Muito Bom";
  if (score >= 70) return "Bom";
  if (score >= 60) return "Regular";
  return "Insuficiente";
}

// Simulation Answers
export interface SimulationAnswer {
  id: string;
  simulation_id: string;
  question_id: string;
  user_answer?: boolean;
  is_correct: boolean;
  time_spent_seconds: number;
  answered_at: string;
}

// History (User's simulation history)
export interface History {
  id: string;
  user_id: string;
  simulation_id: string;
  category: CategoryType;
  score: number;
  correct_answers: number;
  total_questions: number;
  classification: Classification;
  time_spent_seconds: number;
  created_at: string;
}

export interface SubscriptionHistory {
  id: string;
  user_id: string;
  plan: "iniciante" | "medio" | "pro";
  amount: number;
  reference_code: string;
  payment_number: string;
  created_at: string;
}

// Ranking
export interface RankingEntry {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  total_score: number;
  average_score: number;
  total_simulations: number;
  total_correct_answers: number;
  total_time_seconds: number;
  updated_at: string;
}

// Statistics
export interface UserStatistics {
  id: string;
  user_id: string;
  total_simulations: number;
  best_score: number;
  last_score: number;
  average_score: number;
  total_time_seconds: number;
  total_questions_answered: number;
  accuracy_rate: number; // percentage 0-100
  by_category: CategoryStatistics[];
  updated_at: string;
}

export interface CategoryStatistics {
  category: CategoryType;
  simulations_count: number;
  average_score: number;
  best_score: number;
  total_correct: number;
  total_questions: number;
  accuracy_rate: number;
}

// Gamification
export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward_points: number;
}

export interface UserGameification {
  id: string;
  user_id: string;
  total_points: number;
  level: number;
  xp: number;
  xp_next_level: number;
  streak_days: number;
  last_activity: string;
  updated_at: string;
}

// Session State
export interface SimulationSession {
  id: string;
  user_id: string;
  category_id: string;
  questions: Question[];
  current_question_index: number;
  answers: Map<string, boolean | undefined>; // question_id -> answer
  time_spent: Map<string, number>; // question_id -> seconds spent
  started_at: Date;
  is_active: boolean;
  is_completed: boolean;
}

// Agendamento (original - kept for backwards compatibility)
export interface Agendamento {
  id: string;
  nomeCompleto: string;
  nomeCompletoPai: string;
  nomeCompletoMae: string;
  dataNascimento: string;
  dataEmissaoBilhete: string;
  dataExpiracaoBilhete: string;
  email?: string;
  provinciaNaturalidade: string;
  orgao: string;
  genero: string;
  modalidadePagamento: "multicaixa";
  comentario?: string;
  valor: number;
  dataCriacao: string;
  referenciaMulticaixa: string;
  entidadeMulticaixa: string;
  pago: boolean;
  numeroOrdem: number;
  numeroFatura?: string;
}

export const PROVINCIAS_ANGOLA = [
  "Bengo",
  "Benguela",
  "Bié",
  "Cabinda",
  "Cuando",
  "Cubango",
  "Cuanza Norte",
  "Cuanza Sul",
  "Cunene",
  "Huambo",
  "Huíla",
  "Icolo e Bengo",
  "Luanda",
  "Lunda Norte",
  "Lunda Sul",
  "Malanje",
  "Moxico",
  "Moxico Leste",
  "Namibe",
  "Uíge",
  "Zaire"
];

export const MUNICIPIOS_ANGOLA = {
  'Benguela': ['Benguela', 'Baía Farta', 'Catumbela', 'Lobito', 'Balombo', 'Bocoio', 'Caimbambo', 'Chongoroi', 'Ganda', 'Cubal'],
  'Huambo': ['Huambo', 'Caála', 'Eculica', 'Londuimbali', 'Longonjo', 'Mungo', 'Chicala-Choloanga', 'Chinjenje', 'Ucuma', 'Bailundo'],
  'Huila': ['Lubango', 'Caconda', 'Caluquembe', 'Chibia', 'Chicomba', 'Chipindo', 'Cuvango', 'Humpata', 'Jamba', 'Matala', 'Quilengues', 'Quipungo'],
  'Cabinda': ['Cabinda', 'Cacongo', 'Buco-Zau', 'Belize'],
  'Malanje': ['Malanje', 'Cacuso', 'Calandula', 'Cambundi-Catembo', 'Cangandala', 'Kunda-dia-Baze', 'Luquembo', 'Mucari', 'Quela'],
  'Uige': ['Uíge', 'Negage', 'Sanza Pombo', 'Maquela do Zombo', 'Damba', 'Bembe', 'Mucaba', 'Songo'],
};
