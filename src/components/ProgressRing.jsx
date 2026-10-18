import React from 'react';
import styles from './ProgressRing.module.css';

const ProgressRing = ({ radius, stroke, progress, total }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / total) * circumference;

  return (
    <div className={styles.wrapper}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className={styles.ring}
      >
        <circle
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="white"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={styles.progressCircle}
        />
      </svg>
      <div className={styles.content}>
        <span className={styles.number}>{progress}</span>
        <span className={styles.label}>of {total}</span>
      </div>
    </div>
  );
};

export default ProgressRing;
