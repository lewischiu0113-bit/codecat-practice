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
(1, 'Python DateTime 基礎格式化', '初級', '學習 Python datetime 的基本格式化代碼'),
(2, 'Python DateTime 進階格式化', '中級', '學習更複雜的 datetime 格式化技巧'),
(3, 'Python 格式化輸出', '初級', '學習使用 format() 方法進行字符串格式化輸出'),
(4, 'Python 格式化輸出（進階）', '中級', '學習複雜的 format() 格式化技巧，需要寫出完整的格式化語句'),
(5, 'Python 單元測試', '中級', '學習使用 unittest 模組進行單元測試')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  description = EXCLUDED.description;

-- 刪除現有問題（如果存在）
DELETE FROM questions WHERE exam_id IN (1, 2, 3, 4, 5);

-- 插入問題資料 - 考試 1
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(1, 'MCQ', '哪個格式代碼代表 4 位數年份？', '["%y", "%Y", "%D", "%M"]'::jsonb, '%Y', '%Y 代表 4 位數年份（例如：2025），%y 代表 2 位數年份（例如：25）', 1),
(1, 'MCQ', '哪個格式代碼代表月份（01-12）？', '["%m", "%M", "%d", "%D"]'::jsonb, '%m', '%m 代表月份（01-12），%M 代表分鐘（00-59）', 2),
(1, 'Input', E'填入空白處以獲得格式 "2025-12-20"：\nnow.strftime(''_______'')', NULL, '%Y-%m-%d', '%Y 代表年份，%m 代表月份，%d 代表日期，用連字符連接', 3),
(1, 'Input', E'如何顯示時間格式 "14:30:00"？\nnow.strftime(''_______'')', NULL, '%H:%M:%S', '%H 代表小時（24小時制），%M 代表分鐘，%S 代表秒數', 4),
(1, 'MCQ', '哪個格式代碼代表日期（01-31）？', '["%d", "%D", "%m", "%Y"]'::jsonb, '%d', '%d 代表日期（01-31），%D 不是標準的 datetime 格式代碼', 5),
(1, 'Input', E'如何顯示完整的日期時間格式 "2025/12/20 14:30:00"？\nnow.strftime(''_______'')', NULL, '%Y/%m/%d %H:%M:%S', '結合日期和時間格式，用空格分隔', 6),
(1, 'MCQ', '哪個格式代碼代表秒數（00-59）？', '["%s", "%S", "%m", "%M"]'::jsonb, '%S', '%S 代表秒數（00-59），%s 代表自 1970 年以來的秒數（Unix 時間戳）', 7);

