'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useMobileAnimation } from '@/hooks/useMobileAnimation';
import { viewportSettings, buttonTransitionClass, buttonIconTransitionClass } from '@/utils/animations';

const VALID_STYLE_IDS = ['all', 'japanese', 'realism', 'minimal', 'graphic'];

type Work = { id: number; images: string[]; artist: string; style: string };

export default function Gallery() {
  const searchParams = useSearchParams();
  const tCommon = useTranslations('common');
  const tGallery = useTranslations('gallery');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [openWorkId, setOpenWorkId] = useState<number | null>(null);
  const [openWorkImageIndex, setOpenWorkImageIndex] = useState(0);
  const { isMobile, prefersReducedMotion, getAnimationProps } = useMobileAnimation();

  useEffect(() => {
    const style = searchParams.get('style');
    if (style && VALID_STYLE_IDS.includes(style)) setSelectedFilter(style);
  }, [searchParams]);

  const works: Work[] = [
    { id: 1, images: ['/placeholder-work.svg', '/placeholder-work.svg', '/placeholder-work.svg'], artist: 'artist-01', style: 'japanese' },
    { id: 2, images: ['/placeholder-work.svg', '/placeholder-work.svg'], artist: 'artist-02', style: 'realism' },
    { id: 3, images: ['/placeholder-work.svg', '/placeholder-work.svg', '/placeholder-work.svg'], artist: 'artist-03', style: 'minimal' },
    { id: 4, images: ['/placeholder-work.svg', '/placeholder-work.svg'], artist: 'artist-01', style: 'japanese' },
    { id: 5, images: ['/placeholder-work.svg', '/placeholder-work.svg', '/placeholder-work.svg'], artist: 'artist-02', style: 'graphic' },
    { id: 6, images: ['/placeholder-work.svg', '/placeholder-work.svg'], artist: 'artist-03', style: 'minimal' },
    { id: 7, images: ['/placeholder-work.svg', '/placeholder-work.svg'], artist: 'artist-01', style: 'japanese' },
    { id: 8, images: ['/placeholder-work.svg', '/placeholder-work.svg', '/placeholder-work.svg'], artist: 'artist-02', style: 'realism' },
    { id: 9, images: ['/placeholder-work.svg', '/placeholder-work.svg'], artist: 'artist-03', style: 'minimal' },
  ];

  const openWork = openWorkId !== null ? works.find((w) => w.id === openWorkId) : null;
  const openWorkImages = openWork?.images ?? [];
  const currentImageIndex = Math.min(openWorkImageIndex, Math.max(0, openWorkImages.length - 1));

  useEffect(() => {
    if (openWorkId === null) return;
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenWorkId(null);
        return;
      }
      if (openWorkImages.length <= 1) return;
      if (e.key === 'ArrowLeft') {
        setOpenWorkImageIndex((i) => (i - 1 + openWorkImages.length) % openWorkImages.length);
      }
      if (e.key === 'ArrowRight') {
        setOpenWorkImageIndex((i) => (i + 1) % openWorkImages.length);
      }
    };
    document.addEventListener('keydown', handleKeydown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = '';
    };
  }, [openWorkId, openWorkImages.length]);

  const filters = [
    { id: 'all', labelKey: 'all' },
    { id: 'japanese', labelKey: 'japanese' },
    { id: 'realism', labelKey: 'realism' },
    { id: 'minimal', labelKey: 'minimal' },
    { id: 'graphic', labelKey: 'graphic' }
  ];

  const filteredWorks = selectedFilter === 'all' 
    ? works 
    : works.filter(work => work.style === selectedFilter);

  const viewport = prefersReducedMotion
    ? viewportSettings.reduced
    : isMobile
    ? viewportSettings.mobile
    : viewportSettings.desktop;

  return (
    <section id="works" className="py-12 md:py-32 bg-background overflow-x-hidden w-full">
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
          {tCommon('works')}
        </motion.h2>

        {/* Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-6 md:mb-12"
          {...getAnimationProps({
            initial: { opacity: 0, y: 10 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.6, delay: 0.2 },
          })}
          viewport={viewport}
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Filter clicked:', filter.id);
                setSelectedFilter(filter.id);
              }}
              className={`px-6 py-1.5 rounded-xl cursor-pointer shadow-sm ${buttonTransitionClass} ${
                selectedFilter === filter.id
                  ? 'bg-graphite text-white hover:opacity-95'
                  : 'bg-mocha/10 text-mocha hover:bg-mocha/20'
              }`}
              style={{ pointerEvents: 'auto' }}
            >
              {tGallery(filter.labelKey)}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {filteredWorks.map((work, index) => (
            <motion.div
              key={work.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                setOpenWorkId(work.id);
                setOpenWorkImageIndex(0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpenWorkId(work.id);
                  setOpenWorkImageIndex(0);
                }
              }}
              {...getAnimationProps({
                initial: { opacity: 0, scale: 0.98, y: 10 },
                whileInView: { opacity: 1, scale: 1, y: 0 },
                transition: { delay: index * 0.05, duration: 0.5, ease: 'easeOut' },
              })}
              viewport={viewport}
              className="relative aspect-square rounded-lg cursor-pointer group transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <Image
                  src={work.images[0]}
                  alt={`Work ${work.id}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox – darbo nuotraukų slideris */}
      <AnimatePresence>
        {openWorkId !== null && openWorkImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80"
            onClick={() => setOpenWorkId(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Work gallery"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl max-h-[90vh] w-full flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {openWorkImages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenWorkImageIndex((i) => (i - 1 + openWorkImages.length) % openWorkImages.length);
                  }}
                  className={`absolute left-0 md:-left-12 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/90 text-graphite hover:bg-white shadow-lg ${buttonIconTransitionClass}`}
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <div className="flex-1 px-12 md:px-4">
                <Image
                  key={currentImageIndex}
                  src={openWorkImages[currentImageIndex]}
                  alt={`Work ${openWorkId} image ${currentImageIndex + 1}`}
                  width={800}
                  height={800}
                  className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
                />
                <p className="text-center text-white/90 text-sm mt-2">
                  {currentImageIndex + 1} / {openWorkImages.length}
                </p>
              </div>

              {openWorkImages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenWorkImageIndex((i) => (i + 1) % openWorkImages.length);
                  }}
                  className={`absolute right-0 md:-right-12 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/90 text-graphite hover:bg-white shadow-lg ${buttonIconTransitionClass}`}
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              <button
                type="button"
                onClick={() => setOpenWorkId(null)}
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

