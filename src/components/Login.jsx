import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, User, Lock, Loader2 } from "lucide-react";
import { loginUser } from "../utils/auth";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginUser(username.trim(), password);

      if (result.success) {
        // 登入成功，觸發認證狀態更新
        window.dispatchEvent(new Event("auth-state-changed"));
        navigate("/");
      } else {
        setError(result.error || "登入失敗，請檢查您的帳號密碼");
      }
    } catch (err) {
      setError("登入時發生錯誤，請稍後再試");
      console.error("登入錯誤:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景裝飾動畫 - 多個漸入漸出的 blob */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 第一組 - 左上區域 */}
        <div className="absolute top-10 left-5 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob-fade-in-out"></div>
        <div className="absolute top-32 left-20 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob-fade-in-out-2 animation-delay-1000"></div>

        {/* 第二組 - 右上區域 */}
        {/* <div className="absolute top-20 right-10 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob-fade-in-out-2 animation-delay-2000"></div> */}
        <div className="absolute top-60 right-32 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob-fade-in-out animation-delay-3000"></div>
        <div className="absolute top-5 right-1/4 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl animate-blob-fade-in-out-3 animation-delay-1500"></div>

        {/* 第三組 - 左下區域 */}
        <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob-fade-in-out-2 animation-delay-5000"></div>
        <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob-fade-in-out animation-delay-6000"></div>

        {/* 第四組 - 右下區域 */}
        <div className="absolute bottom-32 right-1/3 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl animate-blob-fade-in-out-3 animation-delay-7000"></div>
        <div className="absolute bottom-5 right-1/2 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob-fade-in-out animation-delay-8000"></div>

        {/* 第五組 - 中間區域 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob-fade-in-out-3 animation-delay-2500"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob-fade-in-out-2 animation-delay-4500"></div>
        <div className="absolute top-2/3 right-1/3 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob-fade-in-out animation-delay-5500"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl animate-blob-fade-in-out-3 animation-delay-3500"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob-fade-in-out-2 animation-delay-6500"></div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 animate-scale-in border border-orange-100">
        {/* 標題區域 - 漸進出現動畫 */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4 animate-fade-in-down">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg animate-bounce-in">
                <span className="text-2xl font-bold text-white">C</span>
              </div>
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
            登入您的帳號
          </p>
          <div
            className="mt-4 w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto animate-scale-in"
            style={{ animationDelay: "0.6s" }}
          ></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
                placeholder="請輸入使用者名稱"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200 transition-all duration-300 transform focus:scale-[1.02]"
                autoComplete="username"
              />
            </div>
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
                placeholder="請輸入密碼"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200 transition-all duration-300 transform focus:scale-[1.02]"
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 animate-slide-in-down animate-shake">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <span className="text-red-500">⚠</span>
                {error}
              </p>
            </div>
          )}

          {/* 登入按鈕 - 順序出現 */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.9s" }}
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
                  <span className="relative z-10">登入中...</span>
                </>
              ) : (
                <>
                  <LogIn
                    size={20}
                    className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                  />
                  <span className="relative z-10">登入</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* 註冊連結 - 順序出現 */}
        <div
          className="mt-6 text-center animate-fade-in-up"
          style={{ animationDelay: "1s" }}
        >
          <p className="text-gray-600 text-sm">
            還沒有帳號？{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:text-orange-600 transition-all duration-300 inline-flex items-center gap-1 group"
            >
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                立即註冊
              </span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
