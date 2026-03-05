'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { adminFetch } from '@/lib/adminApi';
import type { ContactSettings } from '@/lib/api';

const CONTENT_LOCALES = ['de', 'en', 'ru', 'it'] as const;

export default function AdminContactPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'de';
  const [editLocale, setEditLocale] = useState<(typeof CONTENT_LOCALES)[number]>('de');
  const [data, setData] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [form, setForm] = useState({
    address: '',
    working_hours: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const res = await adminFetch(`/contact-settings?locale=${editLocale}`);
      if (cancelled) return;
      if (!res.ok) {
        setMessage({ type: 'err', text: 'Failed to load contact settings' });
        setLoading(false);
        return;
      }
      const json = await res.json();
      const contact = json.data as ContactSettings | null;
      if (contact) {
        setData(contact);
        setForm({
          address: contact.address ?? '',
          working_hours: contact.working_hours ?? '',
          phone: contact.phone ?? '',
          email: contact.email ?? '',
        });
      } else {
        setForm({ address: '', working_hours: '', phone: '', email: '' });
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
      const res = await adminFetch('/contact-settings', {
        method: 'PUT',
        body: JSON.stringify({
          locale: editLocale,
          address: form.address.trim() || null,
          working_hours: form.working_hours.trim() || null,
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
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
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="font-serif text-2xl text-graphite mb-2">Contact settings</h1>
        <p className="text-mocha text-sm mb-6">
          Address, opening hours, phone, email. Shown in the contact block. Social links are edited in Hero.
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-graphite mb-1">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                placeholder="e.g. Street, City"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="working_hours" className="block text-sm font-medium text-graphite mb-1">Opening hours</label>
              <input
                id="working_hours"
                name="working_hours"
                type="text"
                value={form.working_hours}
                onChange={handleChange}
                placeholder="e.g. Mon–Fri 10–18, by appointment"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-graphite mb-1">Phone</label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleChange}
                placeholder="+49 ..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-graphite mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="studio@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

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

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link href={`/${locale}#contact`} className="text-graphite underline hover:no-underline">
            View contact block on site →
          </Link>
        </div>
      </main>
    </div>
  );
}
