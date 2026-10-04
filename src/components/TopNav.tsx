import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TopNav.css';

// SVG icons matching the actual SwSh iconography
const PokeballIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h4.5M17.5 12H22"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2a10 10 0 0 1 0 20"/>
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const BoxIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const navItems = [
  { path: '/',          icon: <PokeballIcon />, label: 'Inicio' },
  { path: '/planner',  icon: <ClockIcon />,    label: 'Crianza' },
  { path: '/box',      icon: <BoxIcon />,      label: 'Cajas' },
  { path: '/pokedex',  icon: <StarIcon />,     label: 'Pokédex' },
  { path: '/profile',  icon: <ProfileIcon />,  label: 'Perfil' },
];

export const TopNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/') return null;

  const currentIndex = navItems.findIndex(n => n.path === location.pathname);

  const goPrev = () => {
    const prev = navItems[currentIndex - 1];
    if (prev) navigate(prev.path);
  };

  const goNext = () => {
    const next = navItems[currentIndex + 1];
    if (next) navigate(next.path);
  };

  return (
    <nav className="top-nav-container">
      <div className="top-nav-bar">
        {/* Left arrow — solid triangle like the game */}
        <button
          className={`nav-arrow ${currentIndex <= 0 ? 'disabled' : ''}`}
          onClick={goPrev}
          disabled={currentIndex <= 0}
          aria-label="Anterior"
        >
          <span className="nav-tri nav-tri--left" />
        </button>

        {/* Icon strip */}
        <div className="nav-icons">
          {navItems.map((item, i) => {
            const isActive = i === currentIndex;
            return (
              <div className="nav-item" key={item.path}>
                <button
                  className={`nav-icon-btn ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                  title={item.label}
                >
                  {item.icon}
                </button>
                {isActive && <span className="swsh-tab-band nav-band">{item.label}</span>}
              </div>
            );
          })}
        </div>

        {/* Right arrow — solid triangle like the game */}
        <button
          className={`nav-arrow ${currentIndex >= navItems.length - 1 ? 'disabled' : ''}`}
          onClick={goNext}
          disabled={currentIndex >= navItems.length - 1}
          aria-label="Siguiente"
        >
          <span className="nav-tri nav-tri--right" />
        </button>
      </div>

      {/* Diagonal white accent on the right */}
      <div className="top-nav-diagonal-accent" />
    </nav>
  );
};
