import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const GorgeousLoader = ({ text = "Loading...", fullscreen = true }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false, targetOffsetX: 0, targetOffsetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width || window.innerWidth;
      canvas.height = rect.height || window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 初始化星子數據 (Glitter Wrap Warp Speed 效果)
    const starCount = 120;
    const stars = [];
    const maxDepth = 1000;
    
    // 設定顏色，以淺紫色、粉色、暖橘色調為主，搭配您的程式碼風格
    const colors = [
      'rgba(168, 85, 247, 0.75)', // 紫色 (purple-500)
      'rgba(236, 72, 153, 0.75)', // 桃粉 (pink-500)
      'rgba(255, 107, 0, 0.75)',   // 橘色 (primary)
      'rgba(129, 140, 248, 0.75)', // 靛藍 (indigo-400)
    ];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 1600,
        z: Math.random() * maxDepth,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 1.5 + 0.8
      });
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // 計算滑鼠相對於中心的偏移量，做為透視扭曲的基準
      mouseRef.current.x = mx;
      mouseRef.current.y = my;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const parentElement = canvas.parentElement;
    if (parentElement) {
      parentElement.addEventListener('mousemove', handleMouseMove);
      parentElement.addEventListener('mouseleave', handleMouseLeave);
    }

    let time = 0;
    let currentOffsetX = 0;
    let currentOffsetY = 0;

    const draw = () => {
      time += 0.01;
      
      // 清理畫布，保留一點點透明度可形成淡淡的星軌拖尾效果，讓質感更絲滑
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // 追蹤滑鼠造成的中心點偏折，創造 3D 透視隨著滑鼠扭曲的效果
      const mouse = mouseRef.current;
      if (mouse.active) {
        const targetOffsetX = (mouse.x - centerX) * 0.25;
        const targetOffsetY = (mouse.y - centerY) * 0.25;
        currentOffsetX += (targetOffsetX - currentOffsetX) * 0.08;
        currentOffsetY += (targetOffsetY - currentOffsetY) * 0.08;
      } else {
        // 滑鼠閒置時，自動進行優雅慢速正弦偏折
        const targetOffsetX = Math.cos(time * 0.8) * (width * 0.06);
        const targetOffsetY = Math.sin(time * 0.5) * (height * 0.04);
        currentOffsetX += (targetOffsetX - currentOffsetX) * 0.04;
        currentOffsetY += (targetOffsetY - currentOffsetY) * 0.04;
      }

      const speed = 7.5; // 星軌前進速度
      const scaleFactor = 220; // 投影比例

      // 繪製星空 Warp 效果
      for (let i = 0; i < starCount; i++) {
        const star = stars[i];

        // 往前移動
        star.z -= speed;

        // 如果超出螢幕前方，重新置於遠處
        if (star.z <= 0) {
          star.z = maxDepth;
          star.x = (Math.random() - 0.5) * 1600;
          star.y = (Math.random() - 0.5) * 1600;
          star.color = colors[Math.floor(Math.random() * colors.length)];
          star.size = Math.random() * 1.5 + 0.8;
        }

        // 3D 投影計算
        const k = scaleFactor / star.z;
        const px = star.x * k + centerX + currentOffsetX;
        const py = star.y * k + centerY + currentOffsetY;

        // 前一幀的位置 (用以繪製星軌線段)
        const prevK = scaleFactor / (star.z + speed);
        const ppx = star.x * prevK + centerX + currentOffsetX;
        const ppy = star.y * prevK + centerY + currentOffsetY;

        // 隨著距離變近，粒子看起來越大、越亮
        const relativeScale = 1 - star.z / maxDepth;
        const alpha = Math.min(1, relativeScale * 1.5);
        const lineWidth = star.size * relativeScale * 1.5;

        // 若粒子在可見範圍內，開始繪製
        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          // 1. 繪製星軌線段 (Glitter Warp Trail)
          ctx.beginPath();
          ctx.moveTo(ppx, ppy);
          ctx.lineTo(px, py);
          ctx.strokeStyle = star.color.replace('0.75', (0.35 * alpha).toString());
          ctx.lineWidth = lineWidth;
          ctx.stroke();

          // 2. 繪製閃亮星頭 (Glitter Dot)
          ctx.beginPath();
          ctx.arc(px, py, lineWidth * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = star.color.replace('0.75', alpha.toString());
          
          // 加強發光質感
          ctx.shadowBlur = 6;
          ctx.shadowColor = star.color;
          ctx.fill();
        }
      }

      // 重設陰影以免影響其他元件繪製
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (parentElement) {
        parentElement.removeEventListener('mousemove', handleMouseMove);
        parentElement.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 滿版設計，採用程式碼風格的溫和淺紫色背景 (Purple-50 到 Purple-100 的柔和漸變)
  const containerClasses = fullscreen
    ? "fixed inset-0 z-50 bg-gradient-to-br from-purple-50 via-white to-purple-100/60 flex flex-col items-center justify-center overflow-hidden w-full h-full"
    : "relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-br from-purple-50/50 via-white/80 to-purple-100/30 backdrop-blur-sm overflow-hidden rounded-xl";

  // 字元動畫變體
  const wordVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const letterVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 90,
      },
    },
  };

  const floatVariants = {
    animate: (i) => ({
      y: [0, -6, 0],
      textShadow: [
        "0 0 0px rgba(168,85,247,0)",
        "0 0 8px rgba(168,85,247,0.35)",
        "0 0 0px rgba(168,85,247,0)"
      ],
      transition: {
        duration: 2.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.12,
      },
    }),
  };

  return (
    <div className={containerClasses}>
      {/* Glitter Wrap 畫布背景 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none block animate-fade-in"
      />

      {/* 逐字優雅文字 reveal */}
      <div className="relative z-20 flex flex-col items-center gap-2 select-none pointer-events-none">
        <motion.div
          className="flex flex-wrap justify-center items-center gap-0.5 font-bold tracking-wider text-sm"
          variants={wordVariants}
          initial="hidden"
          animate="visible"
        >
          {text.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-gray-700 to-gray-500 font-bold"
            >
              <motion.span
                className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-purple-600 to-orange-500"
                custom={index}
                variants={floatVariants}
                animate="animate"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default GorgeousLoader;