-- 插入問題資料 - 考試 2
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(2, 'Input', E'請完成以下代碼，讓輸出結果為 "2025-12-25"：\n\nimport _______\n\nnow = datetime.datetime(2025, 12, 25)\nprint(now.strftime(_______))\n\n請依序填入：\n1. 模組名稱（用於處理日期時間）\n2. strftime() 的格式字符串（使用百分比符號和特定字母來表示年月日）', NULL, E'datetime\n"%Y-%m-%d"', '需要 import datetime，然後使用 strftime("%Y-%m-%d") 來格式化日期為 "2025-12-25" 格式', 1),
(2, 'Input', E'請完成以下代碼，讓輸出結果為 "2025年12月25日 14:30:00"：\n\nimport _______\n\nnow = datetime.datetime(2025, 12, 25, 14, 30, 0)\nprint(now.strftime(_______))\n\n請依序填入：\n1. 模組名稱\n2. strftime() 的格式字符串（使用百分比符號，包含年月日時分秒）', NULL, E'datetime\n"%Y年%m月%d日 %H:%M:%S"', '需要 import datetime，然後使用 strftime("%Y年%m月%d日 %H:%M:%S") 來格式化日期時間', 2),
(2, 'Input', E'請完成以下代碼，建立一個日期對象表示 2018年1月15日：\n\nimport _______\n\nmy_date = datetime.date(_______)\nprint(my_date)  # 輸出：2018-01-15\n\n請依序填入：\n1. 模組名稱\n2. date() 構造函數的參數（年, 月, 日，用逗號分隔）', NULL, E'datetime\n2018, 1, 15', '需要 import datetime，然後使用 datetime.date(2018, 1, 15) 來建立日期對象', 3),
(2, 'Input', E'請完成以下代碼，建立一個日期時間對象表示 2025年1月1日 10點30分0秒：\n\nimport _______\n\nmy_datetime = datetime.datetime(_______)\nprint(my_datetime)  # 輸出：2025-01-01 10:30:00\n\n請依序填入：\n1. 模組名稱\n2. datetime() 構造函數的參數（年, 月, 日, 時, 分, 秒，用逗號分隔）', NULL, E'datetime\n2025, 1, 1, 10, 30, 0', '需要 import datetime，然後使用 datetime.datetime(2025, 1, 1, 10, 30, 0) 來建立日期時間對象', 4),
(2, 'Input', E'請完成以下代碼，讓輸出結果為 "今天是 2025/12/25"：\n\nimport _______\n\nnow = datetime.datetime(2025, 12, 25)\nprint(f"今天是 {now.strftime(_______)}")\n\n請依序填入：\n1. 模組名稱\n2. strftime() 的格式字符串（使用百分比符號，用斜線分隔年月日）', NULL, E'datetime\n"%Y/%m/%d"', '需要 import datetime，然後使用 strftime("%Y/%m/%d") 來格式化日期為 "2025/12/25" 格式', 5),
(2, 'Input', E'請完成以下代碼，建立一個日期對象表示 1990年5月15日：\n\nimport _______\n\nbirthday = datetime.date(_______)\nprint(birthday)  # 輸出：1990-05-15\n\n請依序填入：\n1. 模組名稱\n2. date() 構造函數的參數（年, 月, 日）', NULL, E'datetime\n1990, 5, 15', '需要 import datetime，然後使用 datetime.date(1990, 5, 15) 來建立日期對象', 6),
(2, 'Input', E'請完成以下代碼，讓輸出結果為 "14:30:00"（只顯示時間）：\n\nimport _______\n\nnow = datetime.datetime(2025, 12, 25, 14, 30, 0)\nprint(now.strftime(_______))\n\n請依序填入：\n1. 模組名稱\n2. strftime() 的格式字符串（使用百分比符號，只包含時分秒）', NULL, E'datetime\n"%H:%M:%S"', '需要 import datetime，然後使用 strftime("%H:%M:%S") 來格式化時間為 "14:30:00" 格式', 7),
(2, 'Input', E'請完成以下代碼，建立一個日期時間對象表示 2025年3月15日 9點0分0秒：\n\nimport _______\n\nmy_datetime = datetime.datetime(_______)\nprint(my_datetime)  # 輸出：2025-03-15 09:00:00\n\n請依序填入：\n1. 模組名稱\n2. datetime() 構造函數的參數（年, 月, 日, 時, 分, 秒）', NULL, E'datetime\n2025, 3, 15, 9, 0, 0', '需要 import datetime，然後使用 datetime.datetime(2025, 3, 15, 9, 0, 0) 來建立日期時間對象', 8),
(2, 'Input', E'請完成以下代碼，讓輸出結果為 "2025年12月"（只顯示年月）：\n\nimport _______\n\nnow = datetime.datetime(2025, 12, 25)\nprint(now.strftime(_______))\n\n請依序填入：\n1. 模組名稱\n2. strftime() 的格式字符串（使用百分比符號，只包含年月）', NULL, E'datetime\n"%Y年%m月"', '需要 import datetime，然後使用 strftime("%Y年%m月") 來格式化日期為 "2025年12月" 格式', 9),
(2, 'Input', E'請完成以下代碼，建立一個日期對象表示 2025年3月25日：\n\nimport _______\n\ndate2 = datetime.date(_______)\nprint(date2)  # 輸出：2025-03-25\n\n請依序填入：\n1. 模組名稱\n2. date() 構造函數的參數（年, 月, 日）', NULL, E'datetime\n2025, 3, 25', '需要 import datetime，然後使用 datetime.date(2025, 3, 25) 來建立日期對象', 10),
(2, 'Input', E'請完成以下代碼，讓輸出結果為 "12/25/2025"（美式日期格式）：\n\nimport _______\n\nnow = datetime.datetime(2025, 12, 25)\nprint(now.strftime(_______))\n\n請依序填入：\n1. 模組名稱\n2. strftime() 的格式字符串（使用百分比符號，順序為月/日/年）', NULL, E'datetime\n"%m/%d/%Y"', '需要 import datetime，然後使用 strftime("%m/%d/%Y") 來格式化日期為 "12/25/2025" 格式', 11),
(2, 'Input', E'請完成以下代碼，建立一個日期時間對象表示 2025年1月1日 14點45分30秒：\n\nimport _______\n\nend = datetime.datetime(_______)\nprint(end)  # 輸出：2025-01-01 14:45:30\n\n請依序填入：\n1. 模組名稱\n2. datetime() 構造函數的參數（年, 月, 日, 時, 分, 秒）', NULL, E'datetime\n2025, 1, 1, 14, 45, 30', '需要 import datetime，然後使用 datetime.datetime(2025, 1, 1, 14, 45, 30) 來建立日期時間對象', 12);

