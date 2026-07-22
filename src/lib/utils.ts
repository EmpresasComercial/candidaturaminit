import type { Question, Classification } from "../types";

/**
 * Fisher-Yates Shuffle Algorithm
 * Embaralha um array de forma aleatória e uniforme
 */
export function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Embaralha um array, garantindo que o mesmo shuffle nunca se repita
 */
let lastShuffleHash: string | null = null;

export function shuffleQuestionsUniquely(questions: Question[]): Question[] {
  let shuffled: Question[];
  let attempts = 0;
  const maxAttempts = 10;

  do {
    shuffled = fisherYatesShuffle(questions);
    const hash = JSON.stringify(shuffled.map((q) => q.id));
    if (hash !== lastShuffleHash) {
      lastShuffleHash = hash;
      return shuffled;
    }
    attempts++;
  } while (attempts < maxAttempts);

  return shuffled;
}

/**
 * Embaralha True/False para cada questão
 */
export function shuffleTrueFalseOrder(): boolean {
  return Math.random() > 0.5;
}

/**
 * Calcula a pontuação em percentagem
 */
export function calculateScore(
  correctAnswers: number,
  totalQuestions: number
): number {
  if (totalQuestions === 0) return 0;
  return Math.round((correctAnswers / totalQuestions) * 100);
}

/**
 * Formata tempo em segundos para MM:SS
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

/**
 * Converte segundos em formato legível (e.g., "5m 30s")
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Retorna cor baseada na classificação
 */
export function getClassificationColor(classification: Classification): string {
  const colors: Record<Classification, string> = {
    Excelente: "bg-green-500",
    "Muito Bom": "bg-blue-500",
    Bom: "bg-amber-500",
    Regular: "bg-orange-500",
    Insuficiente: "bg-red-500",
  };
  return colors[classification];
}

/**
 * Retorna ícone baseado na classificação
 */
export function getClassificationIcon(classification: Classification): string {
  const icons: Record<Classification, string> = {
    Excelente: "⭐",
    "Muito Bom": "✨",
    Bom: "👍",
    Regular: "📊",
    Insuficiente: "❌",
  };
  return icons[classification];
}

/**
 * Detecta se o usuário saiu de tela cheia (anti-fraude)
 */
export function detectFullscreenExit(): boolean {
  if (typeof document === "undefined") return false;

  return !document.fullscreenElement &&
    !(document as any).webkitFullscreenElement &&
    !(document as any).mozFullScreenElement;
}

/**
 * Detecta múltiplas abas abertas
 */
export function detectMultipleTabs(): boolean {
  if (typeof window === "undefined") return false;

  // Usar sessionStorage para comunicação entre abas
  const testKey = `tab-test-${Date.now()}`;
  try {
    sessionStorage.setItem(testKey, "test");
    sessionStorage.removeItem(testKey);

    // Se há múltiplas abas, podem estar escrevendo no mesmo sessionStorage
    // Isso é um check simplificado - em produção seria mais sofisticado
    return (window.opener !== null) || window.name !== "";
  } catch {
    return false;
  }
}

/**
 * Detecta manipulação do console ou ferramentas de desenvolvedor
 */
export function detectDeveloperTools(): boolean {
  if (typeof window === "undefined") return false;

  const start = performance.now();
  // eslint-disable-next-line no-debugger
  debugger;
  const end = performance.now();

  // Se o debugger foi pausado, o tempo será muito maior
  return end - start > 100;
}

/**
 * Impede voltar à página anterior
 */
export function preventBackButton(): void {
  if (typeof window === "undefined") return;

  window.history.pushState(null, "", window.location.href);
  window.addEventListener("popstate", () => {
    window.history.pushState(null, "", window.location.href);
  });
}

/**
 * Detecta se a página foi recarregada durante a simulação
 */
export function detectPageReload(): boolean {
  if (typeof window === "undefined") return false;

  const navigationEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
  if (navigationEntries.length > 0) {
    const navTiming = navigationEntries[0];
    return navTiming.type === "reload";
  }

  // Fallback para navegadores mais antigos
  return performance.navigation.type === 1;
}

/**
 * Calcula pontos XP ganhos em uma simulação
 */
export function calculateXPGained(
  correctAnswers: number,
  totalQuestions: number,
  difficultyMultiplier: number = 1
): number {
  const baseXP = correctAnswers * 10;
  const bonusXP = correctAnswers === totalQuestions ? 50 : 0; // Bônus por acertar tudo
  return Math.round((baseXP + bonusXP) * difficultyMultiplier);
}

/**
 * Calcula nível baseado em XP
 */
export function calculateLevel(xp: number): number {
  const xpPerLevel = 1000;
  return Math.floor(xp / xpPerLevel) + 1;
}

/**
 * Calcula XP necessário para o próximo nível
 */
export function calculateXPForNextLevel(currentLevel: number): number {
  return currentLevel * 1000;
}

/**
 * Gera seed para randomização consistente (para testes)
 */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Embaralha com seed (para reproduzibilidade)
 */
export function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
