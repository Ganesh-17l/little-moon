import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './AuthModal.module.css';

const AuthModal = ({ isOpen, onClose }) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        onClose();
      } else {
        await signUp(email, password, displayName || 'Little Moon User');
        setSuccessMessage('Registration submitted. Please sign in with your credentials.');
        setMode('signin');
      }
    } catch (err) {
      console.error('Auth action error:', err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.titleSection}>
            <span className={styles.eyebrow}>Security & Access</span>
            <h2 className={styles.title}>
              {mode === 'signin' ? 'Account Authentication' : 'Create Account'}
            </h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </header>

        {/* Segmented Control */}
        <div className={styles.segmentedControl}>
          <button
            type="button"
            className={`${styles.segment} ${mode === 'signin' ? styles.segmentActive : ''}`}
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`${styles.segment} ${mode === 'signup' ? styles.segmentActive : ''}`}
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
          >
            Register
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'signup' && (
            <div className={styles.inputGroup}>
              <label htmlFor="auth-display-name" className={styles.label}>
                Display Name
              </label>
              <div className={styles.inputWrapper}>
                <User size={16} className={styles.inputIcon} />
                <input
                  id="auth-display-name"
                  type="text"
                  required
                  placeholder="Your Name"
                  className={styles.input}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="auth-email" className={styles.label}>
              Email Address
            </label>
            <div className={styles.inputWrapper}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                id="auth-email"
                type="email"
                required
                placeholder="name@example.com"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="auth-password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                id="auth-password"
                type="password"
                required
                placeholder="••••••••"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.footerNote}>
            <ShieldCheck size={14} className={styles.footerIcon} />
            <span>Encrypted with PostgreSQL Row Level Security (RLS)</span>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            <span>{loading ? 'Authenticating…' : mode === 'signin' ? 'Continue' : 'Create Identity'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
