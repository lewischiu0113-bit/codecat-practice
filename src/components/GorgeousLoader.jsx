import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CodeRainBackground from './CodeRainBackground';

// 產生隨機亂碼的文字組件
const ScrambleText = ({ text, className, delay = 0, continuous = false }) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "!<>-_\\\\/[]{}—=+*^?#________";
  
  useEffect(() => {
    let iteration = 0;
    let interval = null;
    
    // 初始化時顯示亂碼
    setDisplayText(
      text.split("").map(() => chars[Math.floor(Math.random() * chars.length)]).join("")
    );
    
    const startTimeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((letter, index) => {
              if (!continuous && index < iteration) return text[index];
              // 若遇到真實字串中的空白，也可選擇保留，但在這我們讓亂碼完全替換
              if (!continuous && letter === " " && index < iteration) return " ";
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (!continuous) {
          if (iteration >= text.length) {
            clearInterval(interval);
          }
          iteration += 1 / 3; // 調慢解碼速度，讓變化感更明顯
        }
      }, 40); // 稍微放慢更新頻率讓閃動感更好
    }, delay);
    
    return () => {
      clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
    };
  }, [text, delay, continuous]);

  return <span className={className}>{displayText}</span>;
};

// 數字跳動組件
const ProgressCounter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500; // 對齊 1.5 秒
    const steps = 60;
    const intervalTime = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      // 使用 easeOutQuart 類似的緩動效果讓數字增長看起來更自然
      const progress = 1 - Math.pow(1 - currentStep / steps, 4);
      setCount(Math.min(99, Math.floor(progress * 100)));

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return <span>{count}</span>;
};

const GorgeousLoader = ({ text = "INITIALIZING SYSTEM MODULES...", fullscreen = true }) => {
  const containerClasses = fullscreen
    ? "fixed inset-0 z-50 bg-gradient-to-br from-purple-50 via-white to-purple-100/60 flex flex-col items-center justify-center overflow-hidden w-full h-full"
    : "relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-br from-purple-50/50 via-white/80 to-purple-100/30 backdrop-blur-sm overflow-hidden rounded-xl";

  return (
    <div className={containerClasses}>
      {/* 程式碼雨背景 */}
      <CodeRainBackground />

      {/* 主要內容區 */}
      <div className="relative z-20 flex flex-col items-center justify-center space-y-12 select-none pointer-events-none">
        
        {/* 亂碼標題區 */}
        <div className="text-center px-4">
          <motion.div 
            className="text-3xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ScrambleText text="CODECAT" delay={100} className="tracking-[0.5em] md:tracking-[0.8em]" />
          </motion.div>
          <motion.div 
            className="text-xs md:text-sm text-gray-400 tracking-[0.2em] font-mono flex flex-col md:flex-row items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span>PYTHON PROGRAMMING</span>
            <ScrambleText text="%-$*?-.\`<~{#+/;" className="text-gray-300" delay={400} />
          </motion.div>
        </div>

        {/* 進度條與狀態 */}
        <motion.div 
          className="w-64 md:w-80 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="text-purple-600 font-bold font-mono text-xl">
            <ProgressCounter /> <span className="text-xs text-purple-400 ml-1">%</span>
          </div>
          
          <div className="w-full h-1 bg-purple-100 rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-400 to-purple-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          
          <div className="text-[10px] text-gray-400 tracking-widest mt-1 uppercase text-center w-full">
            <ScrambleText text={text.toUpperCase()} delay={600} />
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default GorgeousLoader;
