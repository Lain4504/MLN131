-- ============================================
-- MLN131 Quiz Battle - Complete Database Setup
-- ============================================
-- Run this file in Supabase SQL Editor to create all tables, policies, and seed data
-- ============================================

-- ============================================
-- 1. CREATE ENUM TYPE
-- ============================================

-- Create Room Status Type (Check if exists first)
DO $$ BEGIN
    CREATE TYPE room_status AS ENUM ('waiting', 'playing', 'finished');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 2. CREATE TABLES
-- ============================================

-- Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code TEXT UNIQUE NOT NULL,
    status room_status DEFAULT 'waiting',
    current_question_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content JSONB NOT NULL,
    difficulty TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Players Table
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    score INT DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    item_inventory JSONB DEFAULT '{"score_boost":0,"time_extend":0,"shield":0,"confusion":0,"time_attack":0}'::jsonb,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Answers Table
CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL,
    time_used INT NOT NULL, -- milliseconds
    points_awarded INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items Used Table
CREATE TABLE IF NOT EXISTS items_used (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    to_player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('score_boost', 'time_extend', 'shield', 'confusion', 'time_attack')),
    question_index INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. CREATE INDEXES (for better performance)
-- ============================================

-- Rooms indexes
CREATE INDEX IF NOT EXISTS idx_rooms_room_code ON rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);

-- Players indexes
CREATE INDEX IF NOT EXISTS idx_players_room_id ON players(room_id);
CREATE INDEX IF NOT EXISTS idx_players_score ON players(score DESC);
CREATE INDEX IF NOT EXISTS idx_players_last_active ON players(last_active);

-- Questions indexes
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);

-- Answers indexes
CREATE INDEX IF NOT EXISTS idx_answers_player_id ON answers(player_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);

-- Items used indexes
CREATE INDEX IF NOT EXISTS idx_items_used_from_player ON items_used(from_player_id);
CREATE INDEX IF NOT EXISTS idx_items_used_to_player ON items_used(to_player_id);

-- ============================================
-- 4. ENABLE REALTIME (for live updates)
-- ============================================

-- Note: These may fail if tables are already in publication - safe to ignore
DO $$ 
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
EXCEPTION WHEN OTHERS THEN
    -- Table may already be in publication
    NULL;
END $$;

DO $$ 
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE players;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

DO $$ 
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE items_used;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- ============================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE items_used ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. CREATE RLS POLICIES (Complete set)
-- ============================================

-- ===== ROOMS POLICIES =====
-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read rooms" ON rooms;
DROP POLICY IF EXISTS "Allow public insert rooms" ON rooms;
DROP POLICY IF EXISTS "Allow public update rooms" ON rooms;
DROP POLICY IF EXISTS "Allow public delete rooms" ON rooms;

CREATE POLICY "Allow public read rooms" ON rooms
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert rooms" ON rooms
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update rooms" ON rooms
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete rooms" ON rooms
    FOR DELETE
    USING (true);

-- ===== PLAYERS POLICIES =====
-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read players" ON players;
DROP POLICY IF EXISTS "Allow public insert players" ON players;
DROP POLICY IF EXISTS "Allow public update players" ON players;
DROP POLICY IF EXISTS "Allow public delete players" ON players;

CREATE POLICY "Allow public read players" ON players
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert players" ON players
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update players" ON players
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete players" ON players
    FOR DELETE
    USING (true);

-- ===== QUESTIONS POLICIES =====
-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read questions" ON questions;
DROP POLICY IF EXISTS "Allow public insert questions" ON questions;
DROP POLICY IF EXISTS "Allow public update questions" ON questions;
DROP POLICY IF EXISTS "Allow public delete questions" ON questions;

CREATE POLICY "Allow public read questions" ON questions
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert questions" ON questions
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update questions" ON questions
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete questions" ON questions
    FOR DELETE
    USING (true);

-- ===== ANSWERS POLICIES =====
-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read answers" ON answers;
DROP POLICY IF EXISTS "Allow public insert answers" ON answers;
DROP POLICY IF EXISTS "Allow public update answers" ON answers;
DROP POLICY IF EXISTS "Allow public delete answers" ON answers;

