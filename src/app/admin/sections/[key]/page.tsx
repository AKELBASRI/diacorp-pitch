import {revalidatePath} from 'next/cache';
import Link from 'next/link';
import {notFound, redirect} from 'next/navigation';
import {and, eq, desc} from 'drizzle-orm';
import {db} from '@/db/client';
import {
  sections,
  sectionSettings,
  sectionRevisions,
  DEFAULT_SECTION_SETTINGS,
  type SectionSettingsData
} from '@/db/schema';
import {getSession} from '@/lib/auth';
import {SectionEditor} from './editor';
import {SectionSidebar} from './sidebar';

export const dynamic = 'force-dynamic';

const LOCALES = ['fr', 'en', 'ar'] as const;
type Locale = (typeof LOCALES)[number];

// Section keys we know about — mirrors the CATEGORIES list in /admin so the
// editor can bootstrap a row that hasn't been seeded yet (the saveAction
// upserts on first publish).
const KNOWN_KEYS = new Set<string>([
  'home.hero',
  'home.impact',
  'home.capabilities',
  'home.howItWorks',
  'home.activities',
  'home.models',
  'home.scenarios',
  'home.services',
  'home.products',
  'home.projects',
  'home.track',
  'home.partners',
  'home.anchor',
  'home.loi',
  'home.team',
  'home.contact',
  'servicesPage',
  'contactPage',
  'register',
  'hero',
  'thesis',
  'positioning',
  'strategies',
  'financials',
  'timeline',
  'team',
  'cta',
  'gallery',
  'meta',
  'nav',
  'footer'
]);

async function saveAction(formData: FormData) {
  'use server';
  const sess = await getSession();
  if (!sess.userId) redirect('/admin/login');

  const key = String(formData.get('__key') ?? '');
  if (!key) throw new Error('missing key');
  const editor = sess.email ?? String(sess.userId);

  // Content per locale
  for (const locale of LOCALES) {
    const raw = String(formData.get(`data_${locale}`) ?? '');
    if (!raw) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      throw new Error(`Invalid JSON for locale=${locale}: ${(e as Error).message}`);
    }

    // Snapshot previous into revisions before overwrite
    const [prev] = await db
      .select({data: sections.data})
      .from(sections)
      .where(and(eq(sections.key, key), eq(sections.locale, locale)))
      .limit(1);
    if (prev) {
      await db.insert(sectionRevisions).values({
        key,
        locale,
        data: prev.data as object,
        createdBy: editor
      });
    }

    // Upsert: insert if missing, update if present. The unique index on
    // (key, locale) lets us collapse this into a single statement that works
    // whether or not a row was previously seeded.
    await db
      .insert(sections)
      .values({
        key,
        locale,
        data: parsed as object,
        updatedBy: editor
      })
      .onConflictDoUpdate({
        target: [sections.key, sections.locale],
        set: {
          data: parsed as object,
          updatedAt: new Date(),
          updatedBy: editor
        }
      });
  }

  // Per-section settings (visibility, accent, anchor, notes).
  // Preserve `order` from the existing row since this form doesn't expose it
  // (that's managed in /admin/layout).
  const [existing] = await db
    .select({data: sectionSettings.data})
    .from(sectionSettings)
    .where(eq(sectionSettings.key, key))
    .limit(1);
  const existingData = (existing?.data as Partial<SectionSettingsData> | undefined) ?? {};
  const settings: SectionSettingsData = {
    ...DEFAULT_SECTION_SETTINGS,
    ...existingData,
    visible: formData.get('settings_visible') === 'on',
    accentColor: normaliseColor(String(formData.get('settings_accent') ?? '')),
    customAnchor: normaliseAnchor(String(formData.get('settings_anchor') ?? '')),
    notes: String(formData.get('settings_notes') ?? '')
  };
  await db
    .insert(sectionSettings)
    .values({key, data: settings, updatedBy: editor})
    .onConflictDoUpdate({
      target: sectionSettings.key,
      set: {data: settings, updatedAt: new Date(), updatedBy: editor}
    });

  revalidatePath('/', 'layout');
  for (const l of LOCALES) revalidatePath(`/${l}`, 'layout');
  redirect(`/admin/sections/${encodeURIComponent(key)}?saved=1`);
}

