import type { MetadataRoute } from 'next';
import { locales } from '@/i18n';
import { getApiUrl } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://soratattoo.de';

const staticPaths = ['', '/impressum', '/privacy'] as const;

async function getArtistSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${getApiUrl()}/artists?locale=de`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const artists = (json.data ?? []) as { slug?: string }[];
    return artists.map((a) => a.slug).filter((s): s is string => Boolean(s));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const artistSlugs = await getArtistSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.4,
      });
    }

    for (const slug of artistSlugs) {
      entries.push({
        url: `${SITE_URL}/${locale}/artists/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
