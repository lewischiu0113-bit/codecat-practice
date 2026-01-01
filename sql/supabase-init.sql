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
  type TEXT NOT NULL CHECK (type IN ('MCQ', 'Input')),
  question TEXT NOT NULL,
  options JSONB, -- 用於 MCQ 類型的選項陣列
  correct_answer TEXT NOT NULL,
  explanation TEXT,
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

-- 插入考試資料
INSERT INTO exams (id, title, difficulty, description) VALUES
(1, 'Python DateTime 基礎', '初級', '學習 Python datetime 的基本格式化代碼'),
(2, 'Python DateTime 進階', '中級', '學習更複雜的 datetime 格式化技巧'),
(3, 'Python 格式化輸出 基礎', '初級', '學習使用 format() 方法進行字符串格式化輸出'),
(4, 'Python 格式化輸出 進階', '中級', '學習複雜的 format() 格式化技巧，需要寫出完整的格式化語句'),
(5, 'Python 單元測試 基礎', '初級', '學習使用 unittest 模組進行單元測試'),
(6, 'Python 單元測試 進階', '中級', '學習編寫完整的 unittest 測試代碼，需要填寫關鍵部分'),
(7, 'Python 錯誤類型 基礎', '初級', '學習 Python 各種錯誤類型的區別和應用場景')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  description = EXCLUDED.description;

-- 刪除現有問題（如果存在）
DELETE FROM questions WHERE exam_id IN (1, 2, 3, 4, 5, 6, 7);

-- 插入問題資料 - 考試 1
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(1, 'MCQ', '哪個格式代碼代表 4 位數年份？', '["%y", "%Y", "%D", "%M"]'::jsonb, '%Y', '%Y 代表 4 位數年份（例如：2025），%y 代表 2 位數年份（例如：25）', 1),
(1, 'MCQ', '哪個格式代碼代表月份（01-12）？', '["%m", "%M", "%d", "%D"]'::jsonb, '%m', '%m 代表月份（01-12），%M 代表分鐘（00-59）', 2),
(1, 'Input', E'填入空白處以獲得格式 "2025-12-20"：\n\n```python\nnow.strftime(''_______'')\n```', NULL, '%Y-%m-%d', '%Y 代表年份，%m 代表月份，%d 代表日期，用連字符連接', 3),
(1, 'Input', E'如何顯示時間格式 "14:30:00"？\n\n```python\nnow.strftime(''_______'')\n```', NULL, '%H:%M:%S', '%H 代表小時（24小時制），%M 代表分鐘，%S 代表秒數', 4),
(1, 'MCQ', '哪個格式代碼代表日期（01-31）？', '["%d", "%D", "%m", "%Y"]'::jsonb, '%d', '%d 代表日期（01-31），%D 不是標準的 datetime 格式代碼', 5),
(1, 'Input', E'如何顯示完整的日期時間格式 "2025/12/20 14:30:00"？\n\n```python\nnow.strftime(''_______'')\n```', NULL, '%Y/%m/%d %H:%M:%S', '結合日期和時間格式，用空格分隔', 6),
(1, 'MCQ', '哪個格式代碼代表秒數（00-59）？', '["%s", "%S", "%m", "%M"]'::jsonb, '%S', '%S 代表秒數（00-59），%s 代表自 1970 年以來的秒數（Unix 時間戳）', 7);

