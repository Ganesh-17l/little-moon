import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/sound';
import styles from './CelebrationGame.module.css';

const CelebrationGame = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const [showText, setShowText] = useState(false);
  const particlesRef = useRef([]);
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const createFirework = (x, y) => {
      const particleCount = 50;
      const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#A8E6CF', '#FF8B94'];
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = Math.random() * 5 + 2;
        
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          gravity: 0.1
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(26, 26, 46, 0.2)'; // Trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= 0.01;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    
    // Auto fireworks
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        createFirework(
          Math.random() * canvas.width,
          Math.random() * canvas.height * 0.6
        );
        playSound('pop');
      }
    }, 800);

    // Show text after delay
    setTimeout(() => setShowText(true), 1000);
    
    // Complete level
    setTimeout(onComplete, 8000);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
      clearInterval(interval);
    };
  }, [onComplete]);

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const particleCount = 30;
    const colors = ['#FFF', '#FFD700', '#FF69B4'];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = Math.random() * 6 + 2;
      
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.1
      });
    }
    playSound('pop');
  };

  return (
    <div className={styles.container}>
      <canvas 
        ref={canvasRef} 
        className={styles.canvas}
        onClick={handleClick}
      />
      <div className={`${styles.content} ${showText ? styles.visible : ''}`}>
        <h1 className={styles.title}>Happy 18th Birthday!</h1>
        <p className={styles.subtitle}>May your life be as bright as these fireworks!</p>
        <div className={styles.cake}>🎂</div>
      </div>
    </div>
  );
};

export default CelebrationGame;
