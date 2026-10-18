import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import styles from './Onboarding.module.css';

const AVATARS = [
  '👧', '👩', '👱‍♀️', '👩‍🦰', '👩‍🦱', '🧚‍♀️'
];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const { updateUser } = useApp();
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    updateUser({
      name,
      avatar,
      isOnboardingComplete: true
    });
    navigate('/home');
  };

  return (
    <div className={styles.container}>
      {/* Progress Dots */}
      <div className={styles.progress}>
        {[1, 2, 3].map(s => (
          <div 
            key={s} 
            className={`${styles.dot} ${step >= s ? styles.activeDot : ''}`}
          />
        ))}
      </div>

      <div className={styles.content}>
        {step === 1 && (
          <div className={`${styles.step} animate-fade-in`}>
            <div className={styles.iconWrapper}>
              <Sparkles size={48} color="var(--color-primary)" />
            </div>
            <h1 className={styles.title}>Welcome to Your Birthday Journey My Little Moon 🎂</h1>
            <p className={styles.subtitle}>This app was made just for you, with love.</p>
          </div>
        )}

        {step === 2 && (
          <div className={`${styles.step} animate-fade-in`}>
            <h2 className={styles.title}>Let's get to know you</h2>
            
            <div className={styles.inputGroup}>
              <label>What should I call you?</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className={styles.input}
                autoFocus
              />
            </div>

            <div className={styles.avatarSection}>
              <label>Choose your avatar</label>
              <div className={styles.avatarGrid}>
                {AVATARS.map(a => (
                  <button
                    key={a}
                    onClick={() => setAvatar(a)}
                    className={`${styles.avatarBtn} ${avatar === a ? styles.selectedAvatar : ''}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={`${styles.step} animate-fade-in`}>
            <div className={styles.iconWrapper}>
              <Star size={48} color="var(--color-accent-yellow)" fill="var(--color-accent-yellow)" />
            </div>
            <h2 className={styles.title}>Your 18-Year Journey</h2>
            <div className={styles.infoCard}>
              <p>You’ll play through <strong>18 levels</strong>, each representing a year of your life.</p>
              <p>Each level unlocks a special gift and a memory.</p>
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <button 
          className="btn-primary w-full"
          onClick={handleNext}
          disabled={step === 2 && !name.trim()}
        >
          {step === 3 ? 'Start Level 1' : 'Continue'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
