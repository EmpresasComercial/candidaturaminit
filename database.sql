-- MININT Simulados - Database Schema
-- Este arquivo não é mais usado na versão local da aplicação.

-- ============================================================================
-- 1. USERS
-- ============================================================================

CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 2. CATEGORIES
-- ============================================================================

CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  icon text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default categories
INSERT INTO categories (name, description, icon) VALUES
  ('Língua Portuguesa', 'Questões sobre a língua portuguesa', '📚'),
  ('Matemática', 'Questões de matemática', '🔢'),
  ('Cultura Geral', 'Questões sobre cultura geral', '🌍'),
  ('História de Angola', 'Questões sobre história de Angola', '🏛️'),
  ('Constituição', 'Questões sobre a Constituição da República de Angola', '📜'),
  ('Direitos Humanos', 'Questões sobre direitos humanos', '⚖️'),
  ('Atualidades', 'Questões sobre atualidades', '📰'),
  ('Informática', 'Questões sobre informática', '💻'),
  ('Raciocínio Lógico', 'Questões sobre raciocínio lógico', '🧠');

-- ============================================================================
-- 3. QUESTIONS
-- ============================================================================

CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  correct_answer boolean NOT NULL,
  explanation text,
  difficulty_level text CHECK (difficulty_level IN ('fácil', 'médio', 'difícil')) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_questions_category_id ON questions(category_id);
CREATE INDEX idx_questions_difficulty_level ON questions(difficulty_level);

-- ============================================================================
-- 4. SIMULATIONS
-- ============================================================================

CREATE TABLE simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL DEFAULT 0,
  wrong_answers integer NOT NULL DEFAULT 0,
  unanswered integer NOT NULL DEFAULT 0,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  time_spent_seconds integer NOT NULL,
  started_at timestamp with time zone NOT NULL,
  finished_at timestamp with time zone NOT NULL,
  classification text CHECK (classification IN ('Excelente', 'Muito Bom', 'Bom', 'Regular', 'Insuficiente')) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_simulations_user_id ON simulations(user_id);
CREATE INDEX idx_simulations_category_id ON simulations(category_id);
CREATE INDEX idx_simulations_created_at ON simulations(created_at DESC);

-- ============================================================================
-- 5. SIMULATION_ANSWERS
-- ============================================================================

CREATE TABLE simulation_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  simulation_id uuid NOT NULL REFERENCES simulations(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_answer boolean,
  is_correct boolean NOT NULL,
  time_spent_seconds integer NOT NULL,
  answered_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_simulation_answers_simulation_id ON simulation_answers(simulation_id);
CREATE INDEX idx_simulation_answers_question_id ON simulation_answers(question_id);

-- ============================================================================
-- 6. HISTORY (User simulation history - denormalized for performance)
-- ============================================================================

CREATE TABLE history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  simulation_id uuid NOT NULL REFERENCES simulations(id) ON DELETE CASCADE,
  category text NOT NULL,
  score integer NOT NULL,
  correct_answers integer NOT NULL,
  total_questions integer NOT NULL,
  classification text NOT NULL,
  time_spent_seconds integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_history_user_id ON history(user_id);
CREATE INDEX idx_history_created_at ON history(created_at DESC);

-- ============================================================================
-- 7. RANKING
-- ============================================================================

CREATE TABLE ranking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  user_email text NOT NULL,
  total_score integer NOT NULL DEFAULT 0,
  average_score integer NOT NULL DEFAULT 0,
  total_simulations integer NOT NULL DEFAULT 0,
  total_correct_answers integer NOT NULL DEFAULT 0,
  total_time_seconds integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_ranking_total_score ON ranking(total_score DESC);
CREATE INDEX idx_ranking_average_score ON ranking(average_score DESC);

-- ============================================================================
-- 8. STATISTICS (User performance metrics)
-- ============================================================================

CREATE TABLE statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_simulations integer NOT NULL DEFAULT 0,
  best_score integer NOT NULL DEFAULT 0,
  last_score integer,
  average_score integer NOT NULL DEFAULT 0,
  total_time_seconds integer NOT NULL DEFAULT 0,
  total_questions_answered integer NOT NULL DEFAULT 0,
  accuracy_rate integer NOT NULL DEFAULT 0,
  by_category jsonb, -- Stores {category: {simulations_count, average_score, best_score, total_correct, total_questions, accuracy_rate}}
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_statistics_user_id ON statistics(user_id);

-- ============================================================================
-- 9. GAMIFICATION
-- ============================================================================

CREATE TABLE achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  reward_points integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default achievements
INSERT INTO achievements (name, description, icon, reward_points) VALUES
  ('Primeiro Passo', 'Completar sua primeira simulação', '🎉', 50),
  ('Streak de 7 Dias', 'Manter uma sequência de 7 dias de simulados', '🔥', 200),
  ('Perfeição', 'Acertar todas as questões em uma simulação', '💯', 500),
  ('Especialista', 'Atingir 80% de acertos em 10 simulações de uma categoria', '🏆', 300),
  ('Velocista', 'Completar uma simulação em menos de 3 minutos', '⚡', 150),
  ('Maratonista', 'Completar 100 simulações', '🏃', 1000),
  ('Escalador', 'Atingir o nível 10', '⛰️', 500),
  ('Campeão', 'Ocupar o primeiro lugar no ranking', '👑', 1000);

CREATE TABLE user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);