-- 插入問題資料 - 考試 2
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(2, 'Input', E'請完成以下代碼，讓輸出結果為 "2025-12-25"：\n\n```python\nimport _______\n\nnow = datetime.datetime(2025, 12, 25)\nprint(now.strftime(_______))\n```\n\n請依序填入：\n1. 模組名稱（用於處理日期時間）\n2. strftime() 的格式字符串（使用百分比符號和特定字母來表示年月日）', NULL, E'datetime\n"%Y-%m-%d"', '需要 import datetime，然後使用 strftime("%Y-%m-%d") 來格式化日期為 "2025-12-25" 格式', 1),
(2, 'Input', E'請完成以下代碼，讓輸出結果為 "2025年12月25日 14:30:00"：\n\n```python\nimport _______\n\nnow = datetime.datetime(2025, 12, 25, 14, 30, 0)\nprint(now.strftime(_______))\n```\n\n請依序填入：\n1. 模組名稱\n2. strftime() 的格式字符串（使用百分比符號，包含年月日時分秒）', NULL, E'datetime\n"%Y年%m月%d日 %H:%M:%S"', '需要 import datetime，然後使用 strftime("%Y年%m月%d日 %H:%M:%S") 來格式化日期時間', 2),
(2, 'Input', E'請完成以下代碼，建立一個日期對象表示 2018年1月15日：\n\n```python\nimport _______\n\nmy_date = datetime.date(_______)\nprint(my_date)  # 輸出：2018-01-15\n```\n\n請依序填入：\n1. 模組名稱\n2. date() 構造函數的參數（年, 月, 日，用逗號分隔）', NULL, E'datetime\n2018, 1, 15', '需要 import datetime，然後使用 datetime.date(2018, 1, 15) 來建立日期對象', 3),
(2, 'Input', E'請完成以下代碼，建立一個日期時間對象表示 2025年1月1日 10點30分0秒：\n\n```python\nimport _______\n\nmy_datetime = datetime.datetime(_______)\nprint(my_datetime)  # 輸出：2025-01-01 10:30:00\n```\n\n請依序填入：\n1. 模組名稱\n2. datetime() 構造函數的參數（年, 月, 日, 時, 分, 秒，用逗號分隔）', NULL, E'datetime\n2025, 1, 1, 10, 30, 0', '需要 import datetime，然後使用 datetime.datetime(2025, 1, 1, 10, 30, 0) 來建立日期時間對象', 4),
(2, 'Input', E'請完成以下代碼，讓輸出結果為 "今天是 2025/12/25"：\n\n```python\nimport _______\n\nnow = datetime.datetime(2025, 12, 25)\nprint(f"今天是 {now.strftime(_______)}")\n```\n\n請依序填入：\n1. 模組名稱\n2. strftime() 的格式字符串（使用百分比符號，用斜線分隔年月日）', NULL, E'datetime\n"%Y/%m/%d"', '需要 import datetime，然後使用 strftime("%Y/%m/%d") 來格式化日期為 "2025/12/25" 格式', 5),
(2, 'Input', E'請完成以下代碼，建立一個日期對象表示 1990年5月15日：\n\n```python\nimport _______\n\nbirthday = datetime.date(_______)\nprint(birthday)  # 輸出：1990-05-15\n```\n\n請依序填入：\n1. 模組名稱\n2. date() 構造函數的參數（年, 月, 日）', NULL, E'datetime\n1990, 5, 15', '需要 import datetime，然後使用 datetime.date(1990, 5, 15) 來建立日期對象', 6),
(2, 'Input', E'請完成以下代碼，讓輸出結果為 "14:30:00"（只顯示時間）：\n\n```python\nimport _______\n\nnow = datetime.datetime(2025, 12, 25, 14, 30, 0)\nprint(now.strftime(_______))\n```\n\n請依序填入：\n1. 模組名稱\n2. strftime() 的格式字符串（使用百分比符號，只包含時分秒）', NULL, E'datetime\n"%H:%M:%S"', '需要 import datetime，然後使用 strftime("%H:%M:%S") 來格式化時間為 "14:30:00" 格式', 7),
(2, 'Input', E'請完成以下代碼，建立一個日期時間對象表示 2025年3月15日 9點0分0秒：\n\n```python\nimport _______\n\nmy_datetime = datetime.datetime(_______)\nprint(my_datetime)  # 輸出：2025-03-15 09:00:00\n```\n\n請依序填入：\n1. 模組名稱\n2. datetime() 構造函數的參數（年, 月, 日, 時, 分, 秒）', NULL, E'datetime\n2025, 3, 15, 9, 0, 0', '需要 import datetime，然後使用 datetime.datetime(2025, 3, 15, 9, 0, 0) 來建立日期時間對象', 8),
(2, 'Input', E'請完成以下代碼，讓輸出結果為 "2025年12月"（只顯示年月）：\n\n```python\nimport _______\n\nnow = datetime.datetime(2025, 12, 25)\nprint(now.strftime(_______))\n```\n\n請依序填入：\n1. 模組名稱\n2. strftime() 的格式字符串（使用百分比符號，只包含年月）', NULL, E'datetime\n"%Y年%m月"', '需要 import datetime，然後使用 strftime("%Y年%m月") 來格式化日期為 "2025年12月" 格式', 9),
(2, 'Input', E'請完成以下代碼，建立一個日期對象表示 2025年3月25日：\n\n```python\nimport _______\n\ndate2 = datetime.date(_______)\nprint(date2)  # 輸出：2025-03-25\n```\n\n請依序填入：\n1. 模組名稱\n2. date() 構造函數的參數（年, 月, 日）', NULL, E'datetime\n2025, 3, 25', '需要 import datetime，然後使用 datetime.date(2025, 3, 25) 來建立日期對象', 10),
(2, 'Input', E'請完成以下代碼，讓輸出結果為 "12/25/2025"（美式日期格式）：\n\n```python\nimport _______\n\nnow = datetime.datetime(2025, 12, 25)\nprint(now.strftime(_______))\n```\n\n請依序填入：\n1. 模組名稱\n2. strftime() 的格式字符串（使用百分比符號，順序為月/日/年）', NULL, E'datetime\n"%m/%d/%Y"', '需要 import datetime，然後使用 strftime("%m/%d/%Y") 來格式化日期為 "12/25/2025" 格式', 11),
(2, 'Input', E'請完成以下代碼，建立一個日期時間對象表示 2025年1月1日 14點45分30秒：\n\n```python\nimport _______\n\nend = datetime.datetime(_______)\nprint(end)  # 輸出：2025-01-01 14:45:30\n```\n\n請依序填入：\n1. 模組名稱\n2. datetime() 構造函數的參數（年, 月, 日, 時, 分, 秒）', NULL, E'datetime\n2025, 1, 1, 14, 45, 30', '需要 import datetime，然後使用 datetime.datetime(2025, 1, 1, 14, 45, 30) 來建立日期時間對象', 12);

