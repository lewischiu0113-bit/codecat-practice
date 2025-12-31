# Username 認證系統說明

## 概述

系統使用自定義的 **`user_profile`** 表進行認證，使用 **username**（使用者名稱）和 **password**（密碼），完全不依賴 Supabase Auth。

## 驗證規則

### Username（使用者名稱）
- ✅ 至少 4 個字元
- ✅ 只能包含：英文、數字、中文
- ✅ 不允許特殊符號
- ✅ 資料庫層級的唯一性約束（UNIQUE）

### Password（密碼）
- ✅ 至少 4 個字元
- ✅ 只能包含：英文或數字
- ✅ 不允許特殊符號或中文
- ✅ 使用 bcrypt 加密存儲

## 技術實現

### 1. **資料庫結構**

#### `user_profile` 表
```sql
CREATE TABLE user_profile (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,  -- 使用者名稱（唯一值）
  password_hash TEXT NOT NULL,     -- 加密後的密碼
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `exam_records` 表關聯
```sql
CREATE TABLE exam_records (
  ...
  user_id INTEGER REFERENCES user_profile(id) ON DELETE CASCADE,
  ...
);
```

### 2. **RPC 函數**

#### 註冊函數：`register_user()`
```sql
CREATE OR REPLACE FUNCTION register_user(
  p_username TEXT,
  p_password TEXT
)
RETURNS JSON
```

- 檢查 username 是否已存在
- 使用 `crypt(p_password, gen_salt('bf'))` 加密密碼（bcrypt）
- 插入新用戶到 `user_profile` 表
- 返回 JSON 格式的結果

#### 登入函數：`verify_user_login()`
```sql
CREATE OR REPLACE FUNCTION verify_user_login(
  p_username TEXT,
  p_password TEXT
)
RETURNS JSON
```

- 查詢 `user_profile` 表找到用戶
- 使用 `crypt(p_password, password_hash)` 驗證密碼
- 返回 JSON 格式的結果

### 3. **前端實現**

#### 註冊流程
```javascript
// src/utils/auth.js
export const registerUser = async (username, password) => {
  const { data, error } = await supabase.rpc('register_user', {
    p_username: username,
    p_password: password,
  });
  // ...
};
```

#### 登入流程
```javascript
// src/utils/auth.js
export const loginUser = async (username, password) => {
  const { data, error } = await supabase.rpc('verify_user_login', {
    p_username: username,
    p_password: password,
  });
  
  // 將用戶資訊存儲到 localStorage
  if (data && data.success) {
    localStorage.setItem('user_session', JSON.stringify({
      user_id: data.user_id,
      username: data.username,
      loginTime: new Date().toISOString(),
    }));
  }
  // ...
};
```

#### Session 管理
- 使用 `localStorage` 存儲用戶 session
- Key: `user_session`
- 登出時清除 `localStorage`

## 資料庫設定

### 1. 執行初始化 SQL

在 Supabase Dashboard → SQL Editor 中執行 `supabase-init.sql`：

1. 創建 `user_profile` 表
2. 創建 `exam_records` 表（關聯到 `user_profile`）
3. 創建 RPC 函數：`register_user()` 和 `verify_user_login()`
4. 設置 RLS 政策

### 2. RLS 政策

- **user_profile**: 允許所有人讀取和插入（用於登入和註冊）
- **exam_records**: 允許所有操作（前端會手動過濾 `user_id`）

注意：由於使用自定義認證，RLS 無法知道當前用戶，所以在前端手動過濾 `user_id`。

## 查看用戶資料

在 Supabase Dashboard → Table Editor → user_profile 中，你會看到：
- **id**: 用戶 ID（INTEGER）
- **username**: 使用者名稱
- **password_hash**: 加密後的密碼（bcrypt 格式）
- **created_at**: 註冊時間
- **updated_at**: 更新時間

## 注意事項

1. **Username 唯一性**：
   - 資料庫層級的 `UNIQUE` 約束確保 username 唯一
   - 如果 username 已存在，註冊會失敗並返回錯誤

2. **密碼安全**：
   - 密碼使用 bcrypt 算法加密（PostgreSQL pgcrypto 擴展）
   - 前端只傳送明文密碼到 RPC 函數
   - 密碼在資料庫層級加密存儲

3. **註冊密碼**：
   - 仍然需要輸入註冊密碼 `c....8`（加密存儲在 `src/utils/encryption.js`）
   - 這是為了防止隨意註冊
   - 前端驗證通過後才會調用 `register_user()` RPC 函數

4. **Session 管理**：
   - Session 存儲在 `localStorage`，不是服務器端
   - 清除瀏覽器數據會導致登出
   - 可以考慮添加 session 過期機制

## 範例

### 註冊範例
- **Username**: `testuser123`
- **Password**: `pass1234`
- **註冊密碼**: `c....8`

### 登入範例
- **Username**: `testuser123`
- **Password**: `pass1234`

## 相關文件

- `src/components/Register.jsx` - 註冊頁面
- `src/components/Login.jsx` - 登入頁面
- `src/utils/auth.js` - 認證工具函數（registerUser, loginUser, getCurrentUser）
- `src/utils/encryption.js` - 註冊密碼驗證
- `src/contexts/AuthContext.jsx` - 認證上下文（管理 session 狀態）
- `supabase-init.sql` - 資料庫初始化腳本（包含表結構和 RPC 函數）

## 與 Supabase Auth 的差異

| 項目 | Supabase Auth | 自定義認證系統 |
|------|--------------|---------------|
| 用戶表 | `auth.users` (UUID) | `user_profile` (INTEGER) |
| 認證方式 | `supabase.auth.signUp()` | RPC 函數 `register_user()` |
| 登入方式 | `supabase.auth.signInWithPassword()` | RPC 函數 `verify_user_login()` |
| Session | JWT token | localStorage |
| Email 驗證 | 需要（可關閉） | 不需要 |
| 密碼加密 | Supabase 自動處理 | PostgreSQL bcrypt |

## 優勢

1. ✅ **完全控制**：不依賴 Supabase Auth，可以自定義所有邏輯
2. ✅ **簡單直接**：使用 username 而不是 email，更符合需求
3. ✅ **無需 Email 驗證**：不需要處理 email 驗證問題
4. ✅ **資料庫層級加密**：密碼在資料庫層級加密，更安全
