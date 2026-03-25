'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useMobileAnimation } from '@/hooks/useMobileAnimation';
import { viewportSettings, buttonTransitionClass, buttonIconTransitionClass } from '@/utils/animations';
import type { Artist, Work } from '@/lib/api';
import { getWorkFirstImage, getWorkFirstAlt } from '@/lib/api';

const artistVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 }
  })
};

type ArtistsProps = { artists: Artist[]; works: Work[] };

export default function Artists({ artists = [], works = [] }: ArtistsProps) {
  const locale = useLocale();
  const t = useTranslations('artists');
  const tCommon = useTranslations('common');
  const galleryRef = useRef<HTMLDivElement>(null);
  const [lightboxWorkId, setLightboxWorkId] = useState<number | null>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const openWork = lightboxWorkId !== null ? works.find((w) => w.id === lightboxWorkId) : null;
  const openWorkImages = openWork?.images ?? [];
  const worksWithImages = works.filter((w) => getWorkFirstImage(w));
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);
  const worksToShow =
    selectedArtistId === null
      ? worksWithImages
      : worksWithImages.filter((w) => w.artist_id === selectedArtistId);
  const { isMobile, prefersReducedMotion, getAnimationProps } = useMobileAnimation();

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (lightboxWorkId === null) return;
      if (e.key === 'Escape') setLightboxWorkId(null);
      if (openWorkImages.length > 1) {
        if (e.key === 'ArrowLeft') setLightboxImageIndex((i) => (i - 1 + openWorkImages.length) % openWorkImages.length);
        if (e.key === 'ArrowRight') setLightboxImageIndex((i) => (i + 1) % openWorkImages.length);
      }
    };
    if (lightboxWorkId !== null) {
      document.addEventListener('keydown', handleKeydown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = '';
    };
  }, [lightboxWorkId, openWorkImages.length]);
  
  const viewport = prefersReducedMotion
    ? viewportSettings.reduced
    : isMobile
    ? viewportSettings.mobile
    : viewportSettings.desktop;

  const scrollGallery = (direction: 'left' | 'right') => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    gallery.scrollBy({ left: direction === 'left' ? -500 : 500, behavior: 'smooth' });
  };

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
          {/* Filter by master */}
          {artists.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setSelectedArtistId(null)}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${buttonTransitionClass} ${
                  selectedArtistId === null ? 'bg-graphite text-white' : 'bg-mocha/10 text-mocha hover:bg-mocha/20'
                }`}
              >
                {t('allMasters') || 'Visi'}
              </button>
              {artists.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setSelectedArtistId(selectedArtistId === a.id ? null : a.id)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${buttonTransitionClass} ${
                    selectedArtistId === a.id ? 'bg-graphite text-white' : 'bg-mocha/10 text-mocha hover:bg-mocha/20'
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>
          )}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
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
              {worksToShow.length === 0 ? (
                <div className="flex-shrink-0 w-[200px] md:w-[250px] h-[200px] md:h-[250px] rounded-lg bg-gray-100 flex items-center justify-center text-mocha text-sm">
                  {selectedArtistId ? (t('noWorksByMaster') || 'Šio meistro darbų nėra') : (t('noWorks') || 'No works yet')}
                </div>
              ) : (
                worksToShow.map((work) => {
                  const src = getWorkFirstImage(work);
                  if (!src) return null;
                  const label = (work.title || work.images?.[0]?.alt || '').trim() || null;
                  const masterName = work.artist?.name ?? null;
                  return (
                    <div
                      key={work.id}
                      className="flex-shrink-0 w-[200px] md:w-[250px] rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      {masterName && (
                        <p className="py-2 px-2 text-xs font-medium truncate text-center text-white rounded-t-lg" style={{ backgroundColor: '#383737' }} title={masterName}>{masterName}</p>
                      )}
                      <button
                        type="button"
                        onClick={() => { setLightboxWorkId(work.id); setLightboxImageIndex(0); }}
                        className={`w-full aspect-[4/5] overflow-hidden bg-gray-200 relative group cursor-pointer focus:ring-2 focus:ring-graphite/50 focus:ring-offset-2 block ${masterName ? 'rounded-t-none' : 'rounded-t-lg'} ${label ? 'rounded-b-none' : 'rounded-b-lg'}`}
                      >
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
                          // Use contain so image height isn't clipped; keeps aspect ratio
                          className="relative z-10 object-contain w-full h-full group-hover:scale-110 transition-transform duration-300 bg-transparent"
                        />
                        <div className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </button>
                      {label && (
                        <div className="mt-0 py-2 px-2 text-center text-white rounded-b-lg" style={{ backgroundColor: '#383737' }}>
                          <p className="text-sm font-medium truncate" title={label}>{label}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>

        {/* Artists Cards - from API */}
        <div className="space-y-4 md:space-y-8">
          {artists.length === 0 ? (
            <p className="text-center text-mocha">{t('noArtists') || 'No masters yet.'}</p>
          ) : (
            artists.map((artist, index) => (
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
                  <div className="relative h-48 md:h-full min-h-[300px] bg-gray-200">
                    <img
                      src={artist.avatar || '/placeholder-avatar.svg'}
                      alt={artist.name ? `Portrait of ${artist.name}` : 'Artist'}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="md:col-span-2 p-4 md:p-8 flex flex-col justify-center">
                    <h3 className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-graphite mb-2 md:mb-3">
                      {artist.name}
                    </h3>
                    {artist.style && (
                      <p className="text-sm md:text-base text-mocha mb-2 md:mb-4 font-medium">
                        {artist.style}
                      </p>
                    )}
                    {artist.description && (
                      <p className="text-sm md:text-base text-mocha mb-4 md:mb-6 leading-relaxed whitespace-pre-line">
                        {artist.description}
                      </p>
                    )}
                    <div className="flex gap-3">
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
            ))
          )}
        </div>
      </div>

      {/* Lightbox – to darbo nuotraukos (slideris jei kelios) */}
      <AnimatePresence>
        {openWork && openWorkImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80"
            onClick={() => setLightboxWorkId(null)}
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
                  alt={(openWorkImages[lightboxImageIndex]?.alt || openWork.title || 'Work').trim() || 'Work'}
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
                onClick={() => setLightboxWorkId(null)}
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

