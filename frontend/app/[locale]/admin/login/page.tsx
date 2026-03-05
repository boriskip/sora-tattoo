'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getApiUrl } from '@/lib/api';
import { setAdminToken } from '@/lib/adminAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'de';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || data.errors?.email?.[0] || 'Ошибка входа');
        return;
      }
      setAdminToken(data.token);
      router.replace(`/${locale}/admin`);
      router.refresh();
    } catch {
      setError('Ошибка сети. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-graphite/5 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="font-serif text-2xl tracking-wide text-graphite mb-2">
          Sora Tattoo Admin
        </h1>
        <p className="text-mocha text-sm mb-6">Войдите для управления контентом</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-graphite mb-1">
              Эл. почта
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-graphite mb-1">
              Пароль
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-graphite text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-60 transition"
          >
            {loading ? 'Вход…' : 'Войти'}
          </button>
        </form>

        <p className="mt-6 text-xs text-mocha">
          По умолчанию: admin@sora-tattoo.local / admin123
        </p>
      </div>
    </div>
  );
}
