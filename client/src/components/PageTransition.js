import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    if (location) {
      setIsTransitioning(true);
      // Wait for exit animation
      setTimeout(() => {
        setDisplayChildren(children);
        // Start entry animation
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    }
  }, [location, children]);

  return (
    <div
      className={`min-h-screen transition-opacity duration-300 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;