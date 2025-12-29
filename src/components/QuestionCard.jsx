import { useState } from 'react';
import { Code } from 'lucide-react';

const QuestionCard = ({ question, index, userAnswer, onAnswerChange, showResult = false }) => {
  const [inputValue, setInputValue] = useState(userAnswer || '');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onAnswerChange(index, value);
  };

  const handleOptionSelect = (option) => {
    onAnswerChange(index, option);
  };

  const isCorrect = showResult && userAnswer === question.correctAnswer;
  const isWrong = showResult && userAnswer !== question.correctAnswer;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-2 p-6 mb-6 ${
        isCorrect ? 'border-green-500 bg-green-50' : isWrong ? 'border-red-500 bg-red-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
            isCorrect
              ? 'bg-green-500 text-white'
              : isWrong
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {index + 1}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 whitespace-pre-line">{question.question}</h3>

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
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? isCorrect
                          ? 'border-green-500 bg-green-100'
                          : isWrong
                          ? 'border-red-500 bg-red-100'
                          : 'border-primary bg-orange-50'
                        : isCorrectOption
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
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
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  disabled={showResult}
                  placeholder="輸入格式代碼..."
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg font-mono text-sm ${
                    isCorrect
                      ? 'border-green-500 bg-green-50'
                      : isWrong
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-orange-200'
                  } ${showResult ? 'cursor-default' : ''}`}
                />
              </div>
              {showResult && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">正確答案：</span>
                  <code className="ml-2 px-2 py-1 bg-gray-100 rounded font-mono text-primary whitespace-pre-line">
                    {question.correctAnswer}
                  </code>
                </div>
              )}
            </div>
          )}

          {showResult && (
            <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
              <p className={`text-sm font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? '✓ 正確！' : '✗ 錯誤'}
              </p>
              <p className="text-sm text-gray-700 mt-1">{question.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;