-- 插入問題資料 - 考試 3 (Python 格式化輸出)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(3, 'Input', E'您有以下代碼：\nprint("今天是 {}，溫度是 {} 度".format("星期三", 28))\n\n輸出結果為：今天是 星期三，溫度是 28 度\n\n請填入 format() 方法中的第一個參數：\n"今天是 {}，溫度是 {} 度".format(_______)', NULL, '"星期三"', 'format() 方法按順序填入參數，第一個 {} 對應第一個參數', 1),
(3, 'Input', E'您有以下代碼：\nprint("{1} 喜歡 {0}".format("Python", "Vincent"))\n\n輸出結果為：Vincent 喜歡 Python\n\n請填入 format() 方法中索引為 1 的參數：\n"{1} 喜歡 {0}".format("Python", _______)', NULL, '"Vincent"', 'format() 方法中 {1} 表示使用索引為 1 的參數（第二個參數）', 2),
(3, 'Input', E'您有以下代碼：\nprint("圓周率 {_______}".format(3.14159))\n\n要讓輸出顯示為：圓周率 3.14\n\n請填入格式字串：', NULL, ':.2f', '.2f 表示保留小數點後 2 位，記法：.2f = 保留 2 位小數', 3),
(3, 'Input', E'您有以下代碼：\nprint("分數 {_______}".format(89.6))\n\n要讓輸出顯示為：分數 90\n\n請填入格式字串：', NULL, ':.0f', '.0f 表示不顯示小數，會四捨五入為整數', 4),
(3, 'Input', E'您有以下代碼：\nprint("{_______}".format("Hi"))\n\n要讓輸出顯示為：Hi        （總長度 10，靠左對齊）\n\n請填入格式字串：', NULL, ':<10', '< 表示靠左對齊，10 表示欄寬為 10', 5),
(3, 'Input', E'您有以下代碼：\nprint("{_______}".format("Hi"))\n\n要讓輸出顯示為：        Hi （總長度 10，靠右對齊）\n\n請填入格式字串：', NULL, ':>10', '> 表示靠右對齊，10 表示欄寬為 10', 6),
(3, 'Input', E'您有以下代碼：\nprint("{_______}".format("Hi"))\n\n要讓輸出顯示為：    Hi     （總長度 10，置中對齊）\n\n請填入格式字串：', NULL, ':^10', '^ 表示置中對齊，10 表示欄寬為 10', 7),
(3, 'Input', E'您有以下代碼：\nprint("{_______}".format(123.456))\n\n要讓輸出顯示為：    123.46 （總長度 10，靠右對齊）\n\n請填入格式字串：', NULL, ':>10.2f', '> 靠右，10 欄寬，.2f 小數 2 位', 8),
(3, 'Input', E'您有以下代碼：\nprint("{_______}".format(1234567))\n\n要讓輸出顯示為：1,234,567\n\n請填入格式字串：', NULL, ':,', ', 表示加上千分位符號', 9),
(3, 'Input', E'您有以下代碼：\nprint("{_______}".format(12345.678))\n\n要讓輸出顯示為：12,345.68\n\n請填入格式字串：', NULL, ':,.2f', ', 表示千分位，.2f 表示小數 2 位', 10),
(3, 'Input', E'您有以下代碼：\nmoney = 98765.4321\nprint("金額：{_______}".format(money))\n\n要讓輸出顯示為：金額：   98,765.43 （總長度 12，靠右對齊）\n\n請填入格式字串：', NULL, ':>12,.2f', '> 靠右，12 欄寬，, 千分位，.2f 小數 2 位', 11),
(3, 'Input', E'您有以下代碼：\nprint("數字 {_______}".format(1.2))\n\n要讓輸出顯示為：數字 1.2000\n\n請填入格式字串：', NULL, ':.4f', '.4f 表示保留小數點後 4 位', 12);

