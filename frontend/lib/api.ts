const PRODUCTION_API = 'https://api.soratattoo.de/api';

/**
 * API base URL: server (API_URL in Docker) or client (NEXT_PUBLIC_API_URL).
 * In production (soratattoo.de) defaults to api.soratattoo.de when env is missing.
 */
export function getApiUrl(): string {
  const envUrl = typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL
    : (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL);
  if (envUrl) return envUrl;
  if (typeof window !== 'undefined' && typeof window.location?.hostname === 'string') {
    const h = window.location.hostname;
    if (h === 'soratattoo.de' || h === 'www.soratattoo.de') return PRODUCTION_API;
  }
  if (typeof process !== 'undefined' && process.env.VERCEL) return PRODUCTION_API;
  return 'http://localhost:8001/api';
}

export type HeroSettings = {
  id: number;
  locale?: string;
  background_image: string | null;
  social_icons_theme: 'light' | 'dark';
  title_main: string | null;
  title_sub: string | null;
  subtitle: string | null;
  description: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  whatsapp_url: string | null;
  block1_color: string | null;
  block2_color: string | null;
};

export type ContactSettings = {
  id: number;
  locale?: string;
  address: string | null;
  working_hours: string | null;
  phone: string | null;
  email: string | null;
};

export type LegalData = {
  id: number;
  locale?: string;
  impressum_title: string | null;
  impressum_content: string | null;
  privacy_title: string | null;
  privacy_content: string | null;
};

export type AboutImageItem = {
  url: string;
  alt?: string;
};

export type AboutSection = {
  id: number;
  locale?: string;
  title: string | null;
  content: string | null;
  /** Array of { url, alt } or legacy string[] (normalize when using) */
  images: AboutImageItem[] | string[] | null;
  sort_order: number;
};

export type InfoGuideImage = { url: string; alt: string | null };
export type InfoGuideItem = {
  slug: string;
  title: string;
  content: string | null;
  images: InfoGuideImage[];
};
export type InfoData = {
  title: string;
  guides: InfoGuideItem[];
};

/** Admin GET /info: section per locale, guides with translations + images (image = path or URL) */
export type AdminInfoSection = { id?: number; locale: string; title: string | null; sort_order?: number };
export type AdminInfoGuideTranslation = { locale: string; title: string | null; content: string | null };
export type AdminInfoGuideImageRow = { image: string; alt: string | null; sort_order?: number };
export type AdminInfoGuide = {
  id: number;
  slug: string;
  sort_order?: number;
  translations?: AdminInfoGuideTranslation[] | Record<string, { title?: string | null; content?: string | null }>;
  images?: AdminInfoGuideImageRow[] | { image: string; alt: string | null; sort_order?: number }[];
};
export type AdminInfoResponse = { sections: AdminInfoSection[]; guides: AdminInfoGuide[] };

/** Base URL for backend (no /api). Prefer NEXT_PUBLIC so SSR HTML works in browser. */
function getStorageBaseUrl(): string {
  const apiUrl = getApiUrl();
  return apiUrl.replace(/\/api\/?$/, '');
}

/** Build full URL for info image (backend may return path e.g. "info/xxx.jpg") */
export function getInfoImageUrl(image: string): string {
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return image;
  const base = getStorageBaseUrl();
  return `${base}/storage/${image.replace(/^\//, '')}`;
}

export type StyleImage = {
  id: number;
  image: string;
  sort_order: number;
};

export type Style = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  images: StyleImage[];
};

export type StyleTranslation = {
  locale: string;
  name: string;
  description: string | null;
};

/** Admin API returns styles with translations[] */
export type AdminStyle = Style & {
  translations?: StyleTranslation[];
};

export type Review = {
  id: number;
  author: string;
  email?: string | null;
  text: string;
  rating: number;
  status?: string;
  locale?: string;
  created_at?: string;
  updated_at?: string;
};

export type WorkImage = {
  id: number;
  work_id: number;
  image: string;
  alt: string | null;
  sort_order: number;
  translations?: { locale: string; alt: string | null }[];
};

export type Work = {
  id: number;
  artist_id: number;
  style: string | null;
  title: string | null;
  sort_order: number;
  artist?: Artist;
  images?: WorkImage[];
  translations?: { locale: string; title: string | null }[];
};

/** Pirmas paveikslas darbo thumbnail / grid. */
export function getWorkFirstImage(work: Work): string | null {
  if (work.images?.length) return work.images[0].image;
  return null;
}

/** Pirmo paveikslo alt arba work.title. */
export function getWorkFirstAlt(work: Work): string {
  if (work.images?.length && (work.images[0].alt ?? work.title)) {
    return (work.images[0].alt || work.title || '').trim() || `Work ${work.id}`;
  }
  return (work.title || `Work ${work.id}`).trim();
}

export type Artist = {
  id: number;
  slug: string;
  name: string;
  style: string | null;
  description: string | null;
  avatar: string | null;
  sort_order: number;
  works?: Work[];
  translations?: { locale: string; name: string; style: string | null; description: string | null }[];
};
