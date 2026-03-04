'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { useMobileAnimation } from '@/hooks/useMobileAnimation';
import { viewportSettings } from '@/utils/animations';

// Mažas thumbnail slideris – 2–3 nuotraukos, horizontalus scroll arba rodyklės
function ThumbnailSlider({ images }: { images: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) return null;

  const scroll = (dir: number) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    el.scrollBy({ left: dir * (el.offsetWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <div className="mt-4 pt-4 border-t border-mocha/20">
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide py-1"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-[140px] h-[100px] md:w-[160px] md:h-[112px] rounded-lg overflow-hidden bg-mocha/10"
              style={{ scrollSnapAlign: 'start' }}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-graphite hover:bg-white transition"
              aria-label="Previous"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-graphite hover:bg-white transition"
              aria-label="Next"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Guides() {
  const t = useTranslations('guides');
  const tCommon = useTranslations('common');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { isMobile, prefersReducedMotion, getAnimationProps } = useMobileAnimation();
  
  const viewport = prefersReducedMotion
    ? viewportSettings.reduced
    : isMobile
    ? viewportSettings.mobile
    : viewportSettings.desktop;

  // Kiekvienam punktui 2–3 nuotraukos (galite pakeisti į /info/... kai bus medžiagos)
  const guides = [
    {
      id: 'chooseArtist',
      titleKey: 'chooseArtist.title',
      contentKey: 'chooseArtist.content',
      images: ['/about/uberuns-1.png', '/about/uberuns-2.png', '/about/uberuns-3.png'],
    },
    {
      id: 'prepare',
      titleKey: 'prepare.title',
      contentKey: 'prepare.content',
      images: ['/about/uberuns-4.png', '/about/uberuns-5.png', '/about/uberuns-6.png'],
    },
    {
      id: 'session',
      titleKey: 'session.title',
      contentKey: 'session.content',
      images: ['/about/uberuns-7.png', '/about/uberuns-8.png', '/about/uberuns-9.png'],
    },
    {
      id: 'aftercare',
      titleKey: 'aftercare.title',
      contentKey: 'aftercare',
      images: ['/about/uberuns-10.png', '/about/uberuns-1.png', '/about/uberuns-2.png'],
    },
  ];

  const toggleGuide = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const renderAftercareContent = () => {
    return (
      <div className="space-y-6">
        <p className="text-mocha leading-relaxed whitespace-pre-line">
          {t('aftercare.intro')}
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-graphite mb-2">
              {t('aftercare.method1.title')}
            </h4>
            <p className="text-mocha mb-3">
              {t('aftercare.method1.description')}
            </p>
            <ul className="list-disc list-inside space-y-1 text-mocha ml-4">
              {t.raw('aftercare.method1.steps').map((step: string, i: number) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
            <p className="text-mocha mt-3 whitespace-pre-line">
              {t('aftercare.method1.afterRemoval')}
            </p>
          </div>

          <div>
            <h4 className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-graphite mb-2">
              {t('aftercare.method2.title')}
            </h4>
            <p className="text-mocha mb-3">
              {t('aftercare.method2.description')}
            </p>
            <ul className="list-disc list-inside space-y-1 text-mocha ml-4">
              {t.raw('aftercare.method2.steps').map((step: string, i: number) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
            <p className="text-mocha mt-3 whitespace-pre-line">
              {t('aftercare.method2.followingDays')}
            </p>
          </div>

          <div>
            <h4 className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-graphite mb-2">
              {t('aftercare.important.title')}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-mocha ml-4">
              {t.raw('aftercare.important.points').map((point: string, i: number) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-graphite mb-2">
              {t('aftercare.healing.title')}
            </h4>
            <p className="text-mocha whitespace-pre-line">
              {t('aftercare.healing.content')}
            </p>
          </div>

          <p className="text-mocha whitespace-pre-line">
            {t('aftercare.support')}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section id="info" className="py-12 md:py-32 bg-background overflow-x-hidden w-full">
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
          {tCommon('info')}
        </motion.h2>

        <div className="max-w-4xl mx-auto space-y-4">
          {guides.map((guide, index) => (
            <motion.div
              key={guide.id}
              {...getAnimationProps({
                initial: { opacity: 0, y: 10 },
                whileInView: { opacity: 1, y: 0 },
                transition: { delay: index * 0.1, duration: 0.6 },
              })}
              viewport={viewport}
              className="bg-background rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleGuide(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-mocha/5 transition"
              >
                <h3 className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-graphite">
                  {t(guide.titleKey)}
                </h3>
                <svg
                  className={`w-5 h-5 text-mocha transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.35,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 border-t border-mocha/20">
                      {guide.id === 'aftercare' ? (
                        renderAftercareContent()
                      ) : (
                        <p className="text-mocha leading-relaxed whitespace-pre-line">
                          {t(guide.contentKey)}
                        </p>
                      )}
                      <ThumbnailSlider images={guide.images} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

