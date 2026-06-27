const sections = [
  { id: "random", title: "Python random 模組對照表總整理" },
  { id: "operator-priority", title: "運算子優先順序" },
  { id: "datetime", title: "時間格式化（datetime）" },
  { id: "math", title: "Python Math 模組" },
  { id: "os-path", title: "Python OS 模組與檔案路徑" },
  { id: "format-output", title: "format格式化輸出" },
  { id: "unittest", title: "unittest 標準格式" },
  { id: "unittest-cli", title: "unittest 命令行選項" },
  { id: "file-open", title: "開檔讀檔（open 模式）" },
  { id: "pydoc", title: "pydoc 讀取模組區塊" },
  { id: "errors", title: "error 種類" },
  { id: "compare", title: "檔案／物件比較概念" },
  { id: "three-format", title: "三種格式化（%, format, f-string）" },
];

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const tableClass =
  "min-w-full text-xs sm:text-sm text-left border-collapse";
const thClass = "border-b-2 border-gray-300 bg-orange-50/50 px-3 py-1.5 font-semibold text-gray-800 text-xs sm:text-sm select-none";
const tdClass = "border-b border-gray-200 px-3 py-1.5 align-top text-gray-600 text-xs sm:text-sm";

const GuideCodeBlock = ({ children, language = 'python' }) => {
  const handleCopyPrevent = (e) => {
    e.preventDefault();
    alert('為了學習成效，本頁面的範例程式碼禁止複製貼上，請手動練習輸入！');
  };

  return (
    <div onCopy={handleCopyPrevent} className="my-3 select-none">
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        className="rounded-xl border border-gray-800 shadow-sm"
        customStyle={{
          margin: 0,
          borderRadius: '0.75rem',
          fontSize: '0.8125rem',
        }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
};

const ArticleGuide = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-gray-800">
      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Python 重點整理</h1>
        <p className="text-gray-600">
          考題重點整理，可透過目錄快速跳轉章節。
        </p>
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">目錄快速導覽</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-gray-700 hover:text-primary bg-white/40 hover:bg-orange-50/50 border border-gray-200/50 px-3 py-2 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow hover:-translate-y-0.5"
            >
              # {section.title}
            </a>
          ))}
        </div>
      </div>

      <section id="random" className="bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6 space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">Python random 模組對照表總整理</h2>
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>函式</th>
                <th className={thClass}>用途（幹嘛用）</th>
                <th className={thClass}>語法範例</th>
                <th className={thClass}>是否可重複</th>
                <th className={thClass}>回傳型態</th>
                <th className={thClass}>範例輸出</th>
                <th className={thClass}>常見陷阱與補充</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>random.randint(a, b)</td>
                <td className={tdClass}>取一個整數，包含 a 與 b</td>
                <td className={tdClass}>random.randint(1, 10)</td>
                <td className={tdClass}>可重複</td>
                <td className={tdClass}>int</td>
                <td className={tdClass}>7</td>
                <td className={tdClass}>包含右邊界；randint(1,1) 會回傳 1</td>
              </tr>
              <tr>
                <td className={tdClass}>random.randrange(a, b)</td>
                <td className={tdClass}>取整數，不包含 b</td>
                <td className={tdClass}>random.randrange(1, 10)</td>
                <td className={tdClass}>可重複</td>
                <td className={tdClass}>int</td>
                <td className={tdClass}>5</td>
                <td className={tdClass}>範圍是 1~9；要含 10 用 randint</td>
              </tr>
              <tr>
                <td className={tdClass}>random.random()</td>
                <td className={tdClass}>取 0.0~1.0 的浮點數</td>
                <td className={tdClass}>random.random()</td>
                <td className={tdClass}>可重複</td>
                <td className={tdClass}>float</td>
                <td className={tdClass}>0.4386</td>
                <td className={tdClass}>沒有參數；常用於機率判斷</td>
              </tr>
              <tr>
                <td className={tdClass}>random.uniform(a, b)</td>
                <td className={tdClass}>取 a~b 的浮點數</td>
                <td className={tdClass}>random.uniform(1.5, 3.5)</td>
                <td className={tdClass}>可重複</td>
                <td className={tdClass}>float</td>
                <td className={tdClass}>2.73</td>
                <td className={tdClass}>常用於隨機速度、位置等實數</td>
              </tr>
              <tr>
                <td className={tdClass}>random.choice(seq)</td>
                <td className={tdClass}>取單一元素</td>
                <td className={tdClass}>random.choice(["A","B","C"])</td>
                <td className={tdClass}>可重複</td>
                <td className={tdClass}>元素型態</td>
                <td className={tdClass}>"B"</td>
                <td className={tdClass}>空序列會報錯</td>
              </tr>
              <tr>
                <td className={tdClass}>random.choices(seq, k=n)</td>
                <td className={tdClass}>取多個元素（可重複）</td>
                <td className={tdClass}>random.choices([1,2,3], k=2)</td>
                <td className={tdClass}>可重複</td>
                <td className={tdClass}>list</td>
                <td className={tdClass}>[3, 3]</td>
                <td className={tdClass}>預設 k=1 也回傳 list</td>
              </tr>
              <tr>
                <td className={tdClass}>random.sample(seq, k=n)</td>
                <td className={tdClass}>取多個元素（不重複）</td>
                <td className={tdClass}>random.sample([1,2,3,4], 2)</td>
                <td className={tdClass}>不可重複</td>
                <td className={tdClass}>list</td>
                <td className={tdClass}>[3, 1]</td>
                <td className={tdClass}>k 大於元素數量會 ValueError</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="operator-priority" className="bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6 scroll-mt-8">
        <h2 className="text-xl font-semibold mb-4">運算子優先順序</h2>
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>優先順序</th>
                <th className={thClass}>運算子</th>
                <th className={thClass}>說明</th>
                <th className={thClass}>範例</th>
                <th className={thClass}>結果</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className={tdClass}>1</td><td className={tdClass}>()</td><td className={tdClass}>括號最優先</td><td className={tdClass}>2 * (3 + 4)</td><td className={tdClass}>14</td></tr>
              <tr><td className={tdClass}>2</td><td className={tdClass}>**</td><td className={tdClass}>次方（右結合）</td><td className={tdClass}>2 ** 3 ** 2</td><td className={tdClass}>512</td></tr>
              <tr><td className={tdClass}>3</td><td className={tdClass}>* / // %</td><td className={tdClass}>乘除整除取餘</td><td className={tdClass}>10 // 3 % 2</td><td className={tdClass}>1</td></tr>
              <tr><td className={tdClass}>4</td><td className={tdClass}>+ -</td><td className={tdClass}>加減</td><td className={tdClass}>2 + 3 * 4</td><td className={tdClass}>14</td></tr>
              <tr><td className={tdClass}>5</td><td className={tdClass}>比較運算</td><td className={tdClass}>{"< <= > >= == !="}</td><td className={tdClass}>3 &lt; 5 == True</td><td className={tdClass}>False</td></tr>
              <tr><td className={tdClass}>6</td><td className={tdClass}>not and or</td><td className={tdClass}>邏輯運算</td><td className={tdClass}>True or False and False</td><td className={tdClass}>True</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="datetime" className="bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6 space-y-3 scroll-mt-8">
        <h2 className="text-xl font-semibold">時間格式化（datetime）</h2>
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>常見格式</th>
                <th className={thClass}>用途說明</th>
                <th className={thClass}>對應少見格式 / 補充</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}><code>%Y</code></td>
                <td className={tdClass}>四位年份（例如：2026）</td>
                <td className={tdClass}><code>%y</code>（兩位年份，例如：26）</td>
              </tr>
              <tr>
                <td className={tdClass}><code>%m</code></td>
                <td className={tdClass}>月份（01-12）</td>
                <td className={tdClass}>
                  <code>%B</code>（英文月份全稱，例如：December）<br />
                  <code>%b</code>（英文月份簡稱，例如：Dec）
                </td>
              </tr>
              <tr>
                <td className={tdClass}><code>%d</code></td>
                <td className={tdClass}>日期（01-31）</td>
                <td className={tdClass}><code>%j</code>（一年中的第幾天，001-366）</td>
              </tr>
              <tr>
                <td className={tdClass}><code>%H</code></td>
                <td className={tdClass}>小時（24 小時制，00-23）</td>
                <td className={tdClass}>
                  <code>%I</code>（12 小時制，01-12）<br />
                  <code>%p</code>（AM / PM 標記）
                </td>
              </tr>
              <tr>
                <td className={tdClass}><code>%M</code></td>
                <td className={tdClass}>分鐘（00-59）</td>
                <td className={tdClass}>-</td>
              </tr>
              <tr>
                <td className={tdClass}><code>%S</code></td>
                <td className={tdClass}>秒數（00-59）</td>
                <td className={tdClass}><code>%f</code>（微秒，000000-999999）</td>
              </tr>
              <tr>
                <td className={tdClass}>星期（補充）</td>
                <td className={tdClass}>星期相關格式化</td>
                <td className={tdClass}>
                  <code>%A</code>（星期英文全稱，例如：Monday）<br />
                  <code>%a</code>（星期英文簡稱，例如：Mon）<br />
                  <code>%w</code>（星期數字 0-6，0 代表星期日）
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <GuideCodeBlock>
          {`from datetime import datetime
now = datetime.now()
print(now.strftime('%Y/%m/%d'))
print(now.strftime('%H:%M:%S'))`}
        </GuideCodeBlock>
        <GuideCodeBlock>
          {`import datetime

now = datetime.datetime(2025, 12, 25, 14, 30, 0)
print(now.strftime('%Y/%m/%d'))  # 2025/12/25
print(now.strftime('%H:%M:%S'))`}
        </GuideCodeBlock>
      </section>

      <section id="math" className="bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6 space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">Python Math 模組</h2>
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>函式</th>
                <th className={thClass}>用途</th>
                <th className={thClass}>範例</th>
                <th className={thClass}>結果</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>math.fsum(iterable)</td>
                <td className={tdClass}>高精度浮點數加總</td>
                <td className={tdClass}>math.fsum([.3, .3, .3, .1, .1])</td>
                <td className={tdClass}>1.1</td>
              </tr>
              <tr>
                <td className={tdClass}>math.ceil(x)</td>
                <td className={tdClass}>無條件進位</td>
                <td className={tdClass}>math.ceil(3.1)</td>
                <td className={tdClass}>4</td>
              </tr>
              <tr>
                <td className={tdClass}>math.floor(x)</td>
                <td className={tdClass}>無條件捨去（向下取整）</td>
                <td className={tdClass}>math.floor(3.9)</td>
                <td className={tdClass}>3</td>
              </tr>
              <tr>
                <td className={tdClass}>math.factorial(n)</td>
                <td className={tdClass}>計算階乘</td>
                <td className={tdClass}>math.factorial(5)</td>
                <td className={tdClass}>120</td>
              </tr>
              <tr>
                <td className={tdClass}>math.sqrt(x)</td>
                <td className={tdClass}>平方根</td>
                <td className={tdClass}>math.sqrt(16)</td>
                <td className={tdClass}>4.0</td>
              </tr>
              <tr>
                <td className={tdClass}>math.fabs(x)</td>
                <td className={tdClass}>絕對值（回傳 float）</td>
                <td className={tdClass}>math.fabs(-10.5)</td>
                <td className={tdClass}>10.5</td>
              </tr>
              <tr>
                <td className={tdClass}>math.pow(x, y)</td>
                <td className={tdClass}>x 的 y 次方（回傳 float）</td>
                <td className={tdClass}>math.pow(2, 3)</td>
                <td className={tdClass}>8.0</td>
              </tr>
            </tbody>
          </table>
        </div>
        <GuideCodeBlock>
          {`import math

my_list = [.3, .3, .3, .1, .1]
print(math.fsum(my_list))      # 1.1
print(math.ceil(3.1))          # 4
print(math.floor(3.9))         # 3
print(math.factorial(5))       # 120
print(math.sqrt(16))           # 4.0
print(math.fabs(-10.5))        # 10.5
print(math.pow(2, 3))          # 8.0`}
        </GuideCodeBlock>
      </section>

      <section id="os-path" className="bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6 space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">Python OS 模組與檔案路徑</h2>
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>函式</th>
                <th className={thClass}>用途</th>
                <th className={thClass}>範例</th>
                <th className={thClass}>說明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>os.getcwd()</td>
                <td className={tdClass}>取得目前工作目錄</td>
                <td className={tdClass}>os.getcwd()</td>
                <td className={tdClass}>回傳目前程式執行所在路徑</td>
              </tr>
              <tr>
                <td className={tdClass}>os.listdir(path)</td>
                <td className={tdClass}>列出目錄內容</td>
                <td className={tdClass}>os.listdir(r"C:\\tmp")</td>
                <td className={tdClass}>回傳指定路徑下的檔案/資料夾清單</td>
              </tr>
              <tr>
                <td className={tdClass}>os.chdir(path)</td>
                <td className={tdClass}>切換工作目錄</td>
                <td className={tdClass}>os.chdir(r"C:\\Windows")</td>
                <td className={tdClass}>變更目前工作路徑</td>
              </tr>
              <tr>
                <td className={tdClass}>os.mkdir(name)</td>
                <td className={tdClass}>建立資料夾</td>
                <td className={tdClass}>os.mkdir("data")</td>
                <td className={tdClass}>建立單層目錄</td>
              </tr>
              <tr>
                <td className={tdClass}>os.path.join(a, b)</td>
                <td className={tdClass}>合併路徑</td>
                <td className={tdClass}>os.path.join("data", "report.txt")</td>
                <td className={tdClass}>自動處理 Windows/Linux 分隔符</td>
              </tr>
              <tr>
                <td className={tdClass}>os.path.exists(path)</td>
                <td className={tdClass}>檢查是否存在</td>
                <td className={tdClass}>os.path.exists(r"C:\\config.ini")</td>
                <td className={tdClass}>存在回傳 True，否則 False</td>
              </tr>
            </tbody>
          </table>
        </div>

        <GuideCodeBlock>
          {`import os

# 1) Raw string：避免 \\t 被當成 Tab
win_path = r'C:\\temp\\new_file.txt'
print(win_path)

# 2) 目前工作目錄
print(os.getcwd())

# 3) 切換目錄 + 列出內容
os.chdir(r'C:\\Windows')
print(os.listdir('.')[:5])  # 只印前 5 筆

# 4) 跨平台合併路徑
full_path = os.path.join('data', 'report.txt')
print(full_path)

# 5) 檢查檔案是否存在
if os.path.exists(r'C:\\config.ini'):
    print('檔案存在')
else:
    print('檔案找不到')`}
        </GuideCodeBlock>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section
          id="format-output"
          className="bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">格式化輸出</h2>
          <GuideCodeBlock>
            {`print("今天是 {}，溫度是 {} 度".format("星期三", 28))
print("{1} 喜歡 {0}".format("Python", "Vincent"))`}
          </GuideCodeBlock>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>功能</th>
                  <th className={thClass}>格式字串</th>
                  <th className={thClass}>範例輸出</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={tdClass}>小數 2 位</td>
                  <td className={tdClass}>{"{:.2f}"}</td>
                  <td className={tdClass}>3.14</td>
                </tr>
                <tr>
                  <td className={tdClass}>靠左</td>
                  <td className={tdClass}>{"{:<10}"}</td>
                  <td className={tdClass}>Hi········</td>
                </tr>
                <tr>
                  <td className={tdClass}>靠右</td>
                  <td className={tdClass}>{"{:>10}"}</td>
                  <td className={tdClass}>········Hi</td>
                </tr>
                <tr>
                  <td className={tdClass}>置中</td>
                  <td className={tdClass}>{"{:^10}"}</td>
                  <td className={tdClass}>····Hi····</td>
                </tr>
                <tr>
                  <td className={tdClass}>千分位</td>
                  <td className={tdClass}>{"{:,}"}</td>
                  <td className={tdClass}>1,234</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section
          id="three-format"
          className="bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">
            三種格式化（%, format, f-string）
          </h2>
          <GuideCodeBlock>
            {`name = "Gemini"
version = 3.5
print("Hello %s, version %.1f" % (name, version))
print("Hello {}, version {}".format(name, version))
print(f"Hello {name}, version {version}")`}
          </GuideCodeBlock>
          <p>
            三種都可輸出：<b>Hello Gemini, version 3.5</b>
          </p>
        </section>
      </div>

      <section id="unittest" className="bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6 space-y-3 scroll-mt-8">
        <h2 className="text-xl font-semibold">unittest 標準格式</h2>
        <GuideCodeBlock>
          {`import unittest

class TestStringMethods(unittest.TestCase):
    def test_upper(self):
        self.assertEqual('foo'.upper(), 'FOO')

if __name__ == '__main__':
    unittest.main()`}
        </GuideCodeBlock>
      </section>

      <section id="unittest-cli" className="bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6 scroll-mt-8">
        <h2 className="text-xl font-semibold mb-4">unittest 命令行選項</h2>
        <GuideCodeBlock language="bash">
          {`python -m unittest myModule.py`}
        </GuideCodeBlock>
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead><tr><th className={thClass}>參數</th><th className={thClass}>用途</th></tr></thead>
            <tbody>
              <tr><td className={tdClass}>-v</td><td className={tdClass}>顯示每個測試方法（verbose）</td></tr>
              <tr><td className={tdClass}>-f</td><td className={tdClass}>失敗即停止（failfast）</td></tr>
              <tr><td className={tdClass}>-c</td><td className={tdClass}>允許 Ctrl+C 中斷並顯示當前錯誤</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="file-open" className="bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6 scroll-mt-8">
        <h2 className="text-xl font-semibold mb-4">開檔讀檔（open 模式）</h2>
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead><tr><th className={thClass}>模式</th><th className={thClass}>讀寫</th><th className={thClass}>是否清空</th><th className={thClass}>不存在時</th></tr></thead>
            <tbody>
              <tr><td className={tdClass}>r</td><td className={tdClass}>讀</td><td className={tdClass}>否</td><td className={tdClass}>報錯</td></tr>
              <tr><td className={tdClass}>w</td><td className={tdClass}>寫</td><td className={tdClass}>是</td><td className={tdClass}>建立</td></tr>
              <tr><td className={tdClass}>a</td><td className={tdClass}>寫（追加）</td><td className={tdClass}>否</td><td className={tdClass}>建立</td></tr>
              <tr><td className={tdClass}>rb / wb / ab</td><td className={tdClass}>二進位讀寫</td><td className={tdClass}>依 w/a</td><td className={tdClass}>依模式</td></tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 space-y-3">
          <p className="font-medium">常見範例</p>
          <GuideCodeBlock>
            {`# 1) 讀取整個檔案（r）
with open('data.txt', 'r', encoding='utf-8') as f:
    content = f.read()
print(content)

# 2) 寫入檔案（w，會覆蓋）
with open('output.txt', 'w', encoding='utf-8') as f:
    f.write('Hello\\n')
    f.write('World\\n')

# 3) 追加內容（a，不覆蓋）
with open('output.txt', 'a', encoding='utf-8') as f:
    f.write('Append this line\\n')`}
          </GuideCodeBlock>

          <GuideCodeBlock>
            {`# 4) 逐行讀取（省記憶體）
with open('big.txt', 'r', encoding='utf-8') as f:
    for line in f:
        print(line.strip())

# 5) readline / readlines
with open('notes.txt', 'r', encoding='utf-8') as f:
    first = f.readline()     # 只讀第一行
    rest = f.readlines()     # 剩下所有行（list）
print(first)
print(rest)

# 6) 讀取二進位檔（圖片）
with open('photo.jpg', 'rb') as f:
    header = f.read(16)
print(header)`}
          </GuideCodeBlock>
        </div>
      </section>

      <section id="pydoc" className="bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6 scroll-mt-8">
        <h2 className="text-xl font-semibold mb-4">pydoc 讀取模組區塊</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><b>NAME</b>：模組名稱與 docstring 第一行</li>
          <li><b>DESCRIPTION</b>：docstring 後續內容</li>
          <li><b>FUNCTIONS</b>：頂層函式與說明</li>
          <li><b>CLASSES</b>：類別與 methods</li>
          <li><b>DATA</b>：頂層變數（如 <code>__author__</code>）</li>
          <li><b>FILE</b>：實際檔案路徑</li>
        </ul>
        <GuideCodeBlock>
          {`# ==============================
#  🧩 NAME & DESCRIPTION 區塊來源
# ==============================
"""
geometry - 幾何計算小工具模組           # ← 第一行 → 會出現在 NAME 區塊標題
提供面積與周長計算的示範函式與類別。   # ← 從第二行開始 → 會出現在 DESCRIPTION 區塊
"""

# ==============================
#  🧩 DATA 區塊來源
# ==============================
__author__ = "CodeCat"        # ← 會列在 DATA 區塊
__version__ = "0.1"           # ← 會列在 DATA 區塊
PI = 3.14159                  # ← 會列在 DATA 區塊

# ==============================
#  🧩 FUNCTIONS 區塊來源
# ==============================
def circle_area(radius):      # ← 函式名稱與參數會出現在 FUNCTIONS 區塊
    """回傳半徑為 radius 的圓面積。"""  # ← 這段 docstring 會顯示在 FUNCTIONS 區塊
    return PI * radius ** 2


def rectangle_perimeter(width, height):
    """
    計算長方形的周長。              # ← 多行 docstring 全部會出現在 FUNCTIONS 區塊

    Args:
        width (float): 寬。
        height (float): 高。

    Returns:
        float: 長方形的周長。
    """
    return 2 * (width + height)

# ==============================
#  🧩 CLASSES 區塊來源
# ==============================
class Square:                  # ← 類別名稱會出現在 CLASSES 區塊
    """正方形的簡單模型。"""        # ← 類別 docstring 會顯示在 CLASSES 區塊

    def __init__(self, side):
        """建立一個邊長為 side 的正方形。"""  # ← 方法 docstring 會顯示在 methods 下面
        self.side = side

    def area(self):
        """回傳正方形的面積。"""
        return self.side ** 2

    def perimeter(self):
        """回傳正方形的周長。"""
        return 4 * self.side

# ==============================
#  🧩 FILE 區塊來源
# ==============================
# 將此檔案存為 geometry.py，然後在終端機執行：
#     python -m pydoc geometry
#
# pydoc 會在 FILE 區塊顯示這個模組的實際路徑，例如：
# FILE
#     C:/path/to/geometry.py`}
        </GuideCodeBlock>
      </section>

      <section id="errors" className="bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6 scroll-mt-8">
        <h2 className="text-xl font-semibold mb-4">error 種類</h2>
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead><tr><th className={thClass}>錯誤</th><th className={thClass}>何時發生</th><th className={thClass}>範例</th></tr></thead>
            <tbody>
              <tr><td className={tdClass}>AttributeError</td><td className={tdClass}>物件沒有該方法/屬性</td><td className={tdClass}><code>"x".push()</code></td></tr>
              <tr><td className={tdClass}>KeyError</td><td className={tdClass}>字典中找不到指定 key</td><td className={tdClass}><code>{'{"a": 1}["b"]'}</code></td></tr>
              <tr><td className={tdClass}>NameError</td><td className={tdClass}>使用了未定義的變數名稱</td><td className={tdClass}><code>print(undefined_var)</code></td></tr>
              <tr><td className={tdClass}>TypeError</td><td className={tdClass}>型別不相容</td><td className={tdClass}><code>1 + "2"</code></td></tr>
              <tr><td className={tdClass}>ArithmeticError</td><td className={tdClass}>所有數學運算錯誤的「總稱/父類別」（例如除以零、數值溢位等）</td><td className={tdClass}>數學運算錯誤的基底類別</td></tr>
              <tr><td className={tdClass}>ZeroDivisionError</td><td className={tdClass}>「除以零」時發生的具體錯誤（屬於 ArithmeticError 的一種）</td><td className={tdClass}><code>1 / 0</code></td></tr>
              <tr><td className={tdClass}>SyntaxError</td><td className={tdClass}>語法錯誤</td><td className={tdClass}><code>if True</code></td></tr>
              <tr><td className={tdClass}>IndentationError</td><td className={tdClass}>縮排錯誤</td><td className={tdClass}><code>if True:\nprint("Hi")</code></td></tr>
              <tr><td className={tdClass}>EOFError</td><td className={tdClass}>輸入串流提前結束</td><td className={tdClass}><code>input()</code></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="compare" className="bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6 scroll-mt-8">
        <h2 className="text-xl font-semibold mb-4">檔案／物件比較概念</h2>
        <p className="mb-3"><code>==</code> 比值是否相等；<code>is</code> 比是否同一個物件。</p>
        <GuideCodeBlock>
          {`a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)  # True
print(a is b)  # False`}
        </GuideCodeBlock>
      </section>

    </div>
  );
};

export default ArticleGuide;
