import React, { useState, useRef, useEffect } from 'react';
import { playSound } from '../utils/sound';
import styles from './TraceGame.module.css';

const TraceGame = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef(null);
  
  // Simple straight line path for now
  const pathLength = 300; 

  const handleStart = () => {
    setIsDragging(true);
    playSound('tap');
  };
  
  const handleEnd = () => setIsDragging(false);

  const handleMove = (e) => {
    if (!isDragging) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const svgRect = svgRef.current.getBoundingClientRect();
    const relativeX = clientX - svgRect.left;
    
    // Clamp between 0 and pathLength
    const newProgress = Math.max(0, Math.min(relativeX, pathLength));
    
    // Only allow moving forward reasonably
    if (newProgress > progress && newProgress < progress + 50) {
      setProgress(newProgress);
      if (Math.random() > 0.8) playSound('slide'); // Occasional slide sound
      
      if (newProgress >= pathLength - 10) {
        setIsDragging(false);
        playSound('win');
        setTimeout(onComplete, 500);
      }
    }
  };

  return (
    <div 
      className={styles.container}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <h2 className={styles.instruction}>Trace the line to the heart!</h2>
      
      <div className={styles.gameBoard}>
        <svg 
          ref={svgRef}
          width={pathLength + 40} 
          height="100" 
          className={styles.svg}
        >
          {/* Background Path */}
          <line 
            x1="20" y1="50" 
            x2={pathLength + 20} y2="50" 
            stroke="#eee" 
            strokeWidth="20" 
            strokeLinecap="round" 
          />
          
          {/* Progress Path */}
          <line 
            x1="20" y1="50" 
            x2={progress + 20} y2="50" 
            stroke="#7EC8E3" 
            strokeWidth="20" 
            strokeLinecap="round" 
          />
          
          {/* Goal */}
          <text x={pathLength + 10} y="60" fontSize="30">❤️</text>
        </svg>

        {/* Draggable Handle */}
        <div 
          className={styles.handle}
          style={{ transform: `translateX(${progress}px)` }}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
        />
      </div>
    </div>
  );
};

export default TraceGame;
