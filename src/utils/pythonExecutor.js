// Python 程式碼執行工具（使用 Pyodide）
let pyodideInstance = null;

// 初始化 Pyodide
export const initPyodide = async () => {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  try {
    // 動態載入 Pyodide
    const pyodideModule = await import('pyodide');
    pyodideInstance = await pyodideModule.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/',
    });
    return pyodideInstance;
  } catch (error) {
    console.error('初始化 Pyodide 失敗:', error);
    throw error;
  }
};

// 執行 Python 程式碼並返回輸出
export const executePythonCode = async (code, inputData = '') => {
  try {
    const pyodide = await initPyodide();
    
    // 重定向 stdout 來捕獲輸出
    let output = '';
    pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
    `);

    // 如果有輸入資料，模擬 input() 函數
    if (inputData) {
      const inputLines = inputData.trim().split('\n');
      let inputIndex = 0;
      
      // 覆蓋 input() 函數
      pyodide.runPython(`
import sys
from io import StringIO

_input_lines = ${JSON.stringify(inputLines)}
_input_index = 0

def input(prompt=''):
    global _input_index
    if _input_index < len(_input_lines):
        result = _input_lines[_input_index]
        _input_index += 1
        return result
    else:
        return ''
      `);
    }

    // 執行程式碼
    pyodide.runPython(code);

    // 獲取輸出
    output = pyodide.runPython('sys.stdout.getvalue()');
    
    // 清理
    pyodide.runPython(`
sys.stdout = sys.__stdout__
    `);

    return {
      success: true,
      output: output.trim(),
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      output: null,
      error: error.message || String(error),
    };
  }
};

// 驗證程式碼是否通過所有測試案例
export const validateCodeWithTestCases = async (code, testCases) => {
  if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
    return {
      success: false,
      passed: false,
      message: '沒有測試案例',
    };
  }

  const results = [];
  let allPassed = true;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const input = testCase.input || '';
    const expectedOutput = testCase.expectedOutput || '';

    const result = await executePythonCode(code, input);
    
    if (!result.success) {
      allPassed = false;
      results.push({
        testCaseIndex: i + 1,
        passed: false,
        error: result.error,
        input,
        expectedOutput,
        actualOutput: null,
      });
      continue;
    }

    const actualOutput = result.output.trim();
    const expectedOutputTrimmed = expectedOutput.trim();
    const passed = actualOutput === expectedOutputTrimmed;

    if (!passed) {
      allPassed = false;
    }

    results.push({
      testCaseIndex: i + 1,
      passed,
      input,
      expectedOutput: expectedOutputTrimmed,
      actualOutput,
      error: null,
    });
  }

  return {
    success: true,
    passed: allPassed,
    results,
    message: allPassed 
      ? `所有 ${testCases.length} 個測試案例都通過！` 
      : `${results.filter(r => r.passed).length}/${testCases.length} 個測試案例通過`,
  };
};

