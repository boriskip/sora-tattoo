'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { adminFetch } from '@/lib/adminApi';
import type { HeroSettings } from '@/lib/api';

const DEFAULT_BLOCK1_COLOR = '#232323';
const DEFAULT_BLOCK2_COLOR = '#675d54';

const COLOR_PALETTE = [
  '#232323',
  '#675d54',
  '#000000',
  '#ffffff',
  '#2c2c2c',
  '#4a4a4a',
  '#8b7355',
  '#c4b5a5',
];

export default function AdminHeroPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'de';
  const CONTENT_LOCALES = ['de', 'en', 'ru', 'it'] as const;
  const [editLocale, setEditLocale] = useState<(typeof CONTENT_LOCALES)[number]>('de');
  const [data, setData] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [uploadingBg, setUploadingBg] = useState(false);

  const [form, setForm] = useState({
    background_image: '',
    social_icons_theme: 'light' as 'light' | 'dark',
    title_main: '',
    title_sub: '',
    subtitle: '',
    description: '',
    facebook_url: '',
    instagram_url: '',
    whatsapp_url: '',
    block1_color: '',
    block2_color: '',
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [resVisual, resText] = await Promise.all([
        adminFetch('/hero-settings?locale=de'),
        adminFetch(`/hero-settings?locale=${editLocale}`),
      ]);
      if (cancelled) return;
      if (!resVisual.ok || !resText.ok) {
        setMessage({ type: 'err', text: 'Не удалось загрузить данные' });
        setLoading(false);
        return;
      }
      const visual = (await resVisual.json()).data as HeroSettings | null;
      const hero = (await resText.json()).data as HeroSettings | null;
      if (hero) {
        setData(hero);
        setForm({
          background_image: (visual ?? hero).background_image ?? '',
          social_icons_theme: ((visual ?? hero).social_icons_theme as 'light' | 'dark') || 'light',
          title_main: hero.title_main ?? '',
          title_sub: hero.title_sub ?? '',
          subtitle: hero.subtitle ?? '',
          description: hero.description ?? '',
          facebook_url: hero.facebook_url ?? '',
          instagram_url: hero.instagram_url ?? '',
          whatsapp_url: hero.whatsapp_url ?? '',
          block1_color: (visual ?? hero).block1_color ?? DEFAULT_BLOCK1_COLOR,
          block2_color: (visual ?? hero).block2_color ?? DEFAULT_BLOCK2_COLOR,
        });
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [editLocale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBg(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('background', file);
      const res = await adminFetch('/hero-settings/upload-background', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMessage({ type: 'err', text: err.message || 'Ошибка загрузки файла.' });
        return;
      }
      const json = await res.json();
      const url = json.url as string;
      if (url) {
        setForm((prev) => ({ ...prev, background_image: url }));
        setMessage({ type: 'ok', text: 'Изображение загружено. Нажмите «Сохранить».' });
      }
    } catch {
      setMessage({ type: 'err', text: 'Ошибка загрузки файла.' });
    } finally {
      setUploadingBg(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await adminFetch('/hero-settings', {
        method: 'PUT',
        body: JSON.stringify({
          locale: editLocale,
          background_image: form.background_image || null,
          social_icons_theme: form.social_icons_theme,
          title_main: form.title_main || null,
          title_sub: form.title_sub || null,
          subtitle: form.subtitle || null,
          description: form.description || null,
          facebook_url: form.facebook_url || null,
          instagram_url: form.instagram_url || null,
          whatsapp_url: form.whatsapp_url || null,
          block1_color: form.block1_color && form.block1_color.trim() ? form.block1_color.trim() : null,
          block2_color: form.block2_color && form.block2_color.trim() ? form.block2_color.trim() : null,
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
        <h1 className="font-serif text-2xl text-graphite mb-2">Главный экран</h1>
        <p className="text-mocha text-sm mb-4">
          Фон и цвета применяются ко всем языкам. Заголовки и ссылки — для выбранного языка.
        </p>

        <div className="flex gap-2 mb-6">
          <span className="text-sm font-medium text-graphite mr-1">Язык текста:</span>
          {CONTENT_LOCALES.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setEditLocale(loc)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                editLocale === loc
                  ? 'bg-graphite text-white'
                  : 'bg-gray-200 text-graphite hover:bg-gray-300'
              }`}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-graphite mb-1">
              Фоновое изображение Hero (для всех языков)
            </label>
            <div className="flex flex-wrap items-start gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-graphite text-white rounded-lg hover:opacity-90 disabled:opacity-50">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="sr-only"
                  disabled={uploadingBg}
                  onChange={handleBackgroundUpload}
                />
                {uploadingBg ? 'Загрузка…' : 'Выбрать файл с компьютера'}
              </label>
              {form.background_image && (
                <>
                  <div className="relative rounded-lg overflow-hidden border border-gray-300 bg-gray-100 max-w-[200px] max-h-[120px]">
                    <img
                      src={form.background_image}
                      alt="Hero background"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, background_image: '' }))}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Удалить
                  </button>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              JPEG, PNG или WebP, до 5 МБ. После загрузки нажмите «Сохранить».
            </p>
          </div>

          <div>
            <label htmlFor="hero-title-main" className="block text-sm font-medium text-graphite mb-1">
              Главный заголовок
            </label>
            <input
              id="hero-title-main"
              name="title_main"
              type="text"
              value={form.title_main}
              onChange={handleChange}
              placeholder="SORA"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="hero-title-sub" className="block text-sm font-medium text-graphite mb-1">
              Подзаголовок
            </label>
            <input
              id="hero-title-sub"
              name="title_sub"
              type="text"
              value={form.title_sub}
              onChange={handleChange}
              placeholder="Tattoo"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="hero-subtitle" className="block text-sm font-medium text-graphite mb-1">
              Подпись
            </label>
            <input
              id="hero-subtitle"
              name="subtitle"
              type="text"
              value={form.subtitle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="hero-description" className="block text-sm font-medium text-graphite mb-1">
              Описание
            </label>
            <textarea
              id="hero-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-transparent resize-none"
            />
          </div>

          <div className="pt-2 border-t border-gray-200">
            <p className="text-sm font-medium text-graphite mb-3">Цвета блоков (hex, для всех языков)</p>
            <p className="text-xs text-mocha mb-3">Сейчас на сайте: 1 блок = #232323, 2 блок = #675d54. Можно ввести свой hex или выбрать из палитры.</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="hero-block1-color" className="block text-xs text-mocha mb-0.5">1 блок: SORA, Tattoo, линии</label>
                <input
                  id="hero-block1-color"
                  name="block1_color"
                  type="text"
                  value={form.block1_color}
                  onChange={handleChange}
                  placeholder="#232323"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-transparent"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {COLOR_PALETTE.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, block1_color: hex }))}
                      className={`w-8 h-8 rounded-lg border-2 shrink-0 transition ${
                        form.block1_color?.toLowerCase() === hex.toLowerCase() ? 'border-graphite ring-2 ring-graphite/30' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: hex, borderColor: hex === '#ffffff' ? '#ccc' : undefined }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="hero-block2-color" className="block text-xs text-mocha mb-0.5">2 блок: подпись, описание, иконки</label>
                <input
                  id="hero-block2-color"
                  name="block2_color"
                  type="text"
                  value={form.block2_color}
                  onChange={handleChange}
                  placeholder="#675d54"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-transparent"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {COLOR_PALETTE.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, block2_color: hex }))}
                      className={`w-8 h-8 rounded-lg border-2 shrink-0 transition ${
                        form.block2_color?.toLowerCase() === hex.toLowerCase() ? 'border-graphite ring-2 ring-graphite/30' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: hex, borderColor: hex === '#ffffff' ? '#ccc' : undefined }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <p className="text-sm font-medium text-graphite mb-3">Ссылки на соцсети</p>
            <div className="space-y-3">
              <div>
                <label htmlFor="hero-facebook" className="block text-xs text-mocha mb-0.5">Facebook</label>
                <input
                  id="hero-facebook"
                  name="facebook_url"
                  type="url"
                  value={form.facebook_url}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="hero-instagram" className="block text-xs text-mocha mb-0.5">Instagram</label>
                <input
                  id="hero-instagram"
                  name="instagram_url"
                  type="url"
                  value={form.instagram_url}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="hero-whatsapp" className="block text-xs text-mocha mb-0.5">WhatsApp</label>
                <input
                  id="hero-whatsapp"
                  name="whatsapp_url"
                  type="url"
                  value={form.whatsapp_url}
                  onChange={handleChange}
                  placeholder="https://wa.me/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-graphite text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-60"
            >
              {saving ? 'Сохранение…' : 'Сохранить'}
            </button>
            <Link
              href={`/${locale}/admin`}
              className="px-6 py-2.5 border border-gray-300 text-graphite font-medium rounded-lg hover:bg-gray-50"
            >
              Отмена
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

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link href={`/${locale}`} className="text-graphite underline hover:no-underline text-sm">
            ← На сайт
          </Link>
        </div>
      </main>
    </div>
  );
}
