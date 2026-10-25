import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Settings } from 'lucide-react';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav} aria-label="Main Navigation">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <Icon size={20} strokeWidth={2.2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
