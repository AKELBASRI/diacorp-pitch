import {eq} from 'drizzle-orm';
import {db} from '@/db/client';
import {
  siteSettings,
  DEFAULT_SITE_SETTINGS,
  type SiteSettings
} from '@/db/schema';

/**
 * Fetch the global site settings, merged over defaults so a missing key
 * never crashes a component.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const [row] = await db
      .select({data: siteSettings.data})
      .from(siteSettings)
      .where(eq(siteSettings.scope, 'global'))
      .limit(1);
    if (!row) return DEFAULT_SITE_SETTINGS;
    return {...DEFAULT_SITE_SETTINGS, ...(row.data as Partial<SiteSettings>)};
  } catch (err) {
    console.error('[settings] getSiteSettings failed — using defaults:', err);
    return DEFAULT_SITE_SETTINGS;
  }
}
