import React, { useEffect, useRef } from 'react';

interface AmbientParticlesProps {
  type: 'none' | 'stars' | 'confetti' | 'bubbles' | 'cyber';
  glowColor?: string;
}

export const AmbientParticles: React.FC<AmbientParticlesProps> = ({ type, glowColor = '#a855f7' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (type === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle generator based on type
    const count = type === 'stars' ? 80 : type === 'cyber' ? 45 : 35;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * (type === 'bubbles' ? 6 : 3) + 1,
      speedX: (Math.random() - 0.5) * (type === 'cyber' ? 1.2 : 0.4),
      speedY: type === 'bubbles' ? -Math.random() * 0.8 - 0.3 : (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      hue: Math.random() * 60 - 30, // slight variation
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Opacity oscillation
        p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.01;
        const clampedOpacity = Math.max(0.1, Math.min(0.85, p.opacity));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (type === 'stars') {
          ctx.fillStyle = `rgba(255, 255, 255, ${clampedOpacity})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = glowColor;
        } else if (type === 'bubbles') {
          ctx.fillStyle = `rgba(244, 63, 94, ${clampedOpacity * 0.5})`;
          ctx.strokeStyle = `rgba(255, 255, 255, ${clampedOpacity * 0.8})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (type === 'cyber') {
          ctx.fillStyle = `rgba(6, 182, 212, ${clampedOpacity})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#06b6d4';
        } else {
          // Confetti / golden dust
          ctx.fillStyle = `rgba(234, 179, 8, ${clampedOpacity})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#eab308';
        }

        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type, glowColor]);

  if (type === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
      aria-hidden="true"
    />
  );
};
