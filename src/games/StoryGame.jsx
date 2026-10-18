import React, { useState } from 'react';
import { playSound } from '../utils/sound';
import styles from './StoryGame.module.css';

const SCENES = [
  {
    id: 0,
    text: "It's a sunny morning. What do you want to do?",
    choices: [
      { text: "Go for a walk", next: 1 },
      { text: "Read a book", next: 2 }
    ]
  },
  {
    id: 1,
    text: "You walk to the park and see a cute puppy!",
    choices: [
      { text: "Pet the puppy", next: 3 },
      { text: "Keep walking", next: 3 }
    ]
  },
  {
    id: 2,
    text: "The book is about a magical kingdom.",
    choices: [
      { text: "Keep reading", next: 3 },
      { text: "Write your own story", next: 3 }
    ]
  },
  {
    id: 3,
    text: "You had a wonderful day full of small joys.",
    choices: [
      { text: "The End", next: 'end' }
    ]
  }
];

const StoryGame = ({ onComplete }) => {
  const [sceneId, setSceneId] = useState(0);
  
  const handleChoice = (next) => {
    playSound('tap');
    if (next === 'end') {
      playSound('win');
      onComplete();
    } else {
      setSceneId(next);
    }
  };

  const scene = SCENES.find(s => s.id === sceneId);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <p className={styles.text}>{scene.text}</p>
        <div className={styles.choices}>
          {scene.choices.map((c, i) => (
            <button 
              key={i} 
              className="btn-primary"
              onClick={() => handleChoice(c.next)}
            >
              {c.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryGame;
