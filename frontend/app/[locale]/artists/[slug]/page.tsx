import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import ArtistPageClient from '@/components/ArtistPageClient';

// Server-side: use API_URL in Docker (backend:8000), else localhost for host-run dev
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function ArtistPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!locales.includes(locale as any)) notFound();

  setRequestLocale(locale);

  const res = await fetch(`${API_URL}/artists/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) notFound();

  const json = await res.json();
  const artist = json.data;

  return (
    <main className="min-h-screen overflow-x-hidden w-full">
      <ArtistPageClient artist={artist} locale={locale} />
    </main>
  );
}
