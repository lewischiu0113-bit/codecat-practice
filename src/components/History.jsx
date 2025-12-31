import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Loader2, Trash2, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getExamRecords, deleteAllExamRecords } from '../data';
import { verifyPassword } from '../utils/encryption';
import BlobBackground from './BlobBackground';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    const records = await getExamRecords();
    setHistory(records);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistoryClick = () => {
    if (history.length === 0) return;
    setShowPasswordModal(true);
    setPassword('');
    setPasswordError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!password.trim()) {
      setPasswordError('請輸入密碼');
      return;
    }

    // 驗證密碼
    if (!verifyPassword(password)) {
      setPasswordError('密碼錯誤，請重新輸入');
      setPassword('');
      return;
    }

    // 密碼正確，關閉模態框並執行清除
    setShowPasswordModal(false);
    setPassword('');

    // 再次確認
    const confirmed = window.confirm(
      `確定要清除所有 ${history.length} 筆考試記錄嗎？\n此操作無法復原。`
    );
    
    if (!confirmed) return;

    setIsDeleting(true);
    console.log('[History] 開始清除歷史記錄流程...');
    console.log('[History] 當前記錄數量:', history.length);
    
    try {
      console.log('[History] 調用 deleteAllExamRecords()...');
      const result = await deleteAllExamRecords();
      
      console.log('[History] 刪除操作返回結果:', result);
      
      if (result.success) {
        console.log('[History] ✓ 刪除操作成功，更新前端狀態...');
        setHistory([]);
        
        // 重新獲取資料以驗證刪除是否真的成功
        console.log('[History] 重新獲取資料以驗證刪除結果...');
        const verifyRecords = await getExamRecords();
        console.log('[History] 驗證結果 - 資料庫中的記錄數量:', verifyRecords.length);
        
        if (verifyRecords.length > 0) {
          console.error('[History] ❌ 警告：刪除後資料庫仍有記錄！');
          console.error('[History] 剩餘記錄:', verifyRecords);
          setHistory(verifyRecords); // 恢復顯示
          alert(`刪除操作完成，但仍有 ${verifyRecords.length} 筆記錄存在。請檢查資料庫。`);
        } else {
          console.log('[History] ✓ 驗證通過，所有記錄已成功清除');
          alert('所有考試記錄已成功清除');
        }
      } else {
        console.error('[History] ❌ 刪除操作失敗');
        console.error('[History] 錯誤詳情:', result.error);
        alert('清除記錄時發生錯誤，請稍後再試');
      }
    } catch (error) {
      console.error('[History] ❌ 刪除操作發生異常');
      console.error('[History] 異常詳情:', error);
      alert('清除記錄時發生錯誤，請稍後再試');
    } finally {
      setIsDeleting(false);
      console.log('[History] 清除流程結束');
    }
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setPasswordError('');
  };

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
    hidden: { opacity: 0, x: -30, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
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
        <div className="flex items-center justify-between mb-2">
          <div>
            <motion.h1
              className="text-3xl font-bold text-gray-800 mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              考試歷史
            </motion.h1>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              查看您過去的考試記錄
            </motion.p>
          </div>
          <AnimatePresence>
            {history.length > 0 && (
              <motion.button
                onClick={handleClearHistoryClick}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>清除中...</span>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <Trash2 size={18} />
                    </motion.div>
                    <span>清除歷史記錄</span>
                  </>
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {history.length === 0 ? (
          <motion.div
            key="empty"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <Clock className="mx-auto text-gray-400 mb-4" size={48} />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">尚無考試記錄</h3>
            <p className="text-gray-600 mb-6">完成您的第一個考試後，記錄將顯示在這裡</p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {history.map((record, index) => (
              <motion.div
                key={record.id}
                variants={cardVariants}
                whileHover={{
                  scale: 1.02,
                  x: 10,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  transition: { duration: 0.3 },
                }}
              >
                <Link
                  to={`/exam/${record.examId}`}
                  className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="p-3 bg-orange-100 rounded-lg"
                        whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        >
                          <BookOpen className="text-primary" size={24} />
                        </motion.div>
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{record.examTitle}</h3>
                        <p className="text-sm text-gray-600">{record.date}</p>
                        {record.difficulty && (
                          <motion.span
                            className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700"
                            whileHover={{ scale: 1.1 }}
                          >
                            {record.difficulty}
                          </motion.span>
                        )}
                      </div>
                    </div>
                    <motion.div
                      className="text-right"
                      whileHover={{ scale: 1.1 }}
                    >
                      <p className={`text-2xl font-bold ${
                        record.score >= 80 ? 'text-green-600' :
                        record.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {record.score}%
                      </p>
                      <p className="text-sm text-gray-600">{record.correct}/{record.total}</p>
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 密碼輸入模態框 */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="p-2 bg-red-100 rounded-lg"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <Lock className="text-red-600" size={24} />
                  </motion.div>
                  <h2 className="text-xl font-bold text-gray-800">確認清除操作</h2>
                </div>
                <motion.button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              <p className="text-gray-600 mb-4">
                此操作將清除所有 <span className="font-semibold text-red-600">{history.length}</span> 筆考試記錄，且無法復原。
                <br />
                請輸入密碼以確認此操作：
              </p>

              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="請輸入密碼"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      passwordError
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-primary focus:ring-orange-200'
                    }`}
                    autoFocus
                  />
                  <AnimatePresence>
                    {passwordError && (
                      <motion.p
                        className="mt-2 text-sm text-red-600"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {passwordError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    取消
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    確認清除
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default History;

