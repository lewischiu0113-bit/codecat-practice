import { useState } from 'react';
import { Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const QuestionCard = ({ question, index, userAnswer, onAnswerChange, showResult = false, isCorrect: externalIsCorrect = null }) => {
  const [inputValue, setInputValue] = useState(userAnswer || '');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onAnswerChange(index, value);
  };

  const handleOptionSelect = (option) => {
    onAnswerChange(index, option);
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

