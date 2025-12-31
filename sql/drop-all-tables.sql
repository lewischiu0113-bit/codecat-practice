-- 刪除所有表、政策、索引和函數
-- 警告：此腳本會刪除所有資料，請謹慎使用！

-- ============================================
-- 1. 刪除所有 RLS 政策
-- ============================================

DROP POLICY IF EXISTS "Allow public read access on exams" ON exams;
DROP POLICY IF EXISTS "Allow public read access on questions" ON questions;
DROP POLICY IF EXISTS "Allow users to read own exam_records" ON exam_records;
DROP POLICY IF EXISTS "Allow users to insert own exam_records" ON exam_records;
DROP POLICY IF EXISTS "Allow users to delete own exam_records" ON exam_records;
DROP POLICY IF EXISTS "Allow public read access on exam_records" ON exam_records;
DROP POLICY IF EXISTS "Allow public insert access on exam_records" ON exam_records;
DROP POLICY IF EXISTS "Allow public delete access on exam_records" ON exam_records;
DROP POLICY IF EXISTS "Allow public read access on user_profile for login" ON user_profile;
DROP POLICY IF EXISTS "Allow public insert access on user_profile" ON user_profile;

-- ============================================
-- 2. 刪除所有索引
-- ============================================

DROP INDEX IF EXISTS idx_questions_exam_id;
DROP INDEX IF EXISTS idx_questions_order;
DROP INDEX IF EXISTS idx_user_profile_username;
DROP INDEX IF EXISTS idx_exam_records_exam_id;
DROP INDEX IF EXISTS idx_exam_records_user_id;
DROP INDEX IF EXISTS idx_exam_records_completed_at;

-- ============================================
-- 3. 刪除 RPC 函數（如果存在）
-- ============================================

DROP FUNCTION IF EXISTS register_user(TEXT, TEXT);
DROP FUNCTION IF EXISTS verify_user_login(TEXT, TEXT);
DROP FUNCTION IF EXISTS delete_all_exam_records();

-- ============================================
-- 4. 刪除所有表（按照外鍵依賴順序）
-- ============================================

DROP TABLE IF EXISTS exam_records CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS user_profile CASCADE;

-- ============================================
-- 完成
-- ============================================
SELECT '所有表、政策、索引和函數已成功刪除' AS message;

