import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LEVELS } from '../data/levels';
import LevelIntro from '../components/LevelIntro';
import RewardScreen from '../components/RewardScreen';
import BalloonsGame from '../games/BalloonsGame';
import MemoryGame from '../games/MemoryGame';
import TraceGame from '../games/TraceGame';
import JigsawGame from '../games/JigsawGame';
import CatchGame from '../games/CatchGame';
import EmojiGame from '../games/EmojiGame';
import RhythmGame from '../games/RhythmGame';
import DifferenceGame from '../games/DifferenceGame';
import QuickTapGame from '../games/QuickTapGame';
import UnscrambleGame from '../games/UnscrambleGame';
import ColoringGame from '../games/ColoringGame';
import ConnectGame from '../games/ConnectGame';
import MazeGame from '../games/MazeGame';
import QuizGame from '../games/QuizGame';
import BubblesGame from '../games/BubblesGame';
import SlidingGame from '../games/SlidingGame';
import StoryGame from '../games/StoryGame';
import StackerGame from '../games/StackerGame';
import CelebrationGame from '../games/CelebrationGame';
import PlaceholderGame from '../games/PlaceholderGame';
import { X } from 'lucide-react';
import styles from './GameLevel.module.css';

const GAME_COMPONENTS = {
  balloons: BalloonsGame,
  memory: MemoryGame,
  trace: TraceGame,
  jigsaw: JigsawGame,
  catch: CatchGame,
  emoji: EmojiGame,
  rhythm: RhythmGame,
  difference: DifferenceGame,
  quicktap: QuickTapGame,
  unscramble: UnscrambleGame,
  coloring: ColoringGame,
  connect: ConnectGame,
  maze: MazeGame,
  quiz: QuizGame,
  bubbles: BubblesGame,
  sliding: SlidingGame,
  story: StoryGame,
  stacker: StackerGame,
  celebration: CelebrationGame,
  placeholder: PlaceholderGame
};

const GameLevel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { completeLevel, unlockGift } = useApp();
  const [gameState, setGameState] = useState('intro'); // intro, playing, won
  
  const levelId = parseInt(id);
  const level = LEVELS.find(l => l.id === levelId);

  useEffect(() => {
    if (!level) {
      navigate('/levels');
    }
  }, [level, navigate]);

  if (!level) return null;

  const handleStart = () => {
    setGameState('playing');
  };

  const handleWin = () => {
    completeLevel(levelId);
    unlockGift(level.giftId);
    setGameState('won');
  };

  const handleContinue = () => {
    navigate('/levels');
  };

  const handleExit = () => {
    if (confirm('Are you sure you want to exit? Progress will be lost.')) {
      navigate('/levels');
    }
  };

  const GameComponent = GAME_COMPONENTS[level.type] || PlaceholderGame;

  return (
    <div className={styles.container}>
      {gameState === 'intro' && (
        <LevelIntro level={level} onStart={handleStart} />
      )}

      {gameState === 'playing' && (
        <>
          <button className={styles.exitBtn} onClick={handleExit}>
            <X size={24} />
          </button>
          <div className={styles.gameArea}>
            <GameComponent onComplete={handleWin} />
          </div>
        </>
      )}

      {gameState === 'won' && (
        <RewardScreen level={level} onContinue={handleContinue} />
      )}
    </div>
  );
};

export default GameLevel;
