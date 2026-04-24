import {eq} from 'drizzle-orm';
import {db} from '@/db/client';
import {
  sectionSettings,
  DEFAULT_SECTION_SETTINGS,
  type SectionSettingsData
} from '@/db/schema';

/**
 * Fetch per-section settings for a given key. Returns defaults when the row
 * doesn't exist or the DB call fails (keeps the site rendering no matter what).
 */
export async function getSectionSettings(
  key: string
): Promise<SectionSettingsData> {
  try {
    const [row] = await db
      .select({data: sectionSettings.data})
      .from(sectionSettings)
      .where(eq(sectionSettings.key, key))
      .limit(1);
    if (!row) return DEFAULT_SECTION_SETTINGS;
    return {
      ...DEFAULT_SECTION_SETTINGS,
      ...(row.data as Partial<SectionSettingsData>)
    };
  } catch (err) {
    console.error('[sectionSettings] failed, using defaults:', err);
    return DEFAULT_SECTION_SETTINGS;
  }
}
