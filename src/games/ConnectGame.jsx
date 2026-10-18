import React, { useState } from 'react';
import { playSound } from '../utils/sound';
import styles from './ConnectGame.module.css';

const DOTS = [
  { id: 1, x: 100, y: 50 },
  { id: 2, x: 150, y: 150 },
  { id: 3, x: 50, y: 150 },
  { id: 4, x: 100, y: 50 } // Back to start
];

const ConnectGame = ({ onComplete }) => {
  const [nextId, setNextId] = useState(1);
  const [lines, setLines] = useState([]);

  const handleDotClick = (id) => {
    if (id === nextId) {
      playSound('tap');
      if (id > 1) {
        const prev = DOTS[id - 2];
        const curr = DOTS[id - 1];
        setLines(prevLines => [...prevLines, { x1: prev.x, y1: prev.y, x2: curr.x, y2: curr.y }]);
      }
      
      if (id === DOTS.length) {
        playSound('win');
        setTimeout(onComplete, 500);
      } else {
        setNextId(id + 1);
      }
    } else {
      playSound('error');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Connect in order!</h2>
      <svg width="200" height="200" className={styles.svg}>
        {lines.map((l, i) => (
          <line 
            key={i} 
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} 
            stroke="#7EC8E3" strokeWidth="4" 
            className={styles.line}
          />
        ))}
        {DOTS.slice(0, DOTS.length - 1).map(dot => (
          <g key={dot.id} onClick={() => handleDotClick(dot.id)}>
            <circle cx={dot.x} cy={dot.y} r="15" fill={nextId === dot.id ? "#FF7675" : "#ddd"} />
            <text x={dot.x} y={dot.y + 5} textAnchor="middle" fill="white" fontSize="14">{dot.id}</text>
          </g>
        ))}
        {/* Last dot logic (same as first visually) */}
        {nextId === 4 && (
           <g onClick={() => handleDotClick(4)}>
             <circle cx={DOTS[3].x} cy={DOTS[3].y} r="15" fill="#FF7675" opacity="0.5" />
           </g>
        )}
      </svg>
    </div>
  );
};

export default ConnectGame;
