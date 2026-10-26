import React, { useState } from 'react';
import CompanionScene from '../components/Companion3D/CompanionScene';
import styles from './Explore.module.css';

const EXPRESSION_LIST = [
  { key: 'neutral', name: 'Neutral', icon: '● ●' },
  { key: 'happy', name: 'Happy', icon: '∩ ∩' },
  { key: 'love', name: 'Heart Eyes', icon: '♥ ♥' },
  { key: 'curious', name: 'Curious', icon: '● ◕' },
  { key: 'content', name: 'Content', icon: '◡ ◡' },
  { key: 'laugh', name: 'Laughing', icon: '⌒ ⌒' },
];

const ANIMATION_LIST = [
  { key: 'floatIdle', name: 'Float Idle' },
  { key: 'hover', name: 'Hover' },
  { key: 'greeting', name: 'Greeting' },
  { key: 'excitedBounce', name: 'Bounce' },
  { key: 'tiltLeft', name: 'Tilt Left' },
  { key: 'tiltRight', name: 'Tilt Right' },
];

const Explore = () => {
  const [activeExpr, setActiveExpr] = useState('neutral');
  const [activeAnim, setActiveAnim] = useState('floatIdle');

  return (
    <div className={`${styles.container} animate-apple-in`}>
      <header className={styles.topHeader}>
        <span className={styles.headerDate}>Interactive Rig</span>
        <h1 className={styles.mainTitle}>Companion Studio</h1>
        <p className={styles.subtitle}>
          Interactive 3D character engine with real-time physics, conformal eyes, and motion dynamics.
        </p>
      </header>

      {/* 3D Viewport */}
      <section className={styles.viewportCard}>
        <CompanionScene
          expression={activeExpr}
          animation={activeAnim}
          height="310px"
          interactive={true}
        />
        <div className={styles.viewportFooter}>
          <span className={styles.footerHint}>Drag horizontally to rotate 360°</span>
        </div>
      </section>

      {/* Expression Controls */}
      <section className={styles.group}>
        <span className={styles.groupCaption}>Eye Expressions</span>
        <div className={styles.chipGrid}>
          {EXPRESSION_LIST.map((expr) => (
            <button
              key={expr.key}
              type="button"
              className={`${styles.controlChip} ${
                activeExpr === expr.key ? styles.controlChipActive : ''
              }`}
              onClick={() => setActiveExpr(expr.key)}
            >
              <span className={styles.chipIcon}>{expr.icon}</span>
              <span>{expr.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Animation Controls */}
      <section className={styles.group}>
        <span className={styles.groupCaption}>Motion Animations</span>
        <div className={styles.chipGrid}>
          {ANIMATION_LIST.map((anim) => (
            <button
              key={anim.key}
              type="button"
              className={`${styles.controlChip} ${
                activeAnim === anim.key ? styles.controlChipActive : ''
              }`}
              onClick={() => setActiveAnim(anim.key)}
            >
              <span>{anim.name}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Explore;
