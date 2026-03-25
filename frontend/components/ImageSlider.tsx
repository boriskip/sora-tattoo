'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { buttonIconTransitionClass } from '@/utils/animations';

export type ImageSliderItem = { url: string; alt?: string };

interface ImageSliderProps {
  items: ImageSliderItem[];
  autoPlay?: boolean;
  interval?: number;
}

export default function ImageSlider({ items, autoPlay = true, interval = 5000 }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play with pause functionality
  useEffect(() => {
    if (!autoPlay || items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length, isPaused]);

  // Cleanup pause timeout on unmount
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  const pauseAutoPlay = () => {
    setIsPaused(true);
    // Clear existing timeout
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    // Resume auto-play after 10 seconds of inactivity
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 10000);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    pauseAutoPlay();
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    pauseAutoPlay();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    pauseAutoPlay();
  };

  if (items.length === 0) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const current = items[currentIndex];
  const altText = current?.alt?.trim() || `Slide ${currentIndex + 1}`;

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 group">
      <div className="relative w-full h-[400px] md:h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-full"
          >
            <Image
              src={current?.url ?? ''}
              alt={altText}
              fill
                className="object-cover pointer-events-none"
              priority={currentIndex === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 pointer-events-none">
                <p className="text-gray-500">Failed to load image</p>
              </div>
            )}
            {/* Label ant nuotraukos – stilius kaip header CTA mygtukas */}
            {current?.alt?.trim() && (
              <span
                className="absolute right-3 bottom-[27px] px-4 py-2 text-sm font-medium text-graphite bg-white/80 rounded-xl shadow-sm backdrop-blur-sm max-w-[85%] text-right font-serif"
                aria-hidden="true"
              >
                {current.alt.trim()}
              </span>
            )}
          </motion.div>
        </AnimatePresence>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToPrevious();
            }}
            type="button"
            className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 z-50 shadow-lg hover:scale-110 cursor-pointer pointer-events-auto ${buttonIconTransitionClass}`}
            aria-label="Previous image"
            style={{ zIndex: 50 }}
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToNext();
            }}
            type="button"
            className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 z-50 shadow-lg hover:scale-110 cursor-pointer pointer-events-auto ${buttonIconTransitionClass}`}
            aria-label="Next image"
            style={{ zIndex: 50 }}
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50 pointer-events-auto" style={{ zIndex: 50 }}>
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`h-2 rounded-full cursor-pointer pointer-events-auto ${buttonIconTransitionClass} ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

