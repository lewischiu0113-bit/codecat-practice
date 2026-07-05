-- ============================================
-- CodeCat Practice 完整資料庫重構腳本
-- 整合：初階題目 + 中階題目 + 高階手寫題
-- 總計：26 個考試單元
-- ============================================

-- 步驟 1: 清除所有現有資料與重置 ID
DELETE FROM questions;
DELETE FROM exam_records;
DELETE FROM exams;

ALTER SEQUENCE exams_id_seq RESTART WITH 1;
ALTER SEQUENCE questions_id_seq RESTART WITH 1;

-- ============================================
-- 步驟 2: 插入考試結構 (1-22)
-- ============================================

-- 初階考試 (1-10)
INSERT INTO exams (id, title, difficulty, description) VALUES
(1, 'Python DateTime 基礎', '初級', '學習 Python datetime 的基本格式化代碼'),
(2, 'Python 格式化輸出 基礎', '初級', '學習使用 format() 方法進行字符串格式化輸出'),
(3, 'Python 單元測試 基礎', '初級', '學習使用 unittest 模組進行單元測試'),
(4, 'Python 錯誤類型 基礎', '初級', '學習 Python 各種錯誤類型的區別和應用場景'),
(5, 'Python Math 模組', '初級', '學習 Python math 模組的常用數學函數與浮點數運算'),
(6, 'Python Random 基礎', '初級', '釐清 randint/randrange 的範圍邊界，以及 choice/choices/sample 的回傳型態差異'),
(7, 'Python OS 模組與檔案路徑', '初級', '學習 os 模組的基本操作（目錄切換、列出檔案）以及 Windows 路徑字串（Raw String）的正確處理方式'),
(8, 'Python 檔案讀寫基礎', '初級', '掌握 open() 函式、with as 語法、檔案模式 (r, w, a) 及基本讀寫操作'),
(9, 'Python 程式碼執行練習', '初級', '學習編寫完整的 Python 程式碼，系統會執行您的程式碼並驗證輸出結果'),
(10, 'Python 基礎綜合練習', '初級', '綜合練習 Python 基礎知識');


-- 中階考試 (11-16)
INSERT INTO exams (id, title, difficulty, description) VALUES
(11, 'Python DateTime 進階', '中級', '學習更複雜的 datetime 格式化技巧'),
(12, 'Python 格式化輸出 進階', '中級', '學習複雜的 format() 格式化技巧，需要寫出完整的格式化語句'),
(13, 'Python 單元測試 進階', '中級', '學習編寫完整的 unittest 測試代碼，需要填寫關鍵部分'),
(14, 'Python OS 模組全填空挑戰', '中級', '需完整填寫模組名稱與函式全名（包含 os. 或 os.path. 前綴），測試對模組結構的完整記憶'),
(15, 'Python 檔案讀寫進階挑戰', '中級', '需完整寫出 with open 語句，包含正確的檔案路徑、模式參數與變數名稱'),
(16, 'Python 中階綜合練習', '中級', '綜合練習 Python 中階知識');

-- 高階考試 (17-22) - 全部為程式手寫題
INSERT INTO exams (id, title, difficulty, description) VALUES
(17, 'Python DateTime 高階實作', '高級', '編寫完整的 Python 程式碼處理日期時間問題'),
(18, 'Python 格式化輸出 高階實作', '高級', '編寫完整的 Python 程式碼進行複雜的格式化輸出'),
(19, 'Python 單元測試 高階實作', '高級', '編寫完整的 unittest 測試程式碼'),
(20, 'Python OS 模組 高階實作', '高級', '編寫完整的 Python 程式碼處理檔案系統操作'),
(21, 'Python 檔案讀寫 高階實作', '高級', '編寫完整的 Python 程式碼處理檔案讀寫操作'),
(22, 'Python 高階綜合實作', '高級', '綜合練習 Python 高階程式設計'),
(23, '考古題（卷一）', '高級', '考古題（卷一）'),
(24, '考古題（卷二）', '高級', '考古題（卷二）'),
(25, 'Python 字串格式化三大寫法（初階）', '初級', '練習 % 運算子、str.format() 與 f-string 的基礎選擇題'),
(26, 'Python pydoc 區塊辨識（初階）', '初級', '熟悉 pydoc 的 NAME、DESCRIPTION、FUNCTIONS、CLASSES、DATA、FILE 各區塊代表內容');

-- ============================================
-- 步驟 3: 插入初階題目 (映射舊資料到新 ID)
-- ============================================

-- 新 ID 1: DateTime 基礎 (來源: 舊 ID 1)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(1, 'MCQ', '哪個格式代碼代表 4 位數年份？', '["%y", "%Y", "%D", "%M"]'::jsonb, '%Y', '%Y 代表 4 位數年份（例如：2025），%y 代表 2 位數年份（例如：25）', 1),
(1, 'MCQ', '哪個格式代碼代表月份（01-12）？', '["%m", "%M", "%d", "%D"]'::jsonb, '%m', '%m 代表月份（01-12），%M 代表分鐘（00-59）', 2),
(1, 'Input', E'填入空白處以獲得格式 "2025-12-20"：\n\n```python\nnow.strftime(''_______'')\n```', NULL, '%Y-%m-%d', '%Y 代表年份，%m 代表月份，%d 代表日期，用連字符連接', 3),
(1, 'Input', E'如何顯示時間格式 "14:30:00"？\n\n```python\nnow.strftime(''_______'')\n```', NULL, '%H:%M:%S', '%H 代表小時（24小時制），%M 代表分鐘，%S 代表秒數', 4),
(1, 'MCQ', '哪個格式代碼代表日期（01-31）？', '["%d", "%D", "%m", "%Y"]'::jsonb, '%d', '%d 代表日期（01-31），%D 不是標準的 datetime 格式代碼', 5),
(1, 'Input', E'如何顯示完整的日期時間格式 "2025/12/20 14:30:00"？\n\n```python\nnow.strftime(''_______'')\n```', NULL, '%Y/%m/%d %H:%M:%S', '結合日期和時間格式，用空格分隔', 6),
(1, 'MCQ', '哪個格式代碼代表秒數（00-59）？', '["%s", "%S", "%m", "%M"]'::jsonb, '%S', '%S 代表秒數（00-59），%s 代表自 1970 年以來的秒數（Unix 時間戳）', 7);

-- 新 ID 2: 格式化輸出 基礎 (來源: 舊 ID 3)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(2, 'Input', E'您有以下代碼：\n\n```python\nprint("今天是 {}，溫度是 {} 度".format("星期三", 28))\n```\n\n輸出結果為：今天是 星期三，溫度是 28 度\n\n請填入 format() 方法中的第一個參數：\n\n```python\n"今天是 {}，溫度是 {} 度".format(_______)\n```', NULL, '"星期三"', 'format() 方法按順序填入參數，第一個 {} 對應第一個參數', 1),
(2, 'Input', E'您有以下代碼：\n\n```python\nprint("{1} 喜歡 {0}".format("Python", "Vincent"))\n```\n\n輸出結果為：Vincent 喜歡 Python\n\n請填入 format() 方法中索引為 1 的參數：\n\n```python\n"{1} 喜歡 {0}".format("Python", _______)\n```', NULL, '"Vincent"', 'format() 方法中 {1} 表示使用索引為 1 的參數（第二個參數）', 2),
(2, 'Input', E'您有以下代碼：\n\n```python\nprint("圓周率 {_______}".format(3.14159))\n```\n\n要讓輸出顯示為：圓周率 3.14\n\n請填入格式字串：', NULL, ':.2f', '.2f 表示保留小數點後 2 位，記法：.2f = 保留 2 位小數', 3),
(2, 'Input', E'您有以下代碼：\n\n```python\nprint("分數 {_______}".format(89.6))\n```\n\n要讓輸出顯示為：分數 90\n\n請填入格式字串：', NULL, ':.0f', '.0f 表示不顯示小數，會四捨五入為整數', 4),
(2, 'Input', E'您有以下代碼：\n\n```python\nprint("{_______}".format("Hi"))\n```\n\n要讓輸出顯示為：Hi        （總長度 10，靠左對齊）\n\n請填入格式字串：', NULL, ':<10', '< 表示靠左對齊，10 表示欄寬為 10', 5),
(2, 'Input', E'您有以下代碼：\n\n```python\nprint("{_______}".format("Hi"))\n```\n\n要讓輸出顯示為：        Hi （總長度 10，靠右對齊）\n\n請填入格式字串：', NULL, ':>10', '> 表示靠右對齊，10 表示欄寬為 10', 6),
(2, 'Input', E'您有以下代碼：\n\n```python\nprint("{_______}".format("Hi"))\n```\n\n要讓輸出顯示為：    Hi     （總長度 10，置中對齊）\n\n請填入格式字串：', NULL, ':^10', '^ 表示置中對齊，10 表示欄寬為 10', 7),
(2, 'Input', E'您有以下代碼：\n\n```python\nprint("{_______}".format(123.456))\n```\n\n要讓輸出顯示為：    123.46 （總長度 10，靠右對齊）\n\n請填入格式字串：', NULL, ':>10.2f', '> 靠右，10 欄寬，.2f 小數 2 位', 8),
(2, 'Input', E'您有以下代碼：\n\n```python\nprint("{_______}".format(1234567))\n```\n\n要讓輸出顯示為：1,234,567\n\n請填入格式字串：', NULL, ':,', ', 表示加上千分位符號', 9),
(2, 'Input', E'您有以下代碼：\n\n```python\nprint("{_______}".format(12345.678))\n```\n\n要讓輸出顯示為：12,345.68\n\n請填入格式字串：', NULL, ':,.2f', ', 表示千分位，.2f 表示小數 2 位', 10),
(2, 'Input', E'您有以下代碼：\n\n```python\nmoney = 98765.4321\nprint("金額：{_______}".format(money))\n```\n\n要讓輸出顯示為：金額：   98,765.43 （總長度 12，靠右對齊）\n\n請填入格式字串：', NULL, ':>12,.2f', '> 靠右，12 欄寬，, 千分位，.2f 小數 2 位', 11),
(2, 'Input', E'您有以下代碼：\n\n```python\nprint("數字 {_______}".format(1.2))\n```\n\n要讓輸出顯示為：數字 1.2000\n\n請填入格式字串：', NULL, ':.4f', '.4f 表示保留小數點後 4 位', 12);

-- 新 ID 3: 單元測試 基礎 (來源: 舊 ID 5)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(3, 'MCQ', '在 Python 中，如何正確導入 unittest 模組？', '["import unittest", "from unittest import *", "import test", "from test import unittest"]'::jsonb, 'import unittest', '使用 import unittest 來導入 unittest 模組，這是標準的導入方式', 1),
(3, 'MCQ', '如何定義一個繼承自 unittest.TestCase 的測試類？', '["class TestString(unittest.TestCase):", "class TestString(TestCase):", "class TestString(test.TestCase):", "class TestString:"]'::jsonb, 'class TestString(unittest.TestCase):', '測試類必須繼承自 unittest.TestCase，完整的寫法是 class TestString(unittest.TestCase):', 2),
(3, 'MCQ', '以下哪個是正確的測試方法命名方式？', '["def test_upper(self):", "def upper_test(self):", "def testUpper(self):", "def upper(self):"]'::jsonb, 'def test_upper(self):', '測試方法名稱必須以 test_ 開頭，這樣 unittest 才能自動識別並執行這些測試方法', 3),
(3, 'MCQ', '如果要測試兩個值是否相等，應該使用哪個斷言方法？', '["self.assertTrue()", "self.assertEqual()", "self.assertSame()", "self.assertNotEqual()"]'::jsonb, 'self.assertEqual()', 'self.assertEqual() 用於測試兩個值是否相等，例如：self.assertEqual("foo".upper(), "FOO")', 4),
(3, 'MCQ', '如果要測試某個條件是否為 True，應該使用哪個斷言方法？', '["self.assertEqual()", "self.assertTrue()", "self.assertFalse()", "self.assert()"]'::jsonb, 'self.assertTrue()', 'self.assertTrue() 用於測試某個條件是否為 True，例如：self.assertTrue("FOO".isupper())', 5),
(3, 'MCQ', '如果要測試某個條件是否為 False，應該使用哪個斷言方法？', '["self.assertFalse()", "self.assertNotTrue()", "self.assertEqual(False)", "self.assert()"]'::jsonb, 'self.assertFalse()', 'self.assertFalse() 用於測試某個條件是否為 False，例如：self.assertFalse("Foo".isupper())', 6),
(3, 'MCQ', '如果要測試某個操作是否會拋出特定異常，應該使用哪個斷言方法？', '["self.assertRaises()", "self.assertException()", "self.assertError()", "self.assertRaise()"]'::jsonb, 'self.assertRaises()', 'self.assertRaises() 用於測試是否會拋出特定異常，例如：with self.assertRaises(TypeError): s.split(2)', 7),
(3, 'MCQ', '以下哪個是正確的執行測試的方式？', '["unittest.main()", "main()", "TestString.main()", "unitTest.main()"]'::jsonb, 'unittest.main()', '使用 unittest.main() 可以在直接執行腳本時運行所有測試', 8),
(3, 'MCQ', E'根據以下代碼，test_upper 方法會測試什麼？\n\n```python\ndef test_upper(self):\n    self.assertEqual("foo".upper(), "FOO")\n```', '["測試 ''foo'' 是否等於 ''FOO''", "測試 ''foo''.upper() 是否等於 ''FOO''", "測試 upper() 方法是否存在", "測試字符串是否為大寫"]'::jsonb, '測試 ''foo''.upper() 是否等於 ''FOO''', '這個測試方法使用 assertEqual 來驗證 "foo".upper() 的結果是否等於 "FOO"', 9),
(3, 'MCQ', E'根據以下代碼，test_isupper 方法會測試什麼？\n\n```python\ndef test_isupper(self):\n    self.assertTrue("FOO".isupper())\n    self.assertFalse("Foo".isupper())\n```', '["測試字符串是否為大寫", "測試 isupper() 方法是否正確工作", "測試 ''FOO'' 和 ''Foo'' 是否相等", "測試字符串長度"]'::jsonb, '測試 isupper() 方法是否正確工作', '這個測試方法使用 assertTrue 和 assertFalse 來驗證 isupper() 方法在不同情況下的行為是否正確', 10),
(3, 'MCQ', E'根據以下代碼，test_split 方法中的 assertRaises 測試什麼？\n\n```python\ndef test_split(self):\n    s = "hello world"\n    self.assertEqual(s.split(), ["hello", "world"])\n    with self.assertRaises(TypeError):\n        s.split(2)\n```', '["測試 split() 是否正確分割字符串", "測試當傳入非字符串參數時是否拋出 TypeError", "測試 split() 是否返回列表", "測試字符串長度"]'::jsonb, '測試當傳入非字符串參數時是否拋出 TypeError', 'assertRaises(TypeError) 用於測試當 split() 方法接收到非字符串參數（如整數 2）時，是否會正確拋出 TypeError 異常', 11),
(3, 'MCQ', '在 unittest 中，測試方法的參數 self 代表什麼？', '["測試類的實例", "測試模組", "測試函數", "測試結果"]'::jsonb, '測試類的實例', 'self 代表測試類的實例，通過 self 可以訪問 TestCase 類提供的所有斷言方法（如 assertEqual、assertTrue 等）', 12);

