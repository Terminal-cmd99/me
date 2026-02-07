import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  animationClass: string;
  delay: number;
}

export function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate random stars
    const generateStars = () => {
      const stars: Star[] = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 8000);
      
      for (let i = 0; i < starCount; i++) {
        const animations = ['twinkle', 'twinkle-slow', 'twinkle-fast'];
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          animationClass: animations[Math.floor(Math.random() * animations.length)],
          delay: Math.random() * 3,
        });
      }
      return stars;
    };

    starsRef.current = generateStars();

    // Animation variables
    let time = 0;
    let rafId: number;

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a1a');
      gradient.addColorStop(0.5, '#1a1a3e');
      gradient.addColorStop(1, '#2d1b4e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw twinkling stars
      starsRef.current.forEach((star) => {
        let opacity = 0.5;
        let scale = 1;

        // Calculate twinkle based on animation type
        const starTime = time + star.delay;
        if (star.animationClass === 'twinkle') {
          opacity = 0.3 + 0.7 * Math.sin(starTime * 2);
          scale = 0.8 + 0.4 * Math.sin(starTime * 2);
        } else if (star.animationClass === 'twinkle-slow') {
          opacity = 0.2 + 0.6 * Math.sin(starTime * 1.5);
          scale = 0.5 + 0.5 * Math.sin(starTime * 1.5);
        } else {
          opacity = 0.4 + 0.6 * Math.sin(starTime * 3);
        }

        // Draw pixel star
        const size = star.size * scale;
        ctx.fillStyle = `rgba(255, 248, 220, ${Math.max(0, opacity)})`;
        
        // Draw cross/plus shape for pixel star
        ctx.fillRect(star.x - size/2, star.y - size*1.5, size, size*3);
        ctx.fillRect(star.x - size*1.5, star.y - size/2, size*3, size);
      });

      // Draw occasional shooting star
      if (Math.random() < 0.005) {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height * 0.5;
        drawShootingStar(ctx, startX, startY);
      }

      rafId = requestAnimationFrame(animate);
    };

    const drawShootingStar = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      const length = 80 + Math.random() * 40;
      const angle = Math.PI / 4;
      
      const gradient = ctx.createLinearGradient(x, y, x - length * Math.cos(angle), y + length * Math.sin(angle));
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - length * Math.cos(angle), y + length * Math.sin(angle));
      ctx.stroke();
      
      // Draw star head
      ctx.fillStyle = 'white';
      ctx.fillRect(x - 2, y - 2, 4, 4);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full"
      style={{ 
        zIndex: 0,
        imageRendering: 'pixelated'
      }}
    />
  );
}
