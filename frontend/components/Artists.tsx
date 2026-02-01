'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useMobileAnimation } from '@/hooks/useMobileAnimation';
import { viewportSettings } from '@/utils/animations';

const artistVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 }
  })
};

export default function Artists() {
  const t = useTranslations('artists');
  const tCommon = useTranslations('common');
  const galleryRef = useRef<HTMLDivElement>(null);
  const { isMobile, prefersReducedMotion, getAnimationProps } = useMobileAnimation();
  
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
    <section id="masters" className="py-12 md:py-32 bg-gray-50 overflow-x-hidden w-full">
      <div className="container mx-auto px-4 max-w-full">
        <motion.h2
          className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-8 text-center"
          {...getAnimationProps({
            initial: { opacity: 0, y: 20 },
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
            initial: { opacity: 0, y: 20 },
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
              className="absolute left-2 top-1/2 -translate-y-1/2 z-[100] bg-white hover:bg-gray-100 shadow-lg rounded-full p-2 md:p-2.5 transition-all hover:scale-110 cursor-pointer border border-gray-300"
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
              className="absolute right-2 top-1/2 -translate-y-1/2 z-[100] bg-white hover:bg-gray-100 shadow-lg rounded-full p-2 md:p-2.5 transition-all hover:scale-110 cursor-pointer border border-gray-300"
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
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide relative"
              style={{ 
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {/* Simple gallery items - increased to 20 for better scrolling */}
              {Array.from({ length: 20 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[200px] md:w-[250px] h-[200px] md:h-[250px] rounded-lg overflow-hidden bg-gray-200 relative group cursor-pointer"
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
                  <h3 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mb-2 md:mb-3">
                    {t(artist.nameKey)}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-4 font-medium">
                    {t(artist.styleKey)}
                  </p>
                  <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 leading-relaxed whitespace-pre-line">
                    {t(artist.descriptionKey)}
                  </p>
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => {
                        console.log('View works clicked for:', artist.slug);
                        // TODO: Navigate to artist works page
                        window.location.href = `#works?artist=${artist.slug}`;
                      }}
                      className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition font-medium cursor-pointer"
                    >
                      {tCommon('viewWorks')}
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        console.log('Book clicked for:', artist.slug);
                        // TODO: Navigate to booking page
                        window.location.href = `#contact?artist=${artist.slug}`;
                      }}
                      className="px-6 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-50 transition font-medium border border-gray-300 cursor-pointer"
                    >
                      {tCommon('book')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

