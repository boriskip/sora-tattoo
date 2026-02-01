'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect mobile devices and reduced motion preference
 * Returns optimized animation settings for mobile devices
 */
export function useMobileAnimation() {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      if (typeof window === 'undefined') return;
      
      const isMobileDevice = 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || 
        window.innerWidth < 768;
      
      setIsMobile(isMobileDevice);
    };

    // Check prefers-reduced-motion
    const checkReducedMotion = () => {
      if (typeof window === 'undefined') return;
      
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      // Listen for changes
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      
      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } 
      // Fallback for older browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    };

    checkMobile();
    const cleanupReducedMotion = checkReducedMotion();

    // Listen for resize
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (cleanupReducedMotion) cleanupReducedMotion();
    };
  }, []);

  /**
   * Get optimized animation variants for mobile
   */
  const getAnimationProps = (desktopProps: {
    initial?: any;
    animate?: any;
    transition?: any;
    whileInView?: any;
  }) => {
    if (prefersReducedMotion) {
      // Minimal animations for reduced motion
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
        whileInView: { opacity: 1 },
      };
    }

    if (isMobile) {
      // Mobile-optimized animations - SLOWER for better visibility
      const mobileProps = { ...desktopProps };
      
      // INCREASE duration on mobile (make it slower, more visible)
      // Keep same or slightly longer duration so users can see the animation
      if (mobileProps.transition) {
        if (typeof mobileProps.transition.duration === 'number') {
          // Keep duration same or slightly longer (1.0x to 1.2x) instead of reducing
          mobileProps.transition.duration = mobileProps.transition.duration * 1.1;
        }
        // Keep delay same or slightly increase for better visibility
        if (mobileProps.transition.delay) {
          mobileProps.transition.delay = (mobileProps.transition.delay as number) * 1.0;
        }
      }
      
      // Reduce transform distances on mobile (less movement, but slower)
      if (mobileProps.initial) {
        const initial = { ...mobileProps.initial };
        if (initial.y && typeof initial.y === 'number') {
          initial.y = initial.y * 0.6; // Slightly less reduction (0.6 instead of 0.5)
        }
        if (initial.x && typeof initial.x === 'number') {
          initial.x = initial.x * 0.6; // Slightly less reduction
        }
        mobileProps.initial = initial;
      }
      
      // Reduce scale animations
      if (mobileProps.initial?.scale) {
        mobileProps.initial.scale = 0.95; // Less dramatic scale
      }
      
      return mobileProps;
    }

    // Desktop - return as is
    return desktopProps;
  };

  return {
    isMobile,
    prefersReducedMotion,
    getAnimationProps,
  };
}

