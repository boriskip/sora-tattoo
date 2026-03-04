'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMobileAnimation } from '@/hooks/useMobileAnimation';
import { viewportSettings } from '@/utils/animations';

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

export default function Styles() {
  const locale = useLocale();
  const tCommon = useTranslations('common');
  const tStyles = useTranslations('styles');
  const { isMobile, prefersReducedMotion, getAnimationProps } = useMobileAnimation();
  
  const viewport = prefersReducedMotion
    ? viewportSettings.reduced
    : isMobile
    ? viewportSettings.mobile
    : viewportSettings.desktop;

  const styles = [
    { id: 1, slug: 'realism' },
    { id: 2, slug: 'japanese' },
    { id: 3, slug: 'graphic' },
  ];

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
              className="relative h-80 rounded-lg overflow-hidden group cursor-pointer bg-stylesDark transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-stylesDark" />
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div>
                  <h3 className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-white mb-3">
                    {tStyles(`${style.slug}.name`)}
                  </h3>
                  <p className="text-white/80 mb-4 leading-relaxed min-h-[4.5rem]">
                    {tStyles(`${style.slug}.description`)}
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

