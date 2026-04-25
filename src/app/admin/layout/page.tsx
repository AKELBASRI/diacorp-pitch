import {revalidatePath} from 'next/cache';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {eq, inArray} from 'drizzle-orm';
import {db} from '@/db/client';
import {
  sectionSettings,
  DEFAULT_SECTION_SETTINGS,
  type SectionSettingsData
} from '@/db/schema';
import {getSession} from '@/lib/auth';
import {DEFAULT_HOME_ORDER, SECTION_LABEL} from '@/lib/homeLayout';
import {LayoutEditor} from './editor';

export const dynamic = 'force-dynamic';

async function saveAction(formData: FormData) {
  'use server';
  const sess = await getSession();
  if (!sess.userId) redirect('/admin/login');
  const editor = sess.email ?? String(sess.userId);

  const raw = String(formData.get('layout') ?? '');
  const parsed = JSON.parse(raw) as Array<{
    key: string;
    visible: boolean;
    order: number;
  }>;

  // Fetch existing settings for the touched keys so we can preserve fields
  // we don't manage from this page (accentColor, customAnchor, notes).
  const keys = parsed.map((p) => p.key);
  const existing = await db
    .select()
    .from(sectionSettings)
    .where(inArray(sectionSettings.key, keys));
  const existingMap = new Map(
    existing.map((r) => [r.key, (r.data ?? DEFAULT_SECTION_SETTINGS) as SectionSettingsData])
  );

  for (const item of parsed) {
    const prev = existingMap.get(item.key) ?? DEFAULT_SECTION_SETTINGS;
    const next: SectionSettingsData = {
      ...DEFAULT_SECTION_SETTINGS,
      ...prev,
      visible: item.visible,
      order: item.order
    };
    await db
      .insert(sectionSettings)
      .values({key: item.key, data: next, updatedBy: editor})
      .onConflictDoUpdate({
        target: sectionSettings.key,
        set: {data: next, updatedAt: new Date(), updatedBy: editor}
      });
  }

  revalidatePath('/', 'layout');
  redirect('/admin/layout?saved=1');
}

export default async function LayoutPage({
  searchParams
}: {
  searchParams: Promise<{saved?: string}>;
}) {
  const sess = await getSession();
  if (!sess.userId) redirect('/admin/login');
  const sp = await searchParams;

  const keys = [...DEFAULT_HOME_ORDER];
  const settingsRows = await db
    .select()
    .from(sectionSettings)
    .where(inArray(sectionSettings.key, keys));

  const settingsMap = new Map<string, SectionSettingsData>();
  for (const r of settingsRows) {
    settingsMap.set(r.key, {
      ...DEFAULT_SECTION_SETTINGS,
      ...((r.data ?? {}) as Partial<SectionSettingsData>)
    });
  }

  const items = keys
    .map((key, defaultIdx) => {
      const s = settingsMap.get(key) ?? DEFAULT_SECTION_SETTINGS;
      return {
        key,
        label: SECTION_LABEL[key],
        visible: s.visible,
        order: s.order ?? defaultIdx
      };
    })
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <nav className="admin-nav">
        <div className="admin-nav-inner">
          <div>
            <div className="admin-brand">
              DiaCorp<span>.</span>Admin
            </div>
            <div className="admin-sub">Page layout · homepage</div>
          </div>
          <div style={{display: 'flex', gap: 20, alignItems: 'center'}}>
            <Link href="/admin" className="nav-link">
              Content
            </Link>
            <Link href="/admin/layout" className="nav-link" style={{color: 'var(--admin-accent)', borderBottomColor: 'var(--admin-accent)'}}>
              Layout
            </Link>
            <Link href="/admin/prospects" className="nav-link">
              Prospects
            </Link>
            <Link href="/admin/settings" className="nav-link">
              Site settings
            </Link>
            <a href="/fr" target="_blank" className="nav-link">
              View site ↗
            </a>
          </div>
        </div>
      </nav>

      <main className="admin-container">
        <h1 className="admin-h1">Homepage layout</h1>
        <p className="admin-h1-sub">
          Drag sections to reorder. Toggle visibility to remove a section from
          the site without losing its content — it stays editable and can be
          added back any time.
        </p>

        {sp?.saved === '1' && (
          <div
            style={{
              padding: 14,
              marginBottom: 24,
              border: '1px solid var(--admin-accent-2)',
              background: 'color-mix(in oklch, var(--admin-accent-2) 8%, transparent)',
              color: 'var(--admin-accent-2)',
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em'
            }}
          >
            ✓ Layout saved and published.
          </div>
        )}

        <form action={saveAction}>
          <LayoutEditor initial={items} />
        </form>
      </main>
    </>
  );
}
