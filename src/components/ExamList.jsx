import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, BookOpen, Loader2 } from 'lucide-react';
import { getExams } from '../data';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      const data = await getExams();
      setExams(data);
      setLoading(false);
    };
    fetchExams();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '初級':
        return 'bg-green-100 text-green-700';
      case '中級':
        return 'bg-yellow-100 text-yellow-700';
      case '高級':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-gray-600">載入考試列表中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8 animate-slide-in-down">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">考試列表</h1>
        <p className="text-gray-600">選擇一個考試開始練習 Python</p>
      </div>

      {exams.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center animate-scale-in">
          <BookOpen className="mx-auto text-gray-400 mb-4 animate-pulse" size={48} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">尚無可用考試</h3>
          <p className="text-gray-600">請先初始化資料庫</p>
        </div>
      ) : (
        <div className="space-y-4">
          {exams.map((exam, index) => (
          <div
            key={exam.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-slide-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen size={20} className="text-primary animate-pulse" />
                  <h2 className="text-xl font-semibold text-gray-800">{exam.title}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-110 ${getDifficultyColor(
                      exam.difficulty
                    )}`}
                  >
                    {exam.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{exam.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="animate-pulse" />
                    <span>{exam.questions.length} 題</span>
                  </div>
                </div>
              </div>
              <Link
                to={`/exam/${exam.id}`}
                className="ml-4 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg flex items-center gap-2"
              >
                <Play size={18} className="animate-pulse" />
                開始考試
              </Link>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamList;

