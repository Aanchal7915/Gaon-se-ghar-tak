// src/components/ScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top-left corner of the window
  }, [pathname]); // This effect runs whenever the pathname (route) changes

  return null; // This component doesn't render anything
};

export default ScrollToTop;