-- ============================================================================
-- 10. GAMIFICATION - USER POINTS/XP
-- ============================================================================

CREATE TABLE user_gamification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_points integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  xp integer NOT NULL DEFAULT 0,
  xp_next_level integer NOT NULL DEFAULT 1000,
  streak_days integer NOT NULL DEFAULT 0,
  last_activity timestamp with time zone,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_user_gamification_level ON user_gamification(level DESC);
CREATE INDEX idx_user_gamification_xp ON user_gamification(xp DESC);

-- ============================================================================
-- TRIGGER FUNCTIONS
-- ============================================================================

-- Function to update user profile on auth.users change
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (new.id, new.email, new.user_metadata->>'full_name');
  
  INSERT INTO public.user_gamification (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update statistics after simulation completion
CREATE OR REPLACE FUNCTION update_statistics_after_simulation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.statistics (user_id)
  VALUES (new.user_id)
  ON CONFLICT (user_id) DO UPDATE SET
    total_simulations = statistics.total_simulations + 1,
    last_score = new.score,
    average_score = (
      SELECT ROUND(AVG(score)) FROM simulations 
      WHERE user_id = new.user_id
    ),
    total_time_seconds = statistics.total_time_seconds + new.time_spent_seconds,
    accuracy_rate = (
      SELECT ROUND(AVG(CASE WHEN correct_answers > 0 THEN (correct_answers::float / total_questions) * 100 ELSE 0 END))
      FROM simulations
      WHERE user_id = new.user_id
    ),
    updated_at = timezone('utc'::text, now());

  IF new.score > COALESCE((SELECT best_score FROM statistics WHERE user_id = new.user_id), 0) THEN
    UPDATE statistics SET best_score = new.score WHERE user_id = new.user_id;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_simulation_completed
  AFTER INSERT ON simulations
  FOR EACH ROW EXECUTE FUNCTION update_statistics_after_simulation();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can only see their own simulations
CREATE POLICY "Users can view own simulations" ON simulations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulations" ON simulations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only see their own simulation answers
CREATE POLICY "Users can view own answers" ON simulation_answers
  FOR SELECT USING (
    simulation_id IN (
      SELECT id FROM simulations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own answers" ON simulation_answers
  FOR INSERT WITH CHECK (
    simulation_id IN (
      SELECT id FROM simulations WHERE user_id = auth.uid()
    )
  );

-- Users can view their history
CREATE POLICY "Users can view own history" ON history
  FOR SELECT USING (auth.uid() = user_id);

-- Users can view their statistics
CREATE POLICY "Users can view own statistics" ON statistics
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone can view the public ranking
CREATE POLICY "Ranking is public" ON ranking
  FOR SELECT USING (true);

-- Users can view their achievements
CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- Users can view their gamification data
CREATE POLICY "Users can view own gamification" ON user_gamification
  FOR SELECT USING (auth.uid() = user_id);

-- Questions are public for reading
CREATE POLICY "Questions are public" ON questions
  FOR SELECT USING (true);

-- Categories are public for reading
CREATE POLICY "Categories are public" ON categories
  FOR SELECT USING (true);
