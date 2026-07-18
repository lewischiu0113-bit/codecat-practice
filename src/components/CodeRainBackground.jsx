import { useEffect, useRef } from 'react';

const CodeRainBackground = ({ opacityClass = "opacity-80" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.getBoundingClientRect().width : window.innerWidth;
      canvas.height = parent ? parent.getBoundingClientRect().height : window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const codeSnippets = [
      "def calculate_score(answers):",
      "import sys, os, time",
      "class UserInfo(BaseModel):",
      "return sum([1 for a in ans if a])",
      "async def fetch_data():",
      "yield from generator()",
      "lambda x: x ** 2",
      "from typing import List, Dict",
      "@dataclass",
      "try: \\n  main() \\nexcept Exception as e:",
      "while True:",
      "if __name__ == '__main__':",
      "print('Hello CodeCat')",
      "def get_exam_by_id(id: int):",
      "await db.connect()",
      "res = [x for x in range(10)]",
      "import react from 'react'",
      "const [state, setState] = useState(0)"
    ];

    const streams = [];
    const streamCount = window.innerWidth < 768 ? 30 : 80; // 數量
    for (let i = 0; i < streamCount; i++) {
      streams.push({
        x: (Math.random() * canvas.width * 1.5) - (canvas.width * 0.25),
        y: Math.random() * canvas.height,
        speed: Math.random() * 1.5 + 0.5,
        text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
        opacity: Math.random() * 0.2 + 0.15, // 透明度
        fontSize: Math.random() * 8 + 12
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      streams.forEach(stream => {
        ctx.fillStyle = `rgba(55, 65, 81, ${stream.opacity})`; // 更深的灰色 (gray-700)
        ctx.font = `${stream.fontSize}px monospace`;
        ctx.fillText(stream.text, stream.x, stream.y);
        stream.y -= stream.speed; // 向上捲動

        if (stream.y < -50) {
          stream.y = canvas.height + 50;
          stream.x = (Math.random() * canvas.width * 1.5) - (canvas.width * 0.25);
          stream.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none ${opacityClass}`} />;
};

export default CodeRainBackground;