-- 插入問題資料 - 考試 3 (Python 格式化輸出)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(3, 'Input', E'您有以下代碼：\n\n```python\nprint("今天是 {}，溫度是 {} 度".format("星期三", 28))\n```\n\n輸出結果為：今天是 星期三，溫度是 28 度\n\n請填入 format() 方法中的第一個參數：\n\n```python\n"今天是 {}，溫度是 {} 度".format(_______)\n```', NULL, '"星期三"', 'format() 方法按順序填入參數，第一個 {} 對應第一個參數', 1),
(3, 'Input', E'您有以下代碼：\n\n```python\nprint("{1} 喜歡 {0}".format("Python", "Vincent"))\n```\n\n輸出結果為：Vincent 喜歡 Python\n\n請填入 format() 方法中索引為 1 的參數：\n\n```python\n"{1} 喜歡 {0}".format("Python", _______)\n```', NULL, '"Vincent"', 'format() 方法中 {1} 表示使用索引為 1 的參數（第二個參數）', 2),
(3, 'Input', E'您有以下代碼：\n\n```python\nprint("圓周率 {_______}".format(3.14159))\n```\n\n要讓輸出顯示為：圓周率 3.14\n\n請填入格式字串：', NULL, ':.2f', '.2f 表示保留小數點後 2 位，記法：.2f = 保留 2 位小數', 3),
(3, 'Input', E'您有以下代碼：\n\n```python\nprint("分數 {_______}".format(89.6))\n```\n\n要讓輸出顯示為：分數 90\n\n請填入格式字串：', NULL, ':.0f', '.0f 表示不顯示小數，會四捨五入為整數', 4),
(3, 'Input', E'您有以下代碼：\n\n```python\nprint("{_______}".format("Hi"))\n```\n\n要讓輸出顯示為：Hi        （總長度 10，靠左對齊）\n\n請填入格式字串：', NULL, ':<10', '< 表示靠左對齊，10 表示欄寬為 10', 5),
(3, 'Input', E'您有以下代碼：\n\n```python\nprint("{_______}".format("Hi"))\n```\n\n要讓輸出顯示為：        Hi （總長度 10，靠右對齊）\n\n請填入格式字串：', NULL, ':>10', '> 表示靠右對齊，10 表示欄寬為 10', 6),
(3, 'Input', E'您有以下代碼：\n\n```python\nprint("{_______}".format("Hi"))\n```\n\n要讓輸出顯示為：    Hi     （總長度 10，置中對齊）\n\n請填入格式字串：', NULL, ':^10', '^ 表示置中對齊，10 表示欄寬為 10', 7),
(3, 'Input', E'您有以下代碼：\n\n```python\nprint("{_______}".format(123.456))\n```\n\n要讓輸出顯示為：    123.46 （總長度 10，靠右對齊）\n\n請填入格式字串：', NULL, ':>10.2f', '> 靠右，10 欄寬，.2f 小數 2 位', 8),
(3, 'Input', E'您有以下代碼：\n\n```python\nprint("{_______}".format(1234567))\n```\n\n要讓輸出顯示為：1,234,567\n\n請填入格式字串：', NULL, ':,', ', 表示加上千分位符號', 9),
(3, 'Input', E'您有以下代碼：\n\n```python\nprint("{_______}".format(12345.678))\n```\n\n要讓輸出顯示為：12,345.68\n\n請填入格式字串：', NULL, ':,.2f', ', 表示千分位，.2f 表示小數 2 位', 10),
(3, 'Input', E'您有以下代碼：\n\n```python\nmoney = 98765.4321\nprint("金額：{_______}".format(money))\n```\n\n要讓輸出顯示為：金額：   98,765.43 （總長度 12，靠右對齊）\n\n請填入格式字串：', NULL, ':>12,.2f', '> 靠右，12 欄寬，, 千分位，.2f 小數 2 位', 11),
(3, 'Input', E'您有以下代碼：\n\n```python\nprint("數字 {_______}".format(1.2))\n```\n\n要讓輸出顯示為：數字 1.2000\n\n請填入格式字串：', NULL, ':.4f', '.4f 表示保留小數點後 4 位', 12);

