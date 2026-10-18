import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/sound';
import { Star, Heart, Sun, Moon, Cloud, Music } from 'lucide-react';
import styles from './MemoryGame.module.css';

const ICONS = [Star, Heart, Sun]; // 3 pairs for 6 cards

const MemoryGame = ({ onComplete }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    // Shuffle cards
    const pairs = [...ICONS, ...ICONS];
    const shuffled = pairs
      .map((icon, index) => ({ id: index, icon, isFlipped: false }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  const handleCardClick = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;

    playSound('flip');
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards.find(c => c.id === first).icon === cards.find(c => c.id === second).icon) {
        playSound('success');
        setMatched([...matched, first, second]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          playSound('win');
          setTimeout(onComplete, 1000);
        }
      } else {
        setTimeout(() => {
          playSound('flip'); // Flip back sound
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Find the Pairs</h2>
      <div className={styles.grid}>
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>?</div>
                <div className={styles.cardBack}>
                  <Icon size={32} color="#7EC8E3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemoryGame;
