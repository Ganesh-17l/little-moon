import React, { useState } from 'react';
import { LEVELS } from '../data/levels';
import { MESSAGES } from '../data/messages';
import { Clock, Mail, Heart } from 'lucide-react';
import styles from './Memories.module.css';

const Memories = () => {
  const [activeTab, setActiveTab] = useState('timeline'); // timeline, messages
  const [selectedMessage, setSelectedMessage] = useState(null);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'timeline' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <Clock size={18} /> Timeline
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'messages' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <Mail size={18} /> Messages
          </button>
        </div>
      </header>

      <div className={styles.content}>
        {activeTab === 'timeline' ? (
          <div className={styles.timeline}>
            {LEVELS.map((level, index) => (
              <div key={level.id} className={styles.timelineItem}>
                <div className={styles.line} />
                <div className={styles.dot} />
                <div className={styles.yearCard}>
                  <span className={styles.yearLabel}>Age {index + 1} ({level.year})</span>
                  <h3>{level.title}</h3>
                  <p>"{level.memory}"</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.messagesGrid}>
            {MESSAGES.map(msg => (
              <div 
                key={msg.id} 
                className={`${styles.messageCard} ${msg.isSpecial ? styles.specialCard : ''}`}
                onClick={() => setSelectedMessage(msg)}
              >
                <div className={styles.sender}>
                  {msg.isSpecial && <Heart size={16} fill="currentColor" />}
                  {msg.sender}
                </div>
                <p className={styles.preview}>{msg.preview}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className={styles.modalOverlay} onClick={() => setSelectedMessage(null)}>
          <div className={`${styles.modal} animate-fade-in`} onClick={e => e.stopPropagation()}>
            <div className={styles.letterPaper}>
              <h2>Dear {selectedMessage.sender === 'Future Self' ? 'Me' : 'Little Moon'},</h2>
              <p className={styles.letterBody}>{selectedMessage.content}</p>
              <p className={styles.signature}>- {selectedMessage.sender}</p>
            </div>
            <button className="btn-primary" onClick={() => setSelectedMessage(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Memories;
