"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: { r: number; g: number; b: number };
  alpha: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

const WORDS = ["ROAST", "ARENA", "BURN", "SAVAGE", "FLAME"];
const PARTICLE_GAP = 3;
const MOUSE_RADIUS = 80;

export default function ParticleTextEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const currentWordRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const container = containerRef.current;
    if (!container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const createParticlesFromText = (text: string): Particle[] => {
      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return [];

      offscreen.width = canvas.width;
      offscreen.height = canvas.height;

      const fontSize = Math.min(
        canvas.width / (text.length * 0.55),
        canvas.height * 0.35,
        120
      );

      offCtx.fillStyle = "#ffffff";
      offCtx.font = `900 ${fontSize}px Arial, sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText(text, offscreen.width / 2, offscreen.height / 2);

      const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      const particles: Particle[] = [];

      for (let y = 0; y < offscreen.height; y += PARTICLE_GAP) {
        for (let x = 0; x < offscreen.width; x += PARTICLE_GAP) {
          const index = (y * offscreen.width + x) * 4;
          const alpha = imageData.data[index + 3];

          if (alpha > 128) {
            const newColor = {
              r: Math.random() > 0.5 ? 234 + Math.random() * 21 : 50 + Math.random() * 30,
              g: Math.random() > 0.5 ? 88 + Math.random() * 40 : 100 + Math.random() * 40,
              b: Math.random() > 0.5 ? 12 + Math.random() * 10 : 10 + Math.random() * 15,
            };

            particles.push({
              x: x + (Math.random() - 0.5) * canvas.width,
              y: y + (Math.random() - 0.5) * canvas.height,
              baseX: x,
              baseY: y,
              size: Math.random() * 1.5 + 0.8,
              color: newColor,
              alpha: Math.random() * 0.5 + 0.5,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
              life: 0,
              maxLife: Math.random() * 60 + 30,
            });
          }
        }
      }

      return particles;
    };

    const initParticles = () => {
      const word = WORDS[currentWordRef.current % WORDS.length];
      particlesRef.current = createParticlesFromText(word);
    };

    initParticles();

    let wordChangeTimer = 0;
    const WORD_CHANGE_INTERVAL = 240;

    const animate = () => {
      ctx.fillStyle = "rgba(12, 10, 9, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          const angle = Math.atan2(dy, dx);
          p.vx -= Math.cos(angle) * force * 3;
          p.vy -= Math.sin(angle) * force * 3;
        }

        p.vx += (p.baseX - p.x) * 0.03;
        p.vy += (p.baseY - p.y) * 0.03;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const lifeAlpha =
          p.life < 30
            ? p.life / 30
            : p.life > p.maxLife
              ? 1 - (p.life - p.maxLife) / 30
              : 1;

        const alpha = p.alpha * Math.max(0, Math.min(1, lifeAlpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(p.color.r)}, ${Math.round(p.color.g)}, ${Math.round(p.color.b)}, ${alpha})`;
        ctx.fill();
      }

      wordChangeTimer++;
      if (wordChangeTimer >= WORD_CHANGE_INTERVAL) {
        wordChangeTimer = 0;
        currentWordRef.current = (currentWordRef.current + 1) % WORDS.length;
        const word = WORDS[currentWordRef.current];
        const newParticles = createParticlesFromText(word);

        const maxLen = Math.max(particles.length, newParticles.length);
        for (let i = 0; i < maxLen; i++) {
          if (i < newParticles.length && i < particles.length) {
            newParticles[i].x = particles[i].x;
            newParticles[i].y = particles[i].y;
            newParticles[i].vx = particles[i].vx * 0.5;
            newParticles[i].vy = particles[i].vy * 0.5;
          }
        }

        particlesRef.current = newParticles;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-64 sm:h-80 md:h-96 bg-[#09090b] border border-zinc-800 rounded-xl overflow-hidden cursor-crosshair"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
        <p className="text-lg font-black text-white tracking-widest">ROAST ARENA</p>
        <p className="text-xs text-zinc-600 mt-0.5 uppercase tracking-widest">Where Opinions Get Burned</p>
      </div>
    </div>
  );
}

export { ParticleTextEffect };