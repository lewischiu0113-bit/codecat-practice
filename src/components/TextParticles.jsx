import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const TextParticles = ({ text = "CodeCat", onComplete, duration = 3000 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const mouse = { x: -1000, y: -1000, radius: 100 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    let particles = [];
    
    // 從文字提取像素點並建立粒子
    const initParticles = () => {
      particles = [];
      ctx.clearRect(0, 0, width, height);
      
      // 計算適合的字體大小
      const fontSize = Math.min(width * 0.15, 120);
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // 在中心畫文字
      ctx.fillText(text, width / 2, height / 2);
      
      // 取得像素資料
      const data = ctx.getImageData(0, 0, width, height).data;
      ctx.clearRect(0, 0, width, height);
      
      // 掃描像素（取樣間距）
      const step = 4;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3];
          
          if (alpha > 128) {
            // 文字像素，建立粒子
            // 決定顏色 (紫色至橘色的漸層變化)
            const ratio = x / width;
            // 紫色 rgb(168, 85, 247) 到 橘色 rgb(249, 115, 22)
            const r = Math.floor(168 + (249 - 168) * ratio);
            const g = Math.floor(85 + (115 - 85) * ratio);
            const b = Math.floor(247 + (22 - 247) * ratio);
            
            particles.push({
              x: Math.random() * width, // 初始位置隨機
              y: Math.random() * height,
              baseX: x, // 目標位置
              baseY: y,
              color: `rgb(${r}, ${g}, ${b})`,
              size: Math.random() * 2 + 1,
              vx: 0,
              vy: 0,
              friction: Math.random() * 0.05 + 0.85,
              ease: Math.random() * 0.05 + 0.05
            });
          }
        }
      }
    };
    
    // 延遲一點點再初始化，確保字體載入完成
    setTimeout(initParticles, 100);

    // 啟動定時器
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, duration);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // 滑鼠排斥邏輯
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          // 產生推力
          p.vx -= Math.cos(angle) * force * 5;
          p.vy -= Math.sin(angle) * force * 5;
        }
        
        // 吸引回目標位置 (彈簧效果)
        p.vx += (p.baseX - p.x) * p.ease;
        p.vy += (p.baseY - p.y) * p.ease;
        
        // 套用摩擦力
        p.vx *= p.friction;
        p.vy *= p.friction;
        
        // 更新位置
        p.x += p.vx;
        p.y += p.vy;
        
        // 繪製粒子
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [text, onComplete, duration]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="absolute inset-0 z-50 bg-transparent overflow-hidden pointer-events-auto"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </motion.div>
  );
};

export default TextParticles;