-- 插入問題資料 - 考試 4 (Python 格式化輸出進階)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(4, 'Input', E'您有以下變數：\n\n```python\nname = "Vincent"\nage = 25\n```\n\n請寫出完整的 print 語句，輸出格式為：\n姓名：Vincent，年齡：25\n\n請完成代碼：\n_______', NULL, 'print("姓名：{}，年齡：{}".format(name, age))', '使用 format() 方法將變數填入字符串中，按順序對應 {}', 1),
(4, 'Input', E'您有以下變數：\n\n```python\nproduct = "筆記本"\nprice = 89.5\nquantity = 3\n```\n\n請寫出完整的 print 語句，輸出格式為：\n商品：筆記本，單價：89.50，數量：3\n\n請完成代碼：\n_______', NULL, 'print("商品：{}，單價：{:.2f}，數量：{}".format(product, price, quantity))', '需要對 price 使用 .2f 格式保留兩位小數', 2),
(4, 'Input', E'您有以下變數：\n\n```python\nscore = 95.678\n```\n\n請寫出完整的 print 語句，輸出格式為：\n分數：    95.68 （總長度 10，靠右對齊）\n\n請完成代碼：\n_______', NULL, 'print("分數：{:>10.2f}".format(score))', '使用 >10.2f 實現靠右對齊、欄寬 10、小數 2 位', 3),
(4, 'Input', E'您有以下變數：\n\n```python\nname = "Python"\n```\n\n請寫出完整的 print 語句，輸出格式為：\nPython        （總長度 15，靠左對齊）\n\n請完成代碼：\n_______', NULL, 'print("{:<15}".format(name))', '使用 <15 實現靠左對齊、欄寬 15', 4),
(4, 'Input', E'您有以下變數：\n\n```python\ntitle = "Hello"\n```\n\n請寫出完整的 print 語句，輸出格式為：\n    Hello     （總長度 12，置中對齊）\n\n請完成代碼：\n_______', NULL, 'print("{:^12}".format(title))', '使用 ^12 實現置中對齊、欄寬 12', 5),
(4, 'Input', E'您有以下變數：\n\n```python\npopulation = 1234567\n```\n\n請寫出完整的 print 語句，輸出格式為：\n人口數：1,234,567\n\n請完成代碼：\n_______', NULL, 'print("人口數：{:,}".format(population))', '使用 , 格式加上千分位符號', 6),
(4, 'Input', E'您有以下變數：\n\n```python\nrevenue = 9876543.21\n```\n\n請寫出完整的 print 語句，輸出格式為：\n營收：9,876,543.21\n\n請完成代碼：\n_______', NULL, 'print("營收：{:,}".format(revenue))', '使用 , 格式加上千分位，浮點數會自動保留小數', 7),
(4, 'Input', E'您有以下變數：\n\n```python\nbalance = 12345.678\n```\n\n請寫出完整的 print 語句，輸出格式為：\n餘額：12,345.68\n\n請完成代碼：\n_______', NULL, 'print("餘額：{:,.2f}".format(balance))', '使用 ,.2f 同時加上千分位和保留 2 位小數', 8),
(4, 'Input', E'您有以下變數：\n\n```python\nitem = "筆記本"\nprice = 89.5\n```\n\n請寫出完整的 print 語句，輸出格式為：\n商品：筆記本，價格：89.50\n\n請完成代碼：\n_______', NULL, 'print("商品：{}，價格：{:.2f}".format(item, price))', '對 price 使用 .2f 格式保留兩位小數', 9),
(4, 'Input', E'您有以下變數：\n\n```python\nname = "Alice"\nscore = 95.678\n```\n\n請寫出完整的 print 語句，輸出格式為：\n姓名：Alice，分數：   95.68 （分數部分總長度 8，靠右對齊）\n\n請完成代碼：\n_______', NULL, 'print("姓名：{}，分數：{:>8.2f}".format(name, score))', '對 score 使用 >8.2f 實現靠右對齊、欄寬 8、小數 2 位', 10),
(4, 'Input', E'您有以下變數：\n\n```python\nproduct = "筆記本"\nprice = 89.5\nquantity = 3\ntotal = price * quantity\n```\n\n請寫出完整的 print 語句，輸出格式為：\n商品：筆記本，單價：89.50，數量：3，總計：268.50\n\n請完成代碼：\n_______', NULL, 'print("商品：{}，單價：{:.2f}，數量：{}，總計：{:.2f}".format(product, price, quantity, total))', '對 price 和 total 都使用 .2f 格式保留兩位小數', 11),
(4, 'Input', E'您有以下變數：\n\n```python\nsalary = 98765.4321\n```\n\n請寫出完整的 print 語句，輸出格式為：\n薪資：   98,765.43 （總長度 12，靠右對齊）\n\n請完成代碼：\n_______', NULL, 'print("薪資：{:>12,.2f}".format(salary))', '使用 >12,.2f 實現靠右對齊、欄寬 12、千分位、小數 2 位', 12);