-- 新 ID 4: 錯誤類型 (來源: 舊 ID 7)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(4, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\nx = "hello"\nx.push()\n```', '["TypeError", "AttributeError", "NameError", "SyntaxError"]'::jsonb, 'AttributeError', '物件沒有你呼叫的方法或屬性時會發生 AttributeError。字串沒有 push() 方法', 1),
(4, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\nf = open(''numbers.txt'')\nf.readall()\n```', '["EOFError", "SystemError", "AttributeError", "SyntaxError"]'::jsonb, 'AttributeError', '檔案物件沒有 readall() 方法，正確的方法是 read()，所以會拋出 AttributeError', 2),
(4, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\nprint(undefined_var)\n```', '["AttributeError", "TypeError", "NameError", "SyntaxError"]'::jsonb, 'NameError', '當使用未定義的變數時會拋出 NameError', 3),
(4, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\n1 + "2"\n```', '["ValueError", "TypeError", "AttributeError", "SyntaxError"]'::jsonb, 'TypeError', '型別不合的操作會拋出 TypeError。整數和字串無法直接相加', 4),
(4, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\nif True\n    print("Hi")\n```', '["IndentationError", "TypeError", "NameError", "SyntaxError"]'::jsonb, 'SyntaxError', '程式碼語法錯誤會在執行前被偵測到，拋出 SyntaxError。if 語句缺少冒號', 5),
(4, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\nif True:\nprint("Hi")\n```', '["SyntaxError", "TypeError", "NameError", "IndentationError"]'::jsonb, 'IndentationError', '縮排不合法會拋出 IndentationError。print 語句應該要縮排', 6),
(4, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\n1 / 0\n```', '["ArithmeticError", "ValueError", "TypeError", "ZeroDivisionError"]'::jsonb, 'ZeroDivisionError', '除以零會拋出 ZeroDivisionError，這是 ArithmeticError 的子類別', 7),
(4, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\ntry:\n    result = 10 / 0\nexcept Exception:\n    pass\n```', '["ZeroDivisionError", "ArithmeticError", "不會拋出錯誤", "Exception"]'::jsonb, '不會拋出錯誤', 'Exception 是所有例外的基底類別，可以捕捉所有錯誤，所以錯誤被捕捉後不會再拋出', 8),
(4, 'MCQ', E'以下程式碼會拋出哪種錯誤？\n\n```python\nnumbers = [1, 2, 3]\nnumbers.append(4)\nnumbers.push(5)\n```', '["TypeError", "NameError", "IndexError", "AttributeError"]'::jsonb, 'AttributeError', '列表沒有 push() 方法，正確的方法是 append()，所以會拋出 AttributeError', 9),
(4, 'MCQ', E'以下哪個錯誤類型是數學運算錯誤的基底類別？', '["MathError", "ArithmeticError", "ValueError", "TypeError"]'::jsonb, 'ArithmeticError', 'ArithmeticError 是數學運算錯誤的基底類別，ZeroDivisionError 是它的子類別', 10),
(4, 'Input', E'請完成以下程式碼：\n\n```python\ntry:\n    x = "hello"\n    x.push()\nexcept _______:\n    print("屬性錯誤")\n```', NULL, 'AttributeError', '使用 except AttributeError: 來捕捉屬性錯誤', 11),
(4, 'Input', E'請完成以下程式碼：\n\n```python\ntry:\n    print(undefined_var)\nexcept _______:\n    print("變數未定義")\n```', NULL, 'NameError', '使用 except NameError: 來捕捉變數未定義的錯誤', 12),
(4, 'Input', E'請完成以下程式碼：\n\n```python\ntry:\n    result = 1 + "2"\nexcept _______:\n    print("型別錯誤")\n```', NULL, 'TypeError', '使用 except TypeError: 來捕捉型別不合的操作錯誤', 13),
(4, 'Input', E'請完成以下程式碼，捕捉所有錯誤：\n\n```python\ntry:\n    result = 10 / 0\nexcept _______:\n    print("發生錯誤")\n```', NULL, 'Exception', '使用 except Exception: 可以捕捉所有錯誤（除了系統退出相關的錯誤）', 14),
(4, 'MCQ', E'下列哪段程式會拋出 ValueError？\n\n```python\nint("abc")\n```', '["int(\"abc\")", "print(not_defined)", "1 + \"2\"", "x = []; x.push(1)"]'::jsonb, 'int("abc")', '把無法轉成整數的字串丟進 int() 會拋出 ValueError。', 15),
(4, 'MCQ', E'關於 except 區塊順序，下列哪個寫法比較正確？\n\n```python\ntry:\n    x = 1 / 0\nexcept ZeroDivisionError:\n    print("division by zero")\nexcept Exception:\n    print("other error")\n```', '["先寫 except Exception 再寫 except ZeroDivisionError", "先寫 except ZeroDivisionError 再寫 except Exception", "只能寫一個 except", "except 順序不影響執行"]'::jsonb, '先寫 except ZeroDivisionError 再寫 except Exception', '應先捕捉較具體的錯誤，再捕捉較廣泛的 Exception。', 16),
(4, 'MCQ', E'執行下列程式會發生什麼？\n\n```python\nmy_list = [10, 20]\nprint(my_list[5])\n```', '["TypeError", "ValueError", "KeyError", "IndexError"]'::jsonb, 'IndexError', 'list 索引超出範圍會拋出 IndexError。', 17),
(4, 'MCQ', E'下列哪個錯誤通常代表「字典中查不到指定 key」？\n\n```python\nd = {"a": 1}\nprint(d["b"])\n```', '["AttributeError", "KeyError", "NameError", "ImportError"]'::jsonb, 'KeyError', '對 dict 存取不存在的鍵時，會拋出 KeyError。', 18),
(4, 'MCQ', E'關於 `except Exception as e:` 中的 e，下列敘述何者正確？', '["e 一定是字串", "e 是錯誤物件，可用來查看錯誤訊息", "e 只能在 except 外使用", "e 只能用於 SyntaxError"]'::jsonb, 'e 是錯誤物件，可用來查看錯誤訊息', 'e 代表捕捉到的例外實例，常用 `print(e)` 觀察訊息。', 19);

-- 新 ID 5: Math 模組 (來源: 舊 ID 8)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(5, 'Input', E'請完成以下代碼，以獲得浮點數列表的**精確總和**（解決浮點數精度問題）：\n\n```python\nimport math\nmy_list = [.3, .3, .3, .1, .1]\n# 預期結果：1.1 (而非 1.099999...)\ntotal = math._______(my_list)\n```', NULL, 'fsum', 'fsum() 用於對浮點數進行精確求和，避免標準 sum() 函數可能出現的精度誤差', 1),
(5, 'Input', E'請完成以下代碼，回傳**大於或等於**該數字的最小整數：\n\n```python\nimport math\n# 預期結果：4\nprint(math._______(3.1))\n```', NULL, 'ceil', 'ceil() (Ceiling) 會將數字無條件進位到最接近的整數', 2),
(5, 'Input', E'請完成以下代碼，回傳**小於或等於**該數字的最大整數：\n\n```python\nimport math\n# 預期結果：3\nprint(math._______(3.9))\n```', NULL, 'floor', 'floor() 會將數字無條件捨去（向下取整）到最接近的整數', 3),
(5, 'Input', E'請完成以下代碼，計算 5 的**階乘**（5! = 5*4*3*2*1）：\n\n```python\nimport math\n# 預期結果：120\nprint(math._______(5))\n```', NULL, 'factorial', 'factorial() 用於計算整數的階乘值', 4),
(5, 'Input', E'請完成以下代碼，計算 16 的**平方根**：\n\n```python\nimport math\n# 預期結果：4.0\nprint(math._______(16))\n```', NULL, 'sqrt', 'sqrt() 用於計算數字的平方根，回傳值為浮點數', 5),
(5, 'Input', E'請完成以下代碼，取得數字的**絕對值**（回傳浮點數）：\n\n```python\nimport math\n# 預期結果：10.5\nprint(math._______(-10.5))\n```', NULL, 'fabs', 'fabs() 回傳浮點數類型的絕對值（與內建 abs() 不同，abs() 視輸入類型而定）', 6),
(5, 'Input', E'請完成以下代碼，計算 x 的 y 次方（回傳浮點數）：\n\n```python\nimport math\n# 計算 2 的 3 次方，預期結果：8.0\nprint(math._______(2, 3))\n```', NULL, 'pow', 'math.pow(x, y) 計算 x 的 y 次方，總是回傳浮點數', 7);

-- 新 ID 6: Random 模組 (來源: 舊 ID 9)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(6, 'Input', E'請填入函式名稱，隨機產生一個 **1 到 10 (包含 10)** 的整數：\n\n```python\nimport random\n# 可能出現結果：1, 5, 10\n# 回傳型態：int\nnum = random._______(1, 10)\n```', NULL, 'randint', 'randint(a, b) 會回傳 a 到 b 之間的整數，且**包含** b (inclusive)。', 1),
(6, 'Input', E'請填入函式名稱，隨機產生一個 **1 到 9 (不包含 10)** 的整數：\n\n```python\nimport random\n# 可能出現結果：1, 5, 9 (絕對不會出現 10)\n# 回傳型態：int\nnum = random._______(1, 10)\n```', NULL, 'randrange', 'randrange(start, stop) 類似於 range()，回傳的數字**不包含** stop (exclusive)。', 2),
(6, 'Input', E'請填入函式名稱，從列表中隨機選出 **"一個"** 元素：\n\n```python\nimport random\nitems = ["A", "B", "C"]\n# 可能出現結果："B"\n# 回傳型態：str (單一元素，非列表)\npick = random._______(items)\n```', NULL, 'choice', 'choice(seq) 用於從序列中隨機選取一個元素，回傳該元素的原始型態，而非列表。', 3),
(6, 'Input', E'請填入函式名稱，從列表中隨機選取 3 個元素，且 **"允許重複"** 抽樣：\n\n```python\nimport random\nitems = [1, 2, 3, 4, 5]\n# 可能出現結果：[2, 2, 5]\n# 回傳型態：list\npicks = random._______(items, k=3)\n```', NULL, 'choices', 'choices(seq, k=n) 會回傳一個列表，且採用「取後放回」機制，因此元素可能重複出現。', 4),
(6, 'Input', E'請填入函式名稱，從列表中隨機選取 3 個 **"不重複"** 的元素：\n\n```python\nimport random\nitems = [1, 2, 3, 4, 5]\n# 可能出現結果：[1, 5, 3] (數字不會重複)\n# 回傳型態：list\npicks = random._______(items, k=3)\n```', NULL, 'sample', 'sample(seq, k=n) 會回傳一個列表，採用「取後不放回」機制，確保取出的元素是唯一的。', 5),
(6, 'Input', E'請填入函式名稱，產生一個 0.0 到 1.0 之間的隨機 **浮點數**：\n\n```python\nimport random\n# 可能出現結果：0.3746...\n# 回傳型態：float\nval = random._______()\n```', NULL, 'random', 'random() 函式不接受參數，回傳 [0.0, 1.0) 之間的浮點數。', 6);

-- 新 ID 7: OS 模組與檔案路徑 (來源: 舊 ID 10)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(7, 'Input', E'在 Windows 中路徑常包含反斜線 `\`。為了避免 Python 將 `\\t` 解讀為 Tab 或 `\\n` 解讀為換行，我們需要在字串前加上什麼字母？\n\n```python\n# 讓字串依照原樣顯示，不進行轉義\npath = _______\'C:\\temp\\new_file.txt\'\nprint(path)\n```', NULL, 'r', '在字串前加上 r (raw string) 可以讓 Python 忽略反斜線的轉義功能，直接將其視為普通字元。', 1),
(7, 'Input', E'請填入函式名稱，以取得目前程式所在的**工作目錄** (Current Working Directory)：\n\n```python\nimport os\n# 輸出例如：C:\\Users\\Admin\\Project\ncurrent_path = os._______()\nprint(current_path)\n```', NULL, 'getcwd', 'getcwd() 代表 get current working directory，用於取得當前的工作路徑。', 2),
(7, 'Input', E'請填入函式名稱，以**列出**指定目錄下的所有檔案與資料夾名稱（回傳列表）：\n\n```python\nimport os\n# 顯示 C:\\tmp 底下的所有檔案\nfiles = os._______(r\'C:\\tmp\')\nprint(files)\n```', NULL, 'listdir', 'listdir() 用於列出指定路徑下的所有檔案和資料夾名稱。', 3),
(7, 'Input', E'請填入函式名稱，將目前的工作目錄**切換**到 C 槽的 Windows 資料夾：\n\n```python\nimport os\n# 變更工作路徑\nos._______(r\'C:\\Windows\')\nprint(os.getcwd())\n```', NULL, 'chdir', 'chdir() 代表 change directory，用於改變當前的工作目錄。', 4),
(7, 'Input', E'如果**不使用** `r` 前綴，在一般字串中表示一個反斜線 `\` 需要使用兩個反斜線。請完成路徑字串：\n\n```python\n# 不使用 r\'...\' 的寫法\npath = \'C:_______Windows_______System32\'\n```\n(請填入用來分隔的符號)', NULL, '\\\\', '在普通字串中，反斜線是轉義字元，所以必須使用雙反斜線 \\\\ 來表示一個實際的反斜線。', 5),
(7, 'Input', E'請填入函式名稱，用來**建立**一個新的資料夾：\n\n```python\nimport os\n# 在當前目錄下建立名為 data 的資料夾\nos._______(\'data\')\n```', NULL, 'mkdir', 'mkdir() 代表 make directory，用於建立單一層級的新目錄。', 6),
(7, 'Input', E'為了讓程式碼在 Windows 和 Mac/Linux 都能執行，應避免手動拼接字串。請使用正確的 os 子模組方法來**合併路徑**：\n\n```python\nimport os\nfolder = \'data\'\nfilename = \'report.txt\'\n# 自動處理分隔符 (Windows用 \\, Linux用 /)\nfull_path = os.path._______(folder, filename)\n```', NULL, 'join', 'os.path.join() 會根據作業系統自動選擇正確的路徑分隔符號（斜線或反斜線），是合併路徑的最佳方式。', 7),
(7, 'Input', E'在開啟檔案前，通常需要檢查該檔案或路徑**是否存在**。請完成以下代碼：\n\n```python\nimport os\nif os.path._______(r\'C:\\config.ini\'):\n    print("檔案存在")\nelse:\n    print("檔案找不到")\n```', NULL, 'exists', 'os.path.exists() 用於判斷指定的路徑（檔案或目錄）是否存在，回傳 True 或 False。', 8);

-- 新 ID 8: 檔案讀寫基礎 (來源: 舊 ID 12)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(8, 'Input', E'使用 Context Manager 自動管理檔案開關是最佳實踐。請填入關鍵字：\n\n```python\n# 自動處理檔案關閉\n_______ open(\'data.txt\', \'r\') as f:\n    print(f.read())\n```', NULL, 'with', '使用 `with` 關鍵字可以確保檔案在區塊結束後自動關閉，避免資源洩漏。', 1),
(8, 'Input', E'請完成 `with` 語法，將開啟的檔案物件指派給變數 `f`：\n\n```python\nwith open(\'data.txt\') _______ f:\n    content = f.read()\n```', NULL, 'as', '`as` 關鍵字用於將 `open()` 回傳的檔案物件指派給變數 `f`。', 2),
(8, 'Input', E'當 `open()` 函式省略第二個參數（模式）時，預設會使用什麼模式？\n\n```python\n# 以下兩行效果相同\nf = open(\'file.txt\')\nf = open(\'file.txt\', \'_______\')\n```', NULL, 'r', '`r` (read) 是 `open()` 的預設模式。如果不指定模式，Python 預設為讀取。', 3),
(8, 'Input', E'若要開啟檔案進行**寫入**，且希望**覆蓋**原有內容（或建立新檔），應使用什麼模式？\n\n```python\n# 警告：這會清除檔案舊內容\nwith open(\'report.txt\', \'_______\') as f:\n    f.write("New Content")\n```', NULL, 'w', '`w` (write) 模式用於寫入。若檔案存在，會先清空內容；若不存在，則建立新檔。', 4),
(8, 'Input', E'若要開啟檔案進行寫入，但**保留**原有內容，將新資料加在檔案**末尾**，應使用什麼模式？\n\n```python\n# 在檔案最後面新增一行\nwith open(\'log.txt\', \'_______\') as f:\n    f.write("Log Entry\\n")\n```', NULL, 'a', '`a` (append) 模式用於附加。寫入的資料會接在檔案原本內容的後面，不會覆蓋舊資料。', 5),
(8, 'Input', E'若要明確指定以**唯讀**方式開啟檔案（雖然這是預設值），應填入什麼代碼？\n\n```python\nf = open(\'config.ini\', \'_______\')\n```', NULL, 'r', '`r` 代表 read 模式，僅能讀取，無法寫入。若檔案不存在會拋出 FileNotFoundError。', 6),
(8, 'Input', E'若不使用 `with` 語句，必須手動呼叫什麼方法來釋放檔案資源？\n\n```python\nf = open(\'temp.txt\', \'w\')\nf.write("Hello")\n# 務必記得關閉\nf._______()\n```', NULL, 'close', '如果不使用 `with`，必須手動呼叫 `f.close()` 以確保資料寫入硬碟並釋放系統資源。', 7),
(8, 'Input', E'請填入函式名稱，將字串寫入檔案中：\n\n```python\nwith open(\'out.txt\', \'w\') as f:\n    f._______("Hello World")\n```', NULL, 'write', '`f.write(string)` 方法用於將字串寫入檔案。', 8),
(8, 'Input', E'檔案物件是可疊代的 (Iterable)。請完成迴圈以**逐行**讀取檔案：\n\n```python\nwith open(\'data.txt\', \'r\') as f:\n    for line _______ f:\n        print(line)\n```', NULL, 'in', '使用 `for line in f:` 是逐行讀取檔案最有效率且最 Pythonic 的方式。', 9),
(8, 'Input', E'請填入函式名稱，以讀取檔案的**全部內容**並回傳為一個字串：\n\n```python\nwith open(\'readme.md\', \'r\') as f:\n    all_content = f._______()\n```', NULL, 'read', '`f.read()` 會一次讀取檔案的所有內容（包含換行符號）。', 10),
(8, 'Input', E'請填入函式名稱，將檔案的所有行讀取並儲存為一個**列表** (List)：\n\n```python\nwith open(\'names.txt\', \'r\') as f:\n    # 回傳如 [\'Alice\\n\', \'Bob\\n\']\n    lines_list = f._______()\n```', NULL, 'readlines', '`f.readlines()` 會讀取所有行並回傳一個列表，每一行是列表的一個元素。', 11),
(8, 'Input', E'請填入函式名稱，每次只讀取檔案的**一行**：\n\n```python\nwith open(\'huge_file.txt\', \'r\') as f:\n    first_line = f._______()\n    second_line = f._______()\n```', NULL, 'readline', '`f.readline()` (注意沒有 s) 每次呼叫只會讀取並回傳下一行文字。', 12);

-- 新 ID 9: 程式碼執行練習 (來源: 舊 ID 14)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, test_cases, question_order) VALUES
(9, 'CodeExecution', E'## 三數相加\n\n編寫一個程式，讀取三個數字並輸出它們的總和。\n\n**說明：**\n- 每個數字都在單獨的一行上\n- 使用 `input()` 讀取輸入\n- 使用 `print()` 輸出結果\n\n**範例：**\n如果輸入是：\n```\n2\n3\n6\n```\n\n則輸出應該是：\n```\n11\n```', NULL, E'a = int(input())\nb = int(input())\nc = int(input())\nprint(a + b + c)', '使用 input() 讀取三個數字，轉換為整數後相加，最後使用 print() 輸出結果。', '[
  {"input": "2\n3\n6", "expectedOutput": "11"},
  {"input": "0\n20\n300", "expectedOutput": "320"},
  {"input": "-5\n180\n-17", "expectedOutput": "158"}
]'::jsonb, 1);

-- Exam 10 為綜合練習，暫無題目，保留空殼。

-- ============================================
-- 步驟 4: 插入中階題目 (映射舊資料到新 ID)
-- ============================================

-- 新 ID 11: DateTime 進階 (來源: 舊 ID 2)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(11, 'Input', E'請完成以下代碼，讓輸出結果為 "2025-12-25"：\n\n```python\nimport _______\n\nnow = datetime.datetime(2025, 12, 25)\nprint(now.strftime(_______))\n```\n\n請依序填入：\n1. 模組名稱（用於處理日期時間）\n2. strftime() 的格式字符串（使用百分比符號和特定字母來表示年月日）', NULL, 'datetime' || chr(10) || '"%Y-%m-%d"', '需要 import datetime，然後使用 strftime("%Y-%m-%d") 來格式化日期為 "2025-12-25" 格式', 1),
(11, 'Input', E'請完成以下代碼，讓輸出結果為 "2025年12月25日 14:30:00"：\n\n```python\nimport _______\n\nnow = datetime.datetime(2025, 12, 25, 14, 30, 0)\nprint(now.strftime(_______))\n```\n\n請依序填入：\n1. 模組名稱\n2. strftime() 的格式字符串（使用百分比符號，包含年月日時分秒）', NULL, 'datetime' || chr(10) || '"%Y年%m月%d日 %H:%M:%S"', '需要 import datetime，然後使用 strftime("%Y年%m月%d日 %H:%M:%S") 來格式化日期時間', 2),
(11, 'Input', E'請完成以下代碼，建立一個日期對象表示 2018年1月15日：\n\n```python\nimport _______\n\nmy_date = datetime.date(_______)\nprint(my_date)  # 輸出：2018-01-15\n```\n\n請依序填入：\n1. 模組名稱\n2. date() 構造函數的參數（年, 月, 日，用逗號分隔）', NULL, 'datetime' || chr(10) || '2018, 1, 15', '需要 import datetime，然後使用 datetime.date(2018, 1, 15) 來建立日期對象', 3),
(11, 'Input', E'請完成以下代碼，建立一個日期時間對象表示 2025年1月1日 10點30分0秒：\n\n```python\nimport _______\n\nmy_datetime = datetime.datetime(_______)\nprint(my_datetime)  # 輸出：2025-01-01 10:30:00\n```\n\n請依序填入：\n1. 模組名稱\n2. datetime() 構造函數的參數（年, 月, 日, 時, 分, 秒，用逗號分隔）', NULL, 'datetime' || chr(10) || '2025, 1, 1, 10, 30, 0', '需要 import datetime，然後使用 datetime.datetime(2025, 1, 1, 10, 30, 0) 來建立日期時間對象', 4),
(11, 'Input', E'請完成以下代碼，讓輸出結果為 "今天是 2025/12/25"：\n\n```python\nimport _______\n\nnow = datetime.datetime(2025, 12, 25)\nprint(f"今天是 {now.strftime(_______)}")\n```\n\n請依序填入：\n1. 模組名稱\n2. strftime() 的格式字符串（使用百分比符號，用斜線分隔年月日）', NULL, 'datetime' || chr(10) || '"%Y/%m/%d"', '需要 import datetime，然後使用 strftime("%Y/%m/%d") 來格式化日期為 "2025/12/25" 格式', 5),
(11, 'Input', E'請完成以下代碼，建立一個日期對象表示 1990年5月15日：\n\n```python\nimport _______\n\nbirthday = datetime.date(_______)\nprint(birthday)  # 輸出：1990-05-15\n```\n\n請依序填入：\n1. 模組名稱\n2. date() 構造函數的參數（年, 月, 日）', NULL, 'datetime' || chr(10) || '1990, 5, 15', '需要 import datetime，然後使用 datetime.date(1990, 5, 15) 來建立日期對象', 6),
(11, 'Input', E'請完成以下代碼，讓輸出結果為 "14:30:00"（只顯示時間）：\n\n```python\nimport _______\n\nnow = datetime.datetime(2025, 12, 25, 14, 30, 0)\nprint(now.strftime(_______))\n```\n\n請依序填入：\n1. 模組名稱\n2. strftime() 的格式字符串（使用百分比符號，只包含時分秒）', NULL, 'datetime' || chr(10) || '"%H:%M:%S"', '需要 import datetime，然後使用 strftime("%H:%M:%S") 來格式化時間為 "14:30:00" 格式', 7),
(11, 'Input', E'請完成以下代碼，建立一個日期時間對象表示 2025年3月15日 9點0分0秒：\n\n```python\nimport _______\n\nmy_datetime = datetime.datetime(_______)\nprint(my_datetime)  # 輸出：2025-03-15 09:00:00\n```\n\n請依序填入：\n1. 模組名稱\n2. datetime() 構造函數的參數（年, 月, 日, 時, 分, 秒）', NULL, 'datetime' || chr(10) || '2025, 3, 15, 9, 0, 0', '需要 import datetime，然後使用 datetime.datetime(2025, 3, 15, 9, 0, 0) 來建立日期時間對象', 8),
(11, 'Input', E'請完成以下代碼，讓輸出結果為 "2025年12月"（只顯示年月）：\n\n```python\nimport _______\n\nnow = datetime.datetime(2025, 12, 25)\nprint(now.strftime(_______))\n```\n\n請依序填入：\n1. 模組名稱\n2. strftime() 的格式字符串（使用百分比符號，只包含年月）', NULL, 'datetime' || chr(10) || '"%Y年%m月"', '需要 import datetime，然後使用 strftime("%Y年%m月") 來格式化日期為 "2025年12月" 格式', 9),
(11, 'Input', E'請完成以下代碼，建立一個日期對象表示 2025年3月25日：\n\n```python\nimport _______\n\ndate2 = datetime.date(_______)\nprint(date2)  # 輸出：2025-03-25\n```\n\n請依序填入：\n1. 模組名稱\n2. date() 構造函數的參數（年, 月, 日）', NULL, 'datetime' || chr(10) || '2025, 3, 25', '需要 import datetime，然後使用 datetime.date(2025, 3, 25) 來建立日期對象', 10),
(11, 'Input', E'請完成以下代碼，讓輸出結果為 "12/25/2025"（美式日期格式）：\n\n```python\nimport _______\n\nnow = datetime.datetime(2025, 12, 25)\nprint(now.strftime(_______))\n```\n\n請依序填入：\n1. 模組名稱\n2. strftime() 的格式字符串（使用百分比符號，順序為月/日/年）', NULL, 'datetime' || chr(10) || '"%m/%d/%Y"', '需要 import datetime，然後使用 strftime("%m/%d/%Y") 來格式化日期為 "12/25/2025" 格式', 11),
(11, 'Input', E'請完成以下代碼，建立一個日期時間對象表示 2025年1月1日 14點45分30秒：\n\n```python\nimport _______\n\nend = datetime.datetime(_______)\nprint(end)  # 輸出：2025-01-01 14:45:30\n```\n\n請依序填入：\n1. 模組名稱\n2. datetime() 構造函數的參數（年, 月, 日, 時, 分, 秒）', NULL, 'datetime' || chr(10) || '2025, 1, 1, 14, 45, 30', '需要 import datetime，然後使用 datetime.datetime(2025, 1, 1, 14, 45, 30) 來建立日期時間對象', 12);

-- 新 ID 12: 格式化輸出 進階 (來源: 舊 ID 4)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(12, 'Input', E'您有以下變數：\n\n```python\nname = "Vincent"\nage = 25\n```\n\n請寫出完整的 print 語句，輸出格式為：\n姓名：Vincent，年齡：25\n\n請完成代碼：\n_______', NULL, 'print("姓名：{}，年齡：{}".format(name, age))', '使用 format() 方法將變數填入字符串中，按順序對應 {}', 1),
(12, 'Input', E'您有以下變數：\n\n```python\nproduct = "筆記本"\nprice = 89.5\nquantity = 3\n```\n\n請寫出完整的 print 語句，輸出格式為：\n商品：筆記本，單價：89.50，數量：3\n\n請完成代碼：\n_______', NULL, 'print("商品：{}，單價：{:.2f}，數量：{}".format(product, price, quantity))', '需要對 price 使用 .2f 格式保留兩位小數', 2),
(12, 'Input', E'您有以下變數：\n\n```python\nscore = 95.678\n```\n\n請寫出完整的 print 語句，輸出格式為：\n分數：    95.68 （總長度 10，靠右對齊）\n\n請完成代碼：\n_______', NULL, 'print("分數：{:>10.2f}".format(score))', '使用 >10.2f 實現靠右對齊、欄寬 10、小數 2 位', 3),
(12, 'Input', E'您有以下變數：\n\n```python\nname = "Python"\n```\n\n請寫出完整的 print 語句，輸出格式為：\nPython        （總長度 15，靠左對齊）\n\n請完成代碼：\n_______', NULL, 'print("{:<15}".format(name))', '使用 <15 實現靠左對齊、欄寬 15', 4),
(12, 'Input', E'您有以下變數：\n\n```python\ntitle = "Hello"\n```\n\n請寫出完整的 print 語句，輸出格式為：\n    Hello     （總長度 12，置中對齊）\n\n請完成代碼：\n_______', NULL, 'print("{:^12}".format(title))', '使用 ^12 實現置中對齊、欄寬 12', 5),
(12, 'Input', E'您有以下變數：\n\n```python\npopulation = 1234567\n```\n\n請寫出完整的 print 語句，輸出格式為：\n人口數：1,234,567\n\n請完成代碼：\n_______', NULL, 'print("人口數：{:,}".format(population))', '使用 , 格式加上千分位符號', 6),
(12, 'Input', E'您有以下變數：\n\n```python\nrevenue = 9876543.21\n```\n\n請寫出完整的 print 語句，輸出格式為：\n營收：9,876,543.21\n\n請完成代碼：\n_______', NULL, 'print("營收：{:,}".format(revenue))', '使用 , 格式加上千分位，浮點數會自動保留小數', 7),
(12, 'Input', E'您有以下變數：\n\n```python\nbalance = 12345.678\n```\n\n請寫出完整的 print 語句，輸出格式為：\n餘額：12,345.68\n\n請完成代碼：\n_______', NULL, 'print("餘額：{:,.2f}".format(balance))', '使用 ,.2f 同時加上千分位和保留 2 位小數', 8),
(12, 'Input', E'您有以下變數：\n\n```python\nitem = "筆記本"\nprice = 89.5\n```\n\n請寫出完整的 print 語句，輸出格式為：\n商品：筆記本，價格：89.50\n\n請完成代碼：\n_______', NULL, 'print("商品：{}，價格：{:.2f}".format(item, price))', '對 price 使用 .2f 格式保留兩位小數', 9),
(12, 'Input', E'您有以下變數：\n\n```python\nname = "Alice"\nscore = 95.678\n```\n\n請寫出完整的 print 語句，輸出格式為：\n姓名：Alice，分數：   95.68 （分數部分總長度 8，靠右對齊）\n\n請完成代碼：\n_______', NULL, 'print("姓名：{}，分數：{:>8.2f}".format(name, score))', '對 score 使用 >8.2f 實現靠右對齊、欄寬 8、小數 2 位', 10),
(12, 'Input', E'您有以下變數：\n\n```python\nproduct = "筆記本"\nprice = 89.5\nquantity = 3\ntotal = price * quantity\n```\n\n請寫出完整的 print 語句，輸出格式為：\n商品：筆記本，單價：89.50，數量：3，總計：268.50\n\n請完成代碼：\n_______', NULL, 'print("商品：{}，單價：{:.2f}，數量：{}，總計：{:.2f}".format(product, price, quantity, total))', '對 price 和 total 都使用 .2f 格式保留兩位小數', 11),
(12, 'Input', E'您有以下變數：\n\n```python\nsalary = 98765.4321\n```\n\n請寫出完整的 print 語句，輸出格式為：\n薪資：   98,765.43 （總長度 12，靠右對齊）\n\n請完成代碼：\n_______', NULL, 'print("薪資：{:>12,.2f}".format(salary))', '使用 >12,.2f 實現靠右對齊、欄寬 12、千分位、小數 2 位', 12);

-- 新 ID 13: 單元測試 進階 (來源: 舊 ID 6)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(13, 'Input', E'請完成以下導入語句：\n\n```python\nimport _______\n```', NULL, 'unittest', '使用 import unittest 來導入 unittest 模組', 1),
(13, 'Input', E'請完成以下類定義：\n\n```python\nclass TestStringMethods(_______):\n```', NULL, 'unittest.TestCase', '測試類必須繼承自 unittest.TestCase', 2),
(13, 'Input', E'請完成以下測試方法定義：\n\n```python\n    def _______upper(self):\n        self.assertEqual(''foo''.upper(), ''FOO'')\n```', NULL, 'test_', '測試方法名稱必須以 test_ 開頭，這樣 unittest 才能自動識別並執行', 3),
(13, 'Input', E'請完成以下測試方法：\n\n```python\n    def test_upper(self):\n        self._______(''foo''.upper(), ''FOO'')\n```', NULL, 'assertEqual', '使用 assertEqual() 來測試兩個值是否相等', 4),
(13, 'Input', E'請完成以下測試方法：\n\n```python\n    def test_isupper(self):\n        self._______(''FOO''.isupper())\n```', NULL, 'assertTrue', '使用 assertTrue() 來測試條件是否為 True', 5),
(13, 'Input', E'請完成以下測試方法：\n\n```python\n    def test_isupper(self):\n        self.assertTrue(''FOO''.isupper())\n        self._______(''Foo''.isupper())\n```', NULL, 'assertFalse', '使用 assertFalse() 來測試條件是否為 False', 6),
(13, 'Input', E'請完成以下測試方法：\n\n```python\n    def test_split(self):\n        s = ''hello world''\n        self.assertEqual(s.split(), [''hello'', ''world''])\n        with self._______(TypeError):\n            s.split(2)\n```', NULL, 'assertRaises', '使用 assertRaises() 來測試是否會拋出特定異常', 7),
(13, 'Input', E'請完成以下代碼，讓測試在直接執行腳本時運行：\n\n```python\nif _______ == ''__main__'':\n    unittest.main()\n```', NULL, '__name__', '使用 if __name__ == "__main__": 來判斷是否直接執行腳本', 8),
(13, 'Input', E'請完成以下測試方法，測試字符串的長度：\n\n```python\n    def test_length(self):\n        self._______(''Python'', 6)\n```', NULL, 'assertEqual', '使用 assertEqual() 來測試字符串長度是否等於預期值', 9),
(13, 'Input', E'請完成以下測試方法：\n\n```python\n    def test_split(self):\n        s = ''hello world''\n        self._______(s.split(), [''hello'', ''world''])\n```', NULL, 'assertEqual', '使用 assertEqual() 來測試 split() 方法的返回值是否等於預期結果', 10),
(13, 'Input', E'請完成以下測試方法定義：\n\n```python\n    def test_upper(_______):\n        self.assertEqual(''foo''.upper(), ''FOO'')\n```', NULL, 'self', '測試方法的第一個參數必須是 self，代表測試類的實例', 11),
(13, 'Input', E'請完成以下測試方法：\n\n```python\n    def test_isupper(self):\n        self._______(''FOO''.isupper())\n        self.assertFalse(''Foo''.isupper())\n```', NULL, 'assertTrue', '使用 assertTrue() 來測試 ''FOO''.isupper() 是否返回 True', 12);

-- 新 ID 14: OS 模組全填空挑戰 (來源: 舊 ID 11)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(14, 'Input', E'請完成代碼，取得目前的**工作目錄**：\n\n```python\nimport _______\n\n# 取得目前路徑\ncurrent = _______\nprint(current)\n```\n\n請依序填入（分兩行）：\n1. 模組名稱\n2. 完整的函式調用名稱（包含模組前綴）', NULL, 'os' || chr(10) || 'os.getcwd()', '1. import os' || chr(10) || '2. os.getcwd() 是完整寫法，必須包含 os. 前綴', 1),
(14, 'Input', E'請完成代碼，**列出** C 槽 temp 資料夾下的所有檔案：\n\n```python\nimport _______\n\n# 顯示目錄內容\nfiles = _______(r\'C:\\temp\')\n```\n\n請依序填入（分兩行）：\n1. 模組名稱\n2. 完整的函式調用名稱', NULL, 'os' || chr(10) || 'os.listdir', '1. import os' || chr(10) || '2. os.listdir(path) 用於列出檔案，需寫出完整的 os.listdir', 2),
(14, 'Input', E'請完成代碼，將工作目錄**切換**到 D 槽：\n\n```python\nimport _______\n\n# 變更工作路徑\n_______(r\'D:\\\')\n```\n\n請依序填入（分兩行）：\n1. 模組名稱\n2. 完整的函式調用名稱', NULL, 'os' || chr(10) || 'os.chdir', '1. import os' || chr(10) || '2. os.chdir(path) 用於切換目錄', 3),
(14, 'Input', E'請完成代碼，在當前目錄下**建立**一個名為 "download" 的新資料夾：\n\n```python\nimport _______\n\n# 建立目錄\n_______\n```\n\n請依序填入（分兩行）：\n1. 模組名稱\n2. 完整的函式調用名稱', NULL, 'os' || chr(10) || 'os.mkdir(''download'')', '1. import os' || chr(10) || '2. os.mkdir(path) 用於建立資料夾', 4),
(14, 'Input', E'請完成代碼，以跨平台的方式**合併路徑**（自動處理斜線問題）：\n\n```python\nimport _______\n\n# 合併資料夾與檔名\nfull_path = _______(\'user\', \'data.txt\')\n```\n\n請依序填入（分兩行）：\n1. 模組名稱\n2. 完整的函式調用名稱（注意：這是子模組）', NULL, 'os' || chr(10) || 'os.path.join', '1. import os' || chr(10) || '2. os.path.join() 是正確的完整寫法，join 位於 os.path 子模組下', 5);

-- 新 ID 15: 檔案讀寫進階挑戰 (來源: 舊 ID 13)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(15, 'Input', E'請寫出**完整的一行程式碼**，使用 `with` 語法以 **讀取模式 ** 開啟檔案 `\'data.txt\'`，並將檔案物件命名為 `f`：\n（請使用單引號）', NULL, 'with open(''data.txt'', ''r'') as f:', '標準寫法：with open(''filename'', ''mode'') as variable:', 1),
(15, 'Input', E'請寫出**完整的一行程式碼**，使用 `with` 語法以 **寫入模式 ** 開啟檔案 `\'result.csv\'`，並將檔案物件命名為 `outfile`：\n（請使用單引號）', NULL, 'with open(''result.csv'', ''w'') as outfile:', '注意模式為 ''w''，且變數名稱需依照題目要求設為 outfile。', 2),
(15, 'Input', E'請寫出**完整的一行程式碼**，使用 `with` 語法以 **附加模式 ** 開啟檔案 `\'system.log\'`，並將檔案物件命名為 `log`：\n（請使用單引號，不要覆蓋原檔案內容）', NULL, 'with open(''system.log'', ''a'') as log:', '附加模式使用 ''a'' (append)，變數命名為 log。', 3),
(15, 'Input', E'請寫出**完整的一行程式碼**，使用 `with` 語法以 **二進位讀取模式 ** 開啟圖片檔案 `\'photo.jpg\'`，並將檔案物件命名為 `img`：\n（常用於讀取圖片或非文字檔）', NULL, 'with open(''photo.jpg'', ''rb'') as img:', '讀取非文字檔（如圖片）需加上 b，模式為 ''rb''。', 4),
(15, 'Input', E'當使用 `for line in f:` 逐行讀取時，每一行末尾通常已包含換行符號。請寫出**完整的一行 print 程式碼**，將 `line` 印出且**不自動增加額外換行**：\n（參數請使用單引號）', NULL, 'print(line, end='''')', '因為檔案內容的每一行通常已有 \\n，所以 print 必須設定 end='''' (空字串) 來取消預設的換行，避免輸出變成雙倍行距。', 5),
(15, 'Input', E'若不使用迴圈，請寫出**完整的一行程式碼**，直接**讀取檔案 `f` 的所有內容並將其打印**出來：\n（請使用最簡潔的寫法）', NULL, 'print(f.read())', 'print(f.read()) 會先將檔案內容一次性讀取為字串，然後直接交給 print 函式輸出。', 6);

-- Exam 16 為綜合練習，暫無題目，保留空殼。

-- ============================================
-- 步驟 5: 插入高階題目 (CodeExecution)
-- ============================================

-- 考試 17: Python DateTime 高階實作
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, test_cases, question_order) VALUES
(17, 'CodeExecution', E'## 日期格式化\n\n編寫一個程式，讀取一個日期（格式：年 月 日，用空格分隔），然後輸出格式化的日期字串 "YYYY-MM-DD"。\n\n**說明：**\n- 使用 `input()` 讀取一行輸入（三個整數：年 月 日）\n- 可以使用 `[int(x) for x in input().split()]` 來切分字串並轉換為整數\n- 使用 `print()` 輸出結果\n\n**範例：**\n如果輸入是：\n```\n2025 12 25\n```\n\n則輸出應該是：\n```\n2025-12-25\n```', NULL, E'import datetime' || chr(10) || 'year, month, day = [int(x) for x in input().split()]' || chr(10) || 'date_obj = datetime.date(year, month, day)' || chr(10) || 'print(date_obj.strftime("%Y-%m-%d"))', '使用 datetime.date() 建立日期對象，然後使用 strftime() 格式化輸出。', '[
  {"input": "2025 12 25", "expectedOutput": "2025-12-25"},
  {"input": "2024 1 1", "expectedOutput": "2024-01-01"},
  {"input": "1990 5 15", "expectedOutput": "1990-05-15"}
]'::jsonb, 1),
(17, 'CodeExecution', E'## 計算兩個日期之間的天數\n\n編寫一個程式，讀取兩個日期（格式：年 月 日，用空格分隔，每行一個日期），然後輸出兩個日期之間相差的天數。\n\n**說明：**\n- 使用 `input()` 讀取兩行輸入\n- 可以使用 `[int(x) for x in input().split()]` 來切分字串並轉換為整數\n- 計算日期差並輸出天數\n- 使用 `print()` 輸出結果\n\n**範例：**\n如果輸入是：\n```\n2025 1 1\n2025 1 10\n```\n\n則輸出應該是：\n```\n9\n```', NULL, E'import datetime' || chr(10) || 'y1, m1, d1 = [int(x) for x in input().split()]' || chr(10) || 'y2, m2, d2 = [int(x) for x in input().split()]' || chr(10) || 'date1 = datetime.date(y1, m1, d1)' || chr(10) || 'date2 = datetime.date(y2, m2, d2)' || chr(10) || 'diff = abs((date2 - date1).days)' || chr(10) || 'print(diff)', '使用 datetime.date() 建立兩個日期對象，計算差值並取得天數。', '[
  {"input": "2025 1 1\n2025 1 10", "expectedOutput": "9"},
  {"input": "2024 1 1\n2024 12 31", "expectedOutput": "365"},
  {"input": "2025 3 1\n2025 3 1", "expectedOutput": "0"}
]'::jsonb, 2),
(17, 'CodeExecution', E'## 日期時間格式化\n\n編寫一個程式，讀取一個日期時間（格式：年 月 日 時 分 秒，用空格分隔），然後輸出格式化的日期時間字串 "YYYY年MM月DD日 HH:MM:SS"。\n\n**說明：**\n- 使用 `input()` 讀取一行輸入（六個整數）\n- 可以使用 `[int(x) for x in input().split()]` 來切分字串並轉換為整數\n- 使用 `print()` 輸出結果\n\n**範例：**\n如果輸入是：\n```\n2025 12 25 14 30 0\n```\n\n則輸出應該是：\n```\n2025年12月25日 14:30:00\n```', NULL, E'import datetime' || chr(10) || 'year, month, day, hour, minute, second = [int(x) for x in input().split()]' || chr(10) || 'dt = datetime.datetime(year, month, day, hour, minute, second)' || chr(10) || 'print(dt.strftime("%Y年%m月%d日 %H:%M:%S"))', '使用 datetime.datetime() 建立日期時間對象，然後使用 strftime() 格式化輸出。', '[
  {"input": "2025 12 25 14 30 0", "expectedOutput": "2025年12月25日 14:30:00"},
  {"input": "2024 1 1 0 0 0", "expectedOutput": "2024年01月01日 00:00:00"},
  {"input": "2025 3 15 9 5 30", "expectedOutput": "2025年03月15日 09:05:30"}
]'::jsonb, 3);

-- 考試 18: Python 格式化輸出 高階實作
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, test_cases, question_order) VALUES
(18, 'CodeExecution', E'## 格式化輸出商品資訊\n\n編寫一個程式，讀取商品名稱、價格和數量（每行一個），然後輸出格式化的商品資訊。\n\n**輸出格式：**\n商品：{名稱}，單價：{價格}（保留2位小數），數量：{數量}\n\n**說明：**\n- 使用 `input()` 讀取三行輸入\n- 使用 `format()` 方法格式化輸出\n- 價格需保留2位小數\n- 使用 `print()` 輸出結果\n\n**範例：**\n如果輸入是：\n```\n筆記本\n89.5\n3\n```\n\n則輸出應該是：\n```\n商品：筆記本，單價：89.50，數量：3\n```', NULL, E'product = input()' || chr(10) || 'price = float(input())' || chr(10) || 'quantity = int(input())' || chr(10) || 'print("商品：{}，單價：{:.2f}，數量：{}".format(product, price, quantity))', '使用 format() 方法格式化輸出，價格使用 .2f 保留兩位小數。', '[
  {"input": "筆記本\n89.5\n3", "expectedOutput": "商品：筆記本，單價：89.50，數量：3"},
  {"input": "鉛筆\n15.8\n10", "expectedOutput": "商品：鉛筆，單價：15.80，數量：10"},
  {"input": "橡皮擦\n5.0\n20", "expectedOutput": "商品：橡皮擦，單價：5.00，數量：20"}
]'::jsonb, 1),
(18, 'CodeExecution', E'## 格式化輸出數字（千分位）\n\n編寫一個程式，讀取一個整數，然後輸出帶有千分位符號的格式化數字。\n\n**說明：**\n- 使用 `input()` 讀取一個整數\n- 使用 `format()` 方法加上千分位符號\n- 使用 `print()` 輸出結果\n\n**範例：**\n如果輸入是：\n```\n1234567\n```\n\n則輸出應該是：\n```\n1,234,567\n```', NULL, E'num = int(input())' || chr(10) || 'print("{:,}".format(num))', '使用 format() 方法的 , 格式加上千分位符號。', '[
  {"input": "1234567", "expectedOutput": "1,234,567"},
  {"input": "1000000", "expectedOutput": "1,000,000"},
  {"input": "999", "expectedOutput": "999"}
]'::jsonb, 2),
(18, 'CodeExecution', E'## 格式化輸出分數（對齊）\n\n編寫一個程式，讀取一個浮點數（分數），然後輸出格式化的分數（總長度10，靠右對齊，保留2位小數）。\n\n**說明：**\n- 使用 `input()` 讀取一個浮點數\n- 使用 `format()` 方法格式化輸出（>10.2f）\n- 使用 `print()` 輸出結果\n\n**範例：**\n如果輸入是：\n```\n95.678\n```\n\n則輸出應該是：\n```\n     95.68\n```', NULL, E'score = float(input())' || chr(10) || 'print("{:>10.2f}".format(score))', '使用 format() 方法的 >10.2f 格式實現靠右對齊、欄寬10、小數2位。', '[
  {"input": "95.678", "expectedOutput": "     95.68"},
  {"input": "100.0", "expectedOutput": "    100.00"},
  {"input": "5.5", "expectedOutput": "      5.50"}
]'::jsonb, 3);

-- 考試 19: Python 單元測試 高階實作
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, test_cases, question_order) VALUES
(19, 'CodeExecution', E'## 編寫 unittest 測試類\n\n編寫一個完整的 unittest 測試程式，測試字符串的 `upper()` 方法。\n\n**要求：**\n1. 導入 unittest 模組\n2. 定義一個繼承自 `unittest.TestCase` 的測試類 `TestStringMethods`\n3. 定義一個測試方法 `test_upper`，測試 `"foo".upper()` 是否等於 `"FOO"`\n4. 添加 `if __name__ == "__main__": unittest.main()`\n\n**說明：**\n- 使用 `input()` 讀取一個測試字串（但實際上不需要，因為測試是固定的）\n- 輸出 "OK" 表示測試通過（實際上 unittest 會自動輸出）\n- 為了簡化，只需輸出 "OK" 即可\n\n**範例：**\n如果輸入是：\n```\nfoo\n```\n\n則輸出應該是：\n```\nOK\n```', NULL, E'import unittest' || chr(10) || 'class TestStringMethods(unittest.TestCase):' || chr(10) || '    def test_upper(self):' || chr(10) || '        self.assertEqual("foo".upper(), "FOO")' || chr(10) || 'if __name__ == "__main__":' || chr(10) || '    unittest.main()' || chr(10) || 'print("OK")', '編寫完整的 unittest 測試類，包含測試方法和主程式入口。', '[
  {"input": "foo", "expectedOutput": "OK"},
  {"input": "test", "expectedOutput": "OK"},
  {"input": "hello", "expectedOutput": "OK"}
]'::jsonb, 1),
(19, 'CodeExecution', E'## 編寫 unittest 測試方法\n\n編寫一個完整的 unittest 測試程式，測試字符串的 `isupper()` 方法。\n\n**要求：**\n1. 導入 unittest 模組\n2. 定義一個繼承自 `unittest.TestCase` 的測試類 `TestString`\n3. 定義一個測試方法 `test_isupper`，使用 `assertTrue` 測試 `"FOO".isupper()`，使用 `assertFalse` 測試 `"Foo".isupper()`\n4. 添加 `if __name__ == "__main__": unittest.main()`\n\n**說明：**\n- 輸出 "OK" 表示測試通過\n\n**範例：**\n如果輸入是：\n```\nFOO\n```\n\n則輸出應該是：\n```\nOK\n```', NULL, E'import unittest' || chr(10) || 'class TestString(unittest.TestCase):' || chr(10) || '    def test_isupper(self):' || chr(10) || '        self.assertTrue("FOO".isupper())' || chr(10) || '        self.assertFalse("Foo".isupper())' || chr(10) || 'if __name__ == "__main__":' || chr(10) || '    unittest.main()' || chr(10) || 'print("OK")', '編寫完整的 unittest 測試類，使用 assertTrue 和 assertFalse 測試。', '[
  {"input": "FOO", "expectedOutput": "OK"},
  {"input": "TEST", "expectedOutput": "OK"},
  {"input": "HELLO", "expectedOutput": "OK"}
]'::jsonb, 2),
(19, 'CodeExecution', E'## 編寫 unittest 異常測試\n\n編寫一個完整的 unittest 測試程式，測試當 `split()` 方法接收到非字符串參數時是否會拋出 `TypeError`。\n\n**要求：**\n1. 導入 unittest 模組\n2. 定義一個繼承自 `unittest.TestCase` 的測試類 `TestSplit`\n3. 定義一個測試方法 `test_split_typeerror`，使用 `assertRaises(TypeError)` 測試 `"hello".split(2)`\n4. 添加 `if __name__ == "__main__": unittest.main()`\n\n**說明：**\n- 輸出 "OK" 表示測試通過\n\n**範例：**\n如果輸入是：\n```\nhello\n```\n\n則輸出應該是：\n```\nOK\n```', NULL, E'import unittest' || chr(10) || 'class TestSplit(unittest.TestCase):' || chr(10) || '    def test_split_typeerror(self):' || chr(10) || '        with self.assertRaises(TypeError):' || chr(10) || '            "hello".split(2)' || chr(10) || 'if __name__ == "__main__":' || chr(10) || '    unittest.main()' || chr(10) || 'print("OK")', '編寫完整的 unittest 測試類，使用 assertRaises 測試異常。', '[
  {"input": "hello", "expectedOutput": "OK"},
  {"input": "test", "expectedOutput": "OK"},
  {"input": "world", "expectedOutput": "OK"}
]'::jsonb, 3);

