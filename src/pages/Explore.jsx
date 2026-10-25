import React from 'react';
import { Layers, Image, Cpu } from 'lucide-react';
import styles from './Explore.module.css';

const Explore = () => {
  return (
    <div className={`${styles.container} animate-apple-in`}>
      <header className={styles.topHeader}>
        <span className={styles.headerDate}>Discovery</span>
        <h1 className={styles.mainTitle}>Modular Canvas</h1>
        <p className={styles.subtitle}>
          A blank, structured framework prepared for your upcoming feature implementations.
        </p>
      </header>

      {/* Main Canvas Card */}
      <section className={styles.canvasCard}>
        <h3>Ready for Custom Modules</h3>
        <p>
          All legacy components and assets have been stripped. The architecture now provides clean routing, state persistence, and responsive layouts designed to scale with your ideas.
        </p>
        <div className={styles.noteContainer}>
          <span className={styles.noteTitle}>Clean State</span>
          <span className={styles.noteText}>
            No legacy dependencies or hardcoded data remain. New views can be added directly into the router.
          </span>
        </div>
      </section>

      {/* Spec Rows */}
      <section className={styles.grid}>
        <div className={styles.featureCard}>
          <Image size={20} className={styles.featureIcon} strokeWidth={1.8} />
          <div className={styles.featureContent}>
            <div className={styles.featureTitle}>Asset Slot Ready</div>
            <div className={styles.featureDesc}>
              Ready for your custom icon file at assets/icon.png.
            </div>
          </div>
        </div>

        <div className={styles.featureCard}>
          <Cpu size={20} className={styles.featureIcon} strokeWidth={1.8} />
          <div className={styles.featureContent}>
            <div className={styles.featureTitle}>Performance Baseline</div>
            <div className={styles.featureDesc}>
              Lightweight bundle with sub-second initialization and native viewport handling.
            </div>
          </div>
        </div>

        <div className={styles.featureCard}>
          <Layers size={20} className={styles.featureIcon} strokeWidth={1.8} />
          <div className={styles.featureContent}>
            <div className={styles.featureTitle}>Component Hierarchy</div>
            <div className={styles.featureDesc}>
              Apple-grade grouped surfaces and typography tokens defined in the root stylesheet.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Explore;
