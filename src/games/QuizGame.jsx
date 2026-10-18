import React, { useState } from 'react';
import { playSound } from '../utils/sound';
import styles from './QuizGame.module.css';

const QUESTIONS = [
  { q: "Favorite Color?", options: ["Blue", "Pink", "Black", "Rainbow"] },
  { q: "Morning or Night?", options: ["Early Bird", "Night Owl"] },
  { q: "Cats or Dogs?", options: ["Cats", "Dogs", "Both!"] },
  { q: "Dream Vacation?", options: ["Beach", "Mountains", "City", "Home"] }
];

const QuizGame = ({ onComplete }) => {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (ans) => {
    playSound('tap');
    const newAnswers = [...answers, ans];
    setAnswers(newAnswers);
    
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      playSound('win');
      setShowResult(true);
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  if (showResult) {
    return (
      <div className={styles.container}>
        <h2 className={styles.resultTitle}>You are...</h2>
        <div className={styles.resultCard}>
          <h1>The Creative Dreamer! ✨</h1>
          <p>You know what you love and you follow your heart.</p>
        </div>
        <button className="btn-primary" onClick={handleFinish}>
          Complete Level
        </button>
      </div>
    );
  }

  const current = QUESTIONS[qIndex];

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        Question {qIndex + 1} / {QUESTIONS.length}
      </div>
      
      <h2 className={styles.question}>{current.q}</h2>
      
      <div className={styles.options}>
        {current.options.map((opt, i) => (
          <button 
            key={i} 
            className={styles.optionBtn}
            onClick={() => handleAnswer(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizGame;
