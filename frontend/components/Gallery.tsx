'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useMobileAnimation } from '@/hooks/useMobileAnimation';
import { viewportSettings, buttonTransitionClass, buttonIconTransitionClass } from '@/utils/animations';
import type { Work, Style } from '@/lib/api';
import { getWorkFirstImage, getWorkFirstAlt } from '@/lib/api';

const FALLBACK_STYLE_IDS = ['japanese', 'realism', 'minimal', 'graphic'];

type GalleryProps = { works: Work[]; styles?: Style[] };

export default function Gallery({ works = [], styles = [] }: GalleryProps) {
  const searchParams = useSearchParams();
  const tCommon = useTranslations('common');
  const tGallery = useTranslations('gallery');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [openWorkId, setOpenWorkId] = useState<number | null>(null);
  const { isMobile, prefersReducedMotion, getAnimationProps } = useMobileAnimation();
  const styleSlugs = styles.length > 0 ? styles.map((s) => s.slug) : FALLBACK_STYLE_IDS;

  useEffect(() => {
    const style = searchParams.get('style');
    if (style && (style === 'all' || styleSlugs.includes(style))) setSelectedFilter(style);
  }, [searchParams, styleSlugs]);

  const openWork = openWorkId !== null ? works.find((w) => w.id === openWorkId) : null;
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const openWorkImages = openWork?.images ?? [];

  useEffect(() => {
    if (openWorkId === null) return;
    setLightboxImageIndex(0);
  }, [openWorkId]);

  useEffect(() => {
    if (openWorkId === null) return;
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenWorkId(null);
      if (openWorkImages.length > 1) {
        if (e.key === 'ArrowLeft') setLightboxImageIndex((i) => (i - 1 + openWorkImages.length) % openWorkImages.length);
        if (e.key === 'ArrowRight') setLightboxImageIndex((i) => (i + 1) % openWorkImages.length);
      }
    };
    document.addEventListener('keydown', handleKeydown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = '';
    };
  }, [openWorkId, openWorkImages.length]);

  const filters =
    styles.length > 0
      ? [{ id: 'all' as const, label: tGallery('all') }, ...styles.map((s) => ({ id: s.slug, label: s.name }))]
      : [
          { id: 'all' as const, label: tGallery('all') },
          { id: 'japanese', label: tGallery('japanese') },
          { id: 'realism', label: tGallery('realism') },
          { id: 'minimal', label: tGallery('minimal') },
          { id: 'graphic', label: tGallery('graphic') },
        ];

  const filteredWorks =
    selectedFilter === 'all'
      ? works
      : works.filter((work) => (work.style || '').toLowerCase() === selectedFilter.toLowerCase());
  const filteredWithImages = filteredWorks.filter((w) => getWorkFirstImage(w));

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
                setSelectedFilter(filter.id);
              }}
              className={`px-6 py-1.5 rounded-xl cursor-pointer shadow-sm ${buttonTransitionClass} ${
                selectedFilter === filter.id
                  ? 'bg-graphite text-white hover:opacity-95'
                  : 'bg-mocha/10 text-mocha hover:bg-mocha/20'
              }`}
              style={{ pointerEvents: 'auto' }}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {filteredWithImages.length === 0 ? (
            <p className="col-span-full text-center text-mocha">{tGallery('noWorks') || 'No works in this category.'}</p>
          ) : (
            filteredWithImages.map((work, index) => {
              const src = getWorkFirstImage(work);
              if (!src) return null;
              const label = (work.title || work.images?.[0]?.alt || '').trim() || null;
              const masterName = work.artist?.name ?? null;
              return (
                <motion.div
                  key={work.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => { setOpenWorkId(work.id); setLightboxImageIndex(0); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpenWorkId(work.id);
                      setLightboxImageIndex(0);
                    }
                  }}
                  {...getAnimationProps({
                    initial: { opacity: 0, scale: 0.98, y: 10 },
                    whileInView: { opacity: 1, scale: 1, y: 0 },
                    transition: { delay: index * 0.05, duration: 0.5, ease: 'easeOut' },
                  })}
                  viewport={viewport}
                  className="relative rounded-lg cursor-pointer group transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                >
                  {masterName && (
                    <p className="py-2 px-2 text-xs font-medium truncate text-center text-white rounded-t-lg" style={{ backgroundColor: '#383737' }} title={masterName}>{masterName}</p>
                  )}
                  <div className={`relative aspect-[4/5] overflow-hidden ${masterName ? 'rounded-t-none' : 'rounded-t-lg'} ${label ? 'rounded-b-none' : 'rounded-b-lg'}`}>
                    {/* Blur background so `object-contain` doesn't leave visible side gaps */}
                    <div
                      aria-hidden
                      className="absolute inset-0 z-0 bg-cover bg-center blur-2xl scale-110 opacity-60 pointer-events-none"
                      style={{ backgroundImage: `url(${src})` }}
                    />
                    {/* Tint only side edges (not the whole blurred region) */}
                    <div
                      aria-hidden
                      className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-[#383737]/55 via-transparent to-[#383737]/55"
                    />
                    <img
                      src={src}
                      alt={getWorkFirstAlt(work)}
                      // Use contain so tall/large-aspect images are not cropped (width ok, height not hidden)
                      className="relative z-10 object-contain w-full h-full group-hover:scale-110 transition-transform duration-300 bg-transparent"
                    />
                    <div className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                  {label && (
                    <div className="mt-0 py-2 px-2 text-center text-white rounded-b-lg" style={{ backgroundColor: '#383737' }}>
                      <p className="text-sm font-medium truncate" title={label}>{label}</p>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Lightbox – to darbo nuotraukos (slideris jei kelios) */}
      <AnimatePresence>
        {openWorkId !== null && openWork && openWorkImages.length > 0 && (
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
                  onClick={(e) => { e.stopPropagation(); setLightboxImageIndex((i) => (i - 1 + openWorkImages.length) % openWorkImages.length); }}
                  className={`absolute left-0 md:-left-12 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/90 text-graphite hover:bg-white shadow-lg ${buttonIconTransitionClass}`}
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div className="flex-1 px-12 md:px-4">
                <img
                  key={openWorkImages[lightboxImageIndex]?.id}
                  src={openWorkImages[lightboxImageIndex]?.image}
                  alt={(openWorkImages[lightboxImageIndex]?.alt || openWork.title || `Work ${openWork.id}`).trim() || `Work ${openWork.id}`}
                  className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
                />
                {openWorkImages[lightboxImageIndex]?.alt?.trim() && (
                  <p className="text-center text-white/90 text-sm mt-2">
                    {openWorkImages[lightboxImageIndex].alt.trim()}
                  </p>
                )}
                {openWorkImages.length > 1 && (
                  <p className="text-center text-white/70 text-xs mt-1">
                    {lightboxImageIndex + 1} / {openWorkImages.length}
                  </p>
                )}
              </div>
              {openWorkImages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLightboxImageIndex((i) => (i + 1) % openWorkImages.length); }}
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

