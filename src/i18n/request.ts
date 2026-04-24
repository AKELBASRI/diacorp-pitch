import {hasLocale} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import {eq} from 'drizzle-orm';

/**
 * Per-request i18n config.
 *
 * Strategy: load the static JSON messages as a base, then overlay the DB
 * `sections` rows for the current locale. This keeps every existing
 * `getTranslations('home.hero')` call working unchanged, while letting admins
 * edit any text through the dashboard. If the DB is unreachable, the static
 * JSON is used verbatim (graceful degradation).
 */
export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const base = (await import(`../messages/${locale}.json`)).default as Record<
    string,
    unknown
  >;

  const messages = await overlayDbMessages(base, locale);

  return {locale, messages};
});

async function overlayDbMessages(
  base: Record<string, unknown>,
  locale: string
): Promise<Record<string, unknown>> {
  try {
    const {db} = await import('@/db/client');
    const {sections} = await import('@/db/schema');
    const rows = await db
      .select({key: sections.key, data: sections.data})
      .from(sections)
      .where(eq(sections.locale, locale));

    // Deep-clone base so we don't mutate the imported module cache.
    const merged: Record<string, unknown> = structuredClone(base);

    for (const {key, data} of rows) {
      // Keys come in two forms:
      //   top-level, e.g. "meta", "nav", "footer"
      //   nested under home, e.g. "home.hero", "home.activities"
      // Since we seed home.* as "home.hero" etc., we assign by dotted path.
      setDotted(merged, key, data as unknown);
    }

    return merged;
  } catch (err) {
    console.error('[i18n] overlayDbMessages failed — falling back to JSON:', err);
    return base;
  }
}

function setDotted(obj: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split('.');
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i]!;
    if (typeof cur[k] !== 'object' || cur[k] === null) cur[k] = {};
    cur = cur[k] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]!] = value;
}
