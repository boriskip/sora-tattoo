'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

export default function Hero() {
  const t = useTranslations('hero');
  const tCommon = useTranslations('common');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isContentVisible, setIsContentVisible] = useState(true);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Check initial scroll position on mount
  useEffect(() => {
    if (window.scrollY > 100) {
      setIsContentVisible(false);
    }
  }, []);

  // Listen to scroll progress changes
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest > 0.6) {
      setIsContentVisible(false);
    } else if (latest < 0.6 && window.scrollY < 100) {
      setIsContentVisible(true);
    }
  });

  // Background fades completely when About section covers it
  const backgroundOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  
  // Content (text and buttons) fades on scroll
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -40]);
  
  // Hide Hero completely if scrolled past it
  const heroOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);
  const [shouldBlockPointer, setShouldBlockPointer] = useState(false);

  // Update pointer events based on opacity
  useMotionValueEvent(heroOpacity, 'change', (latest) => {
    setShouldBlockPointer(latest < 0.1);
  });

  return (
    <>
      <motion.section
        ref={containerRef}
        className="fixed top-0 left-0 right-0 h-screen flex items-center justify-center overflow-hidden z-30 w-full"
        style={{
          opacity: heroOpacity,
          position: 'fixed',
          pointerEvents: shouldBlockPointer ? 'none' : 'auto'
        }}
      >
      {/* Background Image */}
      <motion.div 
        className="absolute inset-0"
        style={{
          opacity: backgroundOpacity,
          y: backgroundY
        }}
      >
        <Image
          src="/hero-background.png"
          alt="Sora Tattoo Background"
          fill
          priority
          quality={90}
          className="object-cover"
          style={{ objectPosition: 'center' }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/50" />
      </motion.div>

      {/* Content - fades on scroll */}
      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: isContentVisible ? 0 : 0, y: 30 }}
        animate={{ opacity: isContentVisible ? 1 : 0, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          opacity: isContentVisible ? contentOpacity : 0,
          y: contentY,
          pointerEvents: isContentVisible ? 'auto' : 'none'
        }}
      >
        {/* Title */}
        <motion.h1
          className="text-6xl md:text-8xl font-serif font-bold text-gray-900 mb-4 drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {t('title')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-gray-800 mb-6 font-serif drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {t('subtitle')}
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto drop-shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {t('description')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <button className="px-8 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition font-medium text-lg shadow-lg">
            {t('book')}
          </button>
          <button className="px-8 py-3 bg-white/90 text-gray-900 rounded-md hover:bg-white transition font-medium text-lg border border-gray-300 shadow-lg backdrop-blur-sm">
            {t('viewWorks')}
          </button>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          className="mt-12 flex justify-center space-x-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900 transition drop-shadow-sm"
            aria-label="Facebook"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a
            href="https://wa.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900 transition drop-shadow-sm"
            aria-label="WhatsApp"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900 transition drop-shadow-sm"
            aria-label="Instagram"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </motion.div>
        </motion.div>
      </motion.section>
      {/* Spacer to push content below */}
      <div className="h-screen" />
    </>
  );
}

