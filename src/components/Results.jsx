import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Loader2 } from "lucide-react";
import { getExamById, saveExamRecord } from "../data";
import QuestionCard from "./QuestionCard";

const Results = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasSavedRef = useRef(false); // 使用 ref 追蹤是否已保存，避免重複保存

  const { answers, score } = location.state || {};

  useEffect(() => {
    const fetchExamAndSave = async () => {
      if (!answers || !score) {
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
      setLoading(false);

      // 只在尚未保存時才保存記錄（防止 React StrictMode 重複執行）
      if (!hasSavedRef.current) {
        hasSavedRef.current = true;
        await saveExamRecord(id, score, answers);
      }
    };
    fetchExamAndSave();
  }, [id, answers, score, navigate]);

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
    <div className="p-8">
      <button
        onClick={() => navigate("/exams")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>返回考試列表</span>
      </button>

      <div className="mb-8">
        <div
          className={`inline-flex items-center gap-2 px-6 py-4 rounded-xl ${getScoreBgColor()} mb-4`}
        >
          <Trophy className={getScoreColor()} size={28} />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">考試結果</h1>
            <p className="text-sm text-gray-600">{exam.title}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">得分</p>
              <p className={`text-4xl font-bold ${getScoreColor()}`}>
                {score.correct} / {score.total}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 mb-1">正確率</p>
              <p className={`text-4xl font-bold ${getScoreColor()}`}>
                {score.percentage}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">答案詳解</h2>
        <div className="space-y-4">
          {exam.questions.map((question, index) => {
            const userAnswer = answers[index];
            // Normalize answers for comparison (same logic as in data.js)
            const normalize = (str) => {
              if (!str) return '';
              return str.replace(/\s+/g, '').toLowerCase();
            };
            const isCorrect =
              question.type === "MCQ"
                ? userAnswer === question.correctAnswer
                : normalize(userAnswer) === normalize(question.correctAnswer);

            return (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                userAnswer={userAnswer}
                onAnswerChange={() => {}}
                showResult={true}
              />
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => navigate(`/exam/${id}`)}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          重新考試
        </button>
        <button
          onClick={() => navigate("/exams")}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          返回列表
        </button>
      </div>
    </div>
  );
};

export default Results;
