'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useMobileAnimation } from '@/hooks/useMobileAnimation';
import { viewportSettings } from '@/utils/animations';

const styleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 }
  })
};

// Mobile variants - simpler, no delay to prevent flickering
const styleVariantsMobile = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export default function Styles() {
  const tCommon = useTranslations('common');
  const tStyles = useTranslations('styles');
  const { isMobile, prefersReducedMotion, getAnimationProps } = useMobileAnimation();
  
  const viewport = prefersReducedMotion
    ? viewportSettings.reduced
    : isMobile
    ? viewportSettings.mobile
    : viewportSettings.desktop;

  const styles = [
    {
      id: 1,
      slug: 'realism',
      color: 'bg-gray-900'
    },
    {
      id: 2,
      slug: 'japanese',
      color: 'bg-gray-800'
    },
    {
      id: 3,
      slug: 'graphic',
      color: 'bg-gray-700'
    }
  ];

  return (
    <section id="styles" className="py-12 md:py-32 bg-white overflow-x-hidden w-full">
      <div className="container mx-auto px-4 max-w-full">
        <motion.h2
          className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 md:mb-12 text-center"
          {...getAnimationProps({
            initial: { opacity: 0, y: 20 },
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
              className="relative h-80 rounded-lg overflow-hidden group cursor-pointer"
            >
              <div className={`absolute inset-0 ${style.color} opacity-90`} />
              <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
                <h3 className="text-3xl font-serif font-bold mb-3">
                  {tStyles(`${style.slug}.name`)}
                </h3>
                <p className="text-gray-200 mb-4 leading-relaxed">
                  {tStyles(`${style.slug}.description`)}
                </p>
                <button className="text-white underline hover:no-underline font-medium">
                  {tCommon('viewWorks')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

