'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import type { LegalData } from '@/lib/api';

type LegalType = 'impressum' | 'privacy';

type Props = { type: LegalType; data?: LegalData | null };

export default function LegalPageContent({ type, data }: Props) {
  const locale = useLocale();
  const t = useTranslations('legal');
  const titleFromApi = type === 'impressum' ? data?.impressum_title : data?.privacy_title;
  const contentFromApi = type === 'impressum' ? data?.impressum_content : data?.privacy_content;
  const title = (titleFromApi?.trim() || t(`${type}.title`)) as string;
  const content = (contentFromApi?.trim() || t(`${type}.content`)) as string;
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <article className="container mx-auto px-4 max-w-3xl pt-24 md:pt-28 pb-12 md:pb-20">
      <Link
        href={`/${locale}`}
        className="inline-block text-mocha hover:text-graphite text-sm mb-8 transition"
      >
        ← {locale === 'de' ? 'Zur Startseite' : locale === 'en' ? 'Back to home' : locale === 'ru' ? 'На главную' : 'Torna alla home'}
      </Link>
      <h1 className="font-serif text-[27px] leading-[36px] tracking-[0.2em] text-graphite mb-8">
        {title}
      </h1>
      <div className="text-mocha leading-relaxed space-y-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="whitespace-pre-line">{p}</p>
        ))}
      </div>
    </article>
  );
}
