'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { adminFetch } from '@/lib/adminApi';
import type { Artist } from '@/lib/api';

const LOCALES = ['de', 'en', 'ru', 'it'] as const;
const LOCALE_LABELS: Record<string, string> = { de: 'DE', en: 'EN', ru: 'RU', it: 'IT' };

type TranslationForm = Record<string, { name: string; style: string; description: string }>;

function emptyTranslations(): TranslationForm {
  return LOCALES.reduce((acc, loc) => ({ ...acc, [loc]: { name: '', style: '', description: '' } }), {} as TranslationForm);
}

export default function AdminArtistsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'de';
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<{
    slug: string;
    avatar: string;
    sort_order: number | '';
    translations: TranslationForm;
  }>({ slug: '', avatar: '', sort_order: 0, translations: emptyTranslations() });
  const [saving, setSaving] = useState(false);
  const [addMode, setAddMode] = useState(false);

  const load = async () => {
    const res = await adminFetch('/artists');
    if (!res.ok) return;
    const json = await res.json();
    setArtists((json.data as Artist[]) || []);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    load().then(() => setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'slug' || name === 'avatar' || name === 'sort_order') {
      setForm((prev) => ({
        ...prev,
        [name]: name === 'sort_order' ? (value === '' ? '' : parseInt(value, 10) || 0) : value,
      }));
      setMessage(null);
      return;
    }
    const m = name.match(/^(name|style|description)_(de|en|ru|it)$/);
    if (m) {
      const [, field, loc] = m;
      setForm((prev) => ({
        ...prev,
        translations: {
          ...prev.translations,
          [loc]: { ...prev.translations[loc], [field]: value },
        },
      }));
      setMessage(null);
    }
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await adminFetch('/artists/upload-avatar', { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMessage({ type: 'err', text: (err as { message?: string }).message || 'Ошибка загрузки.' });
        return;
      }
      const json = await res.json();
      if (json.url) setForm((prev) => ({ ...prev, avatar: json.url }));
    } catch {
      setMessage({ type: 'err', text: 'Ошибка загрузки.' });
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const startAdd = () => {
    setEditingId(null);
    setAddMode(true);
    setForm({ slug: '', avatar: '', sort_order: artists.length, translations: emptyTranslations() });
  };

  const startEdit = (a: Artist) => {
    setEditingId(a.id);
    setAddMode(false);
    const tr = emptyTranslations();
    (a.translations ?? []).forEach((t) => {
      if (LOCALES.includes(t.locale as (typeof LOCALES)[number])) {
        tr[t.locale] = {
          name: t.name ?? '',
          style: t.style ?? '',
          description: t.description ?? '',
        };
      }
    });
    if (Object.values(tr).every((v) => !v.name) && a.name) tr['de'] = { name: a.name, style: a.style ?? '', description: a.description ?? '' };
    setForm({
      slug: a.slug ?? '',
      avatar: a.avatar ?? '',
      sort_order: a.sort_order !== undefined && a.sort_order !== null ? Number(a.sort_order) : 0,
      translations: tr,
    });
  };

  const hasAnyName = () => LOCALES.some((loc) => (form.translations[loc]?.name ?? '').trim() !== '');

  const save = async () => {
    if (!hasAnyName()) {
      setMessage({ type: 'err', text: 'Укажите имя хотя бы для одного языка.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const translations: Record<string, { name: string; style: string; description: string }> = {};
      LOCALES.forEach((loc) => {
        const t = form.translations[loc];
        translations[loc] = {
          name: (t?.name ?? '').trim(),
          style: (t?.style ?? '').trim(),
          description: (t?.description ?? '').trim(),
        };
      });
      const body = {
        slug: form.slug.trim() || undefined,
        avatar: form.avatar.trim() || null,
        sort_order: form.sort_order === '' ? 0 : Number(form.sort_order),
        translations,
      };
      if (editingId) {
        const res = await adminFetch(`/artists/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
        if (!res.ok) {
          setMessage({ type: 'err', text: 'Ошибка сохранения.' });
          return;
        }
        setMessage({ type: 'ok', text: 'Сохранено.' });
        setEditingId(null);
      } else {
        const res = await adminFetch('/artists', { method: 'POST', body: JSON.stringify(body) });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setMessage({ type: 'err', text: (err as { message?: string }).message || 'Ошибка создания.' });
          return;
        }
        setMessage({ type: 'ok', text: 'Мастер добавлен.' });
        setAddMode(false);
      }
      await load();
    } catch {
      setMessage({ type: 'err', text: 'Ошибка.' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Удалить мастера и все его работы?')) return;
    const res = await adminFetch(`/artists/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMessage({ type: 'ok', text: 'Удалено.' });
      await load();
      if (editingId === id) setEditingId(null);
    } else setMessage({ type: 'err', text: 'Ошибка удаления.' });
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
        <Link href={`/${locale}/admin`} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition">
          ← Панель
        </Link>
      </header>
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="font-serif text-2xl text-graphite mb-2">Мастера</h1>
        <p className="text-mocha text-sm mb-4">Добавление и редактирование мастеров. У каждого мастера — аватар, имя, стиль, описание и работы (в разделе «Работы»).</p>

        {message && (
          <p className={`text-sm px-3 py-2 rounded-lg mb-4 ${message.type === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </p>
        )}

        {(editingId !== null || addMode) && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <h2 className="font-medium text-graphite mb-3">{editingId ? 'Редактировать' : 'Новый мастер'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-graphite mb-0.5">Slug (URL)</label>
                <input name="slug" value={form.slug} onChange={handleChange} placeholder="artist-01" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              {LOCALES.map((loc) => (
                <div key={loc} className="border border-gray-100 rounded p-3 bg-gray-50/50">
                  <span className="text-xs font-medium text-graphite uppercase">{LOCALE_LABELS[loc]}</span>
                  <div className="mt-2 space-y-2">
                    <input name={`name_${loc}`} value={form.translations[loc]?.name ?? ''} onChange={handleChange} placeholder={`Имя (${loc})`} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    <input name={`style_${loc}`} value={form.translations[loc]?.style ?? ''} onChange={handleChange} placeholder={`Стиль (${loc})`} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    <textarea name={`description_${loc}`} value={form.translations[loc]?.description ?? ''} onChange={handleChange} rows={2} placeholder={`Описание (${loc})`} className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-sm text-graphite mb-0.5">Аватар</label>
                <div className="flex gap-2 items-center">
                  <label className="cursor-pointer px-3 py-2 bg-graphite text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50">
                    <input type="file" accept="image/*" className="sr-only" disabled={uploadingAvatar} onChange={handleUploadAvatar} />
                    {uploadingAvatar ? 'Загрузка…' : 'Загрузить'}
                  </label>
                  {form.avatar && (
                    <img src={form.avatar} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm text-graphite mb-0.5">Порядок</label>
                <input name="sort_order" type="number" value={form.sort_order === '' ? '' : form.sort_order} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="0" min={0} />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={save} disabled={saving || !hasAnyName()} className="px-4 py-2 bg-graphite text-white rounded-lg disabled:opacity-50">
                  {saving ? 'Сохранение…' : 'Сохранить'}
                </button>
                {(editingId || addMode) && (
                  <button type="button" onClick={() => { setEditingId(null); setAddMode(false); setForm({ slug: '', avatar: '', sort_order: 0, translations: emptyTranslations() }); }} className="px-4 py-2 border rounded-lg">
                    Отмена
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <button type="button" onClick={startAdd} className="mb-4 px-4 py-2 bg-graphite text-white rounded-lg">
          + Добавить мастера
        </button>

        <ul className="space-y-3">
          {artists.map((a) => (
            <li key={a.id} className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {a.avatar ? <img src={a.avatar} alt="" className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 rounded-lg bg-gray-200" />}
                <div>
                  <span className="font-medium text-graphite">{(a.translations?.find((t) => t.locale === 'de')?.name ?? a.name) || '—'}</span>
                  {a.works && <span className="text-mocha text-sm ml-2">({a.works.length} работ)</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(a)} className="text-sm text-graphite underline">Изменить</button>
                <button type="button" onClick={() => remove(a.id)} className="text-sm text-red-600 underline">Удалить</button>
              </div>
            </li>
          ))}
        </ul>
        {artists.length === 0 && !addMode && <p className="text-mocha text-sm">Нет мастеров. Нажмите «Добавить мастера».</p>}

        <div className="mt-6">
          <Link href={`/${locale}/admin/works`} className="text-graphite underline">→ Управление работами</Link>
        </div>
      </main>
    </div>
  );
}
