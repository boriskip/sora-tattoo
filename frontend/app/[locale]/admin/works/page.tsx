'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { adminFetch } from '@/lib/adminApi';
import type { Work, Artist, WorkImage, Style } from '@/lib/api';
import { getWorkFirstImage } from '@/lib/api';

const LOCALES = ['de', 'en', 'ru', 'it'] as const;
const LOCALE_LABELS: Record<string, string> = { de: 'DE', en: 'EN', ru: 'RU', it: 'IT' };

function slugify(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export default function AdminWorksPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'de';
  const [works, setWorks] = useState<Work[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newImageAlt, setNewImageAlt] = useState('');
  const [savingAltId, setSavingAltId] = useState<number | null>(null);
  const [imageTranslations, setImageTranslations] = useState<Record<number, Record<string, string>>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<{
    artist_id: number;
    style: string;
    styleCustom: string;
    titleTranslations: Record<string, string>;
    sort_order: number | '';
  }>({
    artist_id: 0,
    style: '',
    styleCustom: '',
    titleTranslations: LOCALES.reduce((acc, loc) => ({ ...acc, [loc]: '' }), {} as Record<string, string>),
    sort_order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [addMode, setAddMode] = useState(false);

  const load = async () => {
    const [resWorks, resArtists, resStyles] = await Promise.all([
      adminFetch('/works'),
      adminFetch('/artists'),
      adminFetch('/styles'),
    ]);
    if (resWorks.ok) {
      const j = await resWorks.json();
      setWorks((j.data as Work[]) || []);
    }
    if (resArtists.ok) {
      const j = await resArtists.json();
      const list = (j.data as Artist[]) || [];
      setArtists(list);
      if (list.length && form.artist_id === 0) setForm((f) => ({ ...f, artist_id: list[0].id }));
    }
    if (resStyles.ok) {
      const j = await resStyles.json();
      setStyles((j.data as Style[]) || []);
    }
  };

  useEffect(() => {
    setLoading(true);
    load().then(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('title_')) {
      const loc = name.replace('title_', '');
      setForm((prev) => ({
        ...prev,
        titleTranslations: { ...prev.titleTranslations, [loc]: value },
      }));
      setMessage(null);
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'artist_id'
          ? parseInt(value, 10) || 0
          : name === 'sort_order'
            ? (value === '' ? '' : parseInt(value, 10) || 0)
            : value,
    }));
    setMessage(null);
  };

  const setImageAltLocale = (imgId: number, loc: string, value: string) => {
    setImageTranslations((prev) => ({
      ...prev,
      [imgId]: { ...(prev[imgId] ?? {}), [loc]: value },
    }));
    setMessage(null);
  };
  const isOtherStyle = form.style === '__other__';

  const handleAddImage = async (workId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append('image', file);
      if (newImageAlt.trim()) fd.append('alt', newImageAlt.trim());
      const res = await adminFetch(`/works/${workId}/images`, { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMessage({ type: 'err', text: (err as { message?: string }).message || 'Ошибка загрузки.' });
        return;
      }
      setMessage({ type: 'ok', text: 'Изображение добавлено.' });
      setNewImageAlt('');
      await load();
    } catch {
      setMessage({ type: 'err', text: 'Ошибка загрузки.' });
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const saveImageAlt = async (workId: number, imageId: number) => {
    setSavingAltId(imageId);
    setMessage(null);
    try {
      const tr = imageTranslations[imageId] ?? {};
      const translations: Record<string, { alt: string }> = {};
      LOCALES.forEach((loc) => {
        translations[loc] = { alt: (tr[loc] ?? '').trim() };
      });
      const res = await adminFetch(`/works/${workId}/images/${imageId}`, {
        method: 'PUT',
        body: JSON.stringify({ translations }),
      });
      if (res.ok) {
        setMessage({ type: 'ok', text: 'Описание сохранено.' });
        await load();
      } else setMessage({ type: 'err', text: 'Ошибка сохранения.' });
    } catch {
      setMessage({ type: 'err', text: 'Ошибка.' });
    } finally {
      setSavingAltId(null);
    }
  };

  const removeImage = async (workId: number, imageId: number) => {
    if (!confirm('Удалить изображение?')) return;
    const res = await adminFetch(`/works/${workId}/images/${imageId}`, { method: 'DELETE' });
    if (res.ok) {
      setMessage({ type: 'ok', text: 'Удалено.' });
      await load();
    } else setMessage({ type: 'err', text: 'Ошибка удаления.' });
  };

  const startAdd = () => {
    setEditingId(null);
    setAddMode(true);
    setForm({
      artist_id: artists[0]?.id ?? 0,
      style: '',
      styleCustom: '',
      titleTranslations: LOCALES.reduce((acc, loc) => ({ ...acc, [loc]: '' }), {} as Record<string, string>),
      sort_order: works.length,
    });
  };

  const startEdit = (w: Work) => {
    setEditingId(w.id);
    setAddMode(false);
    const hasStyle = w.style?.trim();
    const inList = hasStyle && styles.some((s) => s.slug === (w.style ?? '').toLowerCase());
    const titleTranslations: Record<string, string> = LOCALES.reduce((acc, loc) => ({ ...acc, [loc]: '' }), {});
    (w.translations ?? []).forEach((t) => {
      if (LOCALES.includes(t.locale as (typeof LOCALES)[number])) titleTranslations[t.locale] = t.title ?? '';
    });
    if (Object.values(titleTranslations).every((v) => !v) && w.title) titleTranslations['de'] = w.title;
    setForm({
      artist_id: w.artist_id,
      style: inList ? (w.style ?? '') : (hasStyle ? '__other__' : ''),
      styleCustom: inList ? '' : (w.style ?? ''),
      titleTranslations,
      sort_order: w.sort_order !== undefined && w.sort_order !== null ? Number(w.sort_order) : 0,
    });
  };

  const save = async () => {
    if (!form.artist_id) {
      setMessage({ type: 'err', text: 'Выберите мастера.' });
      return;
    }
    if (isOtherStyle && !form.styleCustom.trim()) {
      setMessage({ type: 'err', text: 'Введите название стиля.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      let styleSlug: string | null = null;
      if (isOtherStyle && form.styleCustom.trim()) {
        const customName = form.styleCustom.trim();
        const slug = slugify(customName);
        const existing = styles.find((s) => s.slug === slug || s.name.toLowerCase() === customName.toLowerCase());
        if (existing) {
          styleSlug = existing.slug;
        } else {
          const resStyle = await adminFetch('/styles', {
            method: 'POST',
            body: JSON.stringify({ name: customName }),
          });
          if (resStyle.ok) {
            const j = await resStyle.json();
            styleSlug = (j.data as Style).slug;
            await load();
          } else {
            setMessage({ type: 'err', text: 'Не удалось создать стиль.' });
            setSaving(false);
            return;
          }
        }
      } else if (form.style.trim() && form.style !== '__other__') {
        styleSlug = form.style.trim();
      }
      const translations: Record<string, { title: string }> = {};
      LOCALES.forEach((loc) => {
        translations[loc] = { title: (form.titleTranslations[loc] ?? '').trim() };
      });
      const body = {
        artist_id: form.artist_id,
        style: styleSlug,
        sort_order: form.sort_order === '' ? 0 : Number(form.sort_order),
        translations,
      };
      if (editingId) {
        const res = await adminFetch(`/works/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
        if (!res.ok) {
          setMessage({ type: 'err', text: 'Ошибка сохранения.' });
          return;
        }
        setMessage({ type: 'ok', text: 'Сохранено.' });
      } else {
        const res = await adminFetch('/works', { method: 'POST', body: JSON.stringify(body) });
        if (!res.ok) {
          setMessage({ type: 'err', text: 'Ошибка создания.' });
          return;
        }
        const json = await res.json();
        setMessage({ type: 'ok', text: 'Работа добавлена. Добавьте изображения ниже.' });
        setAddMode(false);
        setEditingId((json.data as Work).id);
      }
      await load();
    } catch {
      setMessage({ type: 'err', text: 'Ошибка.' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Удалить работу и все её изображения?')) return;
    const res = await adminFetch(`/works/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMessage({ type: 'ok', text: 'Удалено.' });
      await load();
      if (editingId === id) setEditingId(null);
    } else setMessage({ type: 'err', text: 'Ошибка удаления.' });
  };

  useEffect(() => {
    if (editingId == null) {
      setImageTranslations({});
      return;
    }
    const work = works.find((w) => w.id === editingId);
    const imgs = work?.images ?? [];
    const next: Record<number, Record<string, string>> = {};
    imgs.forEach((img) => {
      const byLoc: Record<string, string> = LOCALES.reduce((acc, loc) => ({ ...acc, [loc]: '' }), {});
      (img.translations ?? []).forEach((t) => {
        if (LOCALES.includes(t.locale as (typeof LOCALES)[number])) byLoc[t.locale] = t.alt ?? '';
      });
      if (Object.values(byLoc).every((v) => !v) && img.alt) byLoc['de'] = img.alt;
      next[img.id] = byLoc;
    });
    setImageTranslations(next);
  }, [editingId, works]);

  if (loading) {
    return (
      <div className="min-h-screen bg-graphite/5 flex items-center justify-center">
        <p className="text-mocha">Загрузка…</p>
      </div>
    );
  }

  const showForm = editingId !== null || addMode;
  const editingWork = editingId !== null ? works.find((w) => w.id === editingId) : null;
  const editingImages = editingWork?.images ?? [];

  const getImageAlt = (img: WorkImage, loc: string) => {
    const fromState = imageTranslations[img.id]?.[loc];
    if (fromState !== undefined && fromState !== '') return fromState;
    const fromApi = img.translations?.find((t) => t.locale === loc)?.alt ?? '';
    if (fromApi) return fromApi;
    return loc === 'de' ? (img.alt ?? '') : '';
  };

  return (
    <div className="min-h-screen bg-graphite/5">
      <header className="bg-graphite text-white py-4 px-6 flex justify-between items-center">
        <span className="font-serif text-xl tracking-wide">Sora Tattoo Admin</span>
        <Link href={`/${locale}/admin`} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition">
          ← Панель
        </Link>
      </header>
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="font-serif text-2xl text-graphite mb-2">Работы</h1>
        <p className="text-mocha text-sm mb-4">Каждая работа привязана к мастеру. У работы может быть несколько изображений (alt у каждого).</p>

        {message && (
          <p className={`text-sm px-3 py-2 rounded-lg mb-4 ${message.type === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </p>
        )}

        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <h2 className="font-medium text-graphite mb-3">{editingId ? 'Редактировать работу' : 'Новая работа'}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-graphite mb-0.5">Мастер *</label>
                <select name="artist_id" value={form.artist_id} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required>
                  {artists.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                  {artists.length === 0 && <option value={0}>— Нет мастеров —</option>}
                </select>
              </div>
              <div>
                <label className="block text-sm text-graphite mb-0.5">Название работы (по языкам)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {LOCALES.map((loc) => (
                    <div key={loc}>
                      <span className="text-xs text-mocha">{LOCALE_LABELS[loc]}</span>
                      <input name={`title_${loc}`} value={form.titleTranslations[loc] ?? ''} onChange={handleChange} placeholder={`Название (${loc})`} className="w-full px-2 py-1.5 border rounded text-sm" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-graphite mb-0.5">Стиль</label>
                <select name="style" value={form.style} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">— Не выбрано —</option>
                  {styles.map((s) => (
                    <option key={s.id} value={s.slug}>{s.name}</option>
                  ))}
                  <option value="__other__">— Ввести свой —</option>
                </select>
                {isOtherStyle && (
                  <input
                    name="styleCustom"
                    type="text"
                    value={form.styleCustom}
                    onChange={handleChange}
                    placeholder="Название стиля (напр. Minimal)"
                    className="mt-2 w-full px-3 py-2 border rounded-lg"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm text-graphite mb-0.5">Порядок</label>
                <input name="sort_order" type="number" value={form.sort_order === '' ? '' : form.sort_order} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="0" min={0} />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={save} disabled={saving || !form.artist_id} className="px-4 py-2 bg-graphite text-white rounded-lg disabled:opacity-50">
                  {saving ? 'Сохранение…' : 'Сохранить'}
                </button>
                {(editingId || addMode) && (
                  <button type="button" onClick={() => { setEditingId(null); setAddMode(false); setForm({ artist_id: artists[0]?.id ?? 0, style: '', styleCustom: '', titleTranslations: LOCALES.reduce((acc, loc) => ({ ...acc, [loc]: '' }), {} as Record<string, string>), sort_order: 0 }); }} className="px-4 py-2 border rounded-lg">
                    Отмена
                  </button>
                )}
              </div>
            </div>

            {/* Paveikslai darbo – rodomi tik redaguojant esamą darbą */}
            {editingId !== null && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-graphite mb-2">Изображения работы</h3>
                <p className="text-mocha text-sm mb-2">Описание (alt) показывается под каждой фотографией в слайдере на сайте. Можно указать при загрузке или отредактировать ниже.</p>
                <div className="flex flex-wrap gap-3 items-end mb-3">
                  <div>
                    <label className="block text-xs text-graphite mb-1">Описание для нового фото (alt)</label>
                    <input
                      type="text"
                      value={newImageAlt}
                      onChange={(e) => setNewImageAlt(e.target.value)}
                      placeholder="Краткое описание фото"
                      className="w-48 px-2 py-1.5 border rounded text-sm"
                    />
                  </div>
                  <label className="cursor-pointer px-3 py-2 bg-graphite text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50">
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={uploadingImage}
                      onChange={(ev) => { handleAddImage(editingId, ev); }}
                    />
                    {uploadingImage ? 'Загрузка…' : '+ Добавить изображение'}
                  </label>
                </div>
                <ul className="space-y-3">
                  {editingImages.map((img: WorkImage) => (
                    <li key={img.id} className="flex gap-3 items-start p-2 rounded border border-gray-200">
                      <div className="relative flex-shrink-0">
                        <img src={img.image} alt={img.alt ?? ''} className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
                        <button
                          type="button"
                          onClick={() => removeImage(editingId, img.id)}
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                          aria-label="Удалить"
                        >
                          ×
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs text-graphite mb-0.5">Описание (alt) по языкам — в слайдере</label>
                        <div className="space-y-1.5">
                          {LOCALES.map((loc) => (
                            <div key={loc} className="flex items-center gap-2">
                              <span className="text-xs text-mocha w-6">{LOCALE_LABELS[loc]}</span>
                              <input
                                type="text"
                                value={getImageAlt(img, loc)}
                                onChange={(e) => setImageAltLocale(img.id, loc, e.target.value)}
                                placeholder={`Alt (${loc})`}
                                className="flex-1 px-2 py-1 border rounded text-sm"
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => saveImageAlt(editingId!, img.id)}
                            disabled={savingAltId === img.id}
                            className="mt-1 px-2 py-1.5 bg-graphite text-white rounded text-sm disabled:opacity-50"
                          >
                            {savingAltId === img.id ? '…' : 'Сохранить'}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {editingImages.length === 0 && <p className="text-mocha text-sm">Нет изображений. Загрузите хотя бы одно.</p>}
              </div>
            )}
          </div>
        )}

        <button type="button" onClick={startAdd} className="mb-4 px-4 py-2 bg-graphite text-white rounded-lg" disabled={artists.length === 0}>
          + Добавить работу
        </button>
        {artists.length === 0 && <p className="text-mocha text-sm mb-4">Сначала добавьте мастеров в разделе «Мастера».</p>}

        <ul className="space-y-3">
          {works.map((w) => {
            const firstImg = getWorkFirstImage(w);
            return (
              <li key={w.id} className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {firstImg ? <img src={firstImg} alt="" className="w-14 h-14 rounded-lg object-cover" /> : <div className="w-14 h-14 rounded-lg bg-gray-200" />}
                  <div>
                    <span className="text-graphite font-medium">{(w.translations?.find((t) => t.locale === 'de')?.title ?? w.title) || 'Без названия'}</span>
                    <span className="text-mocha text-sm ml-2">({w.artist?.name ?? '—'})</span>
                    {w.style && <span className="text-mocha text-sm ml-1"> • {w.style}</span>}
                    {(w.images?.length ?? 0) > 0 && <span className="text-mocha text-sm ml-1"> • {w.images!.length} фото</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => startEdit(w)} className="text-sm text-graphite underline">Изменить</button>
                  <button type="button" onClick={() => remove(w.id)} className="text-sm text-red-600 underline">Удалить</button>
                </div>
              </li>
            );
          })}
        </ul>
        {works.length === 0 && !showForm && <p className="text-mocha text-sm">Нет работ.</p>}

        <div className="mt-6">
          <Link href={`/${locale}/admin/artists`} className="text-graphite underline">→ Управление мастерами</Link>
        </div>
      </main>
    </div>
  );
}
