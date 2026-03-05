'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { adminFetch } from '@/lib/adminApi';
import type { AdminStyle, StyleTranslation } from '@/lib/api';

const LOCALES = ['de', 'en', 'ru', 'it'] as const;
const LOCALE_LABELS: Record<string, string> = { de: 'DE', en: 'EN', ru: 'RU', it: 'IT' };

type TranslationForm = Record<string, { name: string; description: string }>;

function translationsFromStyle(s: AdminStyle): TranslationForm {
  const out: TranslationForm = {};
  for (const loc of LOCALES) {
    out[loc] = { name: '', description: '' };
  }
  for (const t of s.translations ?? []) {
    if (LOCALES.includes(t.locale as (typeof LOCALES)[number])) {
      out[t.locale] = { name: t.name ?? '', description: t.description ?? '' };
    }
  }
  return out;
}

function hasAnyName(tr: TranslationForm): boolean {
  return LOCALES.some((loc) => (tr[loc]?.name ?? '').trim() !== '');
}

export default function AdminStylesPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'de';
  const [styles, setStyles] = useState<AdminStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<{
    slug: string;
    sort_order: number | '';
    translations: TranslationForm;
  }>({
    slug: '',
    sort_order: 0,
    translations: LOCALES.reduce((acc, loc) => ({ ...acc, [loc]: { name: '', description: '' } }), {} as TranslationForm),
  });
  const [saving, setSaving] = useState(false);
  const [addMode, setAddMode] = useState(false);

  const load = async () => {
    const res = await adminFetch('/styles');
    if (!res.ok) return;
    const j = await res.json();
    setStyles((j.data as AdminStyle[]) || []);
  };

  useEffect(() => {
    setLoading(true);
    load().then(() => setLoading(false));
  }, []);

  const setTranslation = (loc: string, field: 'name' | 'description', value: string) => {
    setForm((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [loc]: { ...prev.translations[loc], [field]: value },
      },
    }));
    setMessage(null);
  };

  const setSlugOrOrder = (field: 'slug' | 'sort_order', value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'sort_order' ? (value === '' ? '' : parseInt(String(value), 10) || 0) : value,
    }));
    setMessage(null);
  };

  const startAdd = () => {
    setEditingId(null);
    setAddMode(true);
    setForm({
      slug: '',
      sort_order: styles.length,
      translations: LOCALES.reduce((acc, loc) => ({ ...acc, [loc]: { name: '', description: '' } }), {} as TranslationForm),
    });
  };

  const startEdit = (s: AdminStyle) => {
    setEditingId(s.id);
    setAddMode(false);
    setForm({
      slug: s.slug ?? '',
      sort_order: s.sort_order !== undefined && s.sort_order !== null ? Number(s.sort_order) : 0,
      translations: translationsFromStyle(s),
    });
  };

  const save = async () => {
    if (!hasAnyName(form.translations)) {
      setMessage({ type: 'err', text: 'Укажите название хотя бы для одного языка.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const translations: Record<string, { name: string; description: string }> = {};
      for (const loc of LOCALES) {
        const name = (form.translations[loc]?.name ?? '').trim();
        const description = (form.translations[loc]?.description ?? '').trim();
        if (name) translations[loc] = { name, description };
      }
      const body = {
        slug: form.slug.trim() || undefined,
        sort_order: form.sort_order === '' ? 0 : Number(form.sort_order),
        translations,
      };
      if (editingId) {
        const res = await adminFetch(`/styles/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setMessage({ type: 'err', text: (err as { message?: string }).message || 'Ошибка сохранения.' });
          return;
        }
        setMessage({ type: 'ok', text: 'Сохранено.' });
        setEditingId(null);
      } else {
        const res = await adminFetch('/styles', { method: 'POST', body: JSON.stringify(body) });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setMessage({ type: 'err', text: (err as { message?: string }).message || 'Ошибка создания.' });
          return;
        }
        setMessage({ type: 'ok', text: 'Стиль добавлен.' });
        setAddMode(false);
      }
      await load();
    } catch {
      setMessage({ type: 'err', text: 'Ошибка.' });
    } finally {
      setSaving(false);
    }
  };

  const displayName = (s: AdminStyle) => {
    const first = LOCALES.map((loc) => (s.translations ?? []).find((t) => t.locale === loc)?.name).find(Boolean);
    return (first as string) || s.name || s.slug;
  };

  const remove = async (id: number, name: string) => {
    if (
      !confirm(
        `Удалить стиль «${name}»?\n\nРаботы с этим стилем не изменятся автоматически — при необходимости назначьте им другой стиль в разделе «Работы».`
      )
    )
      return;
    const res = await adminFetch(`/styles/${id}`, { method: 'DELETE' });
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

  const showForm = editingId !== null || addMode;

  return (
    <div className="min-h-screen bg-graphite/5">
      <header className="bg-graphite text-white py-4 px-6 flex justify-between items-center">
        <span className="font-serif text-xl tracking-wide">Sora Tattoo Admin</span>
        <Link href={`/${locale}/admin`} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition">
          ← Панель
        </Link>
      </header>
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="font-serif text-2xl text-graphite mb-2">Стили</h1>
        <p className="text-mocha text-sm mb-4">
          Укажите название и описание для каждого языка (DE, EN, RU, IT). На сайте в блоке «Стили» показывается перевод для выбранной посетителем языка. Slug используется в URL и фильтре работ.
        </p>

        {message && (
          <p className={`text-sm px-3 py-2 rounded-lg mb-4 ${message.type === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </p>
        )}

        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <h2 className="font-medium text-graphite mb-3">{editingId ? 'Редактировать стиль' : 'Новый стиль'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-graphite mb-0.5">Slug (URL, латиница)</label>
                <input
                  value={form.slug}
                  onChange={(e) => setSlugOrOrder('slug', e.target.value)}
                  placeholder="minimal"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              {LOCALES.map((loc) => (
                <div key={loc} className="border border-gray-100 rounded p-3 bg-gray-50/50">
                  <span className="text-xs font-medium text-graphite uppercase">{LOCALE_LABELS[loc] ?? loc}</span>
                  <div className="mt-2 space-y-2">
                    <input
                      placeholder={`Название (${loc})`}
                      value={form.translations[loc]?.name ?? ''}
                      onChange={(e) => setTranslation(loc, 'name', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <textarea
                      placeholder={`Описание (${loc})`}
                      value={form.translations[loc]?.description ?? ''}
                      onChange={(e) => setTranslation(loc, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-sm text-graphite mb-0.5">Порядок</label>
                <input
                  type="number"
                  value={form.sort_order === '' ? '' : form.sort_order}
                  onChange={(e) => setSlugOrOrder('sort_order', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="0"
                  min={0}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={save}
                  disabled={saving || !hasAnyName(form.translations)}
                  className="px-4 py-2 bg-graphite text-white rounded-lg disabled:opacity-50"
                >
                  {saving ? 'Сохранение…' : 'Сохранить'}
                </button>
                {(editingId || addMode) && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setAddMode(false);
                    }}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Отмена
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <button type="button" onClick={startAdd} className="mb-4 px-4 py-2 bg-graphite text-white rounded-lg">
          + Добавить стиль
        </button>

        <ul className="space-y-3">
          {styles.map((s) => (
            <li key={s.id} className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between">
              <div>
                <span className="font-medium text-graphite">{displayName(s)}</span>
                <span className="text-mocha text-sm ml-2">({s.slug})</span>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(s)} className="text-sm text-graphite underline">
                  Изменить
                </button>
                <button type="button" onClick={() => remove(s.id, displayName(s))} className="text-sm text-red-600 underline">
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
        {styles.length === 0 && !showForm && <p className="text-mocha text-sm">Нет стилей. Нажмите «Добавить стиль».</p>}

        <div className="mt-6">
          <Link href={`/${locale}/admin/works`} className="text-graphite underline">
            → Работы (назначить стиль работам)
          </Link>
        </div>
      </main>
    </div>
  );
}
