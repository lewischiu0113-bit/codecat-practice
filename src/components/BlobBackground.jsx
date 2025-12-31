import { motion } from 'framer-motion';

// Blob 配置數據
const blobConfigs = [
  // 第一組 - 左上區域（更豐富）
  { top: '2.5rem', left: '1.25rem', size: '24rem', color: 'bg-orange-200', variant: 1, delay: 0 },
  { top: '8rem', left: '5rem', size: '20rem', color: 'bg-orange-300', variant: 2, delay: 1 },
  { top: '1rem', left: '15%', size: '18rem', color: 'bg-orange-100', variant: 3, delay: 0.5 },
  { top: '12rem', left: '2rem', size: '22rem', color: 'bg-orange-400', variant: 2, delay: 2 },
  { top: '5rem', left: '10%', size: '16rem', color: 'bg-orange-200', variant: 1, delay: 1.5 },
  { top: '0.5rem', left: '8rem', size: '20rem', color: 'bg-orange-300', variant: 3, delay: 2.5 },
  
  // 第二組 - 右上區域（更豐富）
  { top: '15rem', right: '8rem', size: '18rem', color: 'bg-orange-200', variant: 1, delay: 3 },
  { top: '1.25rem', right: '25%', size: '16rem', color: 'bg-orange-100', variant: 3, delay: 1.5 },
  { top: '3rem', right: '2rem', size: '22rem', color: 'bg-orange-400', variant: 2, delay: 3.5 },
  { top: '10rem', right: '12%', size: '20rem', color: 'bg-orange-300', variant: 1, delay: 4 },
  { top: '6rem', right: '15%', size: '18rem', color: 'bg-orange-200', variant: 3, delay: 4.5 },
  { top: '0.5rem', right: '10rem', size: '24rem', color: 'bg-orange-100', variant: 2, delay: 5 },
  { top: '18rem', right: '5%', size: '16rem', color: 'bg-orange-400', variant: 1, delay: 5.5 },
  
  // 第三組 - 左下區域
  { bottom: '10rem', left: '25%', size: '20rem', color: 'bg-orange-200', variant: 2, delay: 5 },
  { bottom: '2.5rem', left: '33.333333%', size: '18rem', color: 'bg-orange-400', variant: 1, delay: 6 },
  
  // 第四組 - 右下區域
  { bottom: '8rem', right: '33.333333%', size: '18rem', color: 'bg-orange-100', variant: 3, delay: 7 },
  { bottom: '1.25rem', right: '50%', size: '20rem', color: 'bg-orange-300', variant: 1, delay: 8 },
  
  // 第五組 - 中間區域
  { top: '50%', left: '50%', size: '400px', color: 'bg-orange-300', variant: 3, delay: 2.5, center: true },
  { top: '33.333333%', left: '33.333333%', size: '20rem', color: 'bg-orange-200', variant: 2, delay: 4.5 },
  { top: '66.666667%', right: '33.333333%', size: '18rem', color: 'bg-orange-400', variant: 1, delay: 5.5 },
  { top: '25%', right: '25%', size: '24rem', color: 'bg-orange-100', variant: 3, delay: 3.5 },
  { bottom: '25%', left: '50%', size: '24rem', color: 'bg-orange-300', variant: 2, delay: 6.5 },
];

// 動畫變體定義
const blobVariants = {
  1: {
    initial: { opacity: 0.12, scale: 0.8, x: 0, y: 0 },
    animate: {
      opacity: [0.12, 0.1, 0.05, 0, 0, 0.05, 0.1, 0.12],
      scale: [0.8, 0.9, 1.0, 1.2, 1.2, 1.0, 0.95, 0.9],
      x: [0, 10, 20, 40, 40, 20, -15, -30],
      y: [0, -20, -40, -60, -60, -40, 20, 40],
    },
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  2: {
    initial: { opacity: 0.15, scale: 1.1, x: 0, y: 0 },
    animate: {
      opacity: [0.15, 0.12, 0.06, 0, 0, 0.06, 0.12, 0.15],
      scale: [1.1, 1.05, 1.0, 0.9, 0.9, 1.0, 1.05, 1.15],
      x: [0, -15, -30, -50, -50, -30, 30, 60],
      y: [0, 15, 30, 50, 50, 30, -20, -40],
    },
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  3: {
    initial: { opacity: 0.18, scale: 0.9, x: 0, y: 0 },
    animate: {
      opacity: [0.18, 0.14, 0.08, 0, 0, 0.08, 0.14, 0.18],
      scale: [0.9, 0.95, 1.0, 1.1, 1.1, 1.0, 0.95, 0.85],
      x: [0, 15, 30, 50, 50, 30, -20, -40],
      y: [0, -10, -20, 30, 30, -20, -30, -50],
    },
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const BlobBackground = ({ opacity = 1 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      {blobConfigs.map((blob, index) => {
        const variant = blobVariants[blob.variant];
        
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

export default BlobBackground;

