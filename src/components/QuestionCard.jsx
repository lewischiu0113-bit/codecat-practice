import { useState } from 'react';
import { Code, Play, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { executePythonCode, validateCodeWithTestCases } from '../utils/pythonExecutor';

const QuestionCard = ({ question, index, userAnswer, onAnswerChange, showResult = false, isCorrect: externalIsCorrect = null }) => {
  const [inputValue, setInputValue] = useState(userAnswer || '');
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onAnswerChange(index, value);
  };

  const handleOptionSelect = (option) => {
    onAnswerChange(index, option);
  };

  // 處理程式碼執行（測試用）
  const handleRunCode = async () => {
    if (!inputValue.trim()) {
      return;
    }

    setIsRunning(true);
    setTestResult(null);

    try {
      if (question.testCases && question.testCases.length > 0) {
        // 使用測試案例驗證
        const result = await validateCodeWithTestCases(inputValue, question.testCases);
        setTestResult(result);
      } else {
        // 簡單執行並顯示輸出
        const result = await executePythonCode(inputValue);
        setTestResult({
          success: result.success,
          output: result.output,
          error: result.error,
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message || '執行失敗',
      });
    } finally {
      setIsRunning(false);
    }
  };

  // 如果外部傳入了 isCorrect，使用外部的判斷；否則使用簡單比較（用於考試界面）
  const isCorrect = showResult ? (externalIsCorrect !== null ? externalIsCorrect : userAnswer === question.correctAnswer) : false;
  const isWrong = showResult && !isCorrect;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-2 p-6 mb-6 transition-all duration-300 ${
        isCorrect 
          ? 'border-green-500 bg-green-50 animate-scale-in' 
          : isWrong 
          ? 'border-red-500 bg-red-50 animate-shake' 
          : 'border-gray-200 hover:border-primary hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
            isCorrect
              ? 'bg-green-500 text-white animate-bounce-in'
              : isWrong
              ? 'bg-red-500 text-white animate-bounce-in'
              : 'bg-gray-200 text-gray-700 hover:bg-primary hover:text-white hover:scale-110'
          }`}
        >
          {index + 1}
        </div>
        <div className="flex-1">
          <div className="text-lg font-semibold text-gray-800 mb-3">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="my-3">
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg border border-gray-200 shadow-sm"
                        customStyle={{
                          margin: 0,
                          borderRadius: '0.5rem',
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono text-primary" {...props}>
                      {children}
                    </code>
                  );
                },
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              }}
            >
              {question.question}
            </ReactMarkdown>
          </div>

          {question.type === 'MCQ' && (
            <div className="space-y-2">
              {question.options.map((option, optIndex) => {
                const isSelected = userAnswer === option;
                const isCorrectOption = showResult && option === question.correctAnswer;
                return (
                  <button
                    key={optIndex}
                    onClick={() => !showResult && handleOptionSelect(option)}
                    disabled={showResult}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-300 transform ${
                      isSelected
                        ? isCorrect
                          ? 'border-green-500 bg-green-100 scale-105 shadow-md'
                          : isWrong
                          ? 'border-red-500 bg-red-100 scale-105 shadow-md'
                          : 'border-primary bg-orange-50 scale-105 shadow-md'
                        : isCorrectOption
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 hover:border-primary hover:bg-orange-50 hover:scale-[1.02] hover:shadow-sm'
                    } ${showResult ? 'cursor-default' : 'cursor-pointer active:scale-95'}`}
                  >
                    <span className="font-medium text-gray-800">{option}</span>
                  </button>
                );
              })}
            </div>
          )}

          {question.type === 'Input' && (
            <div className="space-y-3">
              <div className="relative">
                <Code className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <textarea
                  value={inputValue}
                  onChange={handleInputChange}
                  disabled={showResult}
                  placeholder="輸入格式代碼..."
                  rows={8}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg font-mono text-sm resize-y min-h-[120px] transition-all duration-300 ${
                    isCorrect
                      ? 'border-green-500 bg-green-50 animate-scale-in'
                      : isWrong
                      ? 'border-red-500 bg-red-50 animate-shake'
                      : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-orange-200 focus:scale-[1.01]'
                  } ${showResult ? 'cursor-default' : ''}`}
                />
              </div>
              {showResult && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">正確答案：</span>
                  <code className="ml-2 px-2 py-1 bg-gray-100 rounded font-mono text-primary whitespace-pre-line block mt-1">
                    {question.correctAnswer}
                  </code>
                </div>
              )}
            </div>
          )}

          {question.type === 'CodeExecution' && (
            <div className="space-y-3">
              {/* 顯示測試案例輸入 */}
              {question.testCases && question.testCases.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-sm font-semibold text-gray-700 mb-2">測試案例：</div>
                  {question.testCases.map((testCase, idx) => (
                    <div key={idx} className="mb-3 last:mb-0">
                      <div className="text-xs text-gray-600 mb-1">測試案例 {idx + 1}：</div>
                      <div className="bg-white rounded p-2 border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">輸入：</div>
                        <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap">{testCase.input || '(無輸入)'}</pre>
                        <div className="text-xs text-gray-500 mb-1 mt-2">預期輸出：</div>
                        <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap">{testCase.expectedOutput}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 程式碼編輯器 */}
              <div className="relative">
                <Code className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <textarea
                  value={inputValue}
                  onChange={handleInputChange}
                  disabled={showResult}
                  placeholder="請輸入 Python 程式碼..."
                  rows={12}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg font-mono text-sm resize-y min-h-[200px] transition-all duration-300 ${
                    isCorrect
                      ? 'border-green-500 bg-green-50 animate-scale-in'
                      : isWrong
                      ? 'border-red-500 bg-red-50 animate-shake'
                      : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-orange-200 focus:scale-[1.01]'
                  } ${showResult ? 'cursor-default' : ''}`}
                />
              </div>

              {/* 執行按鈕（僅在非結果顯示時） */}
              {!showResult && (
                <button
                  onClick={handleRunCode}
                  disabled={isRunning || !inputValue.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>執行中...</span>
                    </>
                  ) : (
                    <>
                      <Play size={18} />
                      <span>測試執行</span>
                    </>
                  )}
                </button>
              )}

              {/* 測試結果顯示 */}
              {testResult && !showResult && (
                <div className={`p-4 rounded-lg border-2 ${
                  testResult.success && testResult.passed
                    ? 'bg-green-50 border-green-300'
                    : testResult.success && !testResult.passed
                    ? 'bg-yellow-50 border-yellow-300'
                    : 'bg-red-50 border-red-300'
                }`}>
                  {testResult.success && testResult.passed !== undefined ? (
                    <>
                      <div className={`text-sm font-semibold mb-2 ${
                        testResult.passed ? 'text-green-800' : 'text-yellow-800'
                      }`}>
                        {testResult.passed ? '✓ 所有測試通過！' : `⚠ ${testResult.message}`}
                      </div>
                      {testResult.results && (
                        <div className="space-y-2">
                          {testResult.results.map((result, idx) => (
                            <div key={idx} className={`text-xs p-2 rounded ${
                              result.passed ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              <div className="font-semibold mb-1">
                                測試案例 {result.testCaseIndex}: {result.passed ? '✓ 通過' : '✗ 失敗'}
                              </div>
                              {result.error && (
                                <div className="text-red-700 font-mono text-xs mt-1">
                                  錯誤: {result.error}
                                </div>
                              )}
                              {!result.passed && !result.error && (
                                <div className="text-xs mt-1">
                                  <div>預期: <code className="bg-white px-1 rounded">{result.expectedOutput}</code></div>
                                  <div>實際: <code className="bg-white px-1 rounded">{result.actualOutput}</code></div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {testResult.error ? (
                        <div className="text-sm text-red-800">
                          <div className="font-semibold mb-1">執行錯誤：</div>
                          <pre className="font-mono text-xs whitespace-pre-wrap">{testResult.error}</pre>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-800">
                          <div className="font-semibold mb-1">輸出：</div>
                          <pre className="font-mono text-xs whitespace-pre-wrap bg-white p-2 rounded">{testResult.output || '(無輸出)'}</pre>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {showResult && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">正確答案範例：</span>
                  <code className="ml-2 px-2 py-1 bg-gray-100 rounded font-mono text-primary whitespace-pre-line block mt-1">
                    {question.correctAnswer}
                  </code>
                </div>
              )}
            </div>
          )}

          {showResult && (
            <div className={`mt-4 p-4 rounded-lg animate-slide-in-up transition-all duration-300 ${
              isCorrect ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <p className={`text-sm font-medium animate-fade-in ${
                isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {isCorrect ? '✓ 正確！' : '✗ 錯誤'}
              </p>
              <p className="text-sm text-gray-700 mt-1 animate-fade-in animate-delay-200">{question.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;

