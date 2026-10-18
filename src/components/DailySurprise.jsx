import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import styles from './DailySurprise.module.css';

const SURPRISES = [
  "You make the world brighter just by being in it.",
  "Your smile is pure magic.",
  "You are loved more than you know.",
  "Today is a perfect day to be happy.",
  "You are capable of amazing things.",
  "Don't forget to be kind to yourself today.",
  "You light up every room you enter.",
  "Your kindness is your superpower."
];

const DailySurprise = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [surprise, setSurprise] = useState('');

  const handleOpen = () => {
    const random = SURPRISES[Math.floor(Math.random() * SURPRISES.length)];
    setSurprise(random);
    setIsOpen(true);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Sparkles size={20} color="var(--color-accent-yellow)" />
        <h3>Today's Surprise</h3>
      </div>
      
      {!isOpen ? (
        <button className={styles.revealBtn} onClick={handleOpen}>
          Tap to Reveal ✨
        </button>
      ) : (
        <div className={`${styles.content} animate-fade-in`}>
          <p className={styles.message}>"{surprise}"</p>
          <div className={styles.icon}>
            <Heart size={24} fill="#FF7675" color="#FF7675" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySurprise;
