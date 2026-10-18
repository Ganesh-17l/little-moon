import React, { useState } from 'react';
import { playSound } from '../utils/sound';
import styles from './UnscrambleGame.module.css';

const WORDS = [
  { scrambled: "EVOL", correct: "LOVE" },
  { scrambled: "ELIMS", correct: "SMILE" },
  { scrambled: "RATS", correct: "STAR" },
  { scrambled: "YPPAH", correct: "HAPPY" }
];

const UnscrambleGame = ({ onComplete }) => {
  const [round, setRound] = useState(0);
  const [currentWord, setCurrentWord] = useState(WORDS[0].scrambled.split(''));
  const [selectedIndex, setSelectedIndex] = useState(null);
  
  const handleLetterClick = (index) => {
    if (selectedIndex === null) {
      // Select first letter
      playSound('tap');
      setSelectedIndex(index);
    } else {
      if (selectedIndex === index) {
        // Deselect
        setSelectedIndex(null);
      } else {
        // Swap
        playSound('slide');
        const newWord = [...currentWord];
        const temp = newWord[index];
        newWord[index] = newWord[selectedIndex];
        newWord[selectedIndex] = temp;
        
        setCurrentWord(newWord);
        setSelectedIndex(null);

        // Check win
        if (newWord.join('') === WORDS[round].correct) {
          playSound('success');
          if (round < WORDS.length - 1) {
            setTimeout(() => {
              setRound(r => r + 1);
              setCurrentWord(WORDS[round + 1].scrambled.split(''));
            }, 500);
          } else {
            playSound('win');
            setTimeout(onComplete, 500);
          }
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tap two letters to swap!</h2>
      <div className={styles.wordContainer}>
        {currentWord.map((char, index) => (
          <button
            key={index}
            className={`${styles.letter} ${selectedIndex === index ? styles.selected : ''}`}
            onClick={() => handleLetterClick(index)}
          >
            {char}
          </button>
        ))}
      </div>
      <p className={styles.progress}>{round + 1} / {WORDS.length}</p>
    </div>
  );
};

export default UnscrambleGame;