async function revertAction(formData: FormData) {
  'use server';
  const sess = await getSession();
  if (!sess.userId) redirect('/admin/login');
  const revisionId = Number(formData.get('__revisionId'));
  const key = String(formData.get('__key') ?? '');
  if (!revisionId || !key) throw new Error('missing');

  const [rev] = await db
    .select()
    .from(sectionRevisions)
    .where(eq(sectionRevisions.id, revisionId))
    .limit(1);
  if (!rev) throw new Error('revision not found');

  // Snapshot current before reverting
  const [cur] = await db
    .select({data: sections.data})
    .from(sections)
    .where(and(eq(sections.key, rev.key), eq(sections.locale, rev.locale)))
    .limit(1);
  if (cur) {
    await db.insert(sectionRevisions).values({
      key: rev.key,
      locale: rev.locale,
      data: cur.data as object,
      createdBy: (sess.email ?? String(sess.userId)) + ' (pre-revert)'
    });
  }

  await db
    .update(sections)
    .set({
      data: rev.data as object,
      updatedAt: new Date(),
      updatedBy: (sess.email ?? String(sess.userId)) + ' (revert)'
    })
    .where(and(eq(sections.key, rev.key), eq(sections.locale, rev.locale)));

  revalidatePath('/', 'layout');
  for (const l of LOCALES) revalidatePath(`/${l}`, 'layout');
  redirect(`/admin/sections/${encodeURIComponent(key)}?reverted=1`);
}

