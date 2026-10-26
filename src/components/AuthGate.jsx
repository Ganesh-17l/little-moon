import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './AuthGate.module.css';

const AuthGate = ({ children }) => {
  const { isAuthenticated, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successNote, setSuccessNote] = useState(null);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <span className={styles.loadingText}>Loading Little Moon…</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const normalizeIdentifier = (val) => {
    const trimmed = (val || '').trim().toLowerCase();
    return trimmed.includes('@') ? trimmed : `${trimmed}@littlemoon.app`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessNote(null);
    setSubmitting(true);

    const email = normalizeIdentifier(identifier);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        const data = await signUp(email, password, displayName || 'Little Moon User');
        if (data?.session) {
          // Auto logged in
        } else {
          setSuccessNote('Account created successfully! Please sign in with your ID.');
          setMode('signin');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (roleId) => {
    setIdentifier(roleId);
    setError(null);
  };

  return (
    <div className={styles.gateContainer}>
      <div className={`${styles.loginCard} animate-apple-in`}>
        {/* Editorial Header */}
        <header className={styles.header}>
          <span className={styles.brandBadge}>Private Companion</span>
          <h1 className={styles.mainTitle}>Little Moon</h1>
          <p className={styles.subtitle}>
            A dedicated sanctuary crafted with care for you and your family.
          </p>
        </header>

        {/* Apple Segmented Switch */}
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
            Create Account
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {successNote && <div className={styles.successMessage}>{successNote}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'signup' && (
            <div className={styles.inputGroup}>
              <label htmlFor="gate-display-name" className={styles.label}>
                Your Display Name
              </label>
              <div className={styles.inputWrapper}>
                <User size={16} className={styles.inputIcon} />
                <input
                  id="gate-display-name"
                  type="text"
                  required
                  placeholder="e.g. Sister, Ganesh"
                  className={styles.input}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="gate-identifier" className={styles.label}>
              Account ID or Email
            </label>
            <div className={styles.inputWrapper}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                id="gate-identifier"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                required
                placeholder="e.g. sister or brother"
                className={styles.input}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="gate-password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                id="gate-password"
                type="password"
                required
                placeholder="••••••••"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Quick ID Chips */}
          <div className={styles.quickChips}>
            <span className={styles.chipLabel}>Quick fill ID:</span>
            <button
              type="button"
              className={styles.chip}
              onClick={() => handleQuickFill('sister')}
            >
              sister
            </button>
            <button
              type="button"
              className={styles.chip}
              onClick={() => handleQuickFill('brother')}
            >
              brother
            </button>
            <button
              type="button"
              className={styles.chip}
              onClick={() => handleQuickFill('admin')}
            >
              admin
            </button>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            <span>
              {submitting
                ? 'Connecting…'
                : mode === 'signin'
                ? 'Sign In to Little Moon'
                : 'Create My Account'}
            </span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className={styles.securityFooter}>
          <ShieldCheck size={14} color="#10B981" />
          <span>Encrypted with PostgreSQL Row Level Security</span>
        </div>
      </div>
    </div>
  );
};

export default AuthGate;
