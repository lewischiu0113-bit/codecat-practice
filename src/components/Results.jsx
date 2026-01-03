import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Loader2 } from "lucide-react";
import { getExamById, saveExamRecord, checkAnswer, calculateScore } from "../data";
import QuestionCard from "./QuestionCard";

const Results = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasSavedRef = useRef(false); // 使用 ref 追蹤是否已保存，避免重複保存

  const { answers: stateAnswers, score: stateScore } = location.state || {};
  const [answers, setAnswers] = useState(stateAnswers);
  const [score, setScore] = useState(stateScore);

  useEffect(() => {
    const fetchExamAndSave = async () => {
      if (!answers || !stateScore) {
        navigate("/exams");
        return;
      }
      setLoading(true);
      const examData = await getExamById(id);
      if (!examData) {
        navigate("/exams");
        return;
      }
      setExam(examData);
      
      // 重新計算分數，確保使用最新的驗證邏輯（與顯示詳解使用相同邏輯）
      const recalculatedScore = await calculateScore(examData, answers);
      setScore(recalculatedScore);
      
      setLoading(false);

      // 只在尚未保存時才保存記錄（防止 React StrictMode 重複執行）
      if (!hasSavedRef.current) {
        hasSavedRef.current = true;
        await saveExamRecord(id, recalculatedScore, answers);
      }
    };
    fetchExamAndSave();
  }, [id, answers, stateScore, navigate]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-gray-600">載入結果中...</p>
        </div>
      </div>
    );
  }

  if (!exam || !answers || !score) {
    return null;
  }

  const getScoreColor = () => {
    if (score.percentage >= 80) return "text-green-600";
    if (score.percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = () => {
    if (score.percentage >= 80) return "bg-green-100";
    if (score.percentage >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="p-8 animate-fade-in">
      <button
        onClick={() => navigate("/exams")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-all duration-300 transform hover:scale-105 animate-slide-in-left"
      >
        <ArrowLeft size={20} className="transition-transform duration-300 hover:-translate-x-1" />
        <span>返回考試列表</span>
      </button>

      <div className="mb-8">
        <div
          className={`inline-flex items-center gap-2 px-6 py-4 rounded-xl ${getScoreBgColor()} mb-4 animate-bounce-in`}
        >
          <Trophy className={`${getScoreColor()} animate-pulse`} size={28} />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">考試結果</h1>
            <p className="text-sm text-gray-600">{exam.title}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 animate-scale-in">
          <div className="flex items-center justify-between">
            <div className="animate-slide-in-left">
              <p className="text-gray-600 mb-1">得分</p>
              <p className={`text-4xl font-bold ${getScoreColor()} animate-number-count`}>
                {score.correct} / {score.total}
              </p>
            </div>
            <div className="text-right animate-slide-in-right">
              <p className="text-gray-600 mb-1">正確率</p>
              <p className={`text-4xl font-bold ${getScoreColor()} animate-number-count`}>
                {score.percentage}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 animate-slide-in-up animate-delay-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">答案詳解</h2>
        <QuestionResultsList exam={exam} answers={answers} />
      </div>

      <div className="flex justify-end gap-4 animate-slide-in-up animate-delay-500">
        <button
          onClick={() => navigate(`/exam/${id}`)}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:scale-95"
        >
          重新考試
        </button>
        <button
          onClick={() => navigate("/exams")}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
        >
          返回列表
        </button>
      </div>
    </div>
  );
};

// 獨立的問題結果列表組件（支援異步驗證）
const QuestionResultsList = ({ exam, answers }) => {
  const [correctnessMap, setCorrectnessMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateAllAnswers = async () => {
      const map = {};
      for (let index = 0; index < exam.questions.length; index++) {
        const question = exam.questions[index];
        const userAnswer = answers[index];
        const isCorrect = await checkAnswer(question, userAnswer, true);
        map[index] = isCorrect;
        
        console.log(`[詳解顯示] 題目 ${index + 1} (ID: ${question.id}):`, {
          類型: question.type,
          用戶答案: typeof userAnswer === 'string' ? userAnswer.substring(0, 100) : userAnswer,
          正確答案: question.correctAnswer,
          是否正確: isCorrect
        });
      }
      setCorrectnessMap(map);
      setLoading(false);
    };

    validateAllAnswers();
  }, [exam, answers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-primary" size={24} />
        <span className="ml-2 text-gray-600">驗證答案中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exam.questions.map((question, index) => {
        const userAnswer = answers[index];
        const isCorrect = correctnessMap[index] || false;

        return (
          <div
            key={question.id}
            className="animate-slide-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <QuestionCard
              question={question}
              index={index}
              userAnswer={userAnswer}
              onAnswerChange={() => {}}
              showResult={true}
              isCorrect={isCorrect}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Results;
