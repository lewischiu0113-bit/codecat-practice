import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Award, Loader2 } from 'lucide-react';
import { getExams, getExamStatistics, getRecentExamRecords } from '../data';

const Dashboard = () => {
  const [exams, setExams] = useState([]);
  const [statistics, setStatistics] = useState({ totalCompleted: 0, averageScore: 0 });
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [examsData, stats, records] = await Promise.all([
        getExams(),
        getExamStatistics(),
        getRecentExamRecords(5),
      ]);
      setExams(examsData);
      setStatistics(stats);
      setRecentRecords(records);
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalExams = exams.length;
  const totalQuestions = exams.reduce((sum, exam) => sum + (exam.questions?.length || 0), 0);

  const stats = [
    {
      label: '可用考試',
      value: totalExams,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: '總題數',
      value: totalQuestions,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: '平均分數',
      value: statistics.totalCompleted > 0 ? `${statistics.averageScore}%` : '-',
      icon: Award,
      color: 'text-primary',
      bgColor: 'bg-orange-100',
    },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">儀表板</h1>
        <p className="text-gray-600">歡迎來到 Python DateTime 考試平台</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">快速開始</h2>
        <p className="text-gray-600 mb-4">
          選擇一個考試開始練習 Python datetime 格式化。每個考試都包含多種題型，幫助您掌握不同的格式化技巧。
        </p>
        <Link
          to="/exams"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          <BookOpen size={20} />
          查看所有考試
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">最近考試</h2>
        {recentRecords.length === 0 ? (
          <p className="text-gray-500 text-sm">尚無考試記錄</p>
        ) : (
          <div className="space-y-3">
            {recentRecords.map((record) => (
              <Link
                key={record.id}
                to={`/exam/${record.examId}`}
                className="block p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{record.examTitle}</h3>
                    <p className="text-sm text-gray-600">{record.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      record.score >= 80 ? 'text-green-600' :
                      record.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {record.score}%
                    </p>
                    <p className="text-xs text-gray-500">{record.correct}/{record.total}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