-- 考試 20: Python OS 模組 高階實作
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, test_cases, question_order) VALUES
(20, 'CodeExecution', E'## 列出目錄內容\n\n編寫一個程式，讀取一個目錄路徑，然後列出該目錄下的所有檔案和資料夾名稱（每行一個，按字母順序排序）。\n\n**說明：**\n- 使用 `input()` 讀取目錄路徑\n- 使用 `os.listdir()` 列出目錄內容\n- 將結果排序後輸出\n- 使用 `print()` 輸出每個項目（每行一個）\n\n**範例：**\n如果輸入是：\n```\n.\n```\n\n則輸出應該是當前目錄下的檔案列表（按字母順序排序，每行一個）。', NULL, E'import os' || chr(10) || 'path = input()' || chr(10) || 'files = sorted(os.listdir(path))' || chr(10) || 'for f in files:' || chr(10) || '    print(f)', '使用 os.listdir() 列出目錄內容，使用 sorted() 排序後逐行輸出。', '[
  {"input": ".", "expectedOutput": "main.py\nREADME.md\n__pycache__"},
  {"input": ".", "expectedOutput": "app.py\ntest.py\nutils.py"},
  {"input": ".", "expectedOutput": "config.json\ndata.csv\nscript.py"}
]'::jsonb, 1),
(20, 'CodeExecution', E'## 合併路徑\n\n編寫一個程式，讀取兩個路徑片段（每行一個），然後使用 `os.path.join()` 合併它們並輸出。\n\n**說明：**\n- 使用 `input()` 讀取兩行輸入（路徑片段）\n- 使用 `os.path.join()` 合併路徑\n- 使用 `print()` 輸出結果\n\n**範例：**\n如果輸入是：\n```\ndata\nreport.txt\n```\n\n則輸出應該是：\n```\ndata/report.txt\n```\n（在 Windows 上可能是 `data\\report.txt`）', NULL, E'import os' || chr(10) || 'path1 = input()' || chr(10) || 'path2 = input()' || chr(10) || 'full_path = os.path.join(path1, path2)' || chr(10) || 'print(full_path)', '使用 os.path.join() 合併路徑，會根據作業系統自動選擇正確的分隔符號。', '[
  {"input": "data\nreport.txt", "expectedOutput": "data/report.txt"},
  {"input": "user\ndata.txt", "expectedOutput": "user/data.txt"},
  {"input": "folder\nfile.csv", "expectedOutput": "folder/file.csv"}
]'::jsonb, 2),
(20, 'CodeExecution', E'## 檢查路徑是否存在\n\n編寫一個程式，讀取一個路徑，然後檢查該路徑是否存在，輸出 "存在" 或 "不存在"。\n\n**說明：**\n- 使用 `input()` 讀取路徑\n- 使用 `os.path.exists()` 檢查路徑是否存在\n- 使用 `print()` 輸出結果\n\n**範例：**\n如果輸入是：\n```\n.\n```\n\n則輸出應該是：\n```\n存在\n```\n（當前目錄通常存在）', NULL, E'import os' || chr(10) || 'path = input()' || chr(10) || 'if os.path.exists(path):' || chr(10) || '    print("存在")' || chr(10) || 'else:' || chr(10) || '    print("不存在")', '使用 os.path.exists() 檢查路徑是否存在。', '[
  {"input": ".", "expectedOutput": "存在"},
  {"input": "..", "expectedOutput": "存在"},
  {"input": "/nonexistent_path_12345", "expectedOutput": "不存在"}
]'::jsonb, 3);

