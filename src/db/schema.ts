import {
  pgTable,
  serial,
  text,
  varchar,
  jsonb,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', {length: 200}).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', {length: 30}).notNull().default('admin'),
  createdAt: timestamp('created_at', {withTimezone: true})
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {withTimezone: true})
    .notNull()
    .defaultNow()
});

export const sections = pgTable(
  'sections',
  {
    id: serial('id').primaryKey(),
    // Path like "home.hero", "home.models", "footer", "nav"
    key: varchar('key', {length: 120}).notNull(),
    // 'fr' | 'en' | 'ar'
    locale: varchar('locale', {length: 5}).notNull(),
    // Arbitrary JSON shape mirroring the i18n JSON node.
    data: jsonb('data').$type<unknown>().notNull(),
    updatedAt: timestamp('updated_at', {withTimezone: true})
      .notNull()
      .defaultNow(),
    updatedBy: text('updated_by')
  },
  (t) => [uniqueIndex('sections_key_locale_idx').on(t.key, t.locale)]
);

/**
 * Per-section meta (locale-agnostic): visibility toggle, accent colour
 * override, custom anchor id, notes for other editors.
 *
 * Keyed by `key` (e.g. 'home.hero'). One row per section key; locales all
 * share these settings.
 */
export type SectionSettingsData = {
  visible: boolean;
  accentColor: string | null; // null → use theme brand colour
  customAnchor: string | null; // null → use default anchor
  notes: string; // internal editor notes, not shown publicly
  order: number | null; // null → fall back to DEFAULT_HOME_ORDER index
};

export const DEFAULT_SECTION_SETTINGS: SectionSettingsData = {
  visible: true,
  accentColor: null,
  customAnchor: null,
  notes: '',
  order: null
};

export const sectionSettings = pgTable('section_settings_per_key', {
  id: serial('id').primaryKey(),
  key: varchar('key', {length: 120}).notNull().unique(),
  data: jsonb('data').$type<SectionSettingsData>().notNull(),
  updatedAt: timestamp('updated_at', {withTimezone: true})
    .notNull()
    .defaultNow(),
  updatedBy: text('updated_by')
});

/**
 * Immutable revision log. Every save inserts the PREVIOUS state here
 * before the write goes through, so any edit is revertable.
 */
export const sectionRevisions = pgTable('section_revisions', {
  id: serial('id').primaryKey(),
  key: varchar('key', {length: 120}).notNull(),
  locale: varchar('locale', {length: 5}).notNull(),
  data: jsonb('data').$type<unknown>().notNull(),
  createdAt: timestamp('created_at', {withTimezone: true})
    .notNull()
    .defaultNow(),
  createdBy: text('created_by')
});

/**
 * Global site settings — one row keyed by `scope`.
 * Default scope is 'global'. Values are stored as JSON so we can grow the
 * shape without schema churn.
 */
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  scope: varchar('scope', {length: 40}).notNull().unique().default('global'),
  data: jsonb('data').$type<unknown>().notNull(),
  updatedAt: timestamp('updated_at', {withTimezone: true})
    .notNull()
    .defaultNow(),
  updatedBy: text('updated_by')
});

export type SiteSettings = {
  brandColor: string; // e.g. '#e8a948'
  accentSpark: string; // secondary accent
  heroImageUrl: string | null; // optional hero photo
  logoText: string; // 'DiaCorp.Energy' or custom
  tagline: string; // short tagline shown under logo in footer
  showPartnersMarquee: boolean;
  showAnchorLoi: boolean;
  showImpactStrip: boolean;
  contactEmail: string;
  theme: 'dark' | 'light' | 'auto';
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandColor: '#e8a948',
  accentSpark: '#56f0c8',
  heroImageUrl: null,
  logoText: 'DiaCorp.Energy',
  tagline: '',
  showPartnersMarquee: true,
  showAnchorLoi: true,
  showImpactStrip: true,
  contactEmail: 'contact@diacorp.energy',
  theme: 'dark'
};

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Section = typeof sections.$inferSelect;
export type NewSection = typeof sections.$inferInsert;
export type SiteSettingsRow = typeof siteSettings.$inferSelect;
