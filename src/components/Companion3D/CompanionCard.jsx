import React, { useState } from 'react';
import { Sparkles, Send, RefreshCw, Heart } from 'lucide-react';
import CompanionScene from './CompanionScene';
import { askBrotherCompanion, getRandomBrotherGreeting } from '../../utils/aiService';
import styles from './CompanionCard.module.css';

const QUICK_PROMPTS = [
  'Hey brother!',
  'I feel tired today',
  'Tell me something cute',
  'Need some encouragement',
];

const CompanionCard = ({ sisterName = 'Little Sis' }) => {
  const [currentMessage, setCurrentMessage] = useState(
    'Your app is caring like your brother. Always here for you, little sis! 🤍'
  );
  const [expression, setExpression] = useState('happy');
  const [animation, setAnimation] = useState('greeting');
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Toggle/Shuffle cute brotherly message
  const handleShuffleMessage = () => {
    const greeting = getRandomBrotherGreeting();
    setCurrentMessage(greeting.text);
    setExpression(greeting.expression);
    setAnimation(greeting.animation);
  };

  const handleSendMessage = async (textToSend) => {
    const message = textToSend || inputMessage;
    if (!message.trim() || isThinking) return;

    setInputMessage('');
    setIsThinking(true);
    setExpression('thinking');
    setAnimation('hover');

    const updatedHistory = [...chatHistory, { sender: 'user', text: message }];
    setChatHistory(updatedHistory);

    try {
      const response = await askBrotherCompanion(message, updatedHistory);
      setCurrentMessage(response.text);
      setExpression(response.expression || 'happy');
      setAnimation(response.animation || 'floatIdle');
      setChatHistory((prev) => [...prev, { sender: 'model', text: response.text }]);
    } catch (err) {
      console.error('Error sending message to brother:', err);
      setCurrentMessage('Always got your back, little sis! Never forget that.');
      setExpression('love');
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.companionContainer}>
      {/* Top Banner */}
      <div className={styles.topStatus}>
        <div className={styles.statusBadge}>
          <span className={styles.statusDot} />
          <span>Brother Companion Active</span>
        </div>
        <button
          type="button"
          className={styles.refreshBtn}
          onClick={handleShuffleMessage}
          title="Toggle brother note"
          aria-label="Toggle brother note"
        >
          <RefreshCw size={14} />
          <span>Toggle Note</span>
        </button>
      </div>

      {/* 3D Character Viewport */}
      <div className={styles.viewportWrapper}>
        <CompanionScene
          expression={expression}
          animation={animation}
          height="280px"
          interactive={true}
          onModelClick={handleShuffleMessage}
        />

        {/* Floating Speech Bubble */}
        <div className={styles.speechBubble} role="status" aria-live="polite">
          <div className={styles.speechHeader}>
            <Heart size={13} color="#282B4A" fill="#282B4A" />
            <span className={styles.senderTag}>Big Brother</span>
          </div>
          <p className={styles.speechText}>
            {isThinking ? 'Thinking of the best brotherly advice…' : currentMessage}
          </p>
        </div>
      </div>

      {/* Quick Prompt Pills */}
      <div className={styles.quickPrompts}>
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className={styles.promptPill}
            onClick={() => handleSendMessage(prompt)}
            disabled={isThinking}
          >
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className={styles.inputArea}
      >
        <div className={styles.inputBox}>
          <input
            type="text"
            className={styles.chatInput}
            placeholder={`Talk with your brother companion, ${sisterName}…`}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isThinking}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={!inputMessage.trim() || isThinking}
            aria-label="Send message"
          >
            {isThinking ? <Sparkles size={16} /> : <Send size={16} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanionCard;
