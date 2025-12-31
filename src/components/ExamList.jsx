import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, BookOpen, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getExams } from '../data';
import BlobBackground from './BlobBackground';

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

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
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
      <motion.div className="mb-8" variants={headerVariants}>
        <motion.h1
          className="text-3xl font-bold text-gray-800 mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          考試列表
        </motion.h1>
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          選擇一個考試開始練習 Python
        </motion.p>
      </motion.div>

      {exams.length === 0 ? (
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">尚無可用考試</h3>
          <p className="text-gray-600">請先初始化資料庫</p>
        </motion.div>
      ) : (
        <motion.div className="space-y-4" variants={containerVariants}>
          {exams.map((exam, index) => (
            <motion.div
              key={exam.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                y: -5,
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                transition: { duration: 0.3 },
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <BookOpen size={20} className="text-primary" />
                    </motion.div>
                    <h2 className="text-xl font-semibold text-gray-800">{exam.title}</h2>
                    <motion.span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                        exam.difficulty
                      )}`}
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      {exam.difficulty}
                    </motion.span>
                  </div>
                  <p className="text-gray-600 mb-4">{exam.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <motion.div
                      className="flex items-center gap-1"
                      whileHover={{ scale: 1.1 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      >
                        <Clock size={16} />
                      </motion.div>
                      <span>{exam.questions.length} 題</span>
                    </motion.div>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={`/exam/${exam.id}`}
                    className="ml-4 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition-colors duration-300 shadow-lg flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <Play size={18} />
                    </motion.div>
                    開始考試
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      </motion.div>
    </div>
  );
};

export default ExamList;

