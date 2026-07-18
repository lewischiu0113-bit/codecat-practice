import { useEffect, useRef } from 'react';
import WebGLFluidEnhanced from 'webgl-fluid-enhanced';

const FluidTrailBackground = ({ children }) => {
  const containerRef = useRef(null);
  const fluidRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      fluidRef.current = new WebGLFluidEnhanced(containerRef.current);
      
      fluidRef.current.setConfig({
        colorful: false,
        colorPalette: ['#a855f7', '#ea580c', '#ffffff'],
        splatRadius: 0.05,
        splatForce: 8000,
        curl: 0,
        pressure: 0.1,
        densityDissipation: 8,
        velocityDissipation: 8,
        transparent: true,
        backgroundColor: '#fdfbfb', 
        bloom: true,
        bloomIntensity: 0.4,
        bloomThreshold: 0.5,
      });
      
      fluidRef.current.start();

      // Ensure the generated canvas stays behind children and doesn't block them
      const canvas = containerRef.current.querySelector('canvas');
      if (canvas) {
        canvas.style.position = 'absolute';
        canvas.style.zIndex = '0';
        canvas.style.pointerEvents = 'none'; // let events bubble from container
      }
    } catch (err) {
      console.warn("WebGL Fluid failed to initialize:", err);
    }

    return () => {
      if (fluidRef.current) {
        fluidRef.current.stop();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden"
      style={{ width: '100vw', height: '100vh', background: 'transparent' }}
    >
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default FluidTrailBackground;
