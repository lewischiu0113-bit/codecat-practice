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

-- 清除現有資料（可選，如果需要重新初始化）
-- DELETE FROM questions;
-- DELETE FROM exams;

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
(2, 'Input', E'您有以下代碼：\nimport datetime\n\nstartTime = datetime.date(2018, 1, 15)\nendTime = datetime.date(2018, 1, 20)\n\n請填入計算兩個日期之間秒數的關鍵方法：\n(endTime - startTime)._______', NULL, 'total_seconds()', '使用 timedelta 的 total_seconds() 方法計算兩個日期之間的總秒數', 1),
(2, 'Input', E'您有以下代碼：\nimport datetime as dt\n\ndays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]\ntoday = dt.datetime.now()\n\n請填入獲取星期幾索引的方法（返回 0-6）：\ntoday._______', NULL, 'weekday()', 'weekday() 方法返回 0（週一）到 6（週日）的整數，可用來索引 days 列表', 2),
(2, 'Input', E'您有以下代碼：\nimport datetime\n\nstart = datetime.datetime(2025, 1, 1, 10, 30, 0)\nend = datetime.datetime(2025, 1, 1, 14, 45, 30)\n\n請填入計算時間差的關鍵方法：\n(end - start)._______', NULL, 'total_seconds()', '兩個 datetime 對象相減得到 timedelta 對象，使用 total_seconds() 方法獲取總秒數', 3),
(2, 'Input', E'您有以下代碼：\nimport datetime\n\ndate1 = datetime.date(2025, 3, 15)\ndate2 = datetime.date(2025, 3, 25)\n\n請填入獲取天數差的屬性：\n(date2 - date1)._______', NULL, 'days', '兩個 date 對象相減得到 timedelta 對象，使用 .days 屬性獲取天數差', 4),
(2, 'Input', E'您有以下代碼：\nimport datetime\n\nnow = datetime.datetime.now()\n\n請填入獲取年份的屬性：\nnow._______', NULL, 'year', 'datetime 對象有 year 屬性可以直接獲取年份', 5),
(2, 'Input', E'您有以下代碼：\nimport datetime\n\nnow = datetime.datetime.now()\n\n請填入獲取月份的屬性：\nnow._______', NULL, 'month', 'datetime 對象有 month 屬性可以直接獲取月份（1-12）', 6),
(2, 'Input', E'您有以下代碼：\nimport datetime\n\nnow = datetime.datetime.now()\n\n請填入獲取星期幾的方法（返回 0-6）：\nnow._______', NULL, 'weekday()', 'datetime 對象的 weekday() 方法返回 0（週一）到 6（週日）的整數', 7),
(2, 'Input', E'您有以下代碼：\nimport datetime\n\nstart = datetime.datetime(2025, 1, 1)\n\n請填入計算 7 天後的代碼：\nstart + datetime.timedelta(_______)', NULL, 'days=7', '使用 timedelta(days=7) 來進行日期時間的加減運算', 8),
(2, 'Input', E'您有以下代碼：\nimport datetime\n\nnow = datetime.datetime.now()\n\n請填入獲取小時數的屬性：\nnow._______', NULL, 'hour', 'datetime 對象有 hour 屬性可以直接獲取小時數（0-23）', 9),
(2, 'Input', E'您有以下代碼：\nimport datetime\n\nbirthday = datetime.date(1990, 5, 15)\ntoday = datetime.date.today()\n\n請填入獲取天數差的屬性：\n(today - birthday)._______', NULL, 'days', '兩個 date 對象相減得到 timedelta，使用 .days 屬性獲取天數', 10),
(2, 'Input', E'您有以下代碼：\nimport datetime\n\nstart = datetime.datetime(2025, 1, 1, 9, 0, 0)\n\n請填入計算 2 小時 30 分鐘後的代碼：\nstart + datetime.timedelta(_______)', NULL, 'hours=2, minutes=30', '使用 timedelta 可以同時指定 hours 和 minutes 參數來進行時間計算', 11),
(2, 'Input', E'您有以下代碼：\nimport datetime\n\ndate_str = "2025-12-25"\n\n請填入將字符串轉換為 date 對象的方法：\ndatetime.datetime.strptime(date_str, _______)', NULL, '"%Y-%m-%d"', '使用 strptime() 方法將字符串解析為 datetime 對象，格式字符串 "%Y-%m-%d" 對應 "2025-12-25"', 12);

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

-- 建立 exam_records 表格（考試記錄）
CREATE TABLE IF NOT EXISTS exam_records (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
  score INTEGER NOT NULL, -- 正確題數
  total INTEGER NOT NULL, -- 總題數
  percentage INTEGER NOT NULL, -- 正確率百分比
  answers JSONB NOT NULL, -- 用戶答案（陣列格式）
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立索引以提升查詢效能
CREATE INDEX IF NOT EXISTS idx_questions_exam_id ON questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON questions(exam_id, question_order);
CREATE INDEX IF NOT EXISTS idx_exam_records_exam_id ON exam_records(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_records_completed_at ON exam_records(completed_at DESC);

-- 啟用 Row Level Security (RLS)
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_records ENABLE ROW LEVEL SECURITY;

-- 建立政策：允許所有人讀取
CREATE POLICY "Allow public read access on exams" ON exams
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on questions" ON questions
  FOR SELECT USING (true);

-- 建立政策：允許所有人讀取和插入考試記錄
CREATE POLICY "Allow public read access on exam_records" ON exam_records
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on exam_records" ON exam_records
  FOR INSERT WITH CHECK (true);

