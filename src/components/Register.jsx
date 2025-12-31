import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Lock, Loader2 } from 'lucide-react';
import { registerUser } from '../utils/auth';
import { verifyPassword } from '../utils/encryption';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerPassword, setRegisterPassword] = useState(''); // 註冊密碼（c....8）
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            CodeCat <span className="text-primary">Practice</span>
          </h1>
          <p className="text-gray-600">建立新帳號</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              使用者名稱
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                required
                placeholder="請輸入使用者名稱（至少 4 個字元）"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200 transition-all"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">只能包含英文、數字或中文</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              密碼
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="請輸入密碼（至少 4 個字元，英文或數字）"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              確認密碼
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="請再次輸入密碼"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-2">
              註冊密碼
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
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
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200 transition-all"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">需要註冊密碼才能建立帳號</p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 animate-slide-in-down">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>註冊中...</span>
              </>
            ) : (
              <>
                <UserPlus size={20} />
                <span>註冊</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            已經有帳號了？{' '}
            <Link to="/login" className="text-primary font-medium hover:text-orange-600 transition-colors">
              立即登入
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

