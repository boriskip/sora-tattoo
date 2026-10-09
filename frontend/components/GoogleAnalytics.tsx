'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

const STORAGE_KEY = 'sora-analytics-consent';
const MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-NEZ53SK4ZT';

type Consent = 'unknown' | 'granted' | 'denied';

function readConsent(): Consent {
  if (typeof window === 'undefined') return 'unknown';
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === 'granted' || v === 'denied') return v;
  return 'unknown';
}

export default function GoogleAnalytics() {
  const t = useTranslations('cookieConsent');
  const locale = useLocale();
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent>('unknown');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
  }, []);

  if (!MEASUREMENT_ID || pathname?.includes('/admin')) {
    return null;
  }

  function grant() {
    localStorage.setItem(STORAGE_KEY, 'granted');
    setConsent('granted');
  }

  function deny() {
    localStorage.setItem(STORAGE_KEY, 'denied');
    setConsent('denied');
  }

  return (
    <>
      {consent === 'granted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${MEASUREMENT_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {ready && consent === 'unknown' && (
        <div
          role="dialog"
          aria-label={t('title')}
          className="fixed bottom-0 inset-x-0 z-[100] p-4 sm:p-6"
        >
          <div className="mx-auto max-w-3xl rounded-sm border border-[#e8e0d8] bg-[var(--background)] px-5 py-4 shadow-lg sm:px-6">
            <p className="font-serif text-[var(--graphite)] text-base sm:text-lg mb-2">
              {t('title')}
            </p>
            <p className="text-sm sm:text-base text-[var(--mocha)] mb-4 leading-relaxed">
              {t('body')}{' '}
              <Link
                href={`/${locale}/privacy`}
                className="underline underline-offset-2 hover:text-[var(--graphite)]"
              >
                {t('privacyLink')}
              </Link>
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={grant}
                className="bg-[var(--graphite)] text-white px-5 py-2 text-sm tracking-wide hover:opacity-90"
              >
                {t('accept')}
              </button>
              <button
                type="button"
                onClick={deny}
                className="border border-[var(--graphite)] text-[var(--graphite)] px-5 py-2 text-sm tracking-wide hover:bg-[var(--graphite)]/5"
              >
                {t('decline')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
