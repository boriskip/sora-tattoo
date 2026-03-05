'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useMobileAnimation } from '@/hooks/useMobileAnimation';
import { viewportSettings } from '@/utils/animations';
import { buttonIconTransitionClass, buttonTransitionClass } from '@/utils/animations';
import type { InfoData, InfoGuideImage } from '@/lib/api';
import { getInfoImageUrl } from '@/lib/api';

function normalizeImageSrc(url: string): string {
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return getInfoImageUrl(url);
}

// Mažas thumbnail slideris – rodyklės tik kai yra overflow (scrollWidth > clientWidth)
function ThumbnailSlider({ images }: { images: (string | InfoGuideImage)[] }) {
  const items = images.map((img) => {
    const url = typeof img === 'string' ? img : img.url;
    const alt = typeof img === 'string' ? '' : (img.alt ?? '');
    return { url: normalizeImageSrc(url), alt };
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showNavButtons, setShowNavButtons] = useState(false);

  const checkOverflow = () => {
    const el = scrollRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth;
    const manyImages = images.length >= 4;
    setShowNavButtons(overflow || manyImages);
  };

  useEffect(() => {
    checkOverflow();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => checkOverflow());
    ro.observe(el);
    const t1 = setTimeout(checkOverflow, 150);
    const t2 = setTimeout(checkOverflow, 500);
    const t3 = setTimeout(checkOverflow, 1200);
    return () => {
      ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [items.length]);

  if (items.length === 0) return null;

  const scroll = (dir: number) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    el.scrollBy({ left: dir * (el.offsetWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <div className="mt-4 pt-4 border-t border-mocha/20">
      <div className="relative pt-2 pb-2">
        <div
          ref={scrollRef}
className="flex gap-3 overflow-x-auto overflow-y-visible scroll-smooth scrollbar-hide py-2 pl-4 pr-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-[140px] h-[100px] md:w-[160px] md:h-[112px] rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="w-full h-full rounded-lg overflow-hidden bg-mocha/10 relative">
                <img
                  src={item.url}
                  alt={item.alt || ''}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
        {showNavButtons && (
          <>
            <button
              type="button"
              onClick={() => scroll(-1)}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-graphite hover:bg-white ${buttonIconTransitionClass}`}
              aria-label="Previous"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-graphite hover:bg-white ${buttonIconTransitionClass}`}
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

type GuidesProps = { data?: InfoData | null };

export default function Guides({ data }: GuidesProps) {
  const t = useTranslations('guides');
  const tCommon = useTranslations('common');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { isMobile, prefersReducedMotion, getAnimationProps } = useMobileAnimation();
  
  const viewport = prefersReducedMotion
    ? viewportSettings.reduced
    : isMobile
    ? viewportSettings.mobile
    : viewportSettings.desktop;

  const useApiData = data?.guides?.length;

  // Fallback: kai nėra API duomenų
  const fallbackGuides = [
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

  const guidesFromApi = data?.guides ?? [];
  const guides = useApiData
    ? guidesFromApi.map((g) => ({
        id: g.slug,
        title: g.title,
        content: g.content,
        images: g.images,
      }))
    : fallbackGuides;

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
          {useApiData ? data!.title : tCommon('info')}
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
              className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <button
                onClick={() => toggleGuide(index)}
                className={`w-full px-6 py-4 flex items-center justify-between text-left hover:bg-mocha/5 ${buttonTransitionClass}`}
              >
                <h3 className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-graphite">
                  {useApiData ? (guide as { title: string }).title : t((guide as { titleKey: string }).titleKey)}
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
                      {useApiData ? (
                        (guide as { content: string | null }).content != null && (
                          <p className="text-mocha leading-relaxed whitespace-pre-line">
                            {(guide as { content: string }).content}
                          </p>
                        )
                      ) : (guide as { id: string }).id === 'aftercare' ? (
                        renderAftercareContent()
                      ) : (
                        <p className="text-mocha leading-relaxed whitespace-pre-line">
                          {t((guide as { contentKey: string }).contentKey)}
                        </p>
                      )}
                      <ThumbnailSlider
                        images={
                          useApiData
                            ? (guide as { images: InfoGuideImage[] }).images
                            : (guide as { images: string[] }).images
                        }
                      />
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