-- 考試 21: Python 檔案讀寫 高階實作
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, test_cases, question_order) VALUES
(21, 'CodeExecution', E'## 寫入並讀取檔案\n\n編寫一個程式，讀取一個檔案路徑和一行內容，先將內容寫入檔案，然後讀取該檔案的內容並輸出。\n\n**說明：**\n- 使用 `input()` 讀取檔案路徑（第一行）\n- 使用 `input()` 讀取要寫入的內容（第二行）\n- 先使用 `with open()` 語法開啟檔案（寫入模式）寫入內容\n- 再使用 `with open()` 語法開啟檔案（讀取模式）讀取內容\n- 使用 `print()` 輸出讀取的內容\n\n**範例：**\n如果輸入是：\n```\ntest.txt\nHello World\n```\n\n則輸出應該是：\n```\nHello World\n```', NULL, E'filename = input()' || chr(10) || 'content = input()' || chr(10) || 'with open(filename, "w") as f:' || chr(10) || '    f.write(content)' || chr(10) || 'with open(filename, "r") as f:' || chr(10) || '    print(f.read(), end="")', '先使用寫入模式寫入內容，再使用讀取模式讀取內容。', '[
  {"input": "test.txt\nHello World", "expectedOutput": "Hello World"},
  {"input": "data.txt\nTest Content", "expectedOutput": "Test Content"},
  {"input": "file.txt\nRead me", "expectedOutput": "Read me"}
]'::jsonb, 1),
(21, 'CodeExecution', E'## 寫入三行內容並讀取\n\n編寫一個程式，讀取一個檔案路徑和三行內容，先將這三行內容寫入檔案（每行一個，記得加上換行符號），然後讀取該檔案的內容並輸出。\n\n**說明：**\n- 使用 `input()` 讀取檔案路徑（第一行）\n- 使用 `input()` 讀取第一行內容（第二行）\n- 使用 `input()` 讀取第二行內容（第三行）\n- 使用 `input()` 讀取第三行內容（第四行）\n- 先使用 `with open()` 語法開啟檔案（寫入模式）寫入三行內容\n- 再使用 `with open()` 語法開啟檔案（讀取模式）讀取內容\n- 使用 `print()` 輸出讀取的內容\n\n**範例：**\n如果輸入是：\n```\ntest.txt\nHello\nWorld\nPython\n```\n\n則輸出應該是：\n```\nHello\nWorld\nPython\n```', NULL, E'filename = input()' || chr(10) || 'line1 = input()' || chr(10) || 'line2 = input()' || chr(10) || 'line3 = input()' || chr(10) || 'with open(filename, "w") as f:' || chr(10) || '    f.write(line1 + "\\n" + line2 + "\\n" + line3)' || chr(10) || 'with open(filename, "r") as f:' || chr(10) || '    print(f.read(), end="")', '先以寫入模式開啟檔案並將讀入的三行內容寫入，再以讀取模式開啟檔案將內容全部讀出並印出。', '[
  {"input": "test.txt\nHello\nWorld\nPython", "expectedOutput": "Hello\nWorld\nPython"},
  {"input": "data.txt\nLine 1\nLine 2\nLine 3", "expectedOutput": "Line 1\nLine 2\nLine 3"},
  {"input": "file.txt\nApple\nBanana\nOrange", "expectedOutput": "Apple\nBanana\nOrange"}
]'::jsonb, 3);

