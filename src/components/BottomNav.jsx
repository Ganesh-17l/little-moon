import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Gamepad2, Gift, Clock, User } from 'lucide-react';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/levels', icon: Gamepad2, label: 'Levels' },
    { path: '/gallery', icon: Gift, label: 'Gallery' },
    { path: '/memories', icon: Clock, label: 'Memories' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => 
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <Icon size={22} strokeWidth={2.5} />
            {/* <span className={styles.label}>{label}</span> */}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
