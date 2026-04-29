import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Artists from '@/components/Artists';
import Gallery from '@/components/Gallery';
import Styles from '@/components/Styles';
import Guides from '@/components/Guides';
import Reviews from '@/components/Reviews';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/lib/api';
import type { HeroSettings, AboutSection, Style, Review, Artist, Work, InfoData, ContactSettings } from '@/lib/api';

const revalidate = 60;

async function fetchHomeData(locale: string) {
  const apiUrl = getApiUrl();
  const [heroRes, aboutRes, stylesRes, reviewsRes, artistsRes, worksRes, infoRes, contactRes] = await Promise.allSettled([
    fetch(`${apiUrl}/hero-settings?locale=${locale}`, { next: { revalidate } }),
    fetch(`${apiUrl}/about?locale=${locale}`, { next: { revalidate } }),
    fetch(`${apiUrl}/styles?locale=${locale}`, { next: { revalidate } }),
    fetch(`${apiUrl}/reviews?locale=${locale}`, { cache: 'no-store' }),
    fetch(`${apiUrl}/artists?locale=${locale}`, { next: { revalidate } }),
    fetch(`${apiUrl}/works?locale=${locale}`, { next: { revalidate } }),
    fetch(`${apiUrl}/info?locale=${locale}`, { next: { revalidate } }),
    fetch(`${apiUrl}/contact-settings?locale=${locale}`, { next: { revalidate } }),
  ]);

  const hero: HeroSettings | null =
    heroRes.status === 'fulfilled' && heroRes.value.ok
      ? (await heroRes.value.json()).data
      : null;
  const about: AboutSection | null =
    aboutRes.status === 'fulfilled' && aboutRes.value.ok
      ? (await aboutRes.value.json()).data
      : null;
  const styles: Style[] =
    stylesRes.status === 'fulfilled' && stylesRes.value.ok
      ? (await stylesRes.value.json()).data ?? []
      : [];
  const rawReviews =
    reviewsRes.status === 'fulfilled' && reviewsRes.value.ok
      ? (await reviewsRes.value.json()).data ?? []
      : [];
  const reviews: Review[] = Array.isArray(rawReviews) ? rawReviews : Object.values(rawReviews ?? {});
  const artists: Artist[] =
    artistsRes.status === 'fulfilled' && artistsRes.value.ok
      ? (await artistsRes.value.json()).data ?? []
      : [];
  const works: Work[] =
    worksRes.status === 'fulfilled' && worksRes.value.ok
      ? (await worksRes.value.json()).data ?? []
      : [];
  const info: InfoData | null =
    infoRes.status === 'fulfilled' && infoRes.value.ok
      ? (await infoRes.value.json()).data ?? null
      : null;
  const contact: ContactSettings | null =
    contactRes.status === 'fulfilled' && contactRes.value.ok
      ? (await contactRes.value.json()).data ?? null
      : null;

  return { hero, about, styles, reviews, artists, works, info, contact };
}

type Props = { params: Promise<{ locale: string }> | { locale: string } };

export default async function HomePage({ params }: Props) {
  const { locale } = typeof (params as Promise<{ locale: string }>).then === 'function'
    ? await (params as Promise<{ locale: string }>)
    : (params as { locale: string });
  setRequestLocale(locale);

  const { hero, about, styles, reviews, artists, works, info, contact } = await fetchHomeData(locale);

  return (
    <main className="min-h-screen overflow-x-hidden w-full">
      <Header />
      <Hero data={hero} />
      <About data={about} />
      <Artists artists={artists} works={works} />
      <Gallery works={works} styles={styles} />
      {styles.length > 0 && <Styles data={styles} />}
      <Guides data={info} />
      <Reviews data={reviews} />
      <Contact contact={contact} hero={hero} styles={styles} />
      <Footer hero={hero} />
    </main>
  );
}

