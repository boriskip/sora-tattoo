'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMobileAnimation } from '@/hooks/useMobileAnimation';
import { viewportSettings } from '@/utils/animations';
import type { Style } from '@/lib/api';

const styleVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 }
  })
};

// Mobile variants - simpler, no delay to prevent flickering
const styleVariantsMobile = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const FALLBACK_STYLES = [
  { id: 1, slug: 'realism', name: 'Realism', description: null, images: [] },
  { id: 2, slug: 'japanese', name: 'Japanese', description: null, images: [] },
  { id: 3, slug: 'graphic', name: 'Graphic', description: null, images: [] },
];

type StylesProps = { data?: Style[] };

/** Normalize API slug to message key (e.g. Minimalismus -> minimal) */
function getStyleTranslationKey(slug: string): string {
  const normalized: Record<string, string> = {
    Minimalismus: 'minimal',
    minimal: 'minimal',
  };
  return normalized[slug] ?? slug;
}

/** True if next-intl returned a key (missing translation) rather than real text */
function isTranslationKey(s: string): boolean {
  return s.includes('.name') || s.includes('.description') || s.startsWith('styles.');
}

export default function Styles({ data }: StylesProps) {
  const locale = useLocale();
  const tCommon = useTranslations('common');
  const tStyles = useTranslations('styles');
  const { isMobile, prefersReducedMotion, getAnimationProps } = useMobileAnimation();
  const styles = (data?.length ? data : FALLBACK_STYLES) as Style[];

  const getStyleName = (style: Style) => {
    if (style.name?.trim()) return style.name.trim();
    const key = getStyleTranslationKey(style.slug);
    try {
      const fromT = tStyles(`${key}.name`) as string;
      if (fromT && !isTranslationKey(fromT)) return fromT;
    } catch {
      // missing message key – style added via admin, no entry in messages
    }
    return style.name || '';
  };
  const getStyleDescription = (style: Style) => {
    if (style.description?.trim()) return style.description.trim();
    const key = getStyleTranslationKey(style.slug);
    try {
      const fromT = tStyles(`${key}.description`) as string;
      if (fromT && !isTranslationKey(fromT)) return fromT;
    } catch {
      // missing message key – style added via admin
    }
    return style.description ?? '';
  };

  const viewport = prefersReducedMotion
    ? viewportSettings.reduced
    : isMobile
    ? viewportSettings.mobile
    : viewportSettings.desktop;

  return (
    <section id="styles" className="py-12 md:py-32 bg-background overflow-x-hidden w-full">
      <div className="container mx-auto px-4 max-w-full">
        <motion.h2
          className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-graphite mb-12 md:mb-16 text-center"
          {...getAnimationProps({
            initial: { opacity: 0, y: 10 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.6 },
          })}
          viewport={viewport}
        >
          {tCommon('styles')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {styles.map((style, index) => (
            <motion.div
              key={style.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={isMobile ? { once: true, amount: 0.3, margin: '0px' } : viewport}
              variants={isMobile ? styleVariantsMobile : styleVariants}
              className="relative h-80 rounded-lg group cursor-pointer shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="absolute inset-0 overflow-hidden rounded-lg bg-stylesDark">
                <div className="absolute inset-0 bg-stylesDark" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div>
                  <h3 className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-white mb-3">
                    {getStyleName(style)}
                  </h3>
                  <p className="text-white/80 mb-4 leading-relaxed min-h-[4.5rem]">
                    {getStyleDescription(style)}
                  </p>
                </div>
                <Link href={`/${locale}?style=${style.slug}#works`} className="text-white underline hover:no-underline font-medium shrink-0">
                  {tCommon('viewWorks')}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

