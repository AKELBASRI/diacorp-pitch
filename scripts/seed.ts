/**
 * Seed the sections table from the i18n JSON files and create the initial admin user.
 *
 * Usage (from inside the web container or locally with DATABASE_URL set):
 *   npx tsx scripts/seed.ts
 *
 * Env:
 *   DATABASE_URL          Postgres connection string (required)
 *   ADMIN_EMAIL           Email for the first admin (required on first run)
 *   ADMIN_PASSWORD        Plaintext password for the first admin (required on first run)
 *   SEED_RESET_SECTIONS   If '1', wipe + reseed the sections table. Default: upsert.
 */
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import {sql} from 'drizzle-orm';
import {db} from '../src/db/client';
import {sections, users} from '../src/db/schema';

const LOCALES = ['fr', 'en', 'ar'] as const;
type Locale = (typeof LOCALES)[number];

// Which top-level keys we mirror into the sections table.
// Top-level of each i18n file: meta, nav, servicesPage, contactPage, register, home, gallery, hero, thesis, positioning, strategies, financials, timeline, team, cta, footer
// We flatten `home.*` to separate section rows (home.hero, home.capabilities, ...).
// Other top-level blocks are stored as a single row per (key, locale).
const TOP_KEYS_AS_IS = [
  'meta',
  'nav',
  'servicesPage',
  'contactPage',
  'register',
  'gallery',
  'thesis',
  'positioning',
  'strategies',
  'financials',
  'timeline',
  'team',
  'cta',
  'footer'
] as const;

type I18nTree = Record<string, unknown>;

async function loadTree(locale: Locale): Promise<I18nTree> {
  const p = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  const raw = await readFile(p, 'utf-8');
  return JSON.parse(raw) as I18nTree;
}

function splitSections(tree: I18nTree): Array<{key: string; data: unknown}> {
  const out: Array<{key: string; data: unknown}> = [];
  for (const k of TOP_KEYS_AS_IS) {
    if (tree[k] !== undefined) out.push({key: k, data: tree[k]});
  }
  const home = tree['home'] as Record<string, unknown> | undefined;
  if (home && typeof home === 'object') {
    for (const [sub, val] of Object.entries(home)) {
      out.push({key: `home.${sub}`, data: val});
    }
  }
  return out;
}

async function seedSections() {
  const reset = process.env.SEED_RESET_SECTIONS === '1';
  if (reset) {
    console.log('  wiping sections…');
    await db.execute(sql`TRUNCATE TABLE sections RESTART IDENTITY`);
  }

  let count = 0;
  for (const locale of LOCALES) {
    const tree = await loadTree(locale);
    const rows = splitSections(tree);
    for (const {key, data} of rows) {
      await db
        .insert(sections)
        .values({
          key,
          locale,
          data: data as object,
          updatedBy: 'seed'
        })
        .onConflictDoUpdate({
          target: [sections.key, sections.locale],
          set: {data: data as object, updatedAt: new Date(), updatedBy: 'seed'}
        });
      count += 1;
    }
  }
  console.log(`  seeded ${count} section rows across ${LOCALES.length} locales.`);
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const pw = process.env.ADMIN_PASSWORD;

  const [existing] = await db
    .select({id: users.id, email: users.email})
    .from(users)
    .limit(1);
  if (existing) {
    console.log(`  admin already present: ${existing.email}`);
    return;
  }

  if (!email || !pw) {
    throw new Error(
      'No admin exists and ADMIN_EMAIL / ADMIN_PASSWORD not provided. Re-run with those env vars set.'
    );
  }

  const hash = await bcrypt.hash(pw, 12);
  await db.insert(users).values({email, passwordHash: hash, role: 'admin'});
  console.log(`  admin created: ${email}`);
}

async function main() {
  console.log('🌱  seeding database…');
  console.log('  sections:');
  await seedSections();
  console.log('  admin user:');
  await seedAdmin();
  console.log('✅  done.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ seed failed:', err);
    process.exit(1);
  });
