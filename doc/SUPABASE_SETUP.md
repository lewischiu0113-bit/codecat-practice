# Supabase 資料庫設定指南

## 步驟 1: 安裝依賴

首先安裝 Supabase 客戶端庫：

```bash
npm install
# 或
pnpm install
```

## 步驟 2: 配置環境變數

在專案根目錄創建 `.env` 文件（如果尚未創建），並添加以下內容：

```env
VITE_SUPABASE_URL=你的_Supabase_專案_URL
VITE_SUPABASE_ANON_KEY=你的_Supabase_匿名_API_Key
```

**獲取 Supabase 憑證：**
1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇您的專案
3. 點擊左側選單的 **"Settings"** → **"API"**
4. 複製 **"Project URL"** 和 **"anon public"** key

## 步驟 3: 在 Supabase Dashboard 中執行 SQL 腳本

### 選項 A: 完整初始化（推薦，如果表已刪除或首次設定）

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇您的專案
3. 點擊左側選單的 **"SQL Editor"**
4. 點擊 **"New query"** 按鈕
5. 複製 `sql/supabase-init.sql` 檔案的**全部內容**
6. 貼上到 SQL Editor 中
7. 點擊 **"Run"** 按鈕執行

### 選項 B: 重新建立（如果已有資料需要清除）

1. 先執行 `sql/drop-all-tables.sql` 刪除所有表
2. 再執行 `sql/supabase-init.sql` 重新建立所有內容

## 步驟 4: 驗證資料庫設定

執行 SQL 腳本後，您應該會看到：

- ✅ 四個表格已建立：
  - `exams` - 考試列表
  - `questions` - 考試題目
  - `user_profile` - 用戶認證資訊
  - `exam_records` - 考試記錄
- ✅ 5 個考試記錄已插入
- ✅ 多個問題記錄已插入（涵蓋所有考試）
- ✅ Row Level Security (RLS) 已啟用
- ✅ RPC 函數已創建：
  - `register_user()` - 用戶註冊
  - `verify_user_login()` - 用戶登入驗證

## 步驟 5: 啟動應用程式

```bash
npm run dev
# 或
pnpm dev
```

應用程式現在會從 Supabase 讀取資料！

## 資料庫結構

### `exams` 表格
- `id` (SERIAL PRIMARY KEY)
- `title` (TEXT)
- `difficulty` (TEXT)
- `description` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `questions` 表格
- `id` (SERIAL PRIMARY KEY)
- `exam_id` (INTEGER, 外鍵參考 exams.id)
- `type` (TEXT, 'MCQ' 或 'Input')
- `question` (TEXT)
- `options` (JSONB, 用於 MCQ 類型的選項陣列)
- `correct_answer` (TEXT)
- `explanation` (TEXT)
- `question_order` (INTEGER)
- `created_at` (TIMESTAMP)

### `user_profile` 表格（用戶認證）
- `id` (SERIAL PRIMARY KEY)
- `username` (TEXT, UNIQUE) - 使用者名稱（唯一值）
- `password_hash` (TEXT) - 加密後的密碼（bcrypt）
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `exam_records` 表格（考試記錄）
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER, 外鍵參考 user_profile.id)
- `exam_id` (INTEGER, 外鍵參考 exams.id)
- `score` (INTEGER) - 正確題數
- `total` (INTEGER) - 總題數
- `percentage` (INTEGER) - 正確率百分比
- `answers` (JSONB) - 用戶答案（陣列格式）
- `completed_at` (TIMESTAMP)

## 認證系統

### 註冊
- 使用 username（至少 4 個字元，只能包含英文、數字或中文）
- 使用 password（至少 4 個字元，只能包含英文或數字）
- 需要註冊密碼 `codecat168`（防止隨意註冊）

### 登入
- 使用 username 和 password 登入
- Session 存儲在瀏覽器的 `localStorage` 中

### RPC 函數
- `register_user(username, password)` - 註冊新用戶
- `verify_user_login(username, password)` - 驗證登入

詳細說明請參考：
- `doc/AUTH_EXPLANATION.md` - 認證系統詳細說明
- `doc/USERNAME_AUTH_SETUP.md` - Username 認證系統設定

## 疑難排解

### 如果看到 "尚無可用考試"
- 確認 SQL 腳本已成功執行
- 檢查 Supabase Dashboard 的 Table Editor 中是否有資料
- 確認 Row Level Security 政策已正確設定

### 如果看到連線錯誤
- 確認 `src/lib/supabase.js` 中的 URL 和 API Key 是否正確
- 檢查 `.env` 文件是否存在且包含正確的環境變數
- 檢查 Supabase 專案是否處於活動狀態

### 如果註冊或登入失敗
- 確認 `user_profile` 表已創建
- 確認 RPC 函數 `register_user` 和 `verify_user_login` 已創建
- 檢查 Supabase Dashboard → Database → Functions 中是否有這些函數
- 確認 `pgcrypto` 擴展已啟用（用於密碼加密）

### 如果看到認證錯誤
- 確認 `AuthProvider` 已正確包裹在 `App.jsx` 中
- 檢查瀏覽器控制台是否有錯誤訊息
- 確認 `localStorage` 中是否有 `user_session`（登入後）

## 後續操作

您可以在 Supabase Dashboard 的 Table Editor 中：
- 新增更多考試
- 編輯現有問題
- 查看考試記錄
- 查看用戶資料（`user_profile` 表）

所有變更會即時反映在應用程式中！

## 相關 SQL 文件

- `sql/supabase-init.sql` - 完整初始化腳本（包含所有表、數據、函數）
- `sql/drop-all-tables.sql` - 刪除所有表的腳本
- `sql/delete-user.sql` - 刪除用戶的腳本

## 相關文檔

- `doc/AUTH_EXPLANATION.md` - 認證系統詳細說明
- `doc/USERNAME_AUTH_SETUP.md` - Username 認證系統設定指南
