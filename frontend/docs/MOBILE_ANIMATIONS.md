# Mobile Animacijų Strategija

## 📱 Principai

### 1. Performance Optimizacijos
- **Sumažinti animacijų trukmę** mobile: ~40% trumpesnės (0.6x)
- **Mažiau transform animacijų**: sumažinti `y` ir `x` reikšmes 50%
- **Mažiau scale animacijų**: naudoti 0.95 vietoj 0.9
- **Sumažinti stagger delay**: 50% mažiau
- **Išvengti sunkų animacijų**: parallax, complex transforms mobile

### 2. Accessibility
- **`prefers-reduced-motion`** palaikymas: minimalios animacijos (tik opacity)
- **Viewport settings**: mažesnis `amount` ir `margin` mobile

### 3. GPU Acceleration
- Naudoti `transform` ir `opacity` (GPU accelerated)
- Išvengti `width`, `height`, `top`, `left` animacijų

## 🛠️ Naudojimas

### Hook: `useMobileAnimation`

```tsx
import { useMobileAnimation } from '@/hooks/useMobileAnimation';

function MyComponent() {
  const { isMobile, prefersReducedMotion, getAnimationProps } = useMobileAnimation();
  
  const animationProps = getAnimationProps({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeOut' },
  });
  
  return (
    <motion.div {...animationProps}>
      Content
    </motion.div>
  );
}
```

### Presets: `animationPresets`

```tsx
import { getMobileAnimation } from '@/utils/animations';
import { useMobileAnimation } from '@/hooks/useMobileAnimation';

function MyComponent() {
  const { isMobile, prefersReducedMotion } = useMobileAnimation();
  
  const animation = getMobileAnimation(
    'fadeInUp',
    isMobile,
    prefersReducedMotion
  );
  
  return (
    <motion.div {...animation}>
      Content
    </motion.div>
  );
}
```

### Viewport Settings

```tsx
import { viewportSettings } from '@/utils/animations';
import { useMobileAnimation } from '@/hooks/useMobileAnimation';

function MyComponent() {
  const { isMobile, prefersReducedMotion } = useMobileAnimation();
  
  const viewport = prefersReducedMotion
    ? viewportSettings.reduced
    : isMobile
    ? viewportSettings.mobile
    : viewportSettings.desktop;
  
  return (
    <motion.div
      whileInView={{ opacity: 1 }}
      viewport={viewport}
    >
      Content
    </motion.div>
  );
}
```

## 📊 Animacijų Palyginimas

| Animacija | Desktop | Mobile | Reduced Motion |
|-----------|---------|--------|----------------|
| Duration | 0.8s | 0.48s (60%) | 0.2s |
| Y transform | 30px | 15px (50%) | 0px |
| X transform | 50px | 25px (50%) | 0px |
| Scale | 0.9 | 0.95 | 1.0 |
| Delay | 0.2s | 0.1s (50%) | 0s |
| Viewport amount | 0.3 | 0.2 | 0.1 |
| Viewport margin | -100px | -50px | 0px |

## ✅ Best Practices

1. **Naudoti `transform` ir `opacity`** - GPU accelerated
2. **Išvengti `width/height` animacijų** - trigger layout
3. **Sumažinti animacijų kiekį mobile** - performance
4. **Gerbti `prefers-reduced-motion`** - accessibility
5. **Naudoti `will-change` tik kur reikia** - performance
6. **Lazy load animacijas** - initial load performance

## 🚫 Ką Išvengti Mobile

- ❌ Parallax efektai
- ❌ Complex transform chains
- ❌ Daug vienu metu animuojamų elementų
- ❌ Sunkios blur/filter animacijos
- ❌ Animacijos ant kiekvieno scroll event

## ✅ Ką Naudoti Mobile

- ✅ Opacity fade
- ✅ Paprasti transform (y, x)
- ✅ Stagger su mažu delay
- ✅ Viewport-based animations
- ✅ CSS transitions kur įmanoma

