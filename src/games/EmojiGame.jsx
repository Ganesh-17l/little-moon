import React, { useState } from 'react';
import { playSound } from '../utils/sound';
import styles from './EmojiGame.module.css';

const ROUNDS = [
  { word: "Happy", correct: "😊", options: ["😊", "😢", "😠", "😴"] },
  { word: "Sleepy", correct: "😴", options: ["😎", "😴", "🤩", "🤔"] },
  { word: "Excited", correct: "🤩", options: ["😐", "🤩", "🤒", "🤫"] },
  { word: "Cool", correct: "😎", options: ["😎", "🤢", "🤯", "🤠"] },
  { word: "Loved", correct: "🥰", options: ["🥰", "🥶", "🤥", "🤐"] }
];

const EmojiGame = ({ onComplete }) => {
  const [round, setRound] = useState(0);
  
  const handleGuess = (emoji) => {
    if (emoji === ROUNDS[round].correct) {
      playSound('success');
      if (round < ROUNDS.length - 1) {
        setRound(round + 1);
      } else {
        playSound('win');
        onComplete();
      }
    } else {
      playSound('error');
    }
  };

  const current = ROUNDS[round];

  return (
    <div className={styles.container}>
      <h2 className={styles.word}>{current.word}</h2>
      <div className={styles.grid}>
        {current.options.map((emoji, i) => (
          <button 
            key={i} 
            className={styles.btn}
            onClick={() => handleGuess(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className={styles.progress}>
        {round + 1} / {ROUNDS.length}
      </div>
    </div>
  );
};

export default EmojiGame;
