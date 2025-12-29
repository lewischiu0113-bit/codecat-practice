# Supabase 資料庫設定指南

## 步驟 1: 安裝依賴

首先安裝 Supabase 客戶端庫：

```bash
npm install
# 或
pnpm install
```

## 步驟 2: 在 Supabase Dashboard 中執行 SQL 腳本

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇您的專案（tumnkqggbyvjzwrffuao）
3. 點擊左側選單的 **"SQL Editor"**
4. 點擊 **"New query"** 按鈕
5. 複製 `supabase-init.sql` 檔案的**全部內容**
6. 貼上到 SQL Editor 中
7. 點擊 **"Run"** 按鈕執行

## 步驟 3: 驗證資料庫設定

執行 SQL 腳本後，您應該會看到：

- ✅ 兩個表格已建立：`exams` 和 `questions`
- ✅ 2 個考試記錄已插入
- ✅ 10 個問題記錄已插入
- ✅ Row Level Security (RLS) 已啟用並設定為公開讀取

## 步驟 4: 啟動應用程式

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

## 疑難排解

### 如果看到 "尚無可用考試"
- 確認 SQL 腳本已成功執行
- 檢查 Supabase Dashboard 的 Table Editor 中是否有資料
- 確認 Row Level Security 政策已正確設定

### 如果看到連線錯誤
- 確認 `src/lib/supabase.js` 中的 URL 和 API Key 是否正確
- 檢查 Supabase 專案是否處於活動狀態

## 後續操作

您可以在 Supabase Dashboard 的 Table Editor 中：
- 新增更多考試
- 編輯現有問題
- 查看考試記錄

所有變更會即時反映在應用程式中！

