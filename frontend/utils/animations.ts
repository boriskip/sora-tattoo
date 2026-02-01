/**
 * Animation presets optimized for mobile and desktop
 * Automatically adjusts based on device and prefers-reduced-motion
 */

export const animationPresets = {
  // Fade in from bottom (mobile: reduced distance)
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },

  // Fade in from bottom (mobile: shorter duration)
  fadeInUpSlow: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeOut' },
  },

  // Fade in from side (mobile: reduced distance)
  fadeInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },

  fadeInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },

  // Scale + fade (mobile: less scale)
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },

  // Simple fade (works well on all devices)
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

/**
 * Get mobile-optimized animation props
 */
export function getMobileAnimation(
  preset: keyof typeof animationPresets,
  isMobile: boolean,
  prefersReducedMotion: boolean
) {
  if (prefersReducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    };
  }

  const base = animationPresets[preset];
  
  if (!isMobile) {
    return base;
  }

  // Mobile optimizations - SLOWER for better visibility
  const mobile = { ...base };
  
  // INCREASE duration on mobile (make it slower, more visible)
  if (mobile.transition) {
    mobile.transition = {
      ...mobile.transition,
      duration: (mobile.transition.duration || 0.6) * 1.1, // 10% longer instead of shorter
    };
  }
  
  // Reduce transform distances (less movement, but slower animation)
  if (mobile.initial) {
    const initial = { ...mobile.initial };
    if (initial.y) initial.y = (initial.y as number) * 0.6; // 0.6 instead of 0.5
    if (initial.x) initial.x = (initial.x as number) * 0.6; // 0.6 instead of 0.5
    if (initial.scale && initial.scale < 1) initial.scale = 0.95;
    mobile.initial = initial;
  }
  
  return mobile;
}

/**
 * Viewport settings for scroll animations
 */
export const viewportSettings = {
  // Desktop: more aggressive
  desktop: {
    once: false,
    amount: 0.3,
    margin: '-100px',
  },
  // Mobile: more visible, trigger earlier so animation has time to complete
  mobile: {
    once: false,
    amount: 0.4, // Increased from 0.2 to 0.4 - trigger earlier
    margin: '-100px', // Increased from -50px to -100px - more space to see animation
  },
  // Reduced motion: simple
  reduced: {
    once: true,
    amount: 0.1,
    margin: '0px',
  },
};