-- 考試 22: Python 高階綜合實作
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, test_cases, question_order) VALUES
(22, 'CodeExecution', E'## 三數相加\n\n編寫一個程式，讀取三個數字並輸出它們的總和。\n\n**說明：**\n- 每個數字都在單獨的一行上\n- 使用 `input()` 讀取輸入\n- 使用 `print()` 輸出結果\n\n**範例：**\n如果輸入是：\n```\n2\n3\n6\n```\n\n則輸出應該是：\n```\n11\n```', NULL, E'a = int(input())' || chr(10) || 'b = int(input())' || chr(10) || 'c = int(input())' || chr(10) || 'print(a + b + c)', '使用 input() 讀取三個數字，轉換為整數後相加，最後使用 print() 輸出結果。', '[
  {"input": "2\n3\n6", "expectedOutput": "11"},
  {"input": "0\n20\n300", "expectedOutput": "320"},
  {"input": "-5\n180\n-17", "expectedOutput": "158"}
]'::jsonb, 1),
(22, 'CodeExecution', E'## 計算平均值\n\n編寫一個程式，讀取三個數字並輸出它們的平均值（保留2位小數）。\n\n**說明：**\n- 每個數字都在單獨的一行上\n- 使用 `input()` 讀取輸入\n- 計算平均值並保留2位小數\n- 使用 `print()` 輸出結果\n\n**範例：**\n如果輸入是：\n```\n10\n20\n30\n```\n\n則輸出應該是：\n```\n20.00\n```', NULL, E'a = float(input())' || chr(10) || 'b = float(input())' || chr(10) || 'c = float(input())' || chr(10) || 'avg = (a + b + c) / 3' || chr(10) || 'print("{:.2f}".format(avg))', '計算三個數字的平均值，使用 format() 保留2位小數。', '[
  {"input": "10\n20\n30", "expectedOutput": "20.00"},
  {"input": "5\n10\n15", "expectedOutput": "10.00"},
  {"input": "1\n2\n3", "expectedOutput": "2.00"}
]'::jsonb, 2),
(22, 'CodeExecution', E'## 找出最大值\n\n編寫一個程式，讀取三個整數並輸出它們中的最大值。\n\n**說明：**\n- 每個數字都在單獨的一行上\n- 使用 `input()` 讀取輸入\n- 找出最大值\n- 使用 `print()` 輸出結果\n\n**範例：**\n如果輸入是：\n```\n5\n12\n8\n```\n\n則輸出應該是：\n```\n12\n```', NULL, E'a = int(input())' || chr(10) || 'b = int(input())' || chr(10) || 'c = int(input())' || chr(10) || 'max_val = max(a, b, c)' || chr(10) || 'print(max_val)', '使用 max() 函數找出三個數字中的最大值。', '[
  {"input": "5\n12\n8", "expectedOutput": "12"},
  {"input": "100\n50\n75", "expectedOutput": "100"},
  {"input": "-5\n-10\n-3", "expectedOutput": "-3"}
]'::jsonb, 3);
-- 插入問題資料 - 考試 6 (考古題 卷一：煒杰)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(23, 'MCQ', E'關於下列程式中的字串，哪個敘述正確？\n\nmy_str = "he says''Python is an interesting language''"', '["混用單引號與雙引號一定會造成 SyntaxError", "只要外層引號成對，內層可以是不同種類的引號，不會出錯", "Python 字串必須全部使用單引號，不能用雙引號", "只有在三重引號中才能同時使用單引號與雙引號"]'::jsonb, '只要外層引號成對，內層可以是不同種類的引號，不會出錯', '外層用雙引號包起來時，裡面可以安全地放單引號，不會造成語法錯誤。', 1),
(23, 'MCQ', E'下列哪一個是 Python 中合法的多行字串寫法，且會被當成一個字串物件？', '["\"\"\"這其實是一個字串物件\"\"\"", "\"This is multiline\"", "\"這不是字串\"", "\"This is\" \"two strings\""]'::jsonb, '"""這其實是一個字串物件"""', '使用三重引號（"""..."""）可以建立跨多行的單一字串物件。', 2),
(23, 'MCQ', E'執行下列程式時，len(str_test) 的意義為何？\n\nstr_test = """A string that can span multiple lines"""', '["一定是 41", "會依實際字元數計算長度，而不是題目隨便寫的數字", "len() 無法用在三重引號字串", "len() 只會計算空格不算字母"]'::jsonb, '會依實際字元數計算長度，而不是題目隨便寫的數字', 'len() 會計算實際字元數，三重引號本質上仍是普通字串。', 3),
(23, 'MCQ', E'下列程式執行後，new_val 的型別為何？\n\nnew_val = 4647564755 + 857685795468745.456', '["int", "float", "str", "complex"]'::jsonb, 'float', '整數與浮點數運算時，只要表達式中有 float，結果就會升級為 float。', 4),
(23, 'MCQ', E'在 Python 中，下列哪個運算結果正確反映了布林值與整數的關係？\n\nmy_bool = False + 5 - True + 35//4', '["True == 2, False == -1，所以結果是 2", "True == 1, False == 0，所以最後結果是 12", "True 與 False 不能與整數相加，一定拋出 TypeError", "布林值在算術運算中一律會被當成 0"]'::jsonb, 'True == 1, False == 0，所以最後結果是 12', '在算術運算中 True 會被當成 1、False 當成 0，因此可計算出 12。', 5),
(23, 'MCQ', E'執行下列程式，輸出會是什麼？\n\n```python\nprint("Here is what I have:", (7/2) + (False or True) + (9%3))\n```', '["Here is what I have: 4.5", "Here is what I have: 5", "TypeError，因為布林值不能和數字相加", "Here is what I have: 3.5"]'::jsonb, 'Here is what I have: 4.5', '7/2 是 3.5，False or True 結果為 True(數值 1)，9%3 為 0，總和 4.5。', 6),
(23, 'MCQ', E'關於下列程式，哪個敘述正確？\n\n```python\ncount = input("enter count: ")\nprint(count + 1)\n```', '["一定會印出輸入值加一，例如 32768", "會發生 TypeError，因為 input 回傳字串，不能直接與 int 相加", "input 會自動轉成 int，所以可以正常加一", "會印出字串拼接結果，例如 \"327671\""]'::jsonb, '會發生 TypeError，因為 input 回傳字串，不能直接與 int 相加', 'input() 回傳字串，要做數值運算必須先轉成 int/float。', 7),
(23, 'MCQ', E'關於 format() 預設對齊方式，下列哪個敘述是正確的？', '["字串與數字預設都靠左", "字串預設靠右，數字預設靠左", "字串預設靠左，數字預設靠右", "字串與數字預設都置中"]'::jsonb, '字串預設靠左，數字預設靠右', 'format() 及對齊規則中，字串預設左對齊，數值預設右對齊。', 8),
(23, 'MCQ', E'下列哪個格式字元適合用來把浮點數輸出成科學記號（scientific notation）？', '["s", "d", "e", "x"]'::jsonb, 'e', '"e" 或 "E" 用於科學記號；"s" 則用於字串。', 9),
(23, 'MCQ', E'執行下列程式時，會發生哪一種錯誤？\n\n```python\nx = 0\ny = 1\nz = "2"\nsum = x + y + z\n```', '["IndentationError", "ArithmeticError", "TypeError", "SyntaxError"]'::jsonb, 'TypeError', '整數與字串相加會產生 TypeError：不相容型別的運算。', 10),
(23, 'MCQ', E'在 try/except 區塊中捕捉到例外 e 後，若要「保留原始 stack trace」重新拋出錯誤，應該使用哪一個語句？', '["raise", "raise e", "raise Exception(e)", "raise ValueError(\"Error\")"]'::jsonb, 'raise', '單獨使用 raise 會重新拋出目前正在處理的例外，保留原始堆疊資訊。', 11),
(23, 'MCQ', E'原始檔案 info.txt 內容為：\nJames:1\nBryan:2\nLisa:3\nJessica:4\nRuss:2\n\n程式先以 a 模式附加寫入 "Tom:2\\n"，再逐行讀入並把冒號後的數字轉成 float 相加，最後輸出 values。\n最終 values 會是多少？', '["12.0", "13.0", "14.0", "6.0"]'::jsonb, '14.0', '原有 1+2+3+4+2=12，再加上 Tom:2，總和為 14.0。', 12),
(23, 'MCQ', E'執行下列指令時：\n\n```bash\npython -m unittest -v myModule.py\n```\n\n哪個敘述正確？', '["-m 是 unittest 模組的參數，-v 是 Python 直譯器的參數", "-m 表示以模組方式執行 unittest，-v 表示 verbose 模式顯示詳細測試結果", "-m 和 -v 兩個參數都屬於作業系統 shell 的選項", "這個指令會啟動一個 HTTP 伺服器"]'::jsonb, '-m 表示以模組方式執行 unittest，-v 表示 verbose 模式顯示詳細測試結果', '-m 是 Python 直譯器參數，指定以模組方式執行；-v 是 unittest 模組的 verbose 參數。', 13),
(23, 'MCQ', E'下列哪一個 unittest 斷言最適合用來檢查某個回傳值是否為 5？', '["self.assertTrue(result)", "self.assertEqual(result, 5)", "self.assertIn(5, result)", "self.assertRaises(ValueError, func)"]'::jsonb, 'self.assertEqual(result, 5)', '要檢查回傳值是否等於某個具體數值時，用 assertEqual 最直接。', 14),
(23, 'MCQ', E'對於程式碼 `3 + False`，下列哪個敘述正確？', '["結果是 False", "結果是 3，因為 False 會被當作 0", "一定拋出 TypeError", "結果是 4，因為 False 會被當作 1"]'::jsonb, '結果是 3，因為 False 會被當作 0', '在算術運算中 False 相當於 0，True 相當於 1。', 15),
(23, 'MCQ', E'在命令列執行 python -m pydoc myModule 時，pydoc 會優先在哪裡尋找 myModule？', '["只在標準函式庫中尋找", "只在 site-packages 中尋找", "先在目前執行命令的目錄中尋找對應模組或資料夾", "永遠從網路下載文件"]'::jsonb, '先在目前執行命令的目錄中尋找對應模組或資料夾', '執行目錄會被放在 sys.path 前面，因此會先找當前目錄下的模組。', 16),
(23, 'MCQ', E'當你執行 python -m pydoc -p 9898 時，會發生什麼事？', '["只是在終端機印出說明文件", "產生一個靜態 HTML 檔並輸出到 Example.html", "啟動一個在 9898 埠上的 pydoc 網頁伺服器", "關閉所有舊的 pydoc 伺服器"]'::jsonb, '啟動一個在 9898 埠上的 pydoc 網頁伺服器', '-p 參數會啟動一個 HTTP server，讓你用瀏覽器瀏覽文件。', 17),
(23, 'MCQ', E'關於 sys.argv，下列哪個說法正確？\n\n假設執行：\n```bash\npython program.py Alice 85 90 95\n```', '["sys.argv[0] 是 Alice", "sys.argv[1:] 只會包含成績，不含姓名", "成績個數可以用 len(sys.argv) - 2 計算", "sys.argv 只在互動模式中存在"]'::jsonb, '成績個數可以用 len(sys.argv) - 2 計算', 'argv[0] 是程式檔案名稱，argv[1] 是姓名，其餘才是成績，因此是總長度減去 2。', 18),
(23, 'MCQ', E'下列哪一個是正確使用 os.chdir() 切換到 Windows 目錄 C:\\tmp 的寫法？', '["os.chdir(''c:\\tmp'')", "os.chdir(\"c:\\tmp\")", "os.chdir(r''c:\\tmp'')", "os.chdir(''/c/tmp'')"]'::jsonb, 'os.chdir(r''c:\tmp'')', '因為在一般字串中反斜線 \\ 是跳脫字元，像 \\t 會被解讀成 Tab；加上 r 變成 raw string（r''c:\\tmp''）後，路徑會按原樣處理，不會被錯誤轉義。', 19),
(23, 'MCQ', E'若有 measurements 這個浮點數清單，要將每個數字格式化為兩位小數並用逗號加空格串接，哪一段程式最適合？', '["print(\", \".join(str(f) for f in measurements))", "print(\", \".join(\"%.2f\" % f for f in measurements))", "print(\"%.2f\" % measurements)", "print(measurements.join(\", \"))"]'::jsonb, 'print(", ".join("%.2f" % f for f in measurements))', '舊式格式化 %.2f 可控制到兩位小數，再用 join 連接字串。', 20);

