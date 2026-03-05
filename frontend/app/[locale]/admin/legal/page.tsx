'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { adminFetch } from '@/lib/adminApi';
import type { LegalData } from '@/lib/api';

const CONTENT_LOCALES = ['de', 'en', 'ru', 'it'] as const;

export default function AdminLegalPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'de';
  const [editLocale, setEditLocale] = useState<(typeof CONTENT_LOCALES)[number]>('de');
  const [data, setData] = useState<LegalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [form, setForm] = useState({
    impressum_title: '',
    impressum_content: '',
    privacy_title: '',
    privacy_content: '',
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const res = await adminFetch(`/legal?locale=${editLocale}`);
      if (cancelled) return;
      if (!res.ok) {
        setMessage({ type: 'err', text: 'Failed to load legal content' });
        setLoading(false);
        return;
      }
      const json = await res.json();
      const legal = json.data as LegalData | null;
      if (legal) {
        setData(legal);
        setForm({
          impressum_title: legal.impressum_title ?? '',
          impressum_content: legal.impressum_content ?? '',
          privacy_title: legal.privacy_title ?? '',
          privacy_content: legal.privacy_content ?? '',
        });
      } else {
        setForm({
          impressum_title: '',
          impressum_content: '',
          privacy_title: '',
          privacy_content: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await adminFetch('/legal', {
        method: 'PUT',
        body: JSON.stringify({
          locale: editLocale,
          impressum_title: form.impressum_title.trim() || null,
          impressum_content: form.impressum_content.trim() || null,
          privacy_title: form.privacy_title.trim() || null,
          privacy_content: form.privacy_content.trim() || null,
        }),
      });
      if (res.ok) {
        setMessage({ type: 'ok', text: 'Saved.' });
        const json = await res.json();
        setData(json.data);
      } else {
        setMessage({ type: 'err', text: 'Failed to save.' });
      }
    } catch {
      setMessage({ type: 'err', text: 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-graphite/5">
      <header className="bg-graphite text-white py-4 px-6 flex justify-between items-center">
        <Link href={`/${locale}/admin`} className="text-white/90 hover:text-white">
          ← Admin
        </Link>
      </header>
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="font-serif text-2xl text-graphite mb-2">Impressum & Datenschutz</h1>
        <p className="text-mocha text-sm mb-6">
          Redaguokite Impressum ir Datenschutzerklärung turinį pagal locale. Jei laukai tušti, rodomas tekstas iš vertimų.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-graphite mb-1">Locale</label>
          <select
            value={editLocale}
            onChange={(e) => setEditLocale(e.target.value as (typeof CONTENT_LOCALES)[number])}
            className="w-full max-w-[120px] px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            {CONTENT_LOCALES.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-mocha">Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="space-y-4">
              <h2 className="font-serif text-lg text-graphite border-b border-gray-200 pb-1">Impressum</h2>
              <div>
                <label htmlFor="impressum_title" className="block text-sm font-medium text-graphite mb-1">Pavadinimas</label>
                <input
                  id="impressum_title"
                  name="impressum_title"
                  type="text"
                  value={form.impressum_title}
                  onChange={handleChange}
                  placeholder="e.g. Impressum"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="impressum_content" className="block text-sm font-medium text-graphite mb-1">Turinys (pastraipos atskirtos dviem eilučių lūžiais)</label>
                <textarea
                  id="impressum_content"
                  name="impressum_content"
                  rows={12}
                  value={form.impressum_content}
                  onChange={handleChange}
                  placeholder="Angaben gemäß § 5 TMG…"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md font-mono text-sm"
                />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-serif text-lg text-graphite border-b border-gray-200 pb-1">Datenschutzerklärung / Privacy</h2>
              <div>
                <label htmlFor="privacy_title" className="block text-sm font-medium text-graphite mb-1">Pavadinimas</label>
                <input
                  id="privacy_title"
                  name="privacy_title"
                  type="text"
                  value={form.privacy_title}
                  onChange={handleChange}
                  placeholder="e.g. Datenschutzerklärung"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="privacy_content" className="block text-sm font-medium text-graphite mb-1">Turinys</label>
                <textarea
                  id="privacy_content"
                  name="privacy_content"
                  rows={14}
                  value={form.privacy_content}
                  onChange={handleChange}
                  placeholder="Verantwortliche Stelle…"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md font-mono text-sm"
                />
              </div>
            </section>

            {message && (
              <p className={message.type === 'ok' ? 'text-green-600' : 'text-red-600'}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-graphite text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-4">
          <Link href={`/${locale}/impressum`} className="text-graphite underline hover:no-underline">
            Impressum on site →
          </Link>
          <Link href={`/${locale}/privacy`} className="text-graphite underline hover:no-underline">
            Privacy on site →
          </Link>
        </div>
      </main>
    </div>
  );
}