-- 插入問題資料 - 考試 4 (Python 格式化輸出進階)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(4, 'Input', E'您有以下變數：\nname = "Vincent"\nage = 25\n\n請寫出完整的 print 語句，輸出格式為：\n姓名：Vincent，年齡：25\n\n請完成代碼：\n_______', NULL, 'print("姓名：{}，年齡：{}".format(name, age))', '使用 format() 方法將變數填入字符串中，按順序對應 {}', 1),
(4, 'Input', E'您有以下變數：\nproduct = "筆記本"\nprice = 89.5\nquantity = 3\n\n請寫出完整的 print 語句，輸出格式為：\n商品：筆記本，單價：89.50，數量：3\n\n請完成代碼：\n_______', NULL, 'print("商品：{}，單價：{:.2f}，數量：{}".format(product, price, quantity))', '需要對 price 使用 .2f 格式保留兩位小數', 2),
(4, 'Input', E'您有以下變數：\nscore = 95.678\n\n請寫出完整的 print 語句，輸出格式為：\n分數：    95.68 （總長度 10，靠右對齊）\n\n請完成代碼：\n_______', NULL, 'print("分數：{:>10.2f}".format(score))', '使用 >10.2f 實現靠右對齊、欄寬 10、小數 2 位', 3),
(4, 'Input', E'您有以下變數：\nname = "Python"\n\n請寫出完整的 print 語句，輸出格式為：\nPython        （總長度 15，靠左對齊）\n\n請完成代碼：\n_______', NULL, 'print("{:<15}".format(name))', '使用 <15 實現靠左對齊、欄寬 15', 4),
(4, 'Input', E'您有以下變數：\ntitle = "Hello"\n\n請寫出完整的 print 語句，輸出格式為：\n    Hello     （總長度 12，置中對齊）\n\n請完成代碼：\n_______', NULL, 'print("{:^12}".format(title))', '使用 ^12 實現置中對齊、欄寬 12', 5),
(4, 'Input', E'您有以下變數：\npopulation = 1234567\n\n請寫出完整的 print 語句，輸出格式為：\n人口數：1,234,567\n\n請完成代碼：\n_______', NULL, 'print("人口數：{:,}".format(population))', '使用 , 格式加上千分位符號', 6),
(4, 'Input', E'您有以下變數：\nrevenue = 9876543.21\n\n請寫出完整的 print 語句，輸出格式為：\n營收：9,876,543.21\n\n請完成代碼：\n_______', NULL, 'print("營收：{:,}".format(revenue))', '使用 , 格式加上千分位，浮點數會自動保留小數', 7),
(4, 'Input', E'您有以下變數：\nbalance = 12345.678\n\n請寫出完整的 print 語句，輸出格式為：\n餘額：12,345.68\n\n請完成代碼：\n_______', NULL, 'print("餘額：{:,.2f}".format(balance))', '使用 ,.2f 同時加上千分位和保留 2 位小數', 8),
(4, 'Input', E'您有以下變數：\nitem = "筆記本"\nprice = 89.5\n\n請寫出完整的 print 語句，輸出格式為：\n商品：筆記本，價格：89.50\n\n請完成代碼：\n_______', NULL, 'print("商品：{}，價格：{:.2f}".format(item, price))', '對 price 使用 .2f 格式保留兩位小數', 9),
(4, 'Input', E'您有以下變數：\nname = "Alice"\nscore = 95.678\n\n請寫出完整的 print 語句，輸出格式為：\n姓名：Alice，分數：   95.68 （分數部分總長度 8，靠右對齊）\n\n請完成代碼：\n_______', NULL, 'print("姓名：{}，分數：{:>8.2f}".format(name, score))', '對 score 使用 >8.2f 實現靠右對齊、欄寬 8、小數 2 位', 10),
(4, 'Input', E'您有以下變數：\nproduct = "筆記本"\nprice = 89.5\nquantity = 3\ntotal = price * quantity\n\n請寫出完整的 print 語句，輸出格式為：\n商品：筆記本，單價：89.50，數量：3，總計：268.50\n\n請完成代碼：\n_______', NULL, 'print("商品：{}，單價：{:.2f}，數量：{}，總計：{:.2f}".format(product, price, quantity, total))', '對 price 和 total 都使用 .2f 格式保留兩位小數', 11),
(4, 'Input', E'您有以下變數：\nsalary = 98765.4321\n\n請寫出完整的 print 語句，輸出格式為：\n薪資：   98,765.43 （總長度 12，靠右對齊）\n\n請完成代碼：\n_______', NULL, 'print("薪資：{:>12,.2f}".format(salary))', '使用 >12,.2f 實現靠右對齊、欄寬 12、千分位、小數 2 位', 12);

