import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Loader2, Trash2, X, Lock } from 'lucide-react';
import { getExamRecords, deleteAllExamRecords } from '../data';
import { verifyPassword } from '../utils/encryption';

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

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8 animate-slide-in-down">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">考試歷史</h1>
            <p className="text-gray-600">查看您過去的考試記錄</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistoryClick}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed animate-slide-in-right"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>清除中...</span>
                </>
              ) : (
                <>
                  <Trash2 size={18} />
                  <span>清除歷史記錄</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center animate-scale-in">
          <Clock className="mx-auto text-gray-400 mb-4 animate-pulse" size={48} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">尚無考試記錄</h3>
          <p className="text-gray-600 mb-6">完成您的第一個考試後，記錄將顯示在這裡</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record, index) => (
            <Link
              key={record.id}
              to={`/exam/${record.examId}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-slide-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg transition-transform duration-300 hover:scale-110">
                    <BookOpen className="text-primary animate-pulse" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{record.examTitle}</h3>
                    <p className="text-sm text-gray-600">{record.date}</p>
                    {record.difficulty && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700 transition-all duration-300 hover:scale-110">
                        {record.difficulty}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold transition-all duration-300 ${
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

      {/* 密碼輸入模態框 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Lock className="text-red-600" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">確認清除操作</h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
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
                {passwordError && (
                  <p className="mt-2 text-sm text-red-600 animate-slide-in-down">
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  確認清除
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;

