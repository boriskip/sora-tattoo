'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api';
import { getAdminToken, removeAdminToken, getAdminAuthHeaders } from '@/lib/adminAuth';
import Link from 'next/link';

const LOCALES = ['de', 'en', 'ru', 'it'];

const LABELS: Record<string, Record<string, string>> = {
  de: {
    title: 'Übersicht',
    subtitle: 'Inhalte der Website bearbeiten.',
    hero: 'Startbild',
    about: 'Über uns',
    artists: 'Künstler',
    works: 'Arbeiten',
    styles: 'Stile',
    info: 'Information (Guides)',
    contact: 'Kontakt',
    legal: 'Impressum & Datenschutz',
    reviews: 'Bewertungen',
    logout: 'Abmelden',
    api: 'API',
    routes: 'Routen',
    authHeader: 'Header',
    authNote: '(Token wird nach Anmeldung gespeichert)',
    backToSite: '← Zur Website',
  },
  en: {
    title: 'Dashboard',
    subtitle: 'Edit website content.',
    hero: 'Hero',
    about: 'About',
    artists: 'Artists',
    works: 'Works',
    styles: 'Styles',
    info: 'Information (Guides)',
    contact: 'Contact',
    legal: 'Imprint & Privacy',
    reviews: 'Reviews',
    logout: 'Log out',
    api: 'API',
    routes: 'Routes',
    authHeader: 'Header',
    authNote: '(token is saved after login)',
    backToSite: '← To site',
  },
  ru: {
    title: 'Панель управления',
    subtitle: 'Редактирование контента сайта.',
    hero: 'Главный экран',
    about: 'О нас',
    artists: 'Мастера',
    works: 'Работы',
    styles: 'Стили',
    info: 'Информация (гайды)',
    contact: 'Контакт',
    legal: 'Импрессум и конфиденциальность',
    reviews: 'Отзывы',
    logout: 'Выйти',
    api: 'API',
    routes: 'Маршруты',
    authHeader: 'Заголовок',
    authNote: '(токен сохраняется после входа)',
    backToSite: '← На сайт',
  },
  it: {
    title: 'Pannello',
    subtitle: 'Modifica i contenuti del sito.',
    hero: 'Hero',
    about: 'Chi siamo',
    artists: 'Artisti',
    works: 'Lavori',
    styles: 'Stili',
    info: 'Informazioni (guide)',
    contact: 'Contatti',
    legal: 'Impronta & Privacy',
    reviews: 'Recensioni',
    logout: 'Esci',
    api: 'API',
    routes: 'Route',
    authHeader: 'Header',
    authNote: '(token salvato dopo l\'accesso)',
    backToSite: '← Al sito',
  },
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = (pathname && LOCALES.includes(pathname.split('/')[1]) ? pathname.split('/')[1] : 'de') as string;
  const t = LABELS[locale] ?? LABELS.de;
  const [apiUrl, setApiUrl] = useState<string>('');
  useEffect(() => setApiUrl(getApiUrl()), []);

  const handleLogout = async () => {
    const token = getAdminToken();
    if (token) {
      try {
        const apiUrl = getApiUrl();
        await fetch(`${apiUrl}/logout`, {
          method: 'POST',
          headers: { ...getAdminAuthHeaders(), 'Content-Type': 'application/json' },
        });
      } catch {
        // ignore
      }
      removeAdminToken();
    }
    router.replace(`/${locale}/admin/login`);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-graphite/5">
      <header className="bg-graphite text-white py-4 px-6 flex justify-between items-center">
        <span className="font-serif text-xl tracking-wide">Sora Tattoo Admin</span>
        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition"
        >
          {t.logout}
        </button>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="font-serif text-2xl text-graphite mb-6">{t.title}</h1>
        <p className="text-mocha mb-6">{t.subtitle}</p>
        <nav className="mb-8 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/admin/hero`}
            className="px-4 py-2.5 bg-graphite text-white font-medium rounded-lg hover:opacity-90"
          >
            {t.hero}
          </Link>
          <Link
            href={`/${locale}/admin/about`}
            className="px-4 py-2.5 bg-graphite text-white font-medium rounded-lg hover:opacity-90"
          >
            {t.about}
          </Link>
          <Link
            href={`/${locale}/admin/artists`}
            className="px-4 py-2.5 bg-graphite text-white font-medium rounded-lg hover:opacity-90"
          >
            {t.artists}
          </Link>
          <Link
            href={`/${locale}/admin/works`}
            className="px-4 py-2.5 bg-graphite text-white font-medium rounded-lg hover:opacity-90"
          >
            {t.works}
          </Link>
          <Link
            href={`/${locale}/admin/styles`}
            className="px-4 py-2.5 bg-graphite text-white font-medium rounded-lg hover:opacity-90"
          >
            {t.styles}
          </Link>
          <Link
            href={`/${locale}/admin/info`}
            className="px-4 py-2.5 bg-graphite text-white font-medium rounded-lg hover:opacity-90"
          >
            {t.info}
          </Link>
          <Link
            href={`/${locale}/admin/contact`}
            className="px-4 py-2.5 bg-graphite text-white font-medium rounded-lg hover:opacity-90"
          >
            {t.contact}
          </Link>
          <Link
            href={`/${locale}/admin/legal`}
            className="px-4 py-2.5 bg-graphite text-white font-medium rounded-lg hover:opacity-90"
          >
            {t.legal}
          </Link>
          <Link
            href={`/${locale}/admin/reviews`}
            className="px-4 py-2.5 bg-graphite text-white font-medium rounded-lg hover:opacity-90"
          >
            {t.reviews}
          </Link>
        </nav>
        <ul className="space-y-2 text-graphite text-sm">
          <li>
            <strong>{t.api}:</strong> <code className="text-sm bg-gray-100 px-1 rounded">{apiUrl || '…'}</code>
          </li>
          <li>
            <strong>{t.routes}:</strong> GET/PUT <code className="text-sm bg-gray-100 px-1 rounded">/admin/hero-settings</code>,{' '}
            <code className="text-sm bg-gray-100 px-1 rounded">/admin/about</code>,{' '}
            <code className="text-sm bg-gray-100 px-1 rounded">/admin/styles</code>,{' '}
            <code className="text-sm bg-gray-100 px-1 rounded">/admin/contact-settings</code>,{' '}
            <code className="text-sm bg-gray-100 px-1 rounded">/admin/legal</code>,{' '}
            <code className="text-sm bg-gray-100 px-1 rounded">/admin/reviews</code>
          </li>
          <li>
            <strong>{t.authHeader}:</strong> <code className="text-sm bg-gray-100 px-1 rounded">Authorization: Bearer &lt;token&gt;</code>
            {' '}{t.authNote}
          </li>
        </ul>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link href={`/${locale}`} className="text-graphite underline hover:no-underline">
            {t.backToSite}
          </Link>
        </div>
      </main>
    </div>
  );
}
