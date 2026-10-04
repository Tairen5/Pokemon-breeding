import React, { useEffect, useState } from 'react';
import './PageTransition.css';

interface Props {
  children: React.ReactNode;
  sweep?: boolean; // show red diagonal sweep (for major nav)
}

export const PageTransition: React.FC<Props> = ({ children, sweep = false }) => {
  const [showSweep, setShowSweep] = useState(sweep);

  useEffect(() => {
    if (sweep) {
      setShowSweep(true);
      const t = setTimeout(() => setShowSweep(false), 600);
      return () => clearTimeout(t);
    }
  }, [sweep]);

  return (
    <>
      {showSweep && <div className="swsh-sweep-overlay" />}
      <div className="page-enter">
        {children}
      </div>
    </>
  );
};
