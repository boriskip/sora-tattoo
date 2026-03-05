'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import ImageSlider from './ImageSlider';
import { useMobileAnimation } from '@/hooks/useMobileAnimation';
import { viewportSettings } from '@/utils/animations';
import type { AboutSection, AboutImageItem } from '@/lib/api';

const DEFAULT_ABOUT_IMAGES: AboutImageItem[] = [
  '/about/uberuns-1.png', '/about/uberuns-2.png', '/about/uberuns-3.png',
  '/about/uberuns-4.png', '/about/uberuns-5.png', '/about/uberuns-6.png',
  '/about/uberuns-7.png', '/about/uberuns-8.png', '/about/uberuns-9.png', '/about/uberuns-10.png',
].map((url) => ({ url, alt: '' }));

function normalizeAboutImages(images: AboutSection['images']): AboutImageItem[] {
  if (!images?.length) return DEFAULT_ABOUT_IMAGES;
  return images.map((item) =>
    typeof item === 'string' ? { url: item, alt: '' } : { url: item.url, alt: item.alt ?? '' }
  );
}

type AboutProps = { data?: AboutSection | null };

export default function About({ data }: AboutProps) {
  const t = useTranslations('about');
  const { isMobile, prefersReducedMotion, getAnimationProps } = useMobileAnimation();
  const title = (data?.title?.trim() || t('title')) as string;
  const content = (data?.content?.trim() || t('content')) as string;
  const aboutImages = normalizeAboutImages(data?.images ?? null);
  
  const viewport = prefersReducedMotion
    ? viewportSettings.reduced
    : isMobile
    ? viewportSettings.mobile
    : viewportSettings.desktop;

  return (
    <section id="about" className="py-12 md:py-32 bg-background relative z-50 overflow-x-hidden w-full">
      <div className="container mx-auto px-4 max-w-full">
        <motion.h2
          className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-graphite mb-12 md:mb-16 text-center"
          {...getAnimationProps({
            initial: { opacity: 0, y: 12 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.8, ease: 'easeOut' },
          })}
          viewport={viewport}
        >
          {title}
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto items-start">
          {/* Tekstas siauroje kolonoje – ilgesnis stulpelis */}
          <motion.div
            {...getAnimationProps({
              initial: { opacity: 0, x: -12 },
              whileInView: { opacity: 1, x: 0 },
              transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
            })}
            viewport={viewport}
            className="order-2 lg:order-1 lg:col-span-5"
          >
            <div className="max-w-md">
              {content.split('\n').map((paragraph, index) => (
                <p key={index} className="text-mocha mb-5 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Slider šone – about nuotraukos */}
          <motion.div
            {...getAnimationProps({
              initial: { opacity: 0, x: 12 },
              whileInView: { opacity: 1, x: 0 },
              transition: { duration: 0.8, ease: 'easeOut', delay: 0.4 },
            })}
            viewport={viewport}
            className="order-1 lg:order-2 lg:col-span-7"
          >
            <ImageSlider items={aboutImages} autoPlay={false} interval={4000} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

