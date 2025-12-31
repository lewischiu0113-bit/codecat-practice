import { motion } from 'framer-motion';

// Sidebar 專用的背景動畫配置（使用更柔和的藍紫色調，確保不超出 Sidebar 邊界）
const sidebarBlobConfigs = [
  // 左上區域
  { top: '1rem', left: '0.5rem', size: '8rem', color: 'bg-blue-200', variant: 1, delay: 0 },
  { top: '5rem', left: '0', size: '6rem', color: 'bg-purple-200', variant: 2, delay: 1.5 },
  { top: '10rem', left: '1rem', size: '7rem', color: 'bg-indigo-200', variant: 3, delay: 3 },
  
  // 中間區域
  { top: '50%', left: '50%', size: '10rem', color: 'bg-blue-300', variant: 2, delay: 2, center: true },
  { top: '45%', left: '20%', size: '6rem', color: 'bg-purple-300', variant: 1, delay: 3.5 },
  { top: '55%', left: '70%', size: '6rem', color: 'bg-indigo-300', variant: 3, delay: 4.5 },
  
  // 右下區域
  { bottom: '5rem', left: '0.5rem', size: '7rem', color: 'bg-blue-200', variant: 1, delay: 5 },
  { bottom: '2rem', left: '0', size: '6rem', color: 'bg-purple-200', variant: 2, delay: 6 },
  { bottom: '8rem', left: '1rem', size: '8rem', color: 'bg-indigo-200', variant: 3, delay: 6.5 },
];

// 動畫變體定義（增強可見度，顏色更濃）
const sidebarBlobVariants = {
  1: {
    initial: { opacity: 1, scale: 0.9, x: 0, y: 0 },
    animate: {
      opacity: [1, 1, 0.8, 0.5, 0.3, 0.5, 0.8, 1],
      scale: [0.9, 0.95, 1.2, 1.1, 1.1, 1.0, 0.95, 0.9],
      x: [0, 5, 10, 20, 20, 10, -5, -10],
      y: [0, -8, -15, -25, -25, -15, 8, 15],
    },
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  2: {
    initial: { opacity: 0.3, scale: 1.0, x: 0, y: 0 },
    animate: {
      opacity: [0.3, 0.25, 0.18, 0, 0, 0.18, 0.25, 0.3],
      scale: [1.0, 1.05, 1.1, 0.95, 0.95, 1.1, 1.05, 1.0],
      x: [0, -6, -12, -20, -20, -12, 12, 25],
      y: [0, 6, 12, 20, 20, 12, -8, -15],
    },
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  3: {
    initial: { opacity: 0.35, scale: 0.85, x: 0, y: 0 },
    animate: {
      opacity: [0.35, 0.28, 0.2, 0, 0, 0.2, 0.28, 0.35],
      scale: [0.85, 0.9, 1.0, 1.08, 1.08, 1.0, 0.95, 0.85],
      x: [0, 6, 12, 20, 20, 12, -8, -15],
      y: [0, -5, -10, 15, 15, -10, -12, -20],
    },
    transition: {
      duration: 18,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const SidebarBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sidebarBlobConfigs.map((blob, index) => {
        const variant = sidebarBlobVariants[blob.variant];
        
        // 計算初始位置樣式
        const positionStyle = {
          width: blob.size,
          height: blob.size,
        };
        
        if (blob.top) {
          if (blob.center) {
            positionStyle.top = blob.top;
            positionStyle.left = blob.left;
            positionStyle.transform = 'translate(-50%, -50%)';
          } else {
            positionStyle.top = blob.top;
          }
        }
        if (blob.bottom) positionStyle.bottom = blob.bottom;
        if (blob.left && !blob.center) positionStyle.left = blob.left;
        if (blob.right) positionStyle.right = blob.right;
        
        return (
          <motion.div
            key={index}
            className={`absolute ${blob.color} rounded-full mix-blend-multiply filter blur-3xl`}
            style={positionStyle}
            initial={variant.initial}
            animate={variant.animate}
            transition={{
              ...variant.transition,
              delay: blob.delay,
            }}
          />
        );
      })}
    </div>
  );
};

export default SidebarBackground;

