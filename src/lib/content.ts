import {and, eq} from 'drizzle-orm';
import {getLocale} from 'next-intl/server';
import {db} from '@/db/client';
import {sections} from '@/db/schema';

/**
 * Returns the content for a given section key in the current locale.
 *
 * Priority: DB row → null (caller falls back to next-intl `getTranslations`
 * for sections that have not yet been migrated or rows that are missing).
 *
 * Designed to be called inside server components only.
 */
export async function getSectionContent<T = unknown>(
  key: string
): Promise<T | null> {
  try {
    const locale = await getLocale();
    const [row] = await db
      .select({data: sections.data})
      .from(sections)
      .where(and(eq(sections.key, key), eq(sections.locale, locale)))
      .limit(1);
    return (row?.data as T | undefined) ?? null;
  } catch (err) {
    // If DB is unreachable, components should still render via i18n fallback.
    console.error(`[content] getSectionContent("${key}") failed:`, err);
    return null;
  }
}
