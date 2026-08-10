import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Lock, Loader2 } from 'lucide-react';
import { registerUser } from '../utils/auth';
import { verifyPassword } from '../utils/encryption';
import BlobBackground from "./BlobBackground";
import CodeRainBackground from "./CodeRainBackground";
import TextParticles from "./TextParticles";
import { AnimatePresence, motion } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerPassword, setRegisterPassword] = useState(''); // 註冊密碼（c....8）
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSplash, setShowSplash] = useState(true);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // 驗證註冊密碼
    if (!registerPassword.trim()) {
      setError('請輸入註冊密碼');
      return;
    }

    if (!verifyPassword(registerPassword)) {
      setError('註冊密碼錯誤');
      setRegisterPassword('');
      return;
    }

    // 驗證 username（至少 4 個字元，只允許文字）
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError('請輸入使用者名稱');
      return;
    }

    if (trimmedUsername.length < 4) {
      setError('使用者名稱至少需要 4 個字元');
      return;
    }

    // 驗證 username 只包含文字（不允許特殊符號）
    if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(trimmedUsername)) {
      setError('使用者名稱只能包含英文、數字或中文');
      return;
    }

    // 驗證密碼確認
    if (password !== confirmPassword) {
      setError('兩次輸入的密碼不一致');
      return;
    }

    // 驗證密碼（至少 4 個字元，只允許英文或數字）
    if (password.length < 4) {
      setError('密碼長度至少需要 4 個字元');
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(password)) {
      setError('密碼只能包含英文或數字');
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser(trimmedUsername, password);

      if (result.success) {
        // 註冊成功，導航到登入頁面
        alert('註冊成功！請使用您的帳號密碼登入');
        navigate('/login');
      } else {
        setError(result.error || '註冊失敗，請稍後再試');
      }
    } catch (err) {
      setError('註冊時發生錯誤，請稍後再試');
      console.error('註冊錯誤:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景裝飾動畫 - 使用 framer-motion 簡化 */}
      <BlobBackground />

      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div 
            key="splash"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none bg-white"
          >
            <CodeRainBackground opacityClass="opacity-30" />
            <TextParticles 
              text="CodeCat" 
              duration={2500} 
              onComplete={() => setShowSplash(false)} 
            />
          </motion.div>
        ) : (
          <motion.div 
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative z-10 border border-orange-100"
          >
            {/* 標題區域 - 漸進出現動畫 */}
            <div className="text-center mb-8">
              <div className="inline-block mb-4 animate-fade-in-down">
                <div className="flex items-center justify-center gap-2 mb-2">
                </div>
              </div>
              <h1
                className="text-4xl font-bold mb-2 animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <span
                  className="text-gray-800 inline-block animate-slide-in-left"
                  style={{ animationDelay: "0.3s" }}
                >
                  CodeCat
                </span>{" "}
                <span
                  className="text-primary inline-block animate-slide-in-right"
                  style={{ animationDelay: "0.4s" }}
                >
                  Practice
                </span>
              </h1>
              <p
                className="text-gray-600 text-lg animate-fade-in-up"
                style={{ animationDelay: "0.5s" }}
              >
                建立新帳號
              </p>
              <div
                className="mt-4 w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto animate-scale-in"
                style={{ animationDelay: "0.6s" }}
              ></div>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              {/* 使用者名稱輸入框 - 順序出現 */}
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "0.7s" }}
              >
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  使用者名稱
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors duration-300"
                    size={20}
                  />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                    }}
                    required
                    placeholder="請輸入使用者名稱（至少 4 個字元）"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200 transition-all duration-300 transform focus:scale-[1.02]"
                    autoComplete="username"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">只能包含英文、數字或中文</p>
              </div>

              {/* 密碼輸入框 - 順序出現 */}
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "0.8s" }}
              >
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  密碼
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors duration-300"
                    size={20}
                  />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="請輸入密碼（至少 4 個字元）"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200 transition-all duration-300 transform focus:scale-[1.02]"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* 確認密碼輸入框 */}
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "0.8s" }}
              >
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  確認密碼
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors duration-300"
                    size={20}
                  />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="請再次輸入密碼"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200 transition-all duration-300 transform focus:scale-[1.02]"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* 註冊密碼輸入框 */}
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "0.9s" }}
              >
                <label
                  htmlFor="registerPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  註冊密碼
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors duration-300"
                    size={20}
                  />
                  <input
                    id="registerPassword"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => {
                      setRegisterPassword(e.target.value);
                      setError('');
                    }}
                    required
                    placeholder="請輸入註冊密碼"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200 transition-all duration-300 transform focus:scale-[1.02]"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">需要註冊密碼才能建立帳號</p>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 animate-slide-in-down animate-shake">
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <span className="text-red-500">⚠</span>
                    {error}
                  </p>
                </div>
              )}

              {/* 註冊按鈕 - 順序出現 */}
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "1s" }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  {/* 按鈕光澤效果 */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

                  {loading ? (
                    <>
                      <Loader2 className="animate-spin relative z-10" size={20} />
                      <span className="relative z-10">註冊中...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus
                        size={20}
                        className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                      />
                      <span className="relative z-10">註冊</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* 登入連結 - 順序出現 */}
            <div
              className="mt-6 text-center animate-fade-in-up"
              style={{ animationDelay: "1.1s" }}
            >
              <p className="text-gray-600 text-sm">
                已經有帳號了？{" "}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:text-orange-600 transition-all duration-300 inline-flex items-center gap-1 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    立即登入
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </Link>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
