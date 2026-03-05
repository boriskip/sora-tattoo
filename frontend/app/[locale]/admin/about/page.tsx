'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { adminFetch } from '@/lib/adminApi';
import type { AboutSection, AboutImageItem } from '@/lib/api';

const CONTENT_LOCALES = ['de', 'en', 'ru', 'it'] as const;

function normalizeAboutImages(images: AboutSection['images']): AboutImageItem[] {
  if (!images?.length) return [];
  return images.map((item) =>
    typeof item === 'string' ? { url: item, alt: '' } : { url: item.url, alt: item.alt ?? '' }
  );
}

export default function AdminAboutPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'de';
  const [editLocale, setEditLocale] = useState<(typeof CONTENT_LOCALES)[number]>('de');
  const [data, setData] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    title: '',
    content: '',
    images: [] as AboutImageItem[],
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [resImages, resText] = await Promise.all([
        adminFetch('/about?locale=de'),
        adminFetch(`/about?locale=${editLocale}`),
      ]);
      if (cancelled) return;
      if (!resImages.ok || !resText.ok) {
        setMessage({ type: 'err', text: 'Не удалось загрузить данные' });
        setLoading(false);
        return;
      }
      const aboutImages = (await resImages.json()).data as AboutSection | null;
      const about = (await resText.json()).data as AboutSection | null;
      if (about) {
        setData(about);
        setForm({
          title: about.title ?? '',
          content: about.content ?? '',
          images: normalizeAboutImages(aboutImages?.images ?? null),
        });
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [editLocale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await adminFetch('/about/upload-image', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMessage({ type: 'err', text: (err as { message?: string }).message || 'Ошибка загрузки файла.' });
        return;
      }
      const json = await res.json();
      const url = json.url as string;
      if (url) {
        setForm((prev) => ({ ...prev, images: [...prev.images, { url, alt: '' }] }));
        setMessage({ type: 'ok', text: 'Изображение добавлено. Нажмите «Сохранить».' });
      }
    } catch {
      setMessage({ type: 'err', text: 'Ошибка загрузки файла.' });
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setMessage(null);
  };

  const setImageAlt = (index: number, alt: string) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((item, i) => (i === index ? { ...item, alt } : item)),
    }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await adminFetch('/about', {
        method: 'PUT',
        body: JSON.stringify({
          locale: editLocale,
          title: form.title.trim() || null,
          content: form.content.trim() || null,
          images: form.images.length ? form.images.map((item) => ({ url: item.url, alt: item.alt ?? '' })) : null,
        }),
      });
      if (res.ok) {
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
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="font-serif text-2xl text-graphite mb-2">Блок «О нас»</h1>
        <p className="text-mocha text-sm mb-4">
          Изображения слайдера применяются ко всем языкам. Заголовок и текст — для выбранного языка.
        </p>

        <div className="flex gap-2 mb-6">
          <span className="text-sm font-medium text-graphite mr-1">Язык текста:</span>
          {CONTENT_LOCALES.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setEditLocale(loc)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                editLocale === loc ? 'bg-graphite text-white' : 'bg-gray-200 text-graphite hover:bg-gray-300'
              }`}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="about-title" className="block text-sm font-medium text-graphite mb-1">
              Заголовок
            </label>
            <input
              id="about-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Über uns"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="about-content" className="block text-sm font-medium text-graphite mb-1">
              Текст
            </label>
            <textarea
              id="about-content"
              name="content"
              rows={12}
              value={form.content}
              onChange={handleChange}
              placeholder="Основной текст секции…"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-graphite mb-1">
              Изображения слайдера (для всех языков)
            </label>
            <div className="flex flex-wrap gap-3 items-start">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-graphite text-white rounded-lg hover:opacity-90 disabled:opacity-50">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="sr-only"
                  disabled={uploadingImage}
                  onChange={handleImageUpload}
                />
                {uploadingImage ? 'Загрузка…' : 'Добавить изображение'}
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1 mb-2">
              JPEG, PNG или WebP, до 5 МБ. Укажите подпись (alt) для каждой — она отображается под фото и в атрибуте img для SEO.
            </p>
            {form.images.length > 0 && (
              <div className="space-y-3 mt-3">
                {form.images.map((item, index) => (
                  <div key={index} className="flex gap-3 items-start border border-gray-200 rounded-lg p-2 bg-white">
                    <div className="w-20 h-20 rounded overflow-hidden border border-gray-300 bg-gray-100 shrink-0">
                      <img src={item.url} alt={item.alt || ''} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-medium text-graphite mb-0.5">
                        Подпись / Alt (SEO)
                      </label>
                      <input
                        type="text"
                        value={item.alt ?? ''}
                        onChange={(e) => setImageAlt(index, e.target.value)}
                        placeholder="Краткое описание изображения"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-graphite focus:border-transparent"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-red-600 hover:underline text-sm shrink-0"
                      title="Удалить"
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-graphite text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Сохранение…' : 'Сохранить'}
            </button>
            <Link
              href={`/${locale}#about`}
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
