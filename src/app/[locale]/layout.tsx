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
import {Providers} from '@/components/Providers';
import {getSiteSettings} from '@/lib/settings';
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
  const [messages, settings] = await Promise.all([
    getMessages(),
    getSiteSettings()
  ]);
  const dir = (locale as Locale) === 'ar' ? 'rtl' : 'ltr';

  // Inject brand settings as CSS vars so every subtree can honour them.
  const brandVars = `:root, [data-theme="dark"], [data-theme="light"] {
  --color-brand: ${settings.brandColor};
  --color-accent-spark: ${settings.accentSpark};
}
[data-brand-hero-photo="1"] .hero-photo-bg {
  background-image:
    linear-gradient(180deg, rgba(10,11,13,0.55) 0%, rgba(10,11,13,0.85) 60%, rgba(10,11,13,0.96) 100%),
    url("${settings.heroImageUrl ?? ''}");
  background-size: cover;
  background-position: center;
}`;

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fraunces.variable} ${archivo.variable} ${plexMono.variable} ${plexArabic.variable} ${kufi.variable}`}
      suppressHydrationWarning
      data-brand-hero-photo={settings.heroImageUrl ? '1' : '0'}
    >
      <head>
        <style dangerouslySetInnerHTML={{__html: brandVars}} />
      </head>
      <body className="min-h-screen">
        <div className="scroll-progress" aria-hidden />
        <Providers>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
