import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { getExamById, calculateScore } from '../data';
import QuestionCard from './QuestionCard';

const ExamInterface = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      const examData = await getExamById(id);
      if (!examData) {
        navigate('/exams');
        return;
      }
      setExam(examData);
      setLoading(false);
    };
    fetchExam();
  }, [id, navigate]);

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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{exam.title}</h1>
        <p className="text-gray-600">共 {exam.questions.length} 題</p>
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
    </div>
  );
};

export default ExamInterface;

