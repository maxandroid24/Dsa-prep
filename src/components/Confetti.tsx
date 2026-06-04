import { useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

export default function Confetti({ active, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.width = window.innerWidth;
        height = canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      '#6366f1', // indigo-500
      '#a855f7', // purple-500
      '#3b82f6', // blue-500
      '#10b981', // emerald-500
      '#f59e0b', // amber-500
      '#ec4899', // pink-500
      '#14b8a6', // teal-500
    ];

    const particles: Particle[] = [];
    const maxParticles = 160;

    // Build crossfire emitters from the bottom-left and bottom-right corners
    for (let i = 0; i < maxParticles; i++) {
      const isLeft = i % 2 === 0;
      const angleRange = isLeft ? (-Math.PI / 4) - (Math.random() * Math.PI / 6) : (-3 * Math.PI / 4) + (Math.random() * Math.PI / 6);
      const velocity = Math.random() * 16 + 12;

      particles.push({
        x: isLeft ? 0 : width,
        y: height * 0.9,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.cos(angleRange) * velocity,
        speedY: Math.sin(angleRange) * velocity,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 6,
        opacity: 1,
      });
    }

    let isRunning = true;
    const gravity = 0.35;
    const friction = 0.985;

    const updateAndDraw = () => {
      if (!ctx || !isRunning) return;

      ctx.clearRect(0, 0, width, height);
      let activeCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.opacity <= 0) continue;

        activeCount++;

        // Apply physics with gravity and drag/friction
        p.speedX *= friction;
        p.speedY += gravity;
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Graduate fade out
        if (p.y > height * 0.7) {
          p.opacity -= 0.015;
        } else {
          p.opacity -= 0.007;
        }

        if (p.opacity < 0) p.opacity = 0;

        // Visual render
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        // Render shapes (rectangles, diamonds or ovals)
        if (i % 3 === 0) {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
        } else if (i % 3 === 1) {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (activeCount === 0) {
        isRunning = false;
        if (onComplete) onComplete();
      } else {
        animationFrameId = requestAnimationFrame(updateAndDraw);
      }
    };

    updateAndDraw();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      id="confetti-canvas"
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}
