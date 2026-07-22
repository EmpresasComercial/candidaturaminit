# MININT Simulados - Plataforma de Provas Simuladas Online

[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-purple)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-blue)](https://tailwindcss.com)
[![Armazenamento local](https://img.shields.io/badge/Armazenamento local-PostgreSQL-green)](https://Armazenamento local.com)

Uma plataforma moderna e profissional de simulados para o Concurso PÃºblico do MinistÃ©rio do Interior (MININT) de Angola, com simulaÃ§Ãµes em tempo real, anÃ¡lise detalhada de desempenho, ranking dinÃ¢mico e sistema de gamificaÃ§Ã£o.

## ðŸŽ¯ CaracterÃ­sticas Principais

### Sistema de Simulados
- âœ… **QuestÃµes AleatÃ³rias**: Cada simulado oferece uma sequÃªncia Ãºnica de questÃµes
- âœ… **CronÃ´metro Rigoroso**: 5 segundos por questÃ£o, sem pausas
- âœ… **CorrecciÃ³n AutomÃ¡tica**: Resultados instantÃ¢neos apÃ³s conclusÃ£o
- âœ… **Anti-Fraude**: DetecÃ§Ã£o de manipulaÃ§Ã£o, recarregamento de pÃ¡gina, mÃºltiplas abas
- âœ… **QuestÃµes Tipo Verdadeiro/Falso**: Com ordem aleatÃ³ria

### Dashboard e EstatÃ­sticas
- ðŸ“Š GrÃ¡ficos de evoluÃ§Ã£o temporal
- ðŸ“ˆ AnÃ¡lise de desempenho por categoria
- ðŸŽ¯ Taxa de acertos por disciplina
- â±ï¸ Tempo mÃ©dio de resposta
- ðŸ”„ HistÃ³rico completo de simulados

### Ranking e CompetiÃ§Ã£o
- ðŸ† Ranking global ordenado por pontuaÃ§Ã£o
- â±ï¸ Desempate por tempo mais rÃ¡pido
- ðŸ‘¥ ComparaÃ§Ã£o com outros candidatos
- ðŸ“ PosiÃ§Ã£o do usuÃ¡rio no ranking

### GamificaÃ§Ã£o
- â­ Sistema de Pontos (XP)
- ðŸ“Š NÃ­veis progressivos (1-100+)
- ðŸŽ–ï¸ Conquistas desbloqueÃ¡veis
- ðŸ”¥ SequÃªncia diÃ¡ria (Streak)
- ðŸ… Badges exclusivas por marco

### Painel Administrativo
- âž• Adicionar/editar/deletar questÃµes
- ðŸ“¥ Importar questÃµes via CSV
- ðŸ“¤ Exportar dados para anÃ¡lise
- ðŸ” Pesquisa e filtros avanÃ§ados
- ðŸ“‹ DuplicaÃ§Ã£o rÃ¡pida de questÃµes

## ðŸ—ï¸ Arquitetura

### Stack TecnolÃ³gico

**Frontend:**
- React 19 com TypeScript
- Vite 6 para build rÃ¡pido
- Tailwind CSS 4 para estilos
- Framer Motion para animaÃ§Ãµes
- React Router v7 para navegaÃ§Ã£o
- React Query (@tanstack) para estado de servidor
- Zustand para estado local
- Recharts para grÃ¡ficos

**Backend:**
- Armazenamento local (PostgreSQL)
- AutenticaÃ§Ã£o via Armazenamento local Auth
- Row Level Security (RLS) para privacidade
- Triggers automÃ¡ticos para estatÃ­sticas
- FunÃ§Ãµes PostgreSQL customizadas

**Infraestrutura:**
- Deployment em Vercel / Cloudflare Pages / Render
- Edge Functions para operaÃ§Ãµes crÃ­ticas
- CDN global para distribuiÃ§Ã£o rÃ¡pida

### Estrutura de DiretÃ³rios

```
src/
â”œâ”€â”€ components/           # Componentes React reutilizÃ¡veis
â”‚   â”œâ”€â”€ QuestionComponent.tsx      # Tela de questÃ£o com cronÃ´metro
â”‚   â”œâ”€â”€ ResultScreen.tsx           # Tela de resultado
â”‚   â”œâ”€â”€ Dashboard.tsx              # Dashboard do usuÃ¡rio
â”‚   â”œâ”€â”€ RankingComponent.tsx        # Ranking e posiÃ§Ã£o
â”‚   â”œâ”€â”€ AdminPanel.tsx             # Painel administrativo
â”‚   â”œâ”€â”€ SelectCategory.tsx          # SeleÃ§Ã£o de disciplina
â”‚   â””â”€â”€ GamificationPanel.tsx       # Painel de gamificaÃ§Ã£o
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ Armazenamento local.ts       # Cliente e funÃ§Ãµes Armazenamento local
â”‚   â”œâ”€â”€ store.ts          # Estado Zustand
â”‚   â”œâ”€â”€ hooks.ts          # Hooks customizados (React Query)
â”‚   â””â”€â”€ utils.ts          # FunÃ§Ãµes utilitÃ¡rias (shuffle, timer, etc)
â”œâ”€â”€ types.ts              # Tipos TypeScript globais
â”œâ”€â”€ App.tsx               # Componente raiz
â””â”€â”€ main.tsx              # Entry point
```

### Schema do Banco de Dados

```sql
-- Tabelas principais:
users                  -- Perfis de usuÃ¡rios
categories             -- Categorias de questÃµes
questions              -- Banco de questÃµes
simulations            -- Registro de simulados
simulation_answers     -- Respostas individuais
history                -- HistÃ³rico denormalizado
ranking                -- Ranking em tempo real
statistics             -- EstatÃ­sticas agregadas
user_achievements      -- Conquistas desbloqueadas
user_gamification      -- Pontos, XP, nÃ­veis
```

## ðŸš€ Quick Start

### PrÃ©-requisitos
- Node.js 18+
- npm ou yarn
- Conta Armazenamento local (gratuita em https://Armazenamento local.com)

### 1. Clonar e Instalar

```bash
# Clone o repositÃ³rio
git clone <seu-repo>
cd agendamento

# Instale as dependÃªncias
npm install
```

### 2. Configurar Armazenamento local

#### a) Criar Projeto no Armazenamento local
1. VÃ¡ para [Armazenamento local.com](https://Armazenamento local.com)
2. Crie uma nova organizaÃ§Ã£o e projeto
3. Copie as credenciais (URL e Anon Key)

#### b) Executar SQL
1. VÃ¡ para SQL Editor no painel Armazenamento local
2. Abra o arquivo `database.sql`
3. Copie todo o conteÃºdo
4. Cole no SQL Editor do Armazenamento local e execute

Isso criarÃ¡:
- 10 tabelas com relacionamentos
- Ãndices para performance
- Triggers automÃ¡ticos
- Row Level Security (RLS)
- Categorias e conquistas padrÃ£o

### 3. Configurar VariÃ¡veis de Ambiente

```bash
# Crie arquivo .env.local
cp .env.example .env.local

# Adicione suas credenciais
VITE_Armazenamento local_URL=https://seu-projeto.Armazenamento local.co
VITE_Armazenamento local_ANON_KEY=sua-chave-anonima
```

### 4. Executar Localmente

```bash
npm run dev
```

Acesse http://localhost:3000

### 5. Build para ProduÃ§Ã£o

```bash
npm run build
npm run preview
```

## ðŸ“± Fluxo de Uso

### UsuÃ¡rio Novo
1. Acessa `/` - Tela de seleÃ§Ã£o de disciplina
2. Clica em uma categoria - ComeÃ§a simulado com 50 questÃµes
3. Responde cada questÃ£o em 5 segundos (cronÃ´metro obrigatÃ³rio)
4. Sistema bloqueia resposta automaticamente ao fim do tempo
5. Passa para prÃ³xima questÃ£o
6. Ao final, vÃª resultado com grÃ¡ficos e anÃ¡lise
7. Acumula pontos e progride no ranking

### UsuÃ¡rio Registrado
1. Acessa `/dashboard` - VÃª histÃ³rico, estatÃ­sticas e evoluÃ§Ã£o
2. Acessa `/ranking` - VÃª sua posiÃ§Ã£o global
3. Acessa `/simulados` - Escolhe disciplina para novo simulado
4. Acessa `/gamification` - VÃª conquistas desbloqueadas e progression

### Administrador
1. Acessa `/admin/questoes` - Painel de gerenciamento
2. Pode adicionar/editar/deletar questÃµes
3. Importa questÃµes em batch via CSV
4. Exporta dados para anÃ¡lise

## ðŸ” SeguranÃ§a

### Medidas Anti-Fraude
- âœ… DetecÃ§Ã£o de pÃ¡gina recarregada
- âœ… DetecÃ§Ã£o de mÃºltiplas abas abertas
- âœ… ProteÃ§Ã£o contra voltar na histÃ³ria
- âœ… PrevenÃ§Ã£o de manipulaÃ§Ã£o do console
- âœ… VerificaÃ§Ã£o de saÃ­da de tela cheia
- âœ… Timeout automÃ¡tico por questÃ£o

### Row Level Security (RLS)
```sql
-- UsuÃ¡rios sÃ³ veem seus prÃ³prios dados
SELECT * FROM simulations 
WHERE user_id = current_user_id
```

### Respostas Corretas Seguras
- Respostas corretas permanecem APENAS no backend
- Frontend nunca recebe resposta antes da conclusÃ£o
- CorreÃ§Ã£o ocorre apÃ³s finalizar simulado
- ValidaÃ§Ã£o de integridade no servidor

## ðŸ“Š APIs e Hooks

### React Query Hooks

```typescript
// QuestÃµes
useQuestionsByCategory(categoryId)  // Carrega questÃµes de uma categoria
useAllQuestions()                   // Todas as questÃµes (admin)

// Categorias
useCategories()                     // Lista de categorias

// Simulados
useCreateSimulation()               // Criar novo simulado
useUserSimulations(userId)          // HistÃ³rico do usuÃ¡rio

// EstatÃ­sticas
useUserStatistics(userId)           // EstatÃ­sticas do usuÃ¡rio
useUpdateUserStatistics()           // Atualizar stats

// Ranking
useRanking(limit)                   // Top usuarios
useUserRankPosition(userId)         // PosiÃ§Ã£o do usuÃ¡rio
```

### Zustand Stores

```typescript
// AutenticaÃ§Ã£o
useAuthStore()                      // user, isLoading, setUser

// Simulado em Andamento
useSimulationStore()                // currentSession, setAnswer, etc

// EstatÃ­sticas e GamificaÃ§Ã£o
useStatisticsStore()                // stats, gamification

// UI
useUIStore()                        // showAntiCheatWarning, isFullscreen
```

## ðŸ› ï¸ FunÃ§Ãµes UtilitÃ¡rias

```typescript
// Shuffle (Fisher-Yates)
fisherYatesShuffle(array)
shuffleQuestionsUniquely(questions)
shuffleTrueFalseOrder()

// PontuaÃ§Ã£o
calculateScore(correct, total)
calculateXPGained(correct, total, multiplier)
calculateLevel(xp)

// FormataÃ§Ã£o
formatTime(seconds)                 // "05:30"
formatDuration(seconds)             // "5m 30s"
getClassificationColor(classification)
getClassificationIcon(classification)

// Anti-fraude
preventBackButton()
detectFullscreenExit()
detectMultipleTabs()
detectPageReload()
```

## ðŸ“ˆ Exemplo de Fluxo de Simulado

```typescript
// 1. UsuÃ¡rio inicia simulado
const session = createSimulationSession(categoryId, questions)
useSimulationStore().startSession(session)

// 2. Exibe questÃ£o 1 com cronÃ´metro de 5s
<QuestionComponent 
  question={questions[0]}
  onAnswer={(answer, timeSpent) => {
    setAnswer(question.id, answer, timeSpent)
    moveToNextQuestion()
  }}
/>

// 3. Ao fim de todas as questÃµes
calculateResults(session)
createSimulation(results)

// 4. Exibe resultado
<ResultScreen simulation={results} />

// 5. Atualiza ranking e estatÃ­sticas (automÃ¡tico via triggers)
```

## ðŸ“ Categorias DisponÃ­veis

- ðŸ“š LÃ­ngua Portuguesa
- ðŸ”¢ MatemÃ¡tica
- ðŸŒ Cultura Geral
- ðŸ›ï¸ HistÃ³ria de Angola
- ðŸ“œ ConstituiÃ§Ã£o
- âš–ï¸ Direitos Humanos
- ðŸ“° Atualidades
- ðŸ’» InformÃ¡tica
- ðŸ§  RaciocÃ­nio LÃ³gico

## ðŸŽ¯ NÃ­veis de Dificuldade

- ðŸŸ¢ FÃ¡cil (40% do simulado)
- ðŸŸ¡ MÃ©dio (40% do simulado)
- ðŸ”´ DifÃ­cil (20% do simulado)

## ðŸ“Š ClassificaÃ§Ãµes

- ðŸŸ¢ **Excelente** (90-100%): ParabÃ©ns! Excelente desempenho
- ðŸ”µ **Muito Bom** (80-89%): Ã“timo trabalho
- ðŸŸ¡ **Bom** (70-79%): VocÃª estÃ¡ no caminho certo
- ðŸŸ  **Regular** (60-69%): Continue estudando
- ðŸ”´ **Insuficiente** (<60%): Precisa estudar mais

## ðŸŽ–ï¸ Sistema de GamificaÃ§Ã£o

### Pontos
- 10 XP por questÃ£o correta
- +50 XP bÃ´nus por acertar tudo
- Multiplicadores por sequÃªncia diÃ¡ria

### NÃ­veis
- NÃ­vel 1: 0-999 XP
- NÃ­vel 2: 1000-1999 XP
- ...
- MÃ¡ximo: Ilimitado

### Conquistas PadrÃ£o
- ðŸŽ‰ Primeiro Passo (50 pts)
- ðŸ”¥ Streak de 7 Dias (200 pts)
- ðŸ’¯ PerfeiÃ§Ã£o (500 pts)
- ðŸ† Especialista (300 pts)
- âš¡ Velocista (150 pts)
- ðŸƒ Maratonista (1000 pts)
- â›°ï¸ Escalador (500 pts)
- ðŸ‘‘ CampeÃ£o (1000 pts)

## ðŸ› Troubleshooting

### Erro: "Missing Armazenamento local credentials"
- Verifique se `.env.local` existe
- Confirme que `VITE_Armazenamento local_URL` e `VITE_Armazenamento local_ANON_KEY` estÃ£o corretos

### Erro: "RLS policy violation"
- Verifique Row Level Security no Armazenamento local
- Confirme que o usuÃ¡rio estÃ¡ autenticado
- Veja logs de erro no SQL Editor

### Simulado nÃ£o carrega
- Confirme que hÃ¡ questÃµes na categoria
- Verifique conexÃ£o com Armazenamento local
- Abra DevTools e veja o console

## ðŸ“š Recursos Adicionais

- [React Docs](https://react.dev)
- [Armazenamento local Docs](https://Armazenamento local.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [React Query](https://tanstack.com/query)
- [Zustand](https://github.com/pmndrs/zustand)

## ðŸ“ LicenÃ§a

Este projeto Ã© propriedade do MinistÃ©rio do Interior de Angola.

## ðŸ¤ Contribuindo

Para reportar bugs ou sugerir features, entre em contato com a equipe de desenvolvimento.

## ðŸ“ž Suporte

Para dÃºvidas tÃ©cnicas ou suporte, acesse o painel administrativo ou contate development@minint.ao

---

**VersÃ£o:** 1.0.0  
**Ãšltima atualizaÃ§Ã£o:** 2026-07-22  
**Status:** âœ… ProduÃ§Ã£o

