import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Loader2, Clock, AlertCircle } from 'lucide-react';
import { getExamById, calculateScore } from '../data';
import QuestionCard from './QuestionCard';

const ExamInterface = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // 剩餘秒數
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      const examData = await getExamById(id);
      if (!examData) {
        navigate('/exams');
        return;
      }
      setExam(examData);
      // 計算總時間：題數 × 60秒
      const totalTime = examData.questions.length * 60;
      setTimeRemaining(totalTime);
      setLoading(false);
    };
    fetchExam();
  }, [id, navigate]);

  // 倒數計時器
  useEffect(() => {
    if (!exam || timeRemaining <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // 開始倒數計時
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // 時間到
          setShowTimeUpModal(true);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 清理函數
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [exam, timeRemaining]);

  // 格式化時間顯示（MM:SS）
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-gray-600">載入考試中...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return null;
  }

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = () => {
    if (window.confirm('確定要提交答案嗎？提交後將無法修改。')) {
      setIsSubmitted(true);
      // Calculate score and navigate to results
      const score = calculateScore(exam, answers);
      navigate(`/exam/${id}/results`, {
        state: { answers, score },
      });
    }
  };

  const allAnswered = exam.questions.every((_, index) => answers[index] !== undefined && answers[index] !== '');

  return (
    <div className="p-8 animate-fade-in">
      <button
        onClick={() => navigate('/exams')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-all duration-300 transform hover:scale-105 animate-slide-in-left"
      >
        <ArrowLeft size={20} className="transition-transform duration-300 hover:-translate-x-1" />
        <span>返回考試列表</span>
      </button>

      <div className="mb-6 animate-slide-in-down">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-800">{exam.title}</h1>
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border-2 border-orange-200 rounded-lg">
            <Clock 
              size={20} 
              className={`text-orange-600 ${timeRemaining <= 60 ? 'animate-pulse' : ''}`} 
            />
            <span className={`text-lg font-bold ${
              timeRemaining <= 60 ? 'text-red-600' : 'text-orange-600'
            }`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        <p className="text-gray-600">共 {exam.questions.length} 題（每題 1 分鐘，共 {exam.questions.length} 分鐘）</p>
      </div>

      <div className="space-y-4">
        {exam.questions.map((question, index) => (
          <div
            key={question.id}
            className="animate-slide-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <QuestionCard
              question={question}
              index={index}
              userAnswer={answers[index]}
              onAnswerChange={handleAnswerChange}
              showResult={false}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end animate-slide-in-up animate-delay-500">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || isSubmitted}
          className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 transform ${
            allAnswered && !isSubmitted
              ? 'bg-primary text-white hover:bg-orange-600 hover:scale-110 hover:shadow-lg active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <CheckCircle size={20} className={allAnswered && !isSubmitted ? 'animate-pulse' : ''} />
          提交答案
        </button>
      </div>

      {/* 時間到提醒模態框 */}
      {showTimeUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 animate-scale-in">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="text-red-600" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">時間到！</h2>
            <p className="text-gray-600 text-center mb-6">
              考試時間已到，但您仍可以繼續作答並提交答案。
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowTimeUpModal(false)}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamInterface;

