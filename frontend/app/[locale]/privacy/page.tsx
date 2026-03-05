import { setRequestLocale } from 'next-intl/server';
import { getApiUrl } from '@/lib/api';
import type { HeroSettings, LegalData } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LegalPageContent from '@/components/LegalPageContent';

type Props = { params: Promise<{ locale: string }> | { locale: string } };

export default async function PrivacyPage({ params }: Props) {
  const { locale } = typeof (params as Promise<{ locale: string }>).then === 'function'
    ? await (params as Promise<{ locale: string }>)
    : (params as { locale: string });
  setRequestLocale(locale);

  const apiUrl = getApiUrl();
  let hero: HeroSettings | null = null;
  let legal: LegalData | null = null;
  try {
    const [heroRes, legalRes] = await Promise.all([
      fetch(`${apiUrl}/hero-settings?locale=${locale}`, { next: { revalidate: 60 } }),
      fetch(`${apiUrl}/legal?locale=${locale}`, { next: { revalidate: 60 } }),
    ]);
    if (heroRes.ok) {
      const json = await heroRes.json();
      hero = json.data ?? null;
    }
    if (legalRes.ok) {
      const json = await legalRes.json();
      legal = json.data ?? null;
    }
  } catch {
    // ignore
  }

  return (
    <main className="min-h-screen overflow-x-hidden w-full bg-background">
      <Header />
      <LegalPageContent type="privacy" data={legal} />
      <Footer hero={hero} />
    </main>
  );
}
