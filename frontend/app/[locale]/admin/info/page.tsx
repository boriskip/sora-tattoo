'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { adminFetch } from '@/lib/adminApi';
import {
  getInfoImageUrl,
  type AdminInfoResponse,
  type AdminInfoSection,
  type AdminInfoGuide,
  type AdminInfoGuideImageRow,
} from '@/lib/api';

const LOCALES = ['de', 'en', 'ru', 'it'] as const;

type GuideForm = {
  id: number;
  slug: string;
  sort_order: number;
  translations: Record<string, { title: string; content: string }>;
  images: { image: string; alt: string }[];
};

function emptyTranslations(): Record<string, { title: string; content: string }> {
  return { de: { title: '', content: '' }, en: { title: '', content: '' }, ru: { title: '', content: '' }, it: { title: '', content: '' } };
}

function newGuideForm(sortOrder: number): GuideForm {
  return {
    id: 0,
    slug: '',
    sort_order: sortOrder,
    translations: emptyTranslations(),
    images: [],
  };
}

function normalizeSections(sections: AdminInfoSection[] | undefined): Record<string, string> {
  const out: Record<string, string> = { de: '', en: '', ru: '', it: '' };
  if (!sections?.length) return out;
  for (const s of sections) {
    if (LOCALES.includes(s.locale as (typeof LOCALES)[number])) {
      out[s.locale] = s.title ?? '';
    }
  }
  return out;
}

function normalizeGuide(g: AdminInfoGuide): GuideForm {
  const translations: Record<string, { title: string; content: string }> = {};
  for (const loc of LOCALES) {
    translations[loc] = { title: '', content: '' };
  }
  const tr = g.translations;
  if (Array.isArray(tr)) {
    for (const t of tr) {
      if (LOCALES.includes(t.locale as (typeof LOCALES)[number])) {
        translations[t.locale] = {
          title: t.title ?? '',
          content: t.content ?? '',
        };
      }
    }
  } else if (tr && typeof tr === 'object') {
    for (const loc of LOCALES) {
      const t = tr[loc];
      if (t) {
        translations[loc] = {
          title: t.title ?? '',
          content: t.content ?? '',
        };
      }
    }
  }
  const images: { image: string; alt: string }[] = [];
  const imgs = g.images ?? [];
  for (const img of imgs) {
    images.push({
      image: (img as AdminInfoGuideImageRow).image,
      alt: (img as AdminInfoGuideImageRow).alt ?? '',
    });
  }
  return {
    id: g.id,
    slug: g.slug,
    sort_order: g.sort_order ?? 0,
    translations,
    images,
  };
}