-- 插入問題資料 - 考試 5 (Python 單元測試)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(5, 'MCQ', '在 Python 中，如何正確導入 unittest 模組？', '["import unittest", "from unittest import *", "import test", "from test import unittest"]'::jsonb, 'import unittest', '使用 import unittest 來導入 unittest 模組，這是標準的導入方式', 1),
(5, 'MCQ', '如何定義一個繼承自 unittest.TestCase 的測試類？', '["class TestString(unittest.TestCase):", "class TestString(TestCase):", "class TestString(test.TestCase):", "class TestString:"]'::jsonb, 'class TestString(unittest.TestCase):', '測試類必須繼承自 unittest.TestCase，完整的寫法是 class TestString(unittest.TestCase):', 2),
(5, 'MCQ', '以下哪個是正確的測試方法命名方式？', '["def test_upper(self):", "def upper_test(self):", "def testUpper(self):", "def upper(self):"]'::jsonb, 'def test_upper(self):', '測試方法名稱必須以 test_ 開頭，這樣 unittest 才能自動識別並執行這些測試方法', 3),
(5, 'MCQ', '如果要測試兩個值是否相等，應該使用哪個斷言方法？', '["self.assertTrue()", "self.assertEqual()", "self.assertSame()", "self.assertNotEqual()"]'::jsonb, 'self.assertEqual()', 'self.assertEqual() 用於測試兩個值是否相等，例如：self.assertEqual("foo".upper(), "FOO")', 4),
(5, 'MCQ', '如果要測試某個條件是否為 True，應該使用哪個斷言方法？', '["self.assertEqual()", "self.assertTrue()", "self.assertFalse()", "self.assert()"]'::jsonb, 'self.assertTrue()', 'self.assertTrue() 用於測試某個條件是否為 True，例如：self.assertTrue("FOO".isupper())', 5),
(5, 'MCQ', '如果要測試某個條件是否為 False，應該使用哪個斷言方法？', '["self.assertFalse()", "self.assertNotTrue()", "self.assertEqual(False)", "self.assert()"]'::jsonb, 'self.assertFalse()', 'self.assertFalse() 用於測試某個條件是否為 False，例如：self.assertFalse("Foo".isupper())', 6),
(5, 'MCQ', '如果要測試某個操作是否會拋出特定異常，應該使用哪個斷言方法？', '["self.assertRaises()", "self.assertException()", "self.assertError()", "self.assertRaise()"]'::jsonb, 'self.assertRaises()', 'self.assertRaises() 用於測試是否會拋出特定異常，例如：with self.assertRaises(TypeError): s.split(2)', 7),
(5, 'MCQ', '以下哪個是正確的執行測試的方式？', '["unittest.main()", "main()", "TestString.main()", "unitTest.main()"]'::jsonb, 'unittest.main()', '使用 unittest.main() 可以在直接執行腳本時運行所有測試', 8),
(5, 'MCQ', E'根據以下代碼，test_upper 方法會測試什麼？\n\n```python\ndef test_upper(self):\n    self.assertEqual("foo".upper(), "FOO")\n```', '["測試 ''foo'' 是否等於 ''FOO''", "測試 ''foo''.upper() 是否等於 ''FOO''", "測試 upper() 方法是否存在", "測試字符串是否為大寫"]'::jsonb, '測試 ''foo''.upper() 是否等於 ''FOO''', '這個測試方法使用 assertEqual 來驗證 "foo".upper() 的結果是否等於 "FOO"', 9),
(5, 'MCQ', E'根據以下代碼，test_isupper 方法會測試什麼？\n\n```python\ndef test_isupper(self):\n    self.assertTrue("FOO".isupper())\n    self.assertFalse("Foo".isupper())\n```', '["測試字符串是否為大寫", "測試 isupper() 方法是否正確工作", "測試 ''FOO'' 和 ''Foo'' 是否相等", "測試字符串長度"]'::jsonb, '測試 isupper() 方法是否正確工作', '這個測試方法使用 assertTrue 和 assertFalse 來驗證 isupper() 方法在不同情況下的行為是否正確', 10),
(5, 'MCQ', E'根據以下代碼，test_split 方法中的 assertRaises 測試什麼？\n\n```python\ndef test_split(self):\n    s = "hello world"\n    self.assertEqual(s.split(), ["hello", "world"])\n    with self.assertRaises(TypeError):\n        s.split(2)\n```', '["測試 split() 是否正確分割字符串", "測試當傳入非字符串參數時是否拋出 TypeError", "測試 split() 是否返回列表", "測試字符串長度"]'::jsonb, '測試當傳入非字符串參數時是否拋出 TypeError', 'assertRaises(TypeError) 用於測試當 split() 方法接收到非字符串參數（如整數 2）時，是否會正確拋出 TypeError 異常', 11),
(5, 'MCQ', '在 unittest 中，測試方法的參數 self 代表什麼？', '["測試類的實例", "測試模組", "測試函數", "測試結果"]'::jsonb, '測試類的實例', 'self 代表測試類的實例，通過 self 可以訪問 TestCase 類提供的所有斷言方法（如 assertEqual、assertTrue 等）', 12);

