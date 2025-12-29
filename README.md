# Python DateTime Exam Platform

一個使用 React、Vite 和 Tailwind CSS 建立的 Python DateTime 考試平台。

## 環境設置

### 1. 安裝依賴

```bash
npm install
# 或
pnpm install
```

### 2. 設置環境變數

複製 `.env.example` 為 `.env` 並填入您的 Supabase 憑證：

```bash
cp .env.example .env
```

編輯 `.env` 文件，填入您的 Supabase 配置：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**重要：** `.env` 文件已加入 `.gitignore`，不會被提交到 Git。

### 3. 初始化資料庫

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇您的專案
3. 點擊左側選單的 **"SQL Editor"**
4. 複製 `supabase-init.sql` 檔案的內容
5. 貼上並執行 SQL 腳本

詳細說明請參考 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 4. 啟動開發伺服器

```bash
npm run dev
# 或
pnpm dev
```

應用程式將在 `http://localhost:5173` 運行。

## 專案結構

- `src/components/` - React 組件
- `src/data.js` - 資料層（Supabase 操作）
- `src/lib/supabase.js` - Supabase 客戶端配置
- `supabase-init.sql` - 資料庫初始化腳本