-- 插入問題資料 - 考試 7 (考古題 卷二：千喬)
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(24, 'MCQ', E'下列哪個寫法可以根據今天日期印出正確的星期縮寫（Mon/Tue/...），已知 days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]？', '["today = dt.datetime.now(); wd = dt.date.weekday(today); print(days[wd])", "today = dt.datetime.now(); wd = today.day; print(days[wd])", "wd = dt.datetime.weekday; print(days[wd])", "wd = dt.datetime.date; print(days[wd])"]'::jsonb, 'today = dt.datetime.now(); wd = dt.date.weekday(today); print(days[wd])', 'weekday() 回傳 0~6 的索引，恰好可對應 days 清單。', 1),
(24, 'MCQ', E'關於 datetime.date 物件相減的說法何者正確？\n\n```python\nendTime = date(2018,1,20)\nstartTime = date(2018,1,15)\nresult = endTime - startTime\n```', '["result 是整數 5，代表 5 天", "result 是 timedelta 物件，字串表示可能是 ''5 days, 0:00:00''", "result 是字串 ''5 days''", "這樣寫一定拋出 TypeError"]'::jsonb, 'result 是 timedelta 物件，字串表示可能是 ''5 days, 0:00:00''', '兩個 date 相減會得到 datetime.timedelta 物件，而非單純整數。', 2),
(24, 'MCQ', E'想要計算兩個日期之間的秒數，哪一段程式最適合？\n\n```python\nstartTime = date(2018,1,15)\nendTime   = date(2018,1,20)\n```', '["print(endTime - startTime)", "timeDiff = endTime - startTime; print(int(timeDiff.total_seconds()))", "print((endTime - startTime)/60)", "print(int(datetime.timedelta(endTime - startTime)))"]'::jsonb, 'timeDiff = endTime - startTime; print(int(timeDiff.total_seconds()))', 'total_seconds() 會回傳 timedelta 的總秒數，再轉成 int 即可。', 3),
(24, 'MCQ', E'關於三元運算子（conditional expression） result = A if condition else B，下列哪個敘述正確？', '["condition 為 True 時，回傳 B", "condition 為 False 時，回傳 A", "condition 為 True 時，表達式值為 A", "三元運算子只能用在布林以外型別"]'::jsonb, 'condition 為 True 時，表達式值為 A', '語法「A if condition else B」代表條件成立時取 A，否則取 B。', 4),
(24, 'MCQ', E'若 t 是一個長字串，t.find("will") 與 t.rfind("will") 差別為何？', '["find 與 rfind 完全一樣", "find 從左到右找第一次出現位置，rfind 從右到左找最後一次出現位置", "find 找子字串長度，rfind 找子字串個數", "rfind 只能用在 list 不適用字串"]'::jsonb, 'find 從左到右找第一次出現位置，rfind 從右到左找最後一次出現位置', 'find 回傳第一個匹配的位置，rfind 回傳最後一個匹配的位置。', 5),
(24, 'MCQ', E'在 for 迴圈中使用 continue 的主要效果是什麼？', '["結束整個迴圈", "結束程式", "跳過本次迭代剩餘程式碼，直接進入下一輪", "重新從第一輪開始迴圈"]'::jsonb, '跳過本次迭代剩餘程式碼，直接進入下一輪', 'continue 會略過後續程式碼，只進入下一次迭代。', 6),
(24, 'MCQ', E'關於下列程式，哪個選項最貼近題目說明「略過在 items 中的數字，不要加總它們」？\n\n```python\nfor e in elements:\n    if e in items:\n        ____\n    count += e\n```', '["break", "continue", "pass", "return"]'::jsonb, 'continue', '當 e 在 items 中時用 continue，可跳過當次的 count += e。', 7),
(24, 'MCQ', E'若某行程式碼被 # 註解掉，例如 # my_list.sort()，會有什麼影響？', '["程式仍然會執行 sort()", "該行是註解不會執行，my_list 也就不會被排序", "註解會讓後面整個檔案都不執行", "Python 會拋出 SyntaxError"]'::jsonb, '該行是註解不會執行，my_list 也就不會被排序', '# 開頭代表該行是註解，直譯器會直接略過；因此 my_list.sort() 不會執行，原本順序會維持不變。', 8),
(24, 'MCQ', E'在 pydoc 的輸出中，模組頂層的變數（例如 __author__、__copyright__）通常會出現在：
哪一個區塊？', '["NAME", "DESCRIPTION", "FUNCTIONS", "DATA"]'::jsonb, 'DATA', '模組層級的變數會被列在 DATA 區塊中。', 9),
(24, 'MCQ', E'在 Python 互動環境中要查看 Example1 模組的說明，正確步驟為何？', '["直接輸入 help(Example1) 就好，無須 import", "先 import Example1，再呼叫 help(Example1)", "呼叫 Example1.help()", "請改用 python -m pydoc Example1，help() 無法用於模組"]'::jsonb, '先 import Example1，再呼叫 help(Example1)', 'help() 需要已載入的物件，因此要先 import 模組。', 10),
(24, 'MCQ', E'執行 python -m pydoc -p 8989 的主要效果為何？', '["在終端機列印 sys 模組說明", "為指定模組產生一個 Example.html 檔案", "啟動 pydoc 網頁伺服器在 8989 埠供瀏覽說明文件", "移除所有已安裝的文件"]'::jsonb, '啟動 pydoc 網頁伺服器在 8989 埠供瀏覽說明文件', '-p 會在指定 port 上啟動 HTTP 文件伺服器。', 11),
(24, 'MCQ', E'關於 sys.executable，下列哪一個敘述是正確的？', '["回傳目前 Python 的版本字串", "回傳目前 Python 直譯器可執行檔的完整路徑", "回傳目前作業系統平台名稱", "回傳 sys.path 內容"]'::jsonb, '回傳目前 Python 直譯器可執行檔的完整路徑', '例如 Windows 上會類似 C:\\Python311\\python.exe。', 12),
(24, 'MCQ', E'math.floor 與 math.ceil 的共同特性為何？', '["都可以直接吃 list 做整批運算", "都只能接受非負整數", "都接受單一數值（int 或 float）並回傳整數", "兩者僅用於科學記號轉換"]'::jsonb, '都接受單一數值（int 或 float）並回傳整數', 'floor/ceil 都是針對單一數值的向下／向上取整函數。', 13),
(24, 'MCQ', E'關於 math.fsum(iterable) 下列哪個選項最貼近它的用途？', '["計算階乘", "高精度地加總一個數值序列", "將所有元素向上取整後組成新 list", "將 list 轉成 tuple"]'::jsonb, '高精度地加總一個數值序列', 'fsum 以較高精度處理浮點數加總，適合大量小數相加。', 14),
(24, 'MCQ', E'如果對一個檔案物件呼叫不存在的 readall() 方法，最有可能拋出哪一種錯誤？', '["SyntaxError", "EOFError", "SystemError", "AttributeError 或類似的 method not found 錯誤"]'::jsonb, 'AttributeError 或類似的 method not found 錯誤', '檔案物件沒有 readall() 方法，會是屬性／方法不存在型的錯誤。', 15),
(24, 'MCQ', E'下列哪一段程式最能正確取得目前 Python 解譯器的安裝路徑？', '["print(sys.path)", "print(sys.platform)", "print(sys.version)", "print(sys.executable)"]'::jsonb, 'print(sys.executable)', 'sys.executable 會給出目前直譯器可執行檔的完整路徑。', 16),
(24, 'MCQ', E'若有 timeDiff 這個 timedelta 物件，想取得它代表的總秒數，下列哪種作法是正確的？', '["int(timeDiff)", "timeDiff.seconds 乘以 60", "timeDiff.total_seconds()", "直接以 str(timeDiff) 轉成秒數"]'::jsonb, 'timeDiff.total_seconds()', 'total_seconds() 會回傳以 float 表示的完整秒數。', 17),
(24, 'MCQ', E'關於 help 與 import，下列說法何者正確？', '["help 是關鍵字，不需要括號", "import 是函式，可以寫成 import()", "help 是函式，需要括號；import 是語法關鍵字，不能加括號", "兩者都可以視情況省略括號"]'::jsonb, 'help 是函式，需要括號；import 是語法關鍵字，不能加括號', 'help(...) 會讀取物件 docstring；import 則是語法，不是函式。', 18),
(24, 'MCQ', E'在使用舊式格式化字串時，下列哪一個寫法可以印出「你的得分是 95.50」？\n\n假設 score = 95.5', '["print(\"你的得分是 %2f\" % score)", "print(\"你的得分是 %.2f\" % score)", "print(\"你的得分是 %d\" % score)", "print(\"你的得分是 %s\" % score)"]'::jsonb, 'print("你的得分是 %.2f" % score)', '%.2f 表示固定兩位小數的浮點數輸出。', 19),
(24, 'MCQ', E'若有 my_items = ([8, ''7'', 1+2j, False]) 這樣的宣告，關於 my_items 的實際型別，下列哪個正確？', '["tuple，因為外層有 ()", "list，因為只有一個元素且 () 只是運算優先權的括號", "set", "str"]'::jsonb, 'list，因為只有一個元素且 () 只是運算優先權的括號', '( [ ... ] ) 仍然是一個 list，外層的 () 只是一般括號，不會自動變成 tuple。', 20);

-- 新 ID 25: Python 字串格式化三大寫法（初階）
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(25, 'MCQ', E'下列哪一種寫法使用 `%` 運算子進行字串格式化？', '["print(\"Hello {}, version {}\".format(name, version))", "print(f\"Hello {name}, version {version}\")", "print(\"Hello %s, version %.1f\" % (name, version))", "print(\"Hello \" + name + \", version \" + version)"]'::jsonb, 'print("Hello %s, version %.1f" % (name, version))', '有 `%s`、`%.1f` 並搭配 `% (...)` 的就是舊式 `%` 格式化。', 1),
(25, 'MCQ', E'下列哪一種寫法使用 `str.format()`？', '["print(\"Hello {}, version {}\".format(name, version))", "print(\"Hello %s, version %.1f\" % (name, version))", "print(f\"Hello {name}, version {version}\")", "print(\"Hello {name}, version {version}\")"]'::jsonb, 'print("Hello {}, version {}".format(name, version))', '使用 `.format(...)` 方法的就是 new style 格式化。', 2),
(25, 'MCQ', E'下列哪一種寫法使用 f-string？', '["print(\"Hello {}, version {}\".format(name, version))", "print(f\"Hello {name}, version {version}\")", "print(\"Hello %s\" % name)", "print(\"Hello {name}\")"]'::jsonb, 'print(f"Hello {name}, version {version}")', 'f-string 會在字串前加上 `f`，並在 `{}` 內直接放變數。', 3),
(25, 'MCQ', E'給定：\n\n```python\nname = "Gemini"\nversion = 3.5\nprint("Hello %s, version %.1f" % (name, version))\n```\n\n輸出為何？', '["Hello Gemini, version 3.5", "Hello name, version version", "Hello Gemini, version 3.50", "Hello Gemini version 3.5"]'::jsonb, 'Hello Gemini, version 3.5', '`%s` 放字串，`%.1f` 代表小數 1 位，因此是 `3.5`。', 4),
(25, 'MCQ', E'給定：\n\n```python\nname = "Gemini"\nversion = 3.5\nprint("Hello {}, version {}".format(name, version))\n```\n\n輸出為何？', '["Hello Gemini, version 3.5", "Hello {}, version {}", "Hello Gemini version 3.5", "Hello Gemini, version %.1f"]'::jsonb, 'Hello Gemini, version 3.5', '`{}` 會依序套入 `name` 與 `version`。', 5),
(25, 'MCQ', E'給定：\n\n```python\nname = "Gemini"\nversion = 3.5\nprint(f"Hello {name}, version {version}")\n```\n\n輸出為何？', '["Hello Gemini, version 3.5", "Hello {name}, version {version}", "Hello Gemini version", "Hello Gemini, version %.1f"]'::jsonb, 'Hello Gemini, version 3.5', 'f-string 會直接把 `{name}`、`{version}` 插值成變數內容。', 6),
(25, 'MCQ', E'在 `%` 格式化中，`%s` 通常用來放哪種類型？', '["整數", "字串", "布林", "列表"]'::jsonb, '字串', '`%s` 是字串佔位符（也可轉成字串顯示其他型別）。', 7),
(25, 'MCQ', E'在 `%` 格式化中，`%.1f` 的意思是什麼？', '["整數補零到 1 位", "浮點數保留 1 位小數", "字串長度限制 1", "科學記號保留 1 位"]'::jsonb, '浮點數保留 1 位小數', '`.1f` 表示浮點數小數點後 1 位。', 8),
(25, 'MCQ', E'下列哪一行會輸出 `3.50`？（version = 3.5）', '["print(\"%.1f\" % version)", "print(\"%.2f\" % version)", "print(\"{}\".format(version))", "print(f\"{version}\")"]'::jsonb, 'print("%.2f" % version)', '`%.2f` 會輸出 2 位小數，因此 `3.50`。', 9),
(25, 'MCQ', E'在 `str.format()` 中，`{}` 的主要作用是什麼？', '["註解", "變數佔位符", "運算子", "型別宣告"]'::jsonb, '變數佔位符', '`{}` 是 format 字串中的佔位符，會由 `.format(...)` 提供值。', 10),
(25, 'MCQ', E'下列哪一個 `str.format()` 寫法可輸出 `Hello Gemini`？', '["\"Hello {}\".format(\"Gemini\")", "\"Hello {name}\"", "\"Hello %s\" % \"Gemini\"", "f\"Hello name\""]'::jsonb, '"Hello {}".format("Gemini")', '`{}` 會被 `.format("Gemini")` 取代。', 11),
(25, 'MCQ', E'f-string 的語法特徵是哪一個？', '["字串前加 `%`", "字串前加 `f`，並在 `{}` 放變數/表達式", "一定要呼叫 `.format()`", "只能插入字串不能插入數字"]'::jsonb, '字串前加 `f`，並在 `{}` 放變數/表達式', 'f-string 使用 `f"..."`，可在 `{}` 內寫變數或運算式。', 12),
(25, 'MCQ', E'下列哪一行可以在 f-string 內直接做運算？', '["print(f\"{version + 1}\")", "print(\"{version + 1}\".format())", "print(\"%f\" % (version + ))", "print(f\"version\")"]'::jsonb, 'print(f"{version + 1}")', 'f-string 的 `{}` 內可直接放 Python 表達式。', 13),
(25, 'MCQ', E'如果要讓三種寫法都輸出 `Hello Gemini, version 3.5`，下列哪個敘述正確？', '["只有 `%` 可以做到", "只有 f-string 可以做到", "三種都可以做到", "三種都做不到"]'::jsonb, '三種都可以做到', '`%`、`str.format()`、f-string 都能達到相同輸出。', 14),
(25, 'MCQ', E'在可讀性上，初學者通常最容易直觀理解哪一種插值寫法？', '["f-string", "`%` 運算子", "字串相加一定最好", "三者都一樣無差異"]'::jsonb, 'f-string', 'f-string 直接在字串中看到變數名，通常最直觀。', 15),
(25, 'MCQ', E'下列哪個是 `%` 寫法對應 `name=\"Gemini\"`、`version=3.5` 的正確版本？', '["\"Hello %s, version %.1f\" % (name, version)", "\"Hello {}, version {}\" % (name, version)", "\"Hello %s, version %.1f\".format(name, version)", "f\"Hello %s, version %.1f\""]'::jsonb, '"Hello %s, version %.1f" % (name, version)', '`%` 寫法必須是「格式字串 % tuple」。', 16),
(25, 'MCQ', E'下列哪個是 `str.format()` 寫法對應 `name` 與 `version` 的正確版本？', '["\"Hello {}, version {}\".format(name, version)", "\"Hello %s, version %.1f\" % (name, version)", "f\"Hello {}, version {}\"", "\"Hello {name}, version {version}\" % (name, version)"]'::jsonb, '"Hello {}, version {}".format(name, version)', 'new style 的標準寫法是 `"...{}".format(...)`。', 17),
(25, 'MCQ', E'下列哪個是 f-string 寫法對應 `name` 與 `version` 的正確版本？', '["f\"Hello {name}, version {version}\"", "\"Hello {}, version {}\".format(name, version)", "\"Hello %s, version %.1f\" % (name, version)", "\"fHello {name}, version {version}\""]'::jsonb, 'f"Hello {name}, version {version}"', '字串前要有 `f`，並用 `{}` 包住變數。', 18),
(25, 'MCQ', E'若 `name = "Gemini"`，以下哪一行會得到 `Hello Gemini`？', '["print(f\"Hello {name}\")", "print(\"Hello {name}\")", "print(\"Hello %d\" % name)", "print(\"Hello\" + 1)"]'::jsonb, 'print(f"Hello {name}")', '`"Hello {name}"` 若沒有 f 或 format 不會插值。', 19),
(25, 'MCQ', E'總結三種格式化：`%`、`.format()`、f-string，下列何者正確？', '["三者都屬於 Python 合法且常見的字串格式化方式", "只有 `%` 是合法語法", "`.format()` 已被 Python 移除", "f-string 只能在 Python 2 使用"]'::jsonb, '三者都屬於 Python 合法且常見的字串格式化方式', '三種都是合法做法；實務上常見 f-string 與 format。', 20);

-- 新 ID 26: Python pydoc 區塊辨識（初階）
INSERT INTO questions (exam_id, type, question, options, correct_answer, explanation, question_order) VALUES
(26, 'MCQ', E'在 python -m pydoc geometry 的輸出中，NAME 區塊主要對應哪一項？', '["模組名稱 + 模組 docstring 第一行", "所有函式清單", "所有類別與方法", "模組檔案完整路徑"]'::jsonb, '模組名稱 + 模組 docstring 第一行', 'NAME 通常顯示「模組名 - docstring 第一行摘要」。', 1),
(26, 'MCQ', E'DESCRIPTION 區塊最主要是從哪裡來的？', '["函式內部註解", "模組 docstring 第二行開始的內容", "所有全域變數名稱", "import 清單"]'::jsonb, '模組 docstring 第二行開始的內容', 'DESCRIPTION 會承接模組 docstring 的後續說明。', 2),
(26, 'MCQ', E'FUNCTIONS 區塊會列出下列哪一類內容？', '["只有 class method", "模組頂層 def 與其 docstring", "只列出常數值", "只列出作者資訊"]'::jsonb, '模組頂層 def 與其 docstring', 'FUNCTIONS 針對模組層級函式（非類別方法）。', 3),
(26, 'MCQ', E'CLASSES 區塊通常會包含什麼？', '["模組路徑與版本", "類別名稱、類別 docstring 與 methods 資訊", "所有 if/for 語句", "只顯示 __name__"]'::jsonb, '類別名稱、類別 docstring 與 methods 資訊', 'CLASSES 會整理模組中的類別與其方法說明。', 4),
(26, 'MCQ', E'DATA 區塊最可能看到哪種內容？', '["__author__ = \"CodeCat\" 這類頂層變數", "函式參數型別", "測試結果摘要", "路徑分隔符設定"]'::jsonb, '__author__ = "CodeCat" 這類頂層變數', 'DATA 會列出模組層級變數，例如 PI、__version__。', 5),
(26, 'MCQ', E'FILE 區塊顯示的重點是什麼？', '["目前 Python 版本", "模組實際檔案路徑", "函式回傳值", "模組安裝指令"]'::jsonb, '模組實際檔案路徑', 'FILE 區塊用來告訴你文件對應到哪個實體檔案。', 6),
(26, 'MCQ', E'若模組 docstring 只有一行，關於 NAME 與 DESCRIPTION 的敘述何者正確？', '["兩者都一定空白", "DESCRIPTION 可能很少內容，甚至與 NAME 重複感很高", "NAME 會消失", "一定拋出 SyntaxError"]'::jsonb, 'DESCRIPTION 可能很少內容，甚至與 NAME 重複感很高', '因為 DESCRIPTION 來自第二行之後；只有一行時可用內容有限。', 7),
(26, 'MCQ', E'下列哪一項最可能出現在 FUNCTIONS 區塊？', '["add(a, b)", "__version__ = \"1.0\"", "class Counter:", "C:/path/to/geometry.py"]'::jsonb, 'add(a, b)', 'add(a, b) 是函式簽章，屬於 FUNCTIONS。', 8),
(26, 'MCQ', E'下列哪一項最可能出現在 CLASSES 區塊？', '["PI = 3.14159", "Square 與其 area()、perimeter() 方法", "python -m pydoc geometry 指令", "os.path.join"]'::jsonb, 'Square 與其 area()、perimeter() 方法', '類別本體與 methods 會被歸在 CLASSES。', 9),
(26, 'MCQ', E'下列哪一項最可能出現在 DATA 區塊？', '["def rectangle_perimeter(width, height):", "__author__ = \"Ada\"", "class Square:", "FILE"]'::jsonb, '__author__ = "Ada"', '作者、版本、常數等頂層變數會列在 DATA。', 10),
(26, 'MCQ', E'想知道 pydoc 目前在說明哪個實際檔案，應優先看哪個區塊？', '["NAME", "FUNCTIONS", "FILE", "DESCRIPTION"]'::jsonb, 'FILE', '要定位實體檔案就看 FILE。', 11),
(26, 'MCQ', E'下列哪個敘述最正確？', '["FUNCTIONS 會列出模組中的頂層函式，不含 class method", "DATA 只會列出函式名稱", "NAME 只顯示檔案路徑", "CLASSES 只顯示 import 清單"]'::jsonb, 'FUNCTIONS 會列出模組中的頂層函式，不含 class method', 'class method 會歸在 CLASSES 內的對應類別之下。', 12),
(26, 'MCQ', E'若看到 PI = 3.14159、__version__ = \"0.1\" 這些資訊，最可能是從哪個區塊讀到的？', '["DESCRIPTION", "DATA", "FILE", "NAME"]'::jsonb, 'DATA', '這些都是模組層級變數，屬 DATA。', 13),
(26, 'MCQ', E'下列哪一題屬於在考「區塊對應」觀念？', '["NAME 對應模組名與 docstring 第一行", "math.ceil(3.1) 會回傳多少", "for 迴圈怎麼寫", "list.sort() 是否原地排序"]'::jsonb, 'NAME 對應模組名與 docstring 第一行', '本考試重點是 pydoc 區塊辨識，而不是一般語法計算。', 14),
(26, 'MCQ', E'在 python -m pydoc geometry 中，如果你要快速看有哪些可直接呼叫的模組函式，應先看哪個區塊？', '["FUNCTIONS", "DATA", "FILE", "NAME"]'::jsonb, 'FUNCTIONS', '可呼叫的模組層級函式會集中在 FUNCTIONS。', 15);

SELECT '考試資料重構完成！共 26 個考試單元已建立。' AS message;