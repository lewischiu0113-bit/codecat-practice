-- ============================================
-- CodeCat Practice 資料庫初始化腳本
-- 完整版本：包含所有表、數據、政策和函數
-- 假設所有表都已刪除，需要重新建立
-- ============================================

-- 啟用 pgcrypto 擴展（用於密碼加密）
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- 1. 建立基本表結構
-- ============================================

-- 建立 exams 表格
CREATE TABLE IF NOT EXISTS exams (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立 questions 表格
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('MCQ', 'Input', 'CodeExecution')),
  question TEXT NOT NULL,
  options JSONB, -- 用於 MCQ 類型的選項陣列
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  test_cases JSONB, -- 用於 CodeExecution 類型的測試案例（格式：[{input: "2\n3\n6", expectedOutput: "11"}, ...]）
  question_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立 user_profile 表格（用戶資料表）
CREATE TABLE IF NOT EXISTS user_profile (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE, -- 使用者名稱（唯一值）
  password_hash TEXT NOT NULL, -- 加密後的密碼
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立 exam_records 表格（考試記錄）
CREATE TABLE IF NOT EXISTS exam_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES user_profile(id) ON DELETE CASCADE, -- 關聯到 user_profile
  exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
  score INTEGER NOT NULL, -- 正確題數
  total INTEGER NOT NULL, -- 總題數
  percentage INTEGER NOT NULL, -- 正確率百分比
  answers JSONB NOT NULL, -- 用戶答案（陣列格式）
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. 建立索引以提升查詢效能
-- ============================================

CREATE INDEX IF NOT EXISTS idx_questions_exam_id ON questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON questions(exam_id, question_order);
CREATE INDEX IF NOT EXISTS idx_user_profile_username ON user_profile(username);
CREATE INDEX IF NOT EXISTS idx_exam_records_exam_id ON exam_records(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_records_user_id ON exam_records(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_records_completed_at ON exam_records(completed_at DESC);

-- ============================================
-- 3. 插入考試和問題數據
-- ============================================

-- 詳見 題庫.sql


-- ============================================
-- 4. 啟用 Row Level Security (RLS)
-- ============================================

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_records ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. 建立 RLS 政策
-- ============================================

-- 建立政策：允許所有人讀取 exams 和 questions
CREATE POLICY "Allow public read access on exams" ON exams
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on questions" ON questions
  FOR SELECT USING (true);

-- 建立政策：允許所有人讀取 user_profile（用於登入驗證）
CREATE POLICY "Allow public read access on user_profile for login" ON user_profile
  FOR SELECT USING (true);

-- 建立政策：允許所有人插入 user_profile（用於註冊）
CREATE POLICY "Allow public insert access on user_profile" ON user_profile
  FOR INSERT WITH CHECK (true);

-- 建立政策：允許所有操作（前端會手動過濾 user_id）
-- 注意：由於使用自定義認證，RLS 無法知道當前用戶，所以在前端手動過濾
CREATE POLICY "Allow users to read own exam_records" ON exam_records
  FOR SELECT USING (true);

CREATE POLICY "Allow users to insert own exam_records" ON exam_records
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to delete own exam_records" ON exam_records
  FOR DELETE USING (true);

-- ============================================
-- 6. 創建 RPC 函數（認證相關）
-- ============================================

-- 創建註冊函數（RPC）
CREATE OR REPLACE FUNCTION register_user(
  p_username TEXT,
  p_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id INTEGER;
  v_password_hash TEXT;
BEGIN
  -- 檢查 username 是否已存在
  IF EXISTS (SELECT 1 FROM user_profile WHERE username = p_username) THEN
    RETURN json_build_object(
      'success', false,
      'error', '使用者名稱已存在'
    );
  END IF;

  -- 加密密碼（使用 bcrypt）
  v_password_hash := crypt(p_password, gen_salt('bf'));

  -- 插入新用戶
  INSERT INTO user_profile (username, password_hash)
  VALUES (p_username, v_password_hash)
  RETURNING id INTO v_user_id;

  RETURN json_build_object(
    'success', true,
    'user_id', v_user_id,
    'username', p_username
  );
EXCEPTION
  WHEN unique_violation THEN
    RETURN json_build_object(
      'success', false,
      'error', '使用者名稱已存在'
    );
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', '註冊失敗：' || SQLERRM
    );
END;
$$;

-- 創建登入驗證函數（RPC）
CREATE OR REPLACE FUNCTION verify_user_login(
  p_username TEXT,
  p_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id INTEGER;
  v_password_hash TEXT;
  v_stored_hash TEXT;
BEGIN
  -- 查詢用戶
  SELECT id, password_hash INTO v_user_id, v_stored_hash
  FROM user_profile
  WHERE username = p_username;

  -- 檢查用戶是否存在
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', '使用者名稱或密碼錯誤'
    );
  END IF;

  -- 驗證密碼
  IF v_stored_hash = crypt(p_password, v_stored_hash) THEN
    RETURN json_build_object(
      'success', true,
      'user_id', v_user_id,
      'username', p_username
    );
  ELSE
    RETURN json_build_object(
      'success', false,
      'error', '使用者名稱或密碼錯誤'
    );
  END IF;
END;
$$;

-- ============================================
-- 完成
-- ============================================
SELECT '資料庫初始化完成！' AS message;
