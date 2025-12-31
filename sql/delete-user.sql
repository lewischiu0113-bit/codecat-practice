-- 刪除用戶的 SQL 語句
-- 警告：此操作會永久刪除用戶及其所有相關資料（考試記錄等）
--
-- 注意：系統使用 username 認證，email 欄位存儲格式為 username@codecat.practice
-- 真正的 username 存儲在 raw_user_meta_data->>'username' 中

-- ============================================
-- 方法 1: 根據 username 刪除用戶（推薦）
-- ============================================
-- 替換 'testuser123' 為要刪除的用戶 username
DELETE FROM auth.users 
WHERE email = 'testuser123@codecat.practice';

-- ============================================
-- 方法 2: 根據 email（username@local.local 格式）刪除用戶
-- ============================================
-- 替換 'username@codecat.practice' 為要刪除的用戶完整 email 格式
DELETE FROM auth.users 
WHERE email = 'username@codecat.practice';

-- ============================================
-- 方法 2: 根據 user_id (UUID) 刪除用戶
-- ============================================
-- 替換 '00000000-0000-0000-0000-000000000000' 為要刪除的用戶 UUID
-- 可以在 Supabase Dashboard → Authentication → Users 中找到用戶的 UUID
DELETE FROM auth.users 
WHERE id = '00000000-0000-0000-0000-000000000000'::uuid;

-- ============================================
-- 方法 3: 根據 user_id (UUID) 刪除用戶
-- ============================================
-- 替換 '00000000-0000-0000-0000-000000000000' 為要刪除的用戶 UUID
-- 可以在 Supabase Dashboard → Authentication → Users 中找到用戶的 UUID
DELETE FROM auth.users 
WHERE id = '00000000-0000-0000-0000-000000000000'::uuid;

-- ============================================
-- 方法 4: 刪除多個用戶（根據 username 列表）
-- ============================================
DELETE FROM auth.users 
WHERE email IN (
  'user1@codecat.practice',
  'user2@codecat.practice',
  'user3@codecat.practice'
);

-- ============================================
-- 方法 5: 刪除所有用戶（危險！請謹慎使用）
-- ============================================
-- ⚠️ 警告：這會刪除所有用戶，包括管理員帳號！
-- DELETE FROM auth.users;

-- ============================================
-- 查詢用戶資訊（在刪除前先確認）
-- ============================================
-- 查看所有用戶（顯示 username 和 email 格式）
SELECT 
  id, 
  email,
  raw_user_meta_data->>'username' as username,
  created_at, 
  last_sign_in_at 
FROM auth.users 
ORDER BY created_at DESC;

-- 根據 username 查詢特定用戶
SELECT 
  id, 
  email,
  raw_user_meta_data->>'username' as username,
  created_at, 
  last_sign_in_at 
FROM auth.users 
WHERE email = 'testuser123@codecat.practice';

-- 根據 username（從 user_metadata 中提取）查詢用戶
SELECT 
  id, 
  email,
  raw_user_meta_data->>'username' as username,
  created_at, 
  last_sign_in_at 
FROM auth.users 
WHERE raw_user_meta_data->>'username' = 'testuser123';

-- 查看用戶的考試記錄數量（在刪除前確認）
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'username' as username,
  COUNT(er.id) as exam_records_count
FROM auth.users u
LEFT JOIN exam_records er ON er.user_id = u.id
WHERE u.email = 'testuser123@codecat.practice'
GROUP BY u.id, u.email, u.raw_user_meta_data;

-- ============================================
-- 注意事項
-- ============================================
-- 1. 系統使用 username 認證，email 欄位格式為 username@local.local
--    真正的 username 存儲在 raw_user_meta_data->>'username' 中
--
-- 2. 刪除用戶時，由於外鍵約束設定為 ON DELETE CASCADE，
--    相關的 exam_records 記錄會自動被刪除
--
-- 3. 刪除操作無法復原，請在執行前確認
--
-- 4. 建議先使用查詢語句確認要刪除的用戶資訊
--
-- 5. 也可以通過 Supabase Dashboard → Authentication → Users 
--    界面手動刪除用戶（更安全）
--
-- 6. 範例：如果要刪除 username 為 "testuser123" 的用戶：
--    DELETE FROM auth.users WHERE email = 'testuser123@codecat.practice';

