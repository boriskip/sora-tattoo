'use client';

import { useMobileAnimation } from '@/hooks/useMobileAnimation';
import { liftCardClass, liftCardClassReduced } from '@/utils/animations';

type BaseProps = { className?: string; children: React.ReactNode };

type LiftableCardProps = BaseProps &
  (
    | ({ as: 'button' } & React.ButtonHTMLAttributes<HTMLButtonElement>)
    | ({ as?: 'div' } & React.HTMLAttributes<HTMLDivElement>)
    | ({ as: 'a' } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  );

/**
 * Wrapper that adds consistent lift-on-hover (and focus-visible) for thumbnails/cards.
 * Respects prefers-reduced-motion. Use in Meister, Information, Arbeiten, Stile.
 */
export function LiftableCard({
  as: Component = 'div',
  className = '',
  children,
  ...rest
}: LiftableCardProps) {
  const { prefersReducedMotion } = useMobileAnimation();
  const liftClass = prefersReducedMotion ? liftCardClassReduced : liftCardClass;

  return (
    <Component
      className={`${liftClass} ${className}`.trim()}
      {...(rest as React.HTMLAttributes<HTMLElement>)}
    >
      {children}
    </Component>
  );
}
