'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useMobileAnimation } from '@/hooks/useMobileAnimation';
import { viewportSettings } from '@/utils/animations';

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

  const guides = [
    {
      id: 'chooseArtist',
      titleKey: 'chooseArtist.title',
      contentKey: 'chooseArtist.content'
    },
    {
      id: 'prepare',
      titleKey: 'prepare.title',
      contentKey: 'prepare.content'
    },
    {
      id: 'session',
      titleKey: 'session.title',
      contentKey: 'session.content'
    },
    {
      id: 'aftercare',
      titleKey: 'aftercare.title',
      contentKey: 'aftercare'
    }
  ];

  const toggleGuide = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const renderAftercareContent = () => {
    return (
      <div className="space-y-6">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {t('aftercare.intro')}
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {t('aftercare.method1.title')}
            </h4>
            <p className="text-gray-700 mb-3">
              {t('aftercare.method1.description')}
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              {t.raw('aftercare.method1.steps').map((step: string, i: number) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
            <p className="text-gray-700 mt-3 whitespace-pre-line">
              {t('aftercare.method1.afterRemoval')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {t('aftercare.method2.title')}
            </h4>
            <p className="text-gray-700 mb-3">
              {t('aftercare.method2.description')}
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              {t.raw('aftercare.method2.steps').map((step: string, i: number) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
            <p className="text-gray-700 mt-3 whitespace-pre-line">
              {t('aftercare.method2.followingDays')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {t('aftercare.important.title')}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              {t.raw('aftercare.important.points').map((point: string, i: number) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {t('aftercare.healing.title')}
            </h4>
            <p className="text-gray-700 whitespace-pre-line">
              {t('aftercare.healing.content')}
            </p>
          </div>

          <p className="text-gray-700 whitespace-pre-line">
            {t('aftercare.support')}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section id="info" className="py-12 md:py-32 bg-gray-50 overflow-x-hidden w-full">
      <div className="container mx-auto px-4 max-w-full">
        <motion.h2
          className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 md:mb-12 text-center"
          {...getAnimationProps({
            initial: { opacity: 0, y: 20 },
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
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                transition: { delay: index * 0.1, duration: 0.6 },
              })}
              viewport={viewport}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleGuide(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <h3 className="text-xl font-serif font-semibold text-gray-900">
                  {t(guide.titleKey)}
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 border-t border-gray-200">
                      {guide.id === 'aftercare' ? (
                        renderAftercareContent()
                      ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {t(guide.contentKey)}
                        </p>
                      )}
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

