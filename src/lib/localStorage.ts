/**
 * Sistema de armazenamento local (localStorage) para a plataforma MININT Simulados
 * Todos os dados são salvos localmente no navegador.
 */

import type { User, Category, Question, Simulation, History, UserStatistics, UserGameification, SimulationAnswer } from "../types";

const STORAGE_KEYS = {
  USER: "minint_user",
  CATEGORIES: "minint_categories",
  QUESTIONS: "minint_questions",
  SIMULATIONS: "minint_simulations",
  HISTORY: "minint_history",
  STATISTICS: "minint_statistics",
  GAMIFICATION: "minint_gamification",
  ANSWERS: "minint_answers",
  RANKING: "minint_ranking",
} as const;

const now = () => new Date().toISOString();

const normalizeQuestion = (question: Partial<Question> & Record<string, any>): Question => ({
  id: question.id || `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  category_id: question.category_id ?? question.categoryId ?? "",
  question_text: question.question_text ?? question.questionText ?? "",
  correct_answer:
    typeof question.correct_answer === "boolean"
      ? question.correct_answer
        ? "Verdadeiro"
        : "Falso"
      : question.correct_answer ?? question.correctAnswer ?? "",
  options:
    question.options ??
    (typeof question.correct_answer === "boolean"
      ? ["Verdadeiro", "Falso"]
      : question.options ?? ["Verdadeiro", "Falso"]),
  explanation: question.explanation ?? "",
  difficulty_level: question.difficulty_level ?? question.difficultyLevel ?? "médio",
  created_at: question.created_at ?? question.createdAt ?? now(),
  updated_at: question.updated_at ?? question.updatedAt ?? now(),
});

const normalizeCategory = (category: Partial<Category> & Record<string, any>): Category => ({
  id: category.id || `cat_${Date.now()}`,
  name: category.name || "Conhecimentos Gerais",
  description: category.description || "Categoria local",
  icon: category.icon || "📝",
  created_at: category.created_at || now(),
});

// ============ USER MANAGEMENT ============

export const userStorage = {
  getUser: (): User | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (!data) return null;
      const parsed = JSON.parse(data) as Partial<User> & Record<string, any>;
      return {
        id: parsed.id || "",
        email: parsed.email || "",
        full_name: parsed.full_name || parsed.fullName || parsed.email?.split("@")[0] || "Usuário",
        avatar_url: parsed.avatar_url,
        created_at: parsed.created_at || now(),
        updated_at: parsed.updated_at || now(),
      };
    } catch {
      return null;
    }
  },

  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ ...user, full_name: user.full_name || user.email?.split("@")[0] || "Usuário" }));
  },

  signUp: (email: string, _password: string, fullName: string): User => {
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      email,
      full_name: fullName,
      created_at: now(),
      updated_at: now(),
    };
    userStorage.setUser(user);
    return user;
  },

  signIn: (email: string, password: string): User | null => {
    const existingUser = userStorage.getUser();
    if (existingUser && existingUser.email === email) {
      return existingUser;
    }

    const nextUser = userStorage.signUp(email, password, email.split("@")[0]);
    return nextUser;
  },

  signOut: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
};

// ============ CATEGORIES ============

export const categoryStorage = {
  getAll: (): Category[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!data) return categoryStorage.getDefaults();
      const parsed = JSON.parse(data) as Array<Partial<Category> & Record<string, any>>;
      return parsed.map(normalizeCategory);
    } catch {
      return categoryStorage.getDefaults();
    }
  },

  getDefaults: (): Category[] => [
    {
      id: "cat_1",
      name: "Polícia Nacional",
      description: "Questões do ramo policial e legislação",
      icon: "🚓",
      created_at: now(),
    },
    {
      id: "cat_2",
      name: "Bombeiros",
      description: "Questões de segurança e prevenção de incêndios",
      icon: "🚒",
      created_at: now(),
    },
    {
      id: "cat_3",
      name: "Serviços Penitenciários",
      description: "Questões sobre gestão prisional e segurança",
      icon: "🛡️",
      created_at: now(),
    },
    {
      id: "cat_4",
      name: "Serviço de Investigação Criminal",
      description: "Questões de investigação e inteligência policial",
      icon: "🔎",
      created_at: now(),
    },
    {
      id: "cat_5",
      name: "Cultura Geral",
      description: "Conteúdos gerais sobre Angola e atualidades",
      icon: "🌍",
      created_at: now(),
    },
  ],

  save: (categories: Category[]) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories.map(normalizeCategory)));
  },

  getById: (id: string): Category | undefined => {
    return categoryStorage.getAll().find((c) => c.id === id);
  },
};

// ============ QUESTIONS ============

export const questionStorage = {
  getAll: (): Question[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (!data) return [];
      const parsed = JSON.parse(data) as Array<Partial<Question> & Record<string, any>>;
      return parsed.map(normalizeQuestion);
    } catch {
      return [];
    }
  },

  getByCategory: (categoryId: string): Question[] => {
    return questionStorage.getAll().filter((q) => q.category_id === categoryId);
  },

  add: (question: Question) => {
    const questions = questionStorage.getAll();
    questions.push(normalizeQuestion(question));
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  },

  update: (id: string, question: Partial<Question>) => {
    const questions = questionStorage.getAll();
    const index = questions.findIndex((q) => q.id === id);
    if (index !== -1) {
      questions[index] = normalizeQuestion({
        ...questions[index],
        ...question,
        id,
        updated_at: now(),
      });
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    }
  },

  delete: (id: string) => {
    const questions = questionStorage.getAll().filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  },

  addMultiple: (questions: Question[]) => {
    const existing = questionStorage.getAll();
    const all = [...existing, ...questions.map(normalizeQuestion)];
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(all));
  },

  getRandomByCategory: (categoryId: string, count: number): Question[] => {
    const questions = questionStorage.getByCategory(categoryId);
    if (questions.length <= count) return questions;

    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  },
};

// ============ SIMULATIONS ============

export const simulationStorage = {
  getAll: (): Simulation[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SIMULATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getByUser: (userId: string): Simulation[] => {
    return simulationStorage.getAll().filter((s) => s.user_id === userId);
  },

  add: (simulation: Simulation) => {
    const simulations = simulationStorage.getAll();
    simulations.push(simulation);
    localStorage.setItem(STORAGE_KEYS.SIMULATIONS, JSON.stringify(simulations));
  },

  update: (id: string, simulation: Partial<Simulation>) => {
    const simulations = simulationStorage.getAll();
    const index = simulations.findIndex((s) => s.id === id);
    if (index !== -1) {
      simulations[index] = { ...simulations[index], ...simulation };
      localStorage.setItem(STORAGE_KEYS.SIMULATIONS, JSON.stringify(simulations));
    }
  },
};

// ============ HISTORY ============

export const historyStorage = {
  getAll: (): History[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getByUser: (userId: string): History[] => {
    return historyStorage.getAll().filter((h) => h.user_id === userId);
  },

  add: (history: History) => {
    const items = historyStorage.getAll();
    items.push(history);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(items));
  },
};

// ============ STATISTICS ============

export const statisticsStorage = {
  getByUser: (userId: string): UserStatistics | null => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.STATISTICS}_${userId}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  save: (userId: string, stats: UserStatistics) => {
    localStorage.setItem(`${STORAGE_KEYS.STATISTICS}_${userId}`, JSON.stringify(stats));
  },

  update: (userId: string, stats: Partial<UserStatistics>) => {
    const existing = statisticsStorage.getByUser(userId);
    const updated = { ...(existing || {}), ...stats } as UserStatistics;
    statisticsStorage.save(userId, updated);
  },
};

// ============ GAMIFICATION ============

export const gamificationStorage = {
  getByUser: (userId: string): UserGameification | null => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.GAMIFICATION}_${userId}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  save: (userId: string, gamification: UserGameification) => {
    localStorage.setItem(`${STORAGE_KEYS.GAMIFICATION}_${userId}`, JSON.stringify(gamification));
  },

  update: (userId: string, gamification: Partial<UserGameification>) => {
    const existing = gamificationStorage.getByUser(userId);
    const updated = { ...(existing || {}), ...gamification } as UserGameification;
    gamificationStorage.save(userId, updated);
  },
};

// ============ RANKING ============

export const rankingStorage = {
  getAll: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RANKING);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  update: (userId: string, stats: any) => {
    const ranking = rankingStorage.getAll();
    const index = ranking.findIndex((r: any) => r.userId === userId || r.user_id === userId);

    const entry = {
      userId,
      user_id: userId,
      userName: stats.userName || stats.user_name || "Usuário",
      user_name: stats.user_name || stats.userName || "Usuário",
      userEmail: stats.userEmail || stats.user_email || "",
      user_email: stats.user_email || stats.userEmail || "",
      totalScore: stats.totalScore ?? stats.total_score ?? 0,
      total_score: stats.total_score ?? stats.totalScore ?? 0,
      averageScore: stats.averageScore ?? stats.average_score ?? 0,
      average_score: stats.average_score ?? stats.averageScore ?? 0,
      totalSimulations: stats.totalSimulations ?? stats.total_simulations ?? 0,
      total_simulations: stats.total_simulations ?? stats.totalSimulations ?? 0,
      totalCorrectAnswers: stats.totalCorrectAnswers ?? stats.total_correct_answers ?? 0,
      total_correct_answers: stats.total_correct_answers ?? stats.totalCorrectAnswers ?? 0,
      totalTimeSeconds: stats.totalTimeSeconds ?? stats.total_time_seconds ?? 0,
      total_time_seconds: stats.total_time_seconds ?? stats.totalTimeSeconds ?? 0,
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (index !== -1) {
      ranking[index] = entry;
    } else {
      ranking.push(entry);
    }

    localStorage.setItem(STORAGE_KEYS.RANKING, JSON.stringify(ranking));
  },

  getTopUsers: (limit: number = 10) => {
    return rankingStorage.getAll()
      .sort((a: any, b: any) => (b.totalScore ?? b.total_score ?? 0) - (a.totalScore ?? a.total_score ?? 0))
      .slice(0, limit);
  },

  getUserPosition: (userId: string) => {
    const ranking = rankingStorage.getAll()
      .sort((a: any, b: any) => (b.totalScore ?? b.total_score ?? 0) - (a.totalScore ?? a.total_score ?? 0));
    return ranking.findIndex((r: any) => r.userId === userId || r.user_id === userId) + 1;
  },
};

// ============ ANSWERS ============

export const answersStorage = {
  getBySimulation: (simulationId: string): SimulationAnswer[] => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.ANSWERS}_${simulationId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  add: (simulationId: string, answer: SimulationAnswer) => {
    const answers = answersStorage.getBySimulation(simulationId);
    answers.push(answer);
    localStorage.setItem(`${STORAGE_KEYS.ANSWERS}_${simulationId}`, JSON.stringify(answers));
  },

  save: (simulationId: string, answers: SimulationAnswer[]) => {
    localStorage.setItem(`${STORAGE_KEYS.ANSWERS}_${simulationId}`, JSON.stringify(answers));
  },
};

// ============ INITIALIZATION ============

export const initializeLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    categoryStorage.save(categoryStorage.getDefaults());
  }

  const storedQuestions = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
  const shouldSeedQuestions = (() => {
    if (!storedQuestions) return true;
    try {
      const parsed = JSON.parse(storedQuestions);
      return !Array.isArray(parsed) || parsed.length < 15;
    } catch {
      return true;
    }
  })();

  if (shouldSeedQuestions) {
    const sampleQuestions: Question[] = [
      {
        id: "q_1",
        category_id: "cat_1",
        question_text: "Qual é a capital de Angola?",
        correct_answer: "Luanda",
        options: ["Luanda", "Benguela", "Huambo", "Cabinda"],
        explanation: "Luanda é a capital de Angola desde a independência.",
        difficulty_level: "fácil",
        created_at: now(),
        updated_at: now(),
      },
      {
        id: "q_2",
        category_id: "cat_1",
        question_text: "Em que ano Angola conquistou sua independência?",
        correct_answer: "1975",
        options: ["1975", "1985", "1986", "1987"],
        explanation: "Angola tornou-se independente em 11 de novembro de 1975.",
        difficulty_level: "fácil",
        created_at: now(),
        updated_at: now(),
      },
      {
        id: "q_3",
        category_id: "cat_4",
        question_text: "Qual serviço é responsável por investigações criminais?",
        correct_answer: "Serviço de Investigação Criminal",
        options: [
          "Polícia Nacional",
          "Bombeiros",
          "Serviço de Investigação Criminal",
          "Serviços Penitenciários",
        ],
        explanation: "O Serviço de Investigação Criminal é o órgão responsável por investigações criminais.",
        difficulty_level: "médio",
        created_at: now(),
        updated_at: now(),
      },
      {
        id: "q_4",
        category_id: "cat_2",
        question_text: "Qual é a função principal da Polícia Nacional?",
        correct_answer: "Garantir a ordem pública e a segurança dos cidadãos",
        options: [
          "Combater incêndios",
          "Administrar prisões",
          "Garantir a ordem pública e a segurança dos cidadãos",
          "Realizar auditorias financeiras",
        ],
        explanation: "A Polícia Nacional é responsável pela ordem pública e segurança em Angola.",
        difficulty_level: "fácil",
        created_at: now(),
        updated_at: now(),
      },
      {
        id: "q_5",
        category_id: "cat_3",
        question_text: "O que é missão de proteção de provas?",
        correct_answer: "Coletar e preservar evidências para investigação criminal",
        options: [
          "Organizar campanhas educativas",
          "Coletar e preservar evidências para investigação criminal",
          "Emitir documentos de viagem",
          "Realizar perícias médicas",
        ],
        explanation: "A proteção de provas envolve coletar e preservar evidências para investigação criminal.",
        difficulty_level: "médio",
        created_at: now(),
        updated_at: now(),
      },
      {
        id: "q_6",
        category_id: "cat_2",
        question_text: "Qual é o principal objetivo do serviço de imigração?",
        correct_answer: "Controlar entradas e saídas de estrangeiros no país",
        options: [
          "Emitir cartas de condução",
          "Controlar entradas e saídas de estrangeiros no país",
          "Fiscalizar empresas",
          "Prestar serviços de saúde",
        ],
        explanation: "O serviço de imigração controla o movimento de estrangeiros e documentos de entrada.",
        difficulty_level: "médio",
        created_at: now(),
        updated_at: now(),
      },
      {
        id: "q_7",
        category_id: "cat_4",
        question_text: "Qual órgão atua no combate a incêndios?",
        correct_answer: "Bombeiros",
        options: ["Polícia Nacional", "Bombeiros", "Serviço de Investigação Criminal", "Serviços Penitenciários"],
        explanation: "Os Bombeiros são responsáveis pelo combate a incêndios e salvamento.",
        difficulty_level: "fácil",
        created_at: now(),
        updated_at: now(),
      },
      {
        id: "q_8",
        category_id: "cat_1",
        question_text: "Qual é a língua oficial de Angola?",
        correct_answer: "Português",
        options: ["Inglês", "Francês", "Português", "Espanhol"],
        explanation: "O português é a língua oficial de Angola.",
        difficulty_level: "fácil",
        created_at: now(),
        updated_at: now(),
      },
      {
        id: "q_9",
        category_id: "cat_3",
        question_text: "O que representa o Minint?",
        correct_answer: "Ministério do Interior",
        options: ["Ministério da Justiça", "Ministério da Defesa", "Ministério do Interior", "Ministério das Finanças"],
        explanation: "Minint é a sigla do Ministério do Interior.",
        difficulty_level: "fácil",
        created_at: now(),
        updated_at: now(),
      },
      {
        id: "q_10",
        category_id: "cat_2",
        question_text: "Qual é uma atribuição dos serviços penitenciários?",
        correct_answer: "Gerir estabelecimentos prisionais",
        options: [
          "Emitir passaportes",
          "Gerir estabelecimentos prisionais",
          "Fiscalizar imigração",
          "Investigar crimes económicos",
        ],
        explanation: "Os serviços penitenciários gerem estabelecimentos prisionais.",
        difficulty_level: "médio",
        created_at: now(),
        updated_at: now(),
      },
      {
        id: "q_11",
        category_id: "cat_4",
        question_text: "Qual é a principal missão de uma força pública?",
        correct_answer: "Proteger pessoas e bens",
        options: ["Organizar defesa civil", "Proteger pessoas e bens", "Fiscalizar tráfego", "Gerir fronteiras"],
        explanation: "A força pública tem como missão proteger pessoas e bens.",
        difficulty_level: "médio",
        created_at: now(),
        updated_at: now(),
      },
      {
        id: "q_12",
        category_id: "cat_1",
        question_text: "Qual é o principal símbolo de soberania nacional?",
        correct_answer: "Bandeira nacional",
        options: ["Escudo", "Hino", "Bandeira nacional", "Monarquia"],
        explanation: "A bandeira nacional representa a soberania do país.",
        difficulty_level: "fácil",
        created_at: now(),
        updated_at: now(),
      },
      {
        id: "q_13",
        category_id: "cat_3",
        question_text: "O que significa garantir segurança pública?",
        correct_answer: "Preservar a ordem e proteger cidadãos",
        options: [
          "Emitir documentos oficiais",
          "Preservar a ordem e proteger cidadãos",
          "Cobrar taxas de trânsito",
          "Organizar eventos culturais",
        ],
        explanation: "Segurança pública envolve preservar a ordem e proteger cidadãos.",
        difficulty_level: "médio",
        created_at: now(),
        updated_at: now(),
      },
      {
        id: "q_14",
        category_id: "cat_2",
        question_text: "Qual documento permite viajar para outro país?",
        correct_answer: "Passaporte",
        options: ["Bilhete de identidade", "Passaporte", "Carta de condução", "Certidão de nascimento"],
        explanation: "O passaporte é o documento de viagem internacional.",
        difficulty_level: "fácil",
        created_at: now(),
        updated_at: now(),
      },
      {
        id: "q_15",
        category_id: "cat_4",
        question_text: "O que significa estado de emergência?",
        correct_answer: "Medidas especiais para proteger a população em crise",
        options: [
          "Férias coletivas",
          "Medidas especiais para proteger a população em crise",
          "Redução de impostos",
          "Realização de eleições"],
        explanation: "Estado de emergência significa adotar medidas especiais para proteger a população.",
        difficulty_level: "médio",
        created_at: now(),
        updated_at: now(),
      },
    ];
    questionStorage.addMultiple(sampleQuestions);
  }
};
