-- MLN131 Quiz Battle - Supabase Schema

-- 1. Create Room Status Type (Check if exists first)
DO $$ BEGIN
    CREATE TYPE room_status AS ENUM ('waiting', 'playing', 'finished');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    room_code TEXT UNIQUE NOT NULL,
    status room_status DEFAULT 'waiting',
    current_question_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    content JSONB NOT NULL,
    difficulty TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Players Table
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    room_id UUID REFERENCES rooms (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    score INT DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Answers Table
CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    player_id UUID REFERENCES players (id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions (id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL,
    time_used INT NOT NULL, -- milliseconds
    points_awarded INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create Items Table (Tactical Inventory)
CREATE TABLE IF NOT EXISTS items_used (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    from_player_id UUID REFERENCES players (id) ON DELETE CASCADE,
    to_player_id UUID REFERENCES players (id) ON DELETE CASCADE,
    item_type TEXT NOT NULL,
    question_index INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Enable Realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;

ALTER PUBLICATION supabase_realtime ADD TABLE players;

ALTER PUBLICATION supabase_realtime ADD TABLE items_used;

-- 8. Basic Policies (For demo, we keep it simple - consider more restrictive policies for production)
-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

ALTER TABLE items_used ENABLE ROW LEVEL SECURITY;

-- Allow all for now (Demo purposes)
CREATE POLICY "Allow public read rooms" ON rooms FOR
SELECT USING (true);

CREATE POLICY "Allow public insert rooms" ON rooms FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Allow public update rooms" ON rooms
FOR UPDATE
    USING (true);

CREATE POLICY "Allow public read players" ON players FOR
SELECT USING (true);

CREATE POLICY "Allow public insert players" ON players FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Allow public update players" ON players
FOR UPDATE
    USING (true);

CREATE POLICY "Allow public read questions" ON questions FOR
SELECT USING (true);

CREATE POLICY "Allow public read answers" ON answers FOR
SELECT USING (true);

CREATE POLICY "Allow public insert answers" ON answers FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Allow public read items" ON items_used FOR
SELECT USING (true);

CREATE POLICY "Allow public insert items" ON items_used FOR INSERT
WITH
    CHECK (true);

-- 9. Initial Seed Data (Questions)
INSERT INTO
    questions (content, difficulty)
VALUES (
        '{"question": "Ai là người trực tiếp kế thừa và phát triển học thuyết của Các Mác và Phri-đrích Ăng-ghen trong giai đoạn đế quốc chủ nghĩa?", "options": ["V.I.Lênin", "Stalin", "Hồ Chí Minh", "Mao Trạch Đông"], "correct_index": 0, "difficulty": "Trung bình"}',
        'Trung bình'
    ),
    (
        '{"question": "Đối tượng nghiên cứu trực tiếp của Chủ nghĩa Xã hội Khoa học là gì?", "options": ["Những quy luật chính trị - xã hội của quá trình phát sinh, hình thành và phát triển của hình thái kinh tế - xã hội cộng sản chủ nghĩa", "Quá trình sản xuất vật chất", "Các quy luật chung nhất của tự nhiên", "Lịch sử nhân loại"], "correct_index": 0, "difficulty": "Trọng yếu"}',
        'Trọng yếu'
    ),
    (
        '{"question": "Một trong những điều kiện kinh tế - xã hội dẫn đến sự ra đời của Chủ nghĩa Xã hội Khoa học là?", "options": ["Cuộc cách mạng công nghiệp làm nảy sinh mâu thuẫn giữa lực lượng sản xuất và quan hệ sản xuất tư bản chủ nghĩa", "Sự xuất hiện của chủ nghĩa thực dân", "Sự sụp đổ của chế độ phong kiến", "Phát minh về tế bào"], "correct_index": 0, "difficulty": "Cơ bản"}',
        'Cơ bản'
    ),
    (
        '{"question": "Học thuyết nào được coi là \"hòn đá tảng\" của kinh tế chính trị học Mác - Lênin?", "options": ["Học thuyết giá trị thặng dư", "Học thuyết tiến hóa", "Học thuyết nguyên tử", "Học thuyết tâm lý"], "correct_index": 0, "difficulty": "Trọng yếu"}',
        'Trọng yếu'
    ),
    (
        '{"question": "Sứ mệnh lịch sử của giai cấp công nhân là gì?", "options": ["Xóa bỏ chế độ tư hữu, thiết lập chế độ công hữu về tư liệu sản xuất chủ yếu", "Xây dựng xã hội phong kiến mới", "Củng cố quyền lực của giai cấp tư sản", "Duy trì sự phân chia giai cấp vĩnh viễn"], "correct_index": 0, "difficulty": "Trung bình"}',
        'Trung bình'
    );