-- 插入問題資料 - 考試 6 (Python 單元測試進階)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(6, 'Input', E'請完成以下導入語句：\n\n```python\nimport _______\n```', NULL, 'unittest', '使用 import unittest 來導入 unittest 模組', 1),
(6, 'Input', E'請完成以下類定義：\n\n```python\nclass TestStringMethods(_______):\n```', NULL, 'unittest.TestCase', '測試類必須繼承自 unittest.TestCase', 2),
(6, 'Input', E'請完成以下測試方法定義：\n\n```python\n    def _______upper(self):\n        self.assertEqual(''foo''.upper(), ''FOO'')\n```', NULL, 'test_', '測試方法名稱必須以 test_ 開頭，這樣 unittest 才能自動識別並執行', 3),
(6, 'Input', E'請完成以下測試方法：\n\n```python\n    def test_upper(self):\n        self._______(''foo''.upper(), ''FOO'')\n```', NULL, 'assertEqual', '使用 assertEqual() 來測試兩個值是否相等', 4),
(6, 'Input', E'請完成以下測試方法：\n\n```python\n    def test_isupper(self):\n        self._______(''FOO''.isupper())\n```', NULL, 'assertTrue', '使用 assertTrue() 來測試條件是否為 True', 5),
(6, 'Input', E'請完成以下測試方法：\n\n```python\n    def test_isupper(self):\n        self.assertTrue(''FOO''.isupper())\n        self._______(''Foo''.isupper())\n```', NULL, 'assertFalse', '使用 assertFalse() 來測試條件是否為 False', 6),
(6, 'Input', E'請完成以下測試方法：\n\n```python\n    def test_split(self):\n        s = ''hello world''\n        self.assertEqual(s.split(), [''hello'', ''world''])\n        with self._______(TypeError):\n            s.split(2)\n```', NULL, 'assertRaises', '使用 assertRaises() 來測試是否會拋出特定異常', 7),
(6, 'Input', E'請完成以下代碼，讓測試在直接執行腳本時運行：\n\n```python\nif _______ == ''__main__'':\n    unittest.main()\n```', NULL, '__name__', '使用 if __name__ == "__main__": 來判斷是否直接執行腳本', 8),
(6, 'Input', E'請完成以下測試方法，測試字符串的長度：\n\n```python\n    def test_length(self):\n        self._______(''Python'', 6)\n```', NULL, 'assertEqual', '使用 assertEqual() 來測試字符串長度是否等於預期值', 9),
(6, 'Input', E'請完成以下測試方法：\n\n```python\n    def test_split(self):\n        s = ''hello world''\n        self._______(s.split(), [''hello'', ''world''])\n```', NULL, 'assertEqual', '使用 assertEqual() 來測試 split() 方法的返回值是否等於預期結果', 10),
(6, 'Input', E'請完成以下測試方法定義：\n\n```python\n    def test_upper(_______):\n        self.assertEqual(''foo''.upper(), ''FOO'')\n```', NULL, 'self', '測試方法的第一個參數必須是 self，代表測試類的實例', 11),
(6, 'Input', E'請完成以下測試方法：\n\n```python\n    def test_isupper(self):\n        self._______(''FOO''.isupper())\n        self.assertFalse(''Foo''.isupper())\n```', NULL, 'assertTrue', '使用 assertTrue() 來測試 ''FOO''.isupper() 是否返回 True', 12);

