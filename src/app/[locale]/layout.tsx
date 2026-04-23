import type {Metadata} from 'next';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {
  Fraunces,
  Archivo,
  IBM_Plex_Mono,
  IBM_Plex_Sans_Arabic,
  Noto_Kufi_Arabic
} from 'next/font/google';
import {routing, type Locale} from '@/i18n/routing';
import '../globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz']
});
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  display: 'swap'
});
const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600']
});
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: '--font-plex-ar',
  subsets: ['arabic'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700']
});
const kufi = Noto_Kufi_Arabic({
  variable: '--font-kufi',
  subsets: ['arabic'],
  display: 'swap',
  weight: ['300', '500', '700', '800']
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({locale, namespace: 'meta'});
  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = (locale as Locale) === 'ar' ? 'rtl' : 'ltr';

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fraunces.variable} ${archivo.variable} ${plexMono.variable} ${plexArabic.variable} ${kufi.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
