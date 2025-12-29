import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Loader2 } from 'lucide-react';
import { getExamRecords } from '../data';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const records = await getExamRecords();
      setHistory(records);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-gray-600">載入考試記錄中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">考試歷史</h1>
        <p className="text-gray-600">查看您過去的考試記錄</p>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Clock className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">尚無考試記錄</h3>
          <p className="text-gray-600 mb-6">完成您的第一個考試後，記錄將顯示在這裡</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <Link
              key={record.id}
              to={`/exam/${record.examId}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <BookOpen className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{record.examTitle}</h3>
                    <p className="text-sm text-gray-600">{record.date}</p>
                    {record.difficulty && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700">
                        {record.difficulty}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    record.score >= 80 ? 'text-green-600' :
                    record.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {record.score}%
                  </p>
                  <p className="text-sm text-gray-600">{record.correct}/{record.total}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;

