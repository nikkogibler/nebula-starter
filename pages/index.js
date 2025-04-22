
import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Nebula is loading...');

  useEffect(() => {
    let animationId;
    let canvas, ctx;
    const stars = [];

    function initStars() {
      if (!canvas) return;
      stars.length = 0;
      for (let i = 0; i < 150; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5,
          a: Math.random(),
          s: Math.random() * 0.5 + 0.2
        });
      }
    }

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        star.y += star.s;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255,255,255,${star.a})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw);
    }

    setTimeout(() => {
      canvas = document.getElementById('stars');
      if (!canvas) return;
      ctx = canvas.getContext('2d');
      resize();
      window.addEventListener('resize', resize);
      draw();
    }, 0);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-nebula opacity-40 z-0" />
      <canvas id="stars" className="absolute inset-0 z-0 pointer-events-none" />
      <div className="relative z-10 px-6 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Nebula Visual Layer ✅</h1>
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}
