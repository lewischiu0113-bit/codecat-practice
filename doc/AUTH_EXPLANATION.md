# 認證系統說明

## 用戶帳號密碼存儲位置

### 1. **自定義 user_profile 表**
系統使用自定義的 **`user_profile`** 表進行認證，不使用 Supabase Auth。

- **表名**: `user_profile`（我們自己創建的表）
- **存儲內容**: 
  - `id` (SERIAL/INTEGER) - 用戶唯一識別碼
  - `username` (TEXT) - 使用者名稱（唯一值，UNIQUE 約束）
  - `password_hash` (TEXT) - 加密後的密碼（使用 PostgreSQL pgcrypto 的 bcrypt）
  - `created_at` (TIMESTAMP) - 註冊時間
  - `updated_at` (TIMESTAMP) - 更新時間

### 2. **密碼加密方式**
- 使用 PostgreSQL 的 `pgcrypto` 擴展
- 使用 `bcrypt` 算法加密密碼
- 密碼在資料庫層級加密，前端只傳送明文密碼到 RPC 函數

### 3. **註冊密碼（c....8）的存儲位置**
註冊密碼 `c....8` **不是存儲在資料庫中**，而是：
- **存儲位置**: `src/utils/encryption.js`
- **加密形式**: `ENCRYPTED_PASSWORD = 'ZHFnZmVkdTM5OQ=='`
- **用途**: 用於驗證是否允許註冊（防止隨意註冊）
- **驗證方式**: 前端使用 `verifyPassword()` 函數驗證

## 資料庫結構

### 我們創建的表（在 `supabase-init.sql` 中）

1. **`exams`** - 考試列表
2. **`questions`** - 考試題目
3. **`user_profile`** - 用戶認證資訊（自定義認證表）
4. **`exam_records`** - 考試記錄（關聯到 `user_profile`）

### Supabase 自動管理的表

- **不使用** `auth.users` 表（我們使用自定義的 `user_profile` 表）

## 關聯關係

```
user_profile (我們創建的表)
    ↓ (user_id INTEGER)
exam_records (我們創建的表)
    ↓ (exam_id INTEGER)
exams (我們創建的表)
```

在 `exam_records` 表中，我們使用：
```sql
user_id INTEGER REFERENCES user_profile(id) ON DELETE CASCADE
```

這表示 `exam_records.user_id` 會關聯到 `user_profile.id`。

## 認證流程

### 註冊流程
1. 用戶在前端輸入 username、password、註冊密碼
2. 前端驗證註冊密碼（使用 `verifyPassword()`）
3. 前端調用 `registerUser()` 函數
4. `registerUser()` 調用 Supabase RPC 函數 `register_user()`
5. RPC 函數在資料庫中：
   - 檢查 username 是否已存在
   - 使用 `crypt()` 和 `gen_salt('bf')` 加密密碼
   - 插入新用戶到 `user_profile` 表
   - 返回用戶資訊

### 登入流程
1. 用戶在前端輸入 username 和 password
2. 前端調用 `loginUser()` 函數
3. `loginUser()` 調用 Supabase RPC 函數 `verify_user_login()`
4. RPC 函數在資料庫中：
   - 查詢 `user_profile` 表找到用戶
   - 使用 `crypt()` 驗證密碼
   - 返回用戶資訊
5. 前端將用戶資訊存儲到 `localStorage`（作為 session）

### Session 管理
- Session 存儲在瀏覽器的 `localStorage` 中
- Key: `user_session`
- 內容包含：`user_id`、`username`、`loginTime`
- 登出時清除 `localStorage`

## 查看用戶資料

如果你想查看已註冊的用戶，可以在 Supabase Dashboard 中：

1. 前往 **Table Editor** → **user_profile**
2. 這裡會顯示所有註冊的用戶
3. 可以看到用戶的 `username`、`created_at` 等資訊
4. **密碼不會顯示**（因為已經加密存儲為 `password_hash`）

## RPC 函數

### `register_user(p_username TEXT, p_password TEXT)`
- 功能：註冊新用戶
- 參數：
  - `p_username`: 使用者名稱
  - `p_password`: 明文密碼
- 返回：JSON 格式
  - `success`: 是否成功
  - `user_id`: 用戶 ID（成功時）
  - `username`: 使用者名稱（成功時）
  - `error`: 錯誤訊息（失敗時）

### `verify_user_login(p_username TEXT, p_password TEXT)`
- 功能：驗證用戶登入
- 參數：
  - `p_username`: 使用者名稱
  - `p_password`: 明文密碼
- 返回：JSON 格式
  - `success`: 是否成功
  - `user_id`: 用戶 ID（成功時）
  - `username`: 使用者名稱（成功時）
  - `error`: 錯誤訊息（失敗時）

## 總結

- ✅ **用戶帳號密碼**: 存儲在自定義的 `user_profile` 表（使用 bcrypt 加密）
- ✅ **註冊密碼**: 存儲在前端代碼 `src/utils/encryption.js`（用於驗證是否允許註冊）
- ✅ **認證方式**: 使用自定義 RPC 函數，不使用 Supabase Auth
- ✅ **Session 管理**: 使用 `localStorage` 存儲用戶 session
- ✅ **我們的 SQL 文件**: 創建 `exams`、`questions`、`user_profile`、`exam_records` 表
