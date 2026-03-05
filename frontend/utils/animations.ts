/**
 * Animation presets optimized for mobile and desktop
 * Automatically adjusts based on device and prefers-reduced-motion
 */

export const animationPresets = {
  // Švelnus fade in iš apačios – mažesnis poslinkis
  fadeInUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },

  fadeInUpSlow: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },

  fadeInLeft: {
    initial: { opacity: 0, x: -12 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },

  fadeInRight: {
    initial: { opacity: 0, x: 12 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.45, ease: 'easeOut' },
  },

  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.35, ease: 'easeOut' },
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
    const initial: Record<string, number> = { ...mobile.initial };
    if ('y' in initial && typeof initial.y === 'number') {
      initial.y = initial.y * 0.6; // 0.6 instead of 0.5
    }
    if ('x' in initial && typeof initial.x === 'number') {
      initial.x = initial.x * 0.6; // 0.6 instead of 0.5
    }
    if ('scale' in initial && typeof initial.scale === 'number' && initial.scale < 1) {
      initial.scale = 0.95;
    }
    mobile.initial = initial as typeof mobile.initial;
  }
  
  return mobile;
}

/**
 * Card/thumbnail hover: pakyla į priekį (translateY + scale + shadow) – viena vieta visiems sekcijoms
 * hover:z-20 kad būtų virš kitų blokų (accordion, sekcijų)
 */
export const liftCardClass =
  'transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.04] hover:shadow-xl hover:z-20 focus-visible:-translate-y-2 focus-visible:scale-[1.04] focus-visible:shadow-xl focus-visible:z-20 focus-visible:outline-none';
export const liftCardClassReduced = '';

/**
 * Mygtukų animacija: vienoda transition + švelnus hover scale + focus-visible ring
 */
export const buttonTransitionClass =
  'transition-all duration-200 ease-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-graphite focus-visible:ring-offset-2';

/** Ikonų mygtukams (jau turi savo hover scale) – tik transition + focus-visible */
export const buttonIconTransitionClass =
  'transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-graphite focus-visible:ring-offset-2';

/**
 * Viewport settings for scroll animations
 * once: true – blokai animuojasi tik vieną kartą, nebe „dingsta“ scrollinant
 */
export const viewportSettings = {
  desktop: {
    once: true,
    amount: 0.2,
    margin: '-40px',
  },
  mobile: {
    once: true,
    amount: 0.15,
    margin: '-20px',
  },
  reduced: {
    once: true,
    amount: 0.1,
    margin: '0px',
  },
};