-- 插入問題資料 - 考試 7 (Python 錯誤類型)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(7, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\nx = "hello"\nx.push()\n```', '["AttributeError", "TypeError", "NameError", "SyntaxError"]'::jsonb, 'AttributeError', '物件沒有你呼叫的方法或屬性時會發生 AttributeError。字串沒有 push() 方法', 1),
(7, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\nf = open(''numbers.txt'')\nf.readall()\n```', '["AttributeError", "EOFError", "SystemError", "SyntaxError"]'::jsonb, 'AttributeError', '檔案物件沒有 readall() 方法，正確的方法是 read()，所以會拋出 AttributeError', 2),
(7, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\nprint(undefined_var)\n```', '["NameError", "AttributeError", "TypeError", "SyntaxError"]'::jsonb, 'NameError', '當使用未定義的變數時會拋出 NameError', 3),
(7, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\n1 + "2"\n```', '["TypeError", "ValueError", "AttributeError", "SyntaxError"]'::jsonb, 'TypeError', '型別不合的操作會拋出 TypeError。整數和字串無法直接相加', 4),
(7, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\nif True\n    print("Hi")\n```', '["SyntaxError", "IndentationError", "TypeError", "NameError"]'::jsonb, 'SyntaxError', '程式碼語法錯誤會在執行前被偵測到，拋出 SyntaxError。if 語句缺少冒號', 5),
(7, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\nif True:\nprint("Hi")\n```', '["IndentationError", "SyntaxError", "TypeError", "NameError"]'::jsonb, 'IndentationError', '縮排不合法會拋出 IndentationError。print 語句應該要縮排', 6),
(7, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\n1 / 0\n```', '["ZeroDivisionError", "ArithmeticError", "ValueError", "TypeError"]'::jsonb, 'ZeroDivisionError', '除以零會拋出 ZeroDivisionError，這是 ArithmeticError 的子類別', 7),
(7, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\ntry:\n    result = 10 / 0\nexcept Exception:\n    pass\n```', '["不會拋出錯誤", "ZeroDivisionError", "ArithmeticError", "Exception"]'::jsonb, '不會拋出錯誤', 'Exception 是所有例外的基底類別，可以捕捉所有錯誤，所以錯誤被捕捉後不會再拋出', 8),
(7, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\nnumbers = [1, 2, 3]\nnumbers.append(4)\nnumbers.push(5)\n```', '["AttributeError", "TypeError", "NameError", "IndexError"]'::jsonb, 'AttributeError', '列表沒有 push() 方法，正確的方法是 append()，所以會拋出 AttributeError', 9),
(7, 'MCQ', E'以下哪個錯誤類型是數學運算錯誤的基底類別？', '["ArithmeticError", "MathError", "ValueError", "TypeError"]'::jsonb, 'ArithmeticError', 'ArithmeticError 是數學運算錯誤的基底類別，ZeroDivisionError 是它的子類別', 10),
(7, 'Input', E'請完成以下程式碼：\n\n```python\ntry:\n    x = "hello"\n    x.push()\nexcept _______:\n    print("屬性錯誤")\n```', NULL, 'AttributeError', '使用 except AttributeError: 來捕捉屬性錯誤', 11),
(7, 'Input', E'請完成以下程式碼：\n\n```python\ntry:\n    print(undefined_var)\nexcept _______:\n    print("變數未定義")\n```', NULL, 'NameError', '使用 except NameError: 來捕捉變數未定義的錯誤', 12),
(7, 'Input', E'請完成以下程式碼：\n\n```python\ntry:\n    result = 1 + "2"\nexcept _______:\n    print("型別錯誤")\n```', NULL, 'TypeError', '使用 except TypeError: 來捕捉型別不合的操作錯誤', 13),
(7, 'Input', E'請完成以下程式碼，捕捉所有錯誤：\n\n```python\ntry:\n    result = 10 / 0\nexcept _______:\n    print("發生錯誤")\n```', NULL, 'Exception', '使用 except Exception: 可以捕捉所有錯誤（除了系統退出相關的錯誤）', 14);

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