function normaliseColor(v: string): string | null {
  const t = v.trim();
  if (!t) return null;
  if (/^#[0-9a-fA-F]{3,8}$/.test(t)) return t;
  return null;
}

function normaliseAnchor(v: string): string | null {
  const t = v.trim().replace(/^#/, '');
  if (!t) return null;
  if (!/^[a-z0-9-]+$/.test(t)) return null;
  return t;
}

export default async function SectionEditPage({
  params,
  searchParams
}: {
  params: Promise<{key: string}>;
  searchParams: Promise<{saved?: string; reverted?: string}>;
}) {
  const sess = await getSession();
  if (!sess.userId) redirect('/admin/login');

  const {key} = await params;
  await searchParams; // read to opt in to dynamic

  const [rows, settingsRow, revisions] = await Promise.all([
    db.select().from(sections).where(eq(sections.key, key)),
    db
      .select()
      .from(sectionSettings)
      .where(eq(sectionSettings.key, key))
      .limit(1),
    db
      .select({
        id: sectionRevisions.id,
        locale: sectionRevisions.locale,
        createdAt: sectionRevisions.createdAt,
        createdBy: sectionRevisions.createdBy
      })
      .from(sectionRevisions)
      .where(eq(sectionRevisions.key, key))
      .orderBy(desc(sectionRevisions.createdAt))
      .limit(15)
  ]);

  // We intentionally do NOT 404 when rows are missing. The editor is allowed
  // to bootstrap a section that has no DB row yet — the upsert in saveAction
  // will create it on first publish. Only unknown section keys (not in any
  // category) fall through to notFound below.
  const byLocale = new Map<string, (typeof rows)[number]>();
  for (const r of rows) byLocale.set(r.locale, r);

  if (rows.length === 0 && !KNOWN_KEYS.has(key)) notFound();

  // For locales with no DB row, fall back to the static i18n JSON at the
  // matching dotted-path. This gives the form a shape to edit, and the
  // upsert on save will create the row. Without this, an editor opened on a
  // never-seeded section would show nothing.
  async function fallbackForLocale(locale: Locale): Promise<unknown> {
    if (byLocale.has(locale)) return byLocale.get(locale)!.data;
    try {
      const mod = (await import(`@/messages/${locale}.json`)) as {
        default: Record<string, unknown>;
      };
      return getDottedPath(mod.default, key) ?? null;
    } catch {
      return null;
    }
  }
  const [frData, enData, arData] = await Promise.all([
    fallbackForLocale('fr'),
    fallbackForLocale('en'),
    fallbackForLocale('ar')
  ]);

  const settings: SectionSettingsData = {
    ...DEFAULT_SECTION_SETTINGS,
    ...((settingsRow[0]?.data as Partial<SectionSettingsData> | undefined) ?? {})
  };

  return (
    <>
      <nav className="admin-nav">
        <div className="admin-nav-inner">
          <div>
            <div className="admin-brand">
              DiaCorp<span>.</span>Admin
            </div>
            <div className="admin-sub">Editing · {key}</div>
          </div>
          <div style={{display: 'flex', gap: 16}}>
            <Link href="/admin" className="nav-link">
              ← All sections
            </Link>
            <a href={livePreviewUrl(key)} target="_blank" className="nav-link">
              Preview on site ↗
            </a>
          </div>
        </div>
      </nav>

      <main className="edit-shell">
        <div className="edit-main">
          <h1
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              marginBottom: 6
            }}
          >
            {prettify(key)}
          </h1>
          <p className="hint" style={{marginBottom: 22}}>
            Edit content per locale. Save publishes live in ~2 seconds.
          </p>

          <form action={saveAction}>
            <input type="hidden" name="__key" value={key} />

            <SectionEditor
              sectionKey={key}
              data={{fr: frData, en: enData, ar: arData}}
            />

            <div className="sticky-save">
              <button type="submit" className="btn btn-primary">
                Save & publish
              </button>
              <Link href="/admin" className="btn">
                Cancel
              </Link>
              <span
                style={{
                  color: '#6b675e',
                  fontSize: 11,
                  fontFamily: 'ui-monospace, monospace',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase'
                }}
              >
                Section key: {key}
              </span>
            </div>

            <SectionSidebar
              sectionKey={key}
              settings={settings}
              revisions={revisions.map((r) => ({
                id: r.id,
                locale: r.locale,
                createdAt: r.createdAt,
                createdBy: r.createdBy
              }))}
              contentByLocale={{fr: frData, en: enData, ar: arData}}
              lastEdited={{
                updatedAt: byLocale.get('fr')?.updatedAt ?? null,
                updatedBy: byLocale.get('fr')?.updatedBy ?? null
              }}
              revertAction={revertAction}
            />
          </form>
        </div>
      </main>

      <style>{`
        .edit-shell {
          max-width: 1400px;
          margin: 0 auto;
          padding: 36px 24px 120px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 1100px) {
          .edit-shell { grid-template-columns: minmax(0, 1fr) 360px; }
          .edit-main { grid-column: 1; }
          .side-col { grid-column: 2; }
        }
        .sticky-save {
          position: sticky;
          bottom: 0;
          padding: 14px 16px;
          margin-top: 24px;
          background: linear-gradient(180deg, rgba(10,11,13,0.5), rgba(10,11,13,0.95));
          border-top: 1px solid #1e2024;
          backdrop-filter: blur(12px);
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          z-index: 5;
        }
      `}</style>
    </>
  );
}

function getDottedPath(obj: unknown, path: string): unknown {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return cur;
}

function prettify(key: string): string {
  if (key.startsWith('home.')) {
    const rest = key.slice(5);
    return 'Home / ' + rest.charAt(0).toUpperCase() + rest.slice(1);
  }
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function livePreviewUrl(key: string): string {
  const anchors: Record<string, string> = {
    'home.hero': '/fr',
    'home.impact': '/fr',
    'home.capabilities': '/fr',
    'home.activities': '/fr#activites',
    'home.models': '/fr#models',
    'home.scenarios': '/fr#scenarios',
    'home.services': '/fr',
    'home.products': '/fr#produits',
    'home.projects': '/fr#projets',
    'home.track': '/fr#references',
    'home.partners': '/fr',
    'home.anchor': '/fr#anchor',
    'home.loi': '/fr#loi',
    'home.team': '/fr',
    'home.contact': '/fr',
    servicesPage: '/fr/services',
    contactPage: '/fr/contact',
    register: '/fr/register',
    thesis: '/fr/pitch',
    positioning: '/fr/pitch',
    strategies: '/fr/pitch',
    financials: '/fr/pitch',
    timeline: '/fr/pitch',
    nav: '/fr',
    footer: '/fr',
    meta: '/fr'
  };
  return anchors[key] ?? '/fr';
}
