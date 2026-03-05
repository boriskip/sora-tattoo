'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { viewportSettings, buttonTransitionClass } from '@/utils/animations';
import { useMobileAnimation } from '@/hooks/useMobileAnimation';

type Work = { id: number; image: string; style?: string | null; title?: string | null };
type Artist = {
  id: number;
  slug: string;
  name: string;
  style: string | null;
  description: string | null;
  avatar: string | null;
  works: Work[];
};

export default function ArtistPageClient({
  artist,
  locale,
}: {
  artist: Artist;
  locale: string;
}) {
  const tCommon = useTranslations('common');
  const tArtists = useTranslations('artists');
  const { isMobile, prefersReducedMotion, getAnimationProps } = useMobileAnimation();
  const viewport = prefersReducedMotion
    ? viewportSettings.reduced
    : isMobile
      ? viewportSettings.mobile
      : viewportSettings.desktop;

  return (
    <>
      <Header />
      <section className="py-12 md:py-24 bg-background overflow-x-hidden w-full">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back link */}
          <motion.div
            className="mb-8 md:mb-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href={`/${locale}#masters`}
              className="text-mocha hover:text-graphite transition font-medium inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {tArtists('title')}
            </Link>
          </motion.div>

          {/* Artist card */}
          <motion.div
            className="bg-background border border-mocha/20 rounded-lg shadow-md overflow-hidden mb-12 md:mb-16"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="relative h-64 md:min-h-[320px] bg-mocha/10">
                <Image
                  src={artist.avatar || '/placeholder-avatar.svg'}
                  alt={artist.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="md:col-span-2 p-6 md:p-10 flex flex-col justify-center">
                <h1 className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-graphite mb-2">
                  {artist.name}
                </h1>
                {artist.style && (
                  <p className="text-mocha font-medium mb-4">{artist.style}</p>
                )}
                {artist.description && (
                  <p className="text-mocha leading-relaxed whitespace-pre-line">
                    {artist.description}
                  </p>
                )}
                <div className="mt-6">
                  <Link
                    href={`/${locale}${artist.slug ? `?artist=${artist.slug}` : ''}#contact`}
                    className={`inline-block px-6 py-2 bg-graphite text-white rounded-xl hover:opacity-95 font-medium shadow-sm ${buttonTransitionClass}`}
                  >
                    {tCommon('book')}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Works */}
          <motion.h2
            className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-graphite mb-6 text-center"
            {...getAnimationProps({
              initial: { opacity: 0, y: 10 },
              whileInView: { opacity: 1, y: 0 },
              transition: { duration: 0.5 },
            })}
            viewport={viewport}
          >
            {tCommon('works')}
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {artist.works?.map((work, index) => (
              <motion.div
                key={work.id}
                {...getAnimationProps({
                  initial: { opacity: 0, scale: 0.98, y: 10 },
                  whileInView: { opacity: 1, scale: 1, y: 0 },
                  transition: { delay: index * 0.05, duration: 0.45, ease: 'easeOut' },
                })}
                viewport={viewport}
                className="relative aspect-square overflow-hidden rounded-lg group"
              >
                <Image
                  src={work.image}
                  alt={work.title || `Work ${work.id}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </motion.div>
            ))}
          </div>

          {(!artist.works || artist.works.length === 0) && (
            <p className="text-mocha text-center py-8">{tCommon('works')}</p>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
