import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, TrendingUp, Award, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { getExams, getExamStatistics, getRecentExamRecords } from "../data";
import BlobBackground from "./BlobBackground";

const Dashboard = () => {
  const [exams, setExams] = useState([]);
  const [statistics, setStatistics] = useState({
    totalCompleted: 0,
    averageScore: 0,
  });
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
  const totalQuestions = exams.reduce(
    (sum, exam) => sum + (exam.questions?.length || 0),
    0
  );

  const stats = [
    {
      label: "可用考試",
      value: totalExams,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "總題數",
      value: totalQuestions,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "平均分數",
      value:
        statistics.totalCompleted > 0 ? `${statistics.averageScore}%` : "-",
      icon: Award,
      color: "text-primary",
      bgColor: "bg-orange-100",
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

  // 動畫變體
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <BlobBackground opacity={0.6} />
      <motion.div
        className="p-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-8" variants={itemVariants}>
          <motion.h1
            className="text-3xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            首頁
          </motion.h1>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            歡迎來到 CodeCat Practice - Python 程式練習平台
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    className={`p-3 rounded-lg ${stat.bgColor}`}
                    variants={iconVariants}
                    whileHover={{
                      rotate: [0, -10, 10, -10, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    <Icon className={stat.color} size={24} />
                  </motion.div>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <motion.p
                  className="text-2xl font-bold text-gray-800"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.3 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  {stat.value}
                </motion.p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
          variants={itemVariants}
          whileHover={{ scale: 1.01, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">快速開始</h2>
          <p className="text-gray-600 mb-4">
            選擇一個考試開始練習 Python
            程式設計。每個考試都包含多種題型，幫助您掌握不同的 Python 技巧。
          </p>

          <motion.div whileHover={{ x: [-8, 8, -8, 8, 0] }}>
            <Link
              to="/exams"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition-colors duration-300 shadow-lg"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <BookOpen size={20} />
              </motion.div>
              查看所有考試
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">最近考試</h2>
          {recentRecords.length === 0 ? (
            <motion.p
              className="text-gray-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              尚無考試記錄
            </motion.p>
          ) : (
            <motion.div className="space-y-3" variants={containerVariants}>
              {recentRecords.map((record, index) => (
                <motion.div
                  key={record.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={`/exam/${record.examId}`}
                    className="block p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {record.examTitle}
                        </h3>
                        <p className="text-sm text-gray-600">{record.date}</p>
                      </div>
                      <motion.div
                        className="text-right"
                        whileHover={{ scale: 1.1 }}
                      >
                        <p
                          className={`text-lg font-bold ${
                            record.score >= 80
                              ? "text-green-600"
                              : record.score >= 60
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {record.score}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {record.correct}/{record.total}
                        </p>
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
