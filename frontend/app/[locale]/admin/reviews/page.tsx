'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { adminFetch } from '@/lib/adminApi';
import type { Review } from '@/lib/api';

const LOCALES = ['de', 'en', 'ru', 'it'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatDate(s: string | undefined): string {
  if (!s) return '—';
  try {
    const d = new Date(s);
    return d.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return s;
  }
}

export default function AdminReviewsPage() {
  const pathname = usePathname();
  const locale = (pathname && LOCALES.includes(pathname.split('/')[1]) ? pathname.split('/')[1] : 'de') as string;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ author: '', email: '', text: '', rating: 5, status: 'pending' });
  const [saving, setSaving] = useState(false);

  const loadReviews = async () => {
    const url = statusFilter ? `/reviews?status=${statusFilter}` : '/reviews';
    const res = await adminFetch(url);
    if (!res.ok) {
      setMessage({ type: 'err', text: 'Не удалось загрузить отзывы' });
      return;
    }
    const json = await res.json();
    setReviews(json.data ?? []);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadReviews().then(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [statusFilter]);

  const handleApprove = async (id: number) => {
    setMessage(null);
    const res = await adminFetch(`/reviews/${id}/approve`, { method: 'POST' });
    if (res.ok) {
      setMessage({ type: 'ok', text: 'Отзыв одобрен.' });
      loadReviews();
    } else {
      setMessage({ type: 'err', text: 'Ошибка.' });
    }
  };

  const startEdit = (r: Review) => {
    setEditingId(r.id);
    setEditForm({
      author: r.author,
      email: r.email ?? '',
      text: r.text,
      rating: r.rating,
      status: r.status ?? 'pending',
    });
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setMessage(null);
  };

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) return true;
    return EMAIL_REGEX.test(email.trim());
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    if (!validateEmail(editForm.email)) {
      setMessage({ type: 'err', text: 'Некорректный email.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await adminFetch(`/reviews/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify({
          author: editForm.author.trim(),
          email: editForm.email.trim() || null,
          text: editForm.text.trim(),
          rating: editForm.rating,
          status: editForm.status,
        }),
      });
      if (res.ok) {
        setMessage({ type: 'ok', text: 'Сохранено.' });
        setEditingId(null);
        loadReviews();
      } else {
        const err = await res.json().catch(() => ({}));
        setMessage({ type: 'err', text: (err as { message?: string }).message || 'Ошибка сохранения.' });
      }
    } catch {
      setMessage({ type: 'err', text: 'Ошибка сохранения.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить отзыв?')) return;
    setMessage(null);
    const res = await adminFetch(`/reviews/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMessage({ type: 'ok', text: 'Удалено.' });
      if (editingId === id) setEditingId(null);
      loadReviews();
    } else {
      setMessage({ type: 'err', text: 'Ошибка удаления.' });
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
        <Link href={`/${locale}/admin`} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition">
          ← Панель
        </Link>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="font-serif text-2xl text-graphite mb-2">Отзывы</h1>
        <p className="text-mocha text-sm mb-4">
          Одобрение, редактирование. Обязательно проверяйте email при редактировании.
        </p>

        <div className="flex gap-2 mb-4">
          <span className="text-sm font-medium text-graphite">Статус:</span>
          {['', 'pending', 'approved'].map((s) => (
            <button
              key={s || 'all'}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                statusFilter === s ? 'bg-graphite text-white' : 'bg-gray-200 text-graphite hover:bg-gray-300'
              }`}
            >
              {s === '' ? 'Все' : s === 'pending' ? 'На модерации' : 'Одобрены'}
            </button>
          ))}
        </div>

        {message && (
          <p className={`text-sm px-3 py-2 rounded-lg mb-4 ${message.type === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </p>
        )}

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-mocha">Нет отзывов.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4">
                {editingId === r.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-graphite mb-1">Имя</label>
                      <input
                        type="text"
                        value={editForm.author}
                        onChange={(e) => setEditForm((f) => ({ ...f, author: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-graphite mb-1">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-graphite mb-1">Текст</label>
                      <textarea
                        value={editForm.text}
                        onChange={(e) => setEditForm((f) => ({ ...f, text: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                      <div>
                        <label className="block text-xs font-medium text-graphite mb-1">Рейтинг</label>
                        <select
                          value={editForm.rating}
                          onChange={(e) => setEditForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-graphite mb-1">Статус</label>
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="pending">На модерации</option>
                          <option value="approved">Одобрен</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button type="button" onClick={handleSaveEdit} disabled={saving} className="px-4 py-2 bg-graphite text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
                        {saving ? '…' : 'Сохранить'}
                      </button>
                      <button type="button" onClick={cancelEdit} className="px-4 py-2 border border-gray-300 text-graphite rounded-lg text-sm font-medium">
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-medium text-graphite">{r.author}</span>
                        {r.email && <span className="text-mocha text-sm ml-2">({r.email})</span>}
                      </div>
                      <span className="text-xs text-mocha">Создан: {formatDate(r.created_at)}</span>
                    </div>
                    <p className="text-mocha text-sm mb-2 line-clamp-2">&quot;{r.text}&quot;</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-graphite">★ {r.rating}</span>
                      <span className={`px-2 py-0.5 rounded ${r.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {r.status === 'approved' ? 'Одобрен' : 'На модерации'}
                      </span>
                      {r.locale && <span className="text-mocha">{r.locale}</span>}
                      <div className="flex gap-2 ml-auto">
                        {r.status !== 'approved' && (
                          <button type="button" onClick={() => handleApprove(r.id)} className="text-green-600 hover:underline font-medium">
                            Одобрить
                          </button>
                        )}
                        <button type="button" onClick={() => startEdit(r)} className="text-graphite hover:underline font-medium">
                          Редактировать
                        </button>
                        <button type="button" onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline font-medium">
                          Удалить
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-6">
          <Link href={`/${locale}#reviews`} className="text-graphite underline hover:no-underline">
            На сайт → Отзывы
          </Link>
        </div>
      </main>
    </div>
  );
}