CREATE POLICY "Allow public read answers" ON answers
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert answers" ON answers
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update answers" ON answers
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete answers" ON answers
    FOR DELETE
    USING (true);

-- ===== ITEMS_USED POLICIES =====
-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read items_used" ON items_used;
DROP POLICY IF EXISTS "Allow public insert items_used" ON items_used;
DROP POLICY IF EXISTS "Allow public update items_used" ON items_used;
DROP POLICY IF EXISTS "Allow public delete items_used" ON items_used;

CREATE POLICY "Allow public read items_used" ON items_used
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert items_used" ON items_used
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update items_used" ON items_used
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete items_used" ON items_used
    FOR DELETE
    USING (true);

-- ============================================
-- 7. SEED DATA (Initial Questions)
-- ============================================

-- Only insert if no questions exist yet (to avoid duplicates when re-running)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM questions LIMIT 1) THEN
        INSERT INTO questions (content, difficulty) VALUES
        (
            '{"question": "Ai là người trực tiếp kế thừa và phát triển học thuyết của Các Mác và Phri-đrích Ăng-ghen trong giai đoạn đế quốc chủ nghĩa?", "options": ["V.I.Lênin", "Stalin", "Hồ Chí Minh", "Mao Trạch Đông"], "correct_index": 0, "difficulty": "Trung bình"}'::jsonb,
            'Trung bình'
        ),
        (
            '{"question": "Đối tượng nghiên cứu trực tiếp của Chủ nghĩa Xã hội Khoa học là gì?", "options": ["Những quy luật chính trị - xã hội của quá trình phát sinh, hình thành và phát triển của hình thái kinh tế - xã hội cộng sản chủ nghĩa", "Quá trình sản xuất vật chất", "Các quy luật chung nhất của tự nhiên", "Lịch sử nhân loại"], "correct_index": 0, "difficulty": "Trọng yếu"}'::jsonb,
            'Trọng yếu'
        ),
        (
            '{"question": "Một trong những điều kiện kinh tế - xã hội dẫn đến sự ra đời của Chủ nghĩa Xã hội Khoa học là?", "options": ["Cuộc cách mạng công nghiệp làm nảy sinh mâu thuẫn giữa lực lượng sản xuất và quan hệ sản xuất tư bản chủ nghĩa", "Sự xuất hiện của chủ nghĩa thực dân", "Sự sụp đổ của chế độ phong kiến", "Phát minh về tế bào"], "correct_index": 0, "difficulty": "Cơ bản"}'::jsonb,
            'Cơ bản'
        ),
        (
            '{"question": "Học thuyết nào được coi là \"hòn đá tảng\" của kinh tế chính trị học Mác - Lênin?", "options": ["Học thuyết giá trị thặng dư", "Học thuyết tiến hóa", "Học thuyết nguyên tử", "Học thuyết tâm lý"], "correct_index": 0, "difficulty": "Trọng yếu"}'::jsonb,
            'Trọng yếu'
        ),
        (
            '{"question": "Sứ mệnh lịch sử của giai cấp công nhân là gì?", "options": ["Xóa bỏ chế độ tư hữu, thiết lập chế độ công hữu về tư liệu sản xuất chủ yếu", "Xây dựng xã hội phong kiến mới", "Củng cố quyền lực của giai cấp tư sản", "Duy trì sự phân chia giai cấp vĩnh viễn"], "correct_index": 0, "difficulty": "Trung bình"}'::jsonb,
            'Trung bình'
        );
    END IF;
END $$;

-- ============================================
-- 8. VERIFY SETUP
-- ============================================

-- Check all tables exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN ('rooms', 'players', 'questions', 'answers', 'items_used')
ORDER BY table_name;

-- Check all policies exist
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename IN ('rooms', 'players', 'questions', 'answers', 'items_used')
ORDER BY tablename, cmd;

-- Check columns for each table
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name IN ('rooms', 'players', 'questions', 'answers', 'items_used')
ORDER BY table_name, ordinal_position;

-- Check seed data
SELECT COUNT(*) as total_questions FROM questions;

-- ============================================
-- ✅ SETUP COMPLETE!
-- ============================================
-- All tables, indexes, RLS policies, Realtime, and seed data have been created.
-- You can now use the application without database errors.
-- ============================================
