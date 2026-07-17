import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const WelcomeSplash = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  // 檢查 sessionStorage，避免在同一 session 中重複播放，使用 lazy state 避開 mount 閃爍與 lint 警告
  const [visible, setVisible] = useState(() => {
    const hasSeen = sessionStorage.getItem("hasSeenCodeCatIntro");
    return hasSeen !== "true";
  });

  // 有機載入進度模擬
  useEffect(() => {
    if (!visible) return;

    let currentProgress = 0;
    const interval = setInterval(() => {
      // 模擬有機載入曲線：不同階段速度不同，增添真實感與期待感
      let increment = 0;
      if (currentProgress < 30) {
        increment = Math.random() * 5 + 3; // 初始較快
      } else if (currentProgress < 75) {
        increment = Math.random() * 3 + 1; // 中段平穩
      } else if (currentProgress < 90) {
        increment = Math.random() * 1.5 + 0.5; // 模擬載入重資源時的卡頓
      } else {
        increment = Math.random() * 4 + 2; // 最後衝刺
      }

      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(Math.floor(currentProgress));

      if (currentProgress >= 100) {
        clearInterval(interval);
        // 達到 100% 後延遲一下下，讓使用者看清成果再淡出
        setTimeout(() => {
          setIsFinished(true);
        }, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [visible]);

  // 當動畫結束，將狀態存入 sessionStorage 並調用 onComplete
  useEffect(() => {
    if (isFinished) {
      sessionStorage.setItem("hasSeenCodeCatIntro", "true");
      // 延遲 unmount 以讓所有分欄退場動畫播放完畢 (8 columns * 0.08s stagger + 0.8s duration = 1.36s)
      const timeout = setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 1400);
      return () => clearTimeout(timeout);
    }
  }, [isFinished, onComplete]);


  // 亂碼解密動畫邏輯
  const scrambleText = (text, currentProgress) => {
    const chars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    const ratio = currentProgress / 100;
    const resolvedLength = Math.floor(text.length * ratio);

    return text
      .split("")
      .map((char, index) => {
        if (char === " ") return " ";
        if (index < resolvedLength) {
          return char;
        }
        // 隨機返回一個干擾字元
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");
  };

  const titleText = "CODECAT PRACTICE";
  const subtitleText = "PYTHON PROGRAMMING PRACTICE PLATFORM";

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-transparent text-slate-800 select-none overflow-hidden">
      {/* 科技感交錯分欄背景帷幕 (Staggered Vertical Columns Curtain) - 使用白色系背景 */}
      <div className="absolute inset-0 flex pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="h-full bg-white flex-1 border-r border-slate-50 last:border-0"
            initial={{ scaleY: 1 }}
            animate={isFinished ? { scaleY: 0 } : { scaleY: 1 }}
            transition={{
              duration: 0.8,
              delay: i * 0.08,
              ease: [0.76, 0, 0.24, 1], // 精緻的 Cubic-Bezier 貝茲曲線，呈現高級的彈性抽回效果
            }}
            style={{ originY: i % 2 === 0 ? 0 : 1 }} // 偶數欄向上縮，奇數欄向下縮，形成梳子狀開屏效果
          />
        ))}
      </div>

      {/* 背景漸變光點 (Orange & Purple Glows) - 退場時漸變消失 */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-orange-400/15 rounded-full blur-[120px] pointer-events-none"
        animate={isFinished ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-purple-400/15 rounded-full blur-[100px] pointer-events-none"
        animate={isFinished ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* 網格背景點綴 - 退場時漸變消失 */}
      <motion.div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #8b5cf6 1px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
        animate={isFinished ? { opacity: 0 } : { opacity: 0.04 }}
        transition={{ duration: 0.5 }}
      />

      {/* 主要動畫區塊 - 退場時輕微縮小並漸變消失 */}
      <motion.div
        className="flex flex-col items-center max-w-lg px-4 text-center z-10"
        animate={isFinished ? { opacity: 0, scale: 0.92, y: -15 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* 1. 科技感發光 CodeCat SVG Logo */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.95, 1.05, 0.95],
            opacity: 1,
          }}
          transition={{
            scale: {
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
            },
            opacity: {
              duration: 0.8,
            },
          }}
        >
          {/* Logo 外圍發光圈 */}
          <div className="absolute inset-0 bg-orange-300/30 rounded-full blur-2xl transform scale-75 animate-pulse" />

          <svg
            viewBox="0 0 100 100"
            className="w-28 h-28 fill-none stroke-orange-500 relative z-10"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* 程式括號修飾 (紫色) */}
            <motion.path
              d="M 15,35 L 5,45 L 15,55"
              className="stroke-purple-500/70"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.path
              d="M 85,35 L 95,45 L 85,55"
              className="stroke-purple-500/70"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />

            {/* 貓咪頭部與耳朵 */}
            <motion.path
              d="M 30,65 L 30,45 C 30,34 39,28 50,28 C 61,28 70,34 70,45 L 70,65"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
            />
            {/* 左耳 */}
            <motion.path
              d="M 30,45 L 18,22 L 42,33"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
            {/* 右耳 */}
            <motion.path
              d="M 70,45 L 82,22 L 58,33"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />

            {/* 科技感貓咪雙眼 (發光紫色圓點) */}
            <motion.circle
              cx="40"
              cy="46"
              r="3.5"
              className="fill-purple-500 stroke-purple-500"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{
                scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                default: { delay: 1, duration: 0.5 },
              }}
            />
            <motion.circle
              cx="60"
              cy="46"
              r="3.5"
              className="fill-purple-500 stroke-purple-500"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{
                scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                default: { delay: 1, duration: 0.5 },
              }}
            />

            {/* 鼻子與嘴巴 */}
            <motion.path
              d="M 48,53 L 52,53 L 50,55 Z"
              className="fill-orange-500 stroke-orange-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            />
            <motion.path
              d="M 45,58 C 47.5,60 50,60 50,58 C 50,60 52.5,60 55,58"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            />
          </svg>
        </motion.div>

        {/* 2. 橘色到紫色的漸層大標題 */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-purple-600 to-orange-400 mb-2 font-mono h-12">
          {scrambleText(titleText, progress)}
        </h1>

        {/* 3. 灰色副標題 */}
        <p className="text-xs sm:text-sm text-slate-400 tracking-[0.15em] font-medium mb-12 h-6 uppercase">
          {scrambleText(subtitleText, progress)}
        </p>

        {/* 4. 進度條區塊 */}
        <div className="w-64 sm:w-80 flex flex-col items-center">
          {/* 百分比數字 (紫色) */}
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-2xl font-semibold text-purple-600 font-mono">
              {progress}
            </span>
            <span className="text-xs text-slate-400">%</span>
          </div>

          {/* 進度條軌道 (淺灰) */}
          <div className="w-full h-[3px] bg-slate-100 rounded-full overflow-hidden relative">
            {/* 漸變進度條 */}
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.2)]"
              style={{ width: `${progress}%` }}
              layoutId="loading-bar"
            />
          </div>

          {/* 載入中文字 */}
          <span className="text-[10px] text-slate-400 tracking-[0.2em] uppercase mt-4 animate-pulse">
            Initializing System Modules...
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeSplash;
