# CodeCat Practice - Python 考試平台

一個使用 React、Vite 和 Tailwind CSS 建立的 Python 程式設計考試平台，支援多種題型（選擇題、填空題）和即時評分。

## 功能特色

- ✅ **多種考試類型**：Python DateTime、格式化輸出、單元測試等
- ✅ **多種題型**：選擇題（MCQ）和填空題（Input）
- ✅ **即時評分**：提交後立即顯示分數和詳細解析
- ✅ **歷史記錄**：查看過去的考試記錄和成績
- ✅ **用戶認證**：使用 username 和 password 登入系統
- ✅ **個人化**：每個用戶只能查看自己的考試記錄
- ✅ **現代化 UI**：使用 Tailwind CSS 打造的美觀界面

## 技術棧

- **前端框架**: React 18
- **建置工具**: Vite
- **樣式**: Tailwind CSS
- **後端**: Supabase (PostgreSQL)
- **路由**: React Router
- **圖標**: Lucide React

## 環境設置

### 1. 安裝依賴

```bash
npm install
# 或
pnpm install
```

### 2. 設置環境變數

在專案根目錄創建 `.env` 文件，並填入您的 Supabase 憑證：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**獲取 Supabase 憑證：**
1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇您的專案
3. 點擊左側選單的 **"Settings"** → **"API"**
4. 複製 **"Project URL"** 和 **"anon public"** key

**重要：** `.env` 文件已加入 `.gitignore`，不會被提交到 Git。

### 3. 初始化資料庫

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇您的專案
3. 點擊左側選單的 **"SQL Editor"**
4. 點擊 **"New query"** 按鈕
5. 複製 `sql/supabase-init.sql` 檔案的**全部內容**
6. 貼上到 SQL Editor 中
7. 點擊 **"Run"** 按鈕執行

詳細說明請參考 [doc/SUPABASE_SETUP.md](./doc/SUPABASE_SETUP.md)

### 4. 啟動開發伺服器

```bash
npm run dev
# 或
pnpm dev
```

應用程式將在 `http://localhost:5173` 運行。

## 使用說明

### 註冊帳號

1. 訪問 `/register` 頁面
2. 輸入使用者名稱（至少 4 個字元，只能包含英文、數字或中文）
3. 輸入密碼（至少 4 個字元，只能包含英文或數字）
4. 輸入註冊密碼：`codecat168`
5. 點擊「註冊」按鈕

### 登入系統

1. 訪問 `/login` 頁面
2. 輸入使用者名稱和密碼
3. 點擊「登入」按鈕

### 進行考試

1. 登入後，前往「考題列表」頁面
2. 選擇一個考試
3. 回答所有問題
4. 點擊「提交答案」
5. 查看分數和詳細解析

### 查看歷史記錄

1. 前往「歷史紀錄」頁面
2. 查看所有過去的考試記錄
3. 可以點擊記錄查看詳細資訊

## 專案結構

```
codecat-practice/
├── doc/                    # 文檔目錄
│   ├── AUTH_EXPLANATION.md      # 認證系統說明
│   ├── SUPABASE_SETUP.md        # Supabase 設定指南
│   └── USERNAME_AUTH_SETUP.md   # Username 認證設定
├── sql/                    # SQL 腳本目錄
│   ├── supabase-init.sql        # 完整初始化腳本
│   ├── drop-all-tables.sql      # 刪除所有表
│   └── delete-user.sql          # 刪除用戶腳本
├── src/
│   ├── components/          # React 組件
│   │   ├── Dashboard.jsx         # 首頁儀表板
│   │   ├── ExamList.jsx         # 考試列表
│   │   ├── ExamInterface.jsx    # 考試界面
│   │   ├── Results.jsx          # 結果頁面
│   │   ├── History.jsx          # 歷史記錄
│   │   ├── Login.jsx           # 登入頁面
│   │   ├── Register.jsx        # 註冊頁面
│   │   ├── ProtectedRoute.jsx  # 受保護的路由
│   │   ├── Sidebar.jsx         # 側邊欄
│   │   └── QuestionCard.jsx    # 題目卡片
│   ├── contexts/           # React Context
│   │   └── AuthContext.jsx     # 認證上下文
│   ├── utils/              # 工具函數
│   │   ├── auth.js             # 認證工具（註冊、登入、登出）
│   │   └── encryption.js       # 密碼加密工具
│   ├── lib/                # 第三方庫配置
│   │   └── supabase.js         # Supabase 客戶端
│   ├── data.js             # 資料層（Supabase 操作）
│   ├── App.jsx             # 主應用組件
│   └── main.jsx            # 應用入口
├── public/                 # 靜態資源
│   └── cat.png            # 網站圖標
└── README.md              # 本文件
```

## 資料庫結構

### 主要表格

- **`exams`** - 考試列表
- **`questions`** - 考試題目
- **`user_profile`** - 用戶認證資訊（自定義認證表）
- **`exam_records`** - 考試記錄

### RPC 函數

- **`register_user(username, password)`** - 註冊新用戶
- **`verify_user_login(username, password)`** - 驗證登入

詳細說明請參考：
- [doc/AUTH_EXPLANATION.md](./doc/AUTH_EXPLANATION.md) - 認證系統詳細說明
- [doc/USERNAME_AUTH_SETUP.md](./doc/USERNAME_AUTH_SETUP.md) - Username 認證設定

## 考試內容

目前包含以下考試：

1. **Python DateTime 基礎格式化** - 學習 Python datetime 的基本格式化代碼
2. **Python DateTime 進階格式化** - 學習更複雜的 datetime 格式化技巧
3. **Python 格式化輸出** - 學習使用 format() 方法進行字符串格式化輸出
4. **Python 格式化輸出（進階）** - 學習複雜的 format() 格式化技巧
5. **Python 單元測試** - 學習使用 unittest 模組進行單元測試

## 認證系統

系統使用自定義的 `user_profile` 表進行認證：

- **Username**: 至少 4 個字元，只能包含英文、數字或中文
- **Password**: 至少 4 個字元，只能包含英文或數字
- **註冊密碼**: `codecat168`（防止隨意註冊）
- **Session**: 存儲在瀏覽器的 `localStorage` 中

詳細說明請參考 [doc/AUTH_EXPLANATION.md](./doc/AUTH_EXPLANATION.md)

## 疑難排解

### 如果看到連線錯誤
- 確認 `.env` 文件是否存在且包含正確的環境變數
- 確認 `src/lib/supabase.js` 中的 URL 和 API Key 是否正確
- 檢查 Supabase 專案是否處於活動狀態

### 如果註冊或登入失敗
- 確認 `user_profile` 表已創建
- 確認 RPC 函數 `register_user` 和 `verify_user_login` 已創建
- 檢查 Supabase Dashboard → Database → Functions 中是否有這些函數

### 如果看到 "尚無可用考試"
- 確認 SQL 腳本已成功執行
- 檢查 Supabase Dashboard 的 Table Editor 中是否有資料
- 確認 Row Level Security 政策已正確設定

更多疑難排解請參考 [doc/SUPABASE_SETUP.md](./doc/SUPABASE_SETUP.md)

## 開發

### 建置生產版本

```bash
npm run build
# 或
pnpm build
```

### 預覽生產版本

```bash
npm run preview
# 或
pnpm preview
```

## 授權

本專案僅供學習使用。
