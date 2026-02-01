import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { requestLocale } from 'next-intl/server';

export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'de';

export default getRequestConfig(async () => {
  const locale = await requestLocale();

  if (!locales.includes(locale as Locale)) notFound();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