-- 插入問題資料 - 考試 5 (Python 單元測試)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(5, 'Input', E'以下是一些打亂的句子，其中有些是錯誤的。請從中選出正確的句子，拼出一個包含三個測試方法的完整單元測試類，類名為 TestMath。\n\n題目要求（請仔細對應每個測試方法的內容）：\n1. 第一個測試方法：方法名必須清楚表示測試「2 + 2 等於 4」，使用 assertEqual 測試 2 + 2 等於 4，這個測試必須成功（通過）\n2. 第二個測試方法：方法名必須清楚表示測試「5 - 3 等於 2」，使用 @unittest.skip 裝飾器跳過這個測試，跳過原因為 "Not implemented yet"，方法內部仍要寫 self.assertEqual(5 - 3, 2) 來測試減法運算\n3. 第三個測試方法：方法名必須清楚表示測試「2 * 3 等於 5」，使用 assertEqual 測試 2 * 3 等於 5，這個測試必須失敗（因為 2*3=6 不等於 5）\n4. 最後要有 if __name__ == ''__main__'': unittest.main() 來執行測試\n\n句子列表（包含許多錯誤選項）：\n1. import unittest\n2. import test\n3. from unittest import TestCase\n4. from unittest import TestCase, skip\n5. class TestMath(unittest.TestCase):\n6. class TestMath(TestCase):\n7. class MathTest(unittest.TestCase):\n8. def test_2_plus_2_equals_4(self):\n9. def test_2_add_2_equals_4(self):\n10. def test_addition(self):\n11. def addition_test(self):\n12. def testAddition(self):\n13. self.assertEqual(2 + 2, 4)\n14. self.assertEqual(2 + 2, 5)\n15. self.assertEqual(2 + 2, 4, "Addition test")\n16. self.assertTrue(2 + 2 == 4)\n17. @unittest.skip\n18. @unittest.skip("Not implemented yet")\n19. @skip("Not implemented yet")\n20. @unittest.skipIf(True, "Not implemented yet")\n21. def test_5_minus_3_equals_2(self):\n22. def test_5_subtract_3_equals_2(self):\n23. def test_subtraction(self):\n24. def subtraction_test(self):\n25. def testSubtraction(self):\n26. self.assertEqual(5 - 3, 2)\n27. self.assertEqual(5 - 3, 3)\n28. self.assertEqual(5 - 3, 2, "Subtraction test")\n29. def test_2_multiply_3_equals_5(self):\n30. def test_2_times_3_equals_5(self):\n31. def test_multiplication(self):\n32. def multiplication_test(self):\n33. def testMultiplication(self):\n34. self.assertEqual(2 * 3, 5)\n35. self.assertEqual(2 * 3, 6)\n36. self.assertNotEqual(2 * 3, 5)\n37. if __name__ == ''__main__'':\n38. if __name__ == "__main__":\n39. unittest.main()\n40. TestMath.main()\n41. main()\n42. unittest.run()\n\n請寫出完整的正確代碼（包含所有三個測試方法）：', NULL, E'import unittest\n\nclass TestMath(unittest.TestCase):\n    def test_2_plus_2_equals_4(self):\n        self.assertEqual(2 + 2, 4)\n    \n    @unittest.skip("Not implemented yet")\n    def test_5_minus_3_equals_2(self):\n        self.assertEqual(5 - 3, 2)\n    \n    def test_2_multiply_3_equals_5(self):\n        self.assertEqual(2 * 3, 5)\n\nif __name__ == ''__main__'':\n    unittest.main()', '正確組合：import unittest、class TestMath(unittest.TestCase)、test_2_plus_2_equals_4 使用 assertEqual(2+2, 4) 會成功、test_5_minus_3_equals_2 使用 @unittest.skip("Not implemented yet") 會跳過但內部仍要寫 assertEqual(5-3, 2)、test_2_multiply_3_equals_5 使用 assertEqual(2*3, 5) 會失敗（因為實際是 6）、最後用 if __name__ == ''__main__'': unittest.main() 執行', 1),
(5, 'Input', E'以下是一些打亂的句子，其中有些是錯誤的。請從中選出正確的句子，拼出一個包含三個測試方法的完整單元測試類，類名為 TestString。\n\n題目要求（請仔細對應每個測試方法的內容）：\n1. 第一個測試方法：方法名必須清楚表示測試「"hello" 轉大寫等於 "HELLO"」，使用 assertEqual 測試 "hello".upper() 等於 "HELLO"，這個測試必須成功（通過）\n2. 第二個測試方法：方法名必須清楚表示測試「"HELLO" 轉小寫等於 "hello"」，使用 @unittest.skip 裝飾器跳過這個測試，跳過原因為 "Skip this test"，方法內部仍要寫 self.assertEqual("HELLO".lower(), "hello") 來測試小寫轉換\n3. 第三個測試方法：方法名必須清楚表示測試「"Python" 的長度等於 5」，使用 assertEqual 測試 len("Python") 等於 5，這個測試必須失敗（因為 "Python" 的長度是 6 不是 5）\n4. 最後要有 if __name__ == ''__main__'': unittest.main() 來執行測試\n\n句子列表（包含許多錯誤選項）：\n1. import unittest\n2. import test\n3. from unittest import TestCase, skip\n4. from unittest import *\n5. class TestString(unittest.TestCase):\n6. class TestString(TestCase):\n7. class StringTest(unittest.TestCase):\n8. def test_hello_upper_equals_HELLO(self):\n9. def test_hello_to_uppercase_equals_HELLO(self):\n10. def test_upper(self):\n11. def upper_test(self):\n12. def testUpper(self):\n13. self.assertEqual("hello".upper(), "HELLO")\n14. self.assertEqual("hello".upper(), "hello")\n15. self.assertTrue("hello".upper() == "HELLO")\n16. self.assertEqual("HELLO".upper(), "HELLO")\n17. @unittest.skip\n18. @unittest.skip("Skip this test")\n19. @skip("Skip this test")\n20. @unittest.skipIf(False, "Skip this test")\n21. @unittest.expectedFailure\n22. def test_HELLO_lower_equals_hello(self):\n23. def test_HELLO_to_lowercase_equals_hello(self):\n24. def test_lower(self):\n25. def lower_test(self):\n26. def testLower(self):\n27. self.assertEqual("HELLO".lower(), "hello")\n28. self.assertEqual("HELLO".lower(), "HELLO")\n29. self.assertEqual("HELLO".lower(), "hello", "Lower test")\n30. def test_Python_length_equals_5(self):\n31. def test_Python_len_equals_5(self):\n32. def test_length(self):\n33. def length_test(self):\n34. def testLength(self):\n35. self.assertEqual(len("Python"), 5)\n36. self.assertEqual(len("Python"), 6)\n37. self.assertEqual("Python".len(), 5)\n38. self.assertTrue(len("Python") == 5)\n39. if __name__ == ''__main__'':\n40. if __name__ == "__main__":\n41. unittest.main()\n42. TestString.main()\n43. main()\n44. unittest.run()\n45. TestCase.main()\n\n請寫出完整的正確代碼（包含所有三個測試方法）：', NULL, E'import unittest\n\nclass TestString(unittest.TestCase):\n    def test_hello_upper_equals_HELLO(self):\n        self.assertEqual("hello".upper(), "HELLO")\n    \n    @unittest.skip("Skip this test")\n    def test_HELLO_lower_equals_hello(self):\n        self.assertEqual("HELLO".lower(), "hello")\n    \n    def test_Python_length_equals_5(self):\n        self.assertEqual(len("Python"), 5)\n\nif __name__ == ''__main__'':\n    unittest.main()', '正確組合：import unittest、class TestString(unittest.TestCase)、test_hello_upper_equals_HELLO 使用 assertEqual("hello".upper(), "HELLO") 會成功、test_HELLO_lower_equals_hello 使用 @unittest.skip("Skip this test") 會跳過但內部仍要寫 assertEqual("HELLO".lower(), "hello")、test_Python_length_equals_5 使用 assertEqual(len("Python"), 5) 會失敗（因為實際長度是 6）、最後用 if __name__ == ''__main__'': unittest.main() 執行', 2);

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
