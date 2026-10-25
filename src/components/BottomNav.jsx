import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Sliders } from 'lucide-react';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/settings', icon: Sliders, label: 'Settings' },
  ];

  return (
    <aside className={styles.navContainer} aria-label="Bottom Navigation">
      <nav className={styles.nav}>
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <Icon size={17} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default BottomNav;
