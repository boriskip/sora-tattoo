'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useMobileAnimation } from '@/hooks/useMobileAnimation';
import { viewportSettings, buttonTransitionClass, buttonIconTransitionClass } from '@/utils/animations';

const artistVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 }
  })
};

export default function Artists() {
  const locale = useLocale();
  const t = useTranslations('artists');
  const tCommon = useTranslations('common');
  const galleryRef = useRef<HTMLDivElement>(null);
  const LIGHTBOX_WORKS_COUNT = 20;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { isMobile, prefersReducedMotion, getAnimationProps } = useMobileAnimation();

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i === null ? null : (i - 1 + LIGHTBOX_WORKS_COUNT) % LIGHTBOX_WORKS_COUNT));
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i === null ? null : (i + 1) % LIGHTBOX_WORKS_COUNT));
    };
    if (lightboxIndex !== null) {
      document.addEventListener('keydown', handleKeydown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);
  
  const viewport = prefersReducedMotion
    ? viewportSettings.reduced
    : isMobile
    ? viewportSettings.mobile
    : viewportSettings.desktop;


  const scrollGallery = (direction: 'left' | 'right') => {
    const gallery = galleryRef.current;
    
    if (!gallery) {
      return;
    }
    
    const scrollAmount = 500; // Fixed scroll amount in pixels
    
    if (direction === 'left') {
      gallery.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      gallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const artists = [
    {
      id: 1,
      slug: 'artist-01',
      nameKey: 'artist1.name',
      styleKey: 'artist1.style',
      descriptionKey: 'artist1.description',
      avatar: '/placeholder-avatar.svg'
    },
    {
      id: 2,
      slug: 'artist-02',
      nameKey: 'artist2.name',
      styleKey: 'artist2.style',
      descriptionKey: 'artist2.description',
      avatar: '/placeholder-avatar.svg'
    },
    {
      id: 3,
      slug: 'artist-03',
      nameKey: 'artist3.name',
      styleKey: 'artist3.style',
      descriptionKey: 'artist3.description',
      avatar: '/placeholder-avatar.svg'
    }
  ];

  return (
    <section id="masters" className="py-12 md:py-32 bg-background overflow-x-hidden w-full">
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
          {t('title')}
        </motion.h2>

        {/* Gallery - Infinite Horizontal Scroll */}
        <motion.div
          className="w-full mb-6 md:mb-12 overflow-hidden"
          {...getAnimationProps({
            initial: { opacity: 0, y: 10 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.6, delay: 0.2 },
          })}
          viewport={viewport}
        >
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('LEFT BUTTON CLICKED');
                scrollGallery('left');
              }}
              className={`absolute left-2 top-1/2 -translate-y-1/2 z-[100] bg-white hover:bg-gray-100 shadow-lg rounded-full p-2 md:p-2.5 hover:scale-110 cursor-pointer border border-gray-300 ${buttonIconTransitionClass}`}
              aria-label="Scroll left"
              style={{ 
                pointerEvents: 'auto',
                position: 'absolute',
                zIndex: 100
              }}
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('RIGHT BUTTON CLICKED');
                scrollGallery('right');
              }}
              className={`absolute right-2 top-1/2 -translate-y-1/2 z-[100] bg-white hover:bg-gray-100 shadow-lg rounded-full p-2 md:p-2.5 hover:scale-110 cursor-pointer border border-gray-300 ${buttonIconTransitionClass}`}
              aria-label="Scroll right"
              style={{ 
                pointerEvents: 'auto',
                position: 'absolute',
                zIndex: 100
              }}
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div 
              ref={galleryRef}
              className="flex gap-4 overflow-x-auto pt-4 pb-4 scrollbar-hide relative"
              style={{ 
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {/* Galerijos kortelės – paprasta hover animacija tiesiai čia */}
              {Array.from({ length: LIGHTBOX_WORKS_COUNT }).map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[200px] md:w-[250px] h-[200px] md:h-[250px] rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className="w-full h-full rounded-lg overflow-hidden bg-gray-200 relative group cursor-pointer focus:ring-2 focus:ring-graphite/50 focus:ring-offset-2"
                  >
                    <Image
                      src="/placeholder-work.svg"
                      alt={`Work ${index + 1}`}
                      width={250}
                      height={250}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Artists Cards - Vertical Layout, Full Width */}
        <div className="space-y-4 md:space-y-8">
          {artists.map((artist, index) => (
            <motion.div
              key={artist.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={artistVariants}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow w-full"
              style={{ pointerEvents: 'auto' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Image */}
                <div className="relative h-48 md:h-full min-h-[300px] bg-gray-200">
                  <Image
                    src={artist.avatar}
                    alt={t(artist.nameKey)}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="md:col-span-2 p-4 md:p-8 flex flex-col justify-center">
                  <h3 className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-graphite mb-2 md:mb-3">
                    {t(artist.nameKey)}
                  </h3>
                  <p className="text-sm md:text-base text-mocha mb-2 md:mb-4 font-medium">
                    {t(artist.styleKey)}
                  </p>
                  <p className="text-sm md:text-base text-mocha mb-4 md:mb-6 leading-relaxed whitespace-pre-line">
                    {t(artist.descriptionKey)}
                  </p>
                  <div className="flex gap-3">
                    {/* Laikinai → #works (be backend). Vėliau: href={`/${locale}/artists/${artist.slug}`} */}
                    <Link 
                      href={`/${locale}#works`}
                      className={`px-6 py-1.5 bg-graphite text-white rounded-xl hover:opacity-95 font-medium cursor-pointer inline-block text-center shadow-sm ${buttonTransitionClass}`}
                    >
                      {tCommon('viewWorks')}
                    </Link>
                    <Link 
                      href={`/${locale}${artist.slug ? `?artist=${artist.slug}` : ''}#contact`}
                      className={`px-6 py-1.5 bg-background/95 text-graphite rounded-xl hover:bg-white/90 font-medium border border-mocha/20 cursor-pointer inline-block text-center shadow-sm ${buttonTransitionClass}`}
                    >
                      {tCommon('book')}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox - darbų peržiūra su slideriu */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80"
            onClick={() => setLightboxIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Work preview"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl max-h-[90vh] w-full flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i === null ? null : (i - 1 + LIGHTBOX_WORKS_COUNT) % LIGHTBOX_WORKS_COUNT)); }}
                className={`absolute left-0 md:-left-12 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/90 text-graphite hover:bg-white shadow-lg ${buttonIconTransitionClass}`}
                aria-label="Previous work"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Image */}
              <div className="flex-1 px-12 md:px-4">
                <Image
                  key={lightboxIndex}
                  src="/placeholder-work.svg"
                  alt={`Work ${lightboxIndex + 1}`}
                  width={800}
                  height={800}
                  className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
                  unoptimized
                />
                <p className="text-center text-white/90 text-sm mt-2">Work {lightboxIndex + 1} / {LIGHTBOX_WORKS_COUNT}</p>
              </div>

              {/* Next */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i === null ? null : (i + 1) % LIGHTBOX_WORKS_COUNT)); }}
                className={`absolute right-0 md:-right-12 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/90 text-graphite hover:bg-white shadow-lg ${buttonIconTransitionClass}`}
                aria-label="Next work"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className={`absolute -top-10 right-0 md:top-0 md:-right-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-graphite hover:bg-white ${buttonIconTransitionClass}`}
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