export default function AdminInfoPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'de';
  const [sectionTitles, setSectionTitles] = useState<Record<string, string>>({
    de: '',
    en: '',
    ru: '',
    it: '',
  });
  const [guides, setGuides] = useState<GuideForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminFetch('/info')
      .then((res) => {
        if (cancelled) return;
        if (!res.ok) {
          setMessage({ type: 'err', text: 'Не удалось загрузить данные' });
          setLoading(false);
          return;
        }
        return res.json();
      })
      .then((json) => {
        if (cancelled || !json?.data) {
          setLoading(false);
          return;
        }
        const data = json.data as AdminInfoResponse;
        setSectionTitles(normalizeSections(data.sections));
        setGuides((data.guides ?? []).map(normalizeGuide));
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setMessage({ type: 'err', text: 'Ошибка загрузки' });
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const setSectionTitle = (loc: string, value: string) => {
    setSectionTitles((prev) => ({ ...prev, [loc]: value }));
    setMessage(null);
  };

  const setGuideTranslation = (
    guideIndex: number,
    loc: string,
    field: 'title' | 'content',
    value: string
  ) => {
    setGuides((prev) =>
      prev.map((g, i) =>
        i === guideIndex
          ? {
              ...g,
              translations: {
                ...g.translations,
                [loc]: { ...g.translations[loc], [field]: value },
              },
            }
          : g
      )
    );
    setMessage(null);
  };

  const addImageToGuide = (guideIndex: number, image: string, alt: string) => {
    setGuides((prev) =>
      prev.map((g, i) =>
        i === guideIndex ? { ...g, images: [...g.images, { image, alt }] } : g
      )
    );
    setMessage(null);
  };

  const removeImageFromGuide = (guideIndex: number, imageIndex: number) => {
    setGuides((prev) =>
      prev.map((g, i) =>
        i === guideIndex ? { ...g, images: g.images.filter((_, j) => j !== imageIndex) } : g
      )
    );
    setMessage(null);
  };

  const addGuide = () => {
    setGuides((prev) => [...prev, newGuideForm(prev.length)]);
    setMessage(null);
  };

  const removeGuide = (guideIndex: number) => {
    setGuides((prev) => prev.filter((_, i) => i !== guideIndex));
    setMessage(null);
  };

  const setGuideSlug = (guideIndex: number, slug: string) => {
    setGuides((prev) =>
      prev.map((g, i) => (i === guideIndex ? { ...g, slug } : g))
    );
    setMessage(null);
  };

  const setGuideImageAlt = (guideIndex: number, imageIndex: number, alt: string) => {
    setGuides((prev) =>
      prev.map((g, i) =>
        i === guideIndex
          ? {
              ...g,
              images: g.images.map((img, j) => (j === imageIndex ? { ...img, alt } : img)),
            }
          : g
      )
    );
    setMessage(null);
  };

  const handleUpload = async (guideIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFor(guideIndex);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await adminFetch('/info/upload-image', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMessage({
          type: 'err',
          text: (err as { message?: string }).message || 'Ошибка загрузки.',
        });
        return;
      }
      const json = await res.json();
      const path = (json.path ?? json.url) as string;
      const url = path ? (path.startsWith('http') ? path : getInfoImageUrl(path)) : json.url;
      const imageValue = json.path ?? json.url ?? url;
      addImageToGuide(guideIndex, imageValue, '');
      setMessage({ type: 'ok', text: 'Изображение добавлено. Нажмите «Сохранить».' });
    } catch {
      setMessage({ type: 'err', text: 'Ошибка загрузки.' });
    } finally {
      setUploadingFor(null);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        sections: LOCALES.map((loc) => ({
          locale: loc,
          title: sectionTitles[loc]?.trim() || null,
        })),
        guides: guides.map((g) => ({
          id: g.id > 0 ? g.id : undefined,
          slug: g.slug.trim() || `guide-${Date.now()}`,
          sort_order: g.sort_order,
          translations: LOCALES.reduce(
            (acc, loc) => {
              acc[loc] = {
                title: g.translations[loc]?.title?.trim() || null,
                content: g.translations[loc]?.content ?? null,
              };
              return acc;
            },
            {} as Record<string, { title: string | null; content: string | null }>
          ),
          images: g.images.map((img, idx) => ({
            image: img.image,
            alt: img.alt?.trim() || null,
            sort_order: idx,
          })),
        })),
      };
      const res = await adminFetch('/info', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json().catch(() => null);
        if (json?.data?.guides) {
          setGuides((json.data as AdminInfoResponse).guides.map(normalizeGuide));
        }
        setMessage({ type: 'ok', text: 'Сохранено.' });
      } else {
        setMessage({ type: 'err', text: 'Ошибка сохранения.' });
      }
    } catch {
      setMessage({ type: 'err', text: 'Ошибка сохранения.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-graphite/5 flex items-center justify-center">
        <p className="text-mocha">Загрузка…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-graphite/5">
      <header className="bg-graphite text-white py-4 px-6 flex justify-between items-center">
        <span className="font-serif text-xl tracking-wide">Sora Tattoo Admin</span>
        <Link
          href={`/${locale}/admin`}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition"
        >
          ← Панель
        </Link>
      </header>
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="font-serif text-2xl text-graphite mb-2">Блок «Information» (Guides)</h1>
        <p className="text-mocha text-sm mb-6">
          Заголовок секции и тексты гайдов по языкам. Изображения и подписи (alt) для каждого гайда.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="font-medium text-graphite mb-3">Заголовок секции</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LOCALES.map((loc) => (
                <div key={loc}>
                  <label className="block text-xs font-medium text-graphite mb-1">{loc.toUpperCase()}</label>
                  <input
                    type="text"
                    value={sectionTitles[loc] ?? ''}
                    onChange={(e) => setSectionTitle(loc, e.target.value)}
                    placeholder="Information"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          <h2 className="font-medium text-graphite mb-3">Гайды</h2>

          {guides.map((guide, guideIndex) => (
            <div key={guide.id || `new-${guideIndex}`} className="border border-gray-200 rounded-xl p-4 bg-white space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="font-medium text-graphite">
                  {guide.translations[locale]?.title?.trim() ||
                    guide.translations.de?.title?.trim() ||
                    guide.translations.en?.title?.trim() ||
                    guide.slug ||
                    '(новый гайд)'}
                </h2>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-graphite">
                    Slug:
                    <input
                      type="text"
                      value={guide.slug}
                      onChange={(e) => setGuideSlug(guideIndex, e.target.value)}
                      placeholder="my-guide"
                      className="ml-1 px-2 py-1 border border-gray-300 rounded text-sm w-32"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeGuide(guideIndex)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium"
                  >
                    Удалить
                  </button>
                </div>
              </div>

              {LOCALES.map((loc) => (
                <div key={loc} className="border-b border-gray-100 pb-3 last:border-0">
                  <span className="text-xs font-medium text-graphite">{loc.toUpperCase()}</span>
                  <div className="mt-1">
                    <input
                      type="text"
                      value={guide.translations[loc]?.title ?? ''}
                      onChange={(e) => setGuideTranslation(guideIndex, loc, 'title', e.target.value)}
                      placeholder="Заголовок"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite text-sm mb-2"
                    />
                    <textarea
                      value={guide.translations[loc]?.content ?? ''}
                      onChange={(e) => setGuideTranslation(guideIndex, loc, 'content', e.target.value)}
                      placeholder="Текст"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite text-sm"
                    />
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-graphite mb-2">Изображения</label>
                <div className="flex flex-wrap gap-2 items-center mb-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-graphite text-white rounded-lg hover:opacity-90 disabled:opacity-50 text-sm">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      className="sr-only"
                      disabled={uploadingFor !== null}
                      onChange={(e) => handleUpload(guideIndex, e)}
                    />
                    {uploadingFor === guideIndex ? 'Загрузка…' : 'Добавить изображение'}
                  </label>
                </div>
                {guide.images.length > 0 && (
                  <div className="space-y-2">
                    {guide.images.map((img, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="flex gap-3 items-start border border-gray-200 rounded-lg p-2 bg-gray-50"
                      >
                        <div className="w-16 h-16 rounded overflow-hidden border border-gray-300 shrink-0 bg-white">
                          <img
                            src={
                              img.image.startsWith('http')
                                ? img.image
                                : img.image.startsWith('/')
                                  ? img.image
                                  : getInfoImageUrl(img.image)
                            }
                            alt={img.alt || ''}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="block text-xs font-medium text-graphite mb-0.5">Alt (SEO)</label>
                          <input
                            type="text"
                            value={img.alt}
                            onChange={(e) => setGuideImageAlt(guideIndex, imgIndex, e.target.value)}
                            placeholder="Описание"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-graphite"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImageFromGuide(guideIndex, imgIndex)}
                          className="text-red-600 hover:underline text-sm shrink-0"
                        >
                          Удалить
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addGuide}
            className="mb-6 px-4 py-2 bg-graphite text-white rounded-lg text-sm font-medium hover:opacity-90"
          >
            + Добавить гайд
          </button>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-graphite text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Сохранение…' : 'Сохранить'}
            </button>
            <Link
              href={`/${locale}#info`}
              className="px-6 py-2 border border-graphite text-graphite rounded-lg font-medium hover:bg-graphite/5"
            >
              На сайт
            </Link>
          </div>
          {message && (
            <p
              className={`text-sm px-3 py-2 rounded-lg ${
                message.type === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {message.text}
            </p>
          )}
        </form>
      </main>
    </div>
  );
}
