'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useMobileAnimation } from '@/hooks/useMobileAnimation';
import { viewportSettings } from '@/utils/animations';

export default function Gallery() {
  const tCommon = useTranslations('common');
  const tGallery = useTranslations('gallery');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const { isMobile, prefersReducedMotion, getAnimationProps } = useMobileAnimation();
  
  const viewport = prefersReducedMotion
    ? viewportSettings.reduced
    : isMobile
    ? viewportSettings.mobile
    : viewportSettings.desktop;

  // Mock data - works
  const works = [
    { id: 1, image: '/placeholder-work.svg', artist: 'artist-01', style: 'japanese' },
    { id: 2, image: '/placeholder-work.svg', artist: 'artist-02', style: 'realism' },
    { id: 3, image: '/placeholder-work.svg', artist: 'artist-03', style: 'minimal' },
    { id: 4, image: '/placeholder-work.svg', artist: 'artist-01', style: 'japanese' },
    { id: 5, image: '/placeholder-work.svg', artist: 'artist-02', style: 'graphic' },
    { id: 6, image: '/placeholder-work.svg', artist: 'artist-03', style: 'minimal' },
    { id: 7, image: '/placeholder-work.svg', artist: 'artist-01', style: 'japanese' },
    { id: 8, image: '/placeholder-work.svg', artist: 'artist-02', style: 'realism' },
    { id: 9, image: '/placeholder-work.svg', artist: 'artist-03', style: 'minimal' },
  ];

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

  return (
    <section id="works" className="py-12 md:py-32 bg-white overflow-x-hidden w-full">
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
          {tCommon('works')}
        </motion.h2>

        {/* Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-6 md:mb-12"
          {...getAnimationProps({
            initial: { opacity: 0, y: 20 },
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
              className={`px-6 py-2 rounded-md transition cursor-pointer ${
                selectedFilter === filter.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              {...getAnimationProps({
                initial: { opacity: 0, scale: 0.9, y: 20 },
                whileInView: { opacity: 1, scale: 1, y: 0 },
                transition: { delay: index * 0.05, duration: 0.5, ease: 'easeOut' },
              })}
              viewport={viewport}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
            >
              <Image
                src={work.image}
                alt={`Work ${work.id}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

