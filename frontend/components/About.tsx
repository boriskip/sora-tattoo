'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import ImageSlider from './ImageSlider';
import { useMobileAnimation } from '@/hooks/useMobileAnimation';
import { viewportSettings } from '@/utils/animations';

export default function About() {
  const t = useTranslations('about');
  const { isMobile, prefersReducedMotion, getAnimationProps } = useMobileAnimation();
  
  // Get viewport settings based on device
  const viewport = prefersReducedMotion
    ? viewportSettings.reduced
    : isMobile
    ? viewportSettings.mobile
    : viewportSettings.desktop;

  // About sekcijos nuotraukos
  const aboutImages = [
    '/about/uberuns-1.png',
    '/about/uberuns-2.png',
    '/about/uberuns-3.png',
    '/about/uberuns-4.png',
    '/about/uberuns-5.png',
    '/about/uberuns-6.png',
    '/about/uberuns-7.png',
    '/about/uberuns-8.png',
    '/about/uberuns-9.png',
    '/about/uberuns-10.png'
  ];

  return (
    <section id="about" className="py-12 md:py-32 bg-white relative z-50 overflow-x-hidden w-full">
      <div className="container mx-auto px-4 max-w-full">
        <motion.h2
          className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 md:mb-12 text-center"
          {...getAnimationProps({
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.8, ease: 'easeOut' },
          })}
          viewport={viewport}
        >
          {t('title')}
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto items-center">
          {/* Text Content - Left */}
          <motion.div
            {...getAnimationProps({
              initial: { opacity: 0, x: -50 },
              whileInView: { opacity: 1, x: 0 },
              transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
            })}
            viewport={viewport}
            className="order-2 lg:order-1"
          >
            <div className="prose prose-lg max-w-none">
              {t('content').split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Image Slider - Right */}
          <motion.div
            {...getAnimationProps({
              initial: { opacity: 0, x: 50 },
              whileInView: { opacity: 1, x: 0 },
              transition: { duration: 0.8, ease: 'easeOut', delay: 0.4 },
            })}
            viewport={viewport}
            className="order-1 lg:order-2"
          >
            <ImageSlider images={aboutImages} autoPlay={false} interval={4000} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

