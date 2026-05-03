import Link from 'next/link';
import {redirect} from 'next/navigation';
import {getSession} from '@/lib/auth';
import {db} from '@/db/client';
import {sections, sectionRevisions} from '@/db/schema';
import {sql, desc} from 'drizzle-orm';
import {DashboardSearch} from './dashboard-search';

export const dynamic = 'force-dynamic';

async function logoutAction() {
  'use server';
  const sess = await getSession();
  sess.destroy();
  redirect('/admin/login');
}

type Row = {
  key: string;
  locales: number;
  updatedAt: Date | null;
  updatedBy: string | null;
};

const CATEGORIES: Array<{
  id: string;
  label: string;
  hint: string;
  accent: string;
  keys: string[];
}> = [
  {
    id: 'homepage',
    label: 'Homepage',
    hint: 'Sections visible on the landing page.',
    accent: '#e8a948',
    keys: [
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
      'home.contact'
    ]
  },
  {
    id: 'pages',
    label: 'Pages',
    hint: 'Dedicated pages accessed from the nav.',
    accent: '#56f0c8',
    keys: ['servicesPage', 'scenariosPage', 'contactPage', 'register']
  },
  {
    id: 'pitch',
    label: 'Investor pitch',
    hint: 'The /pitch deck sections.',
    accent: '#c9824a',
    keys: [
      'hero',
      'thesis',
      'positioning',
      'strategies',
      'financials',
      'timeline',
      'team',
      'cta',
      'gallery'
    ]
  },
  {
    id: 'global',
    label: 'Global',
    hint: 'Site-wide: nav labels, SEO, footer.',
    accent: '#a18cc8',
    keys: ['meta', 'nav', 'footer']
  }
];

const ICON: Record<string, string> = {
  'home.hero': '◉',
  'home.impact': '▤',
  'home.capabilities': '◊',
  'home.howItWorks': '↳',
  'home.activities': '❖',
  'home.models': '⇆',
  'home.scenarios': '?',
  'home.services': '✦',
  'home.products': '▣',
  'home.projects': '⬢',
  'home.track': '↯',
  'home.partners': '∞',
  'home.anchor': '⚓',
  'home.loi': '⎙',
  'home.team': '◌',
  'home.contact': '✉',
  servicesPage: '✦',
  scenariosPage: '?',
  contactPage: '✉',
  register: '⎙',
  hero: '◉',
  thesis: '☰',
  positioning: '⬥',
  strategies: '⬢',
  financials: '∑',
  timeline: '↯',
  team: '◌',
  cta: '→',
  gallery: '▧',
  meta: '⌖',
  nav: '☰',
  footer: '⎕'
};

export default async function AdminHome() {
  const sess = await getSession();
  if (!sess.userId) redirect('/admin/login');

  const [rows, revisionCount, lastRevision] = await Promise.all([
    db
      .select({
        key: sections.key,
        locales: sql<number>`count(*)::int`,
        updatedAt: sql<Date | null>`max(${sections.updatedAt})`,
        updatedBy: sql<string | null>`max(${sections.updatedBy})`
      })
      .from(sections)
      .groupBy(sections.key)
      .orderBy(sections.key),
    db.select({n: sql<number>`count(*)::int`}).from(sectionRevisions),
    db
      .select({
        createdAt: sectionRevisions.createdAt,
        createdBy: sectionRevisions.createdBy,
        key: sectionRevisions.key
      })
      .from(sectionRevisions)
      .orderBy(desc(sectionRevisions.createdAt))
      .limit(1)
  ]);

  const byKey = new Map(rows.map((r) => [r.key, r]));
  const usedKeys = new Set<string>();

  // Show every category key, whether or not it has a DB row yet. Keys with
  // no row render with locales=0 so the user sees a "not seeded" hint and
  // can still click in to bootstrap content via the editor (the upsert in
  // saveAction handles first-time publish).
  const grouped = CATEGORIES.map((cat) => {
    const items: Row[] = cat.keys.map((k) => {
      usedKeys.add(k);
      return (
        byKey.get(k) ?? {
          key: k,
          locales: 0,
          updatedAt: null,
          updatedBy: null
        }
      );
    });
    return {...cat, items};
  });

  const leftover: Row[] = rows.filter((r) => !usedKeys.has(r.key));
  if (leftover.length > 0) {
    grouped.push({
      id: 'other',
      label: 'Other',
      hint: 'Sections not yet categorised.',
      accent: '#6b675e',
      keys: leftover.map((r) => r.key),
      items: leftover
    });
  }

  const total = rows.length;
  const lastEditTs = rows.reduce<Date | null>((acc, r) => {
    if (!r.updatedAt) return acc;
    const d = new Date(r.updatedAt);
    if (!acc || d > acc) return d;
    return acc;
  }, null);

  return (
    <>
      <nav className="admin-nav">
        <div className="admin-nav-inner">
          <div>
            <div className="admin-brand">
              DiaCorp<span>.</span>Admin
            </div>
            <div className="admin-sub">Signed in as {sess.email}</div>
          </div>
          <div style={{display: 'flex', gap: 20, alignItems: 'center'}}>
            <Link href="/admin" className="nav-link" style={{color: 'var(--admin-accent)', borderBottomColor: 'var(--admin-accent)'}}>
              Content
            </Link>
            <Link href="/admin/layout" className="nav-link">
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
            <form action={logoutAction}>
              <button type="submit" className="btn btn-danger">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="admin-container">
        <h1 className="admin-h1">Content</h1>
        <p className="admin-h1-sub">
          Editable sections of the site, grouped by area. Every change is
          snapshotted into the revision log and goes live in ~2 seconds — no
          rebuild required.
        </p>

        {/* Stat cards */}
        <div className="stats">
          <StatCard label="Sections" value={String(total)} accent="#e8a948" hint={`${grouped.length} categories`} />
          <StatCard label="Locales" value="3" accent="#56f0c8" hint="FR · EN · AR" />
          <StatCard label="Revisions" value={String(revisionCount[0]?.n ?? 0)} accent="#c9824a" hint="Snapshots stored" />
          <StatCard
            label="Last edit"
            value={lastEditTs ? relativeTime(lastEditTs) : '—'}
            accent="#a18cc8"
            hint={lastRevision[0]?.createdBy ?? '—'}
          />
        </div>

        <div className="toolbar">
          <DashboardSearch />
        </div>

        {grouped.map((cat) =>
          cat.items.length === 0 ? null : (
            <section key={cat.id} style={{marginBottom: 44}} data-cat={cat.id}>
              <div className="cat-header">
                <span className="cat-dot" style={{background: cat.accent}} aria-hidden />
                <h2 className="cat-title">{cat.label}</h2>
                <span className="cat-count">{cat.items.length}</span>
                <span className="cat-hint">{cat.hint}</span>
              </div>

              <div className="tile-grid">
                {cat.items.map((r) => (
                  <Link
                    key={r.key}
                    href={`/admin/sections/${encodeURIComponent(r.key)}`}
                    className="tile"
                    data-search={`${prettify(r.key)} ${r.key}`.toLowerCase()}
                    style={{['--tile-accent' as string]: cat.accent}}
                  >
                    <span className="tile-accent" aria-hidden />
                    <div className="tile-top">
                      <span className="tile-icon" aria-hidden>
                        {ICON[r.key] ?? '◇'}
                      </span>
                      <span className="tile-loc">{r.locales} loc</span>
                    </div>
                    <div className="tile-title">{prettify(r.key)}</div>
                    <div className="tile-key">{r.key}</div>
                    <div className="tile-meta">
                      {r.updatedAt
                        ? relativeTime(new Date(r.updatedAt))
                        : '—'}
                      {r.updatedBy ? ` · ${r.updatedBy}` : ''}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        )}

        <style>{`
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 14px;
            margin-bottom: 28px;
          }
          .stat-card {
            position: relative;
            padding: 22px 20px;
            background: linear-gradient(165deg, rgba(18,20,24,0.85) 0%, rgba(14,17,20,0.85) 100%);
            border: 1px solid var(--admin-line);
            overflow: hidden;
          }
          .stat-card::before {
            content: "";
            position: absolute;
            top: 0; left: 0;
            width: 3px;
            height: 100%;
            background: var(--stat-accent);
          }
          .stat-card::after {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 100% 0%, color-mix(in oklch, var(--stat-accent) 14%, transparent), transparent 55%);
            pointer-events: none;
          }
          .stat-label {
            font-family: var(--font-mono);
            font-size: 10px;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: var(--admin-ink-3);
            margin-bottom: 10px;
            position: relative;
          }
          .stat-value {
            font-family: var(--font-display);
            font-size: 38px;
            font-weight: 400;
            letter-spacing: -0.025em;
            line-height: 1;
            margin-bottom: 8px;
            color: var(--stat-accent);
            position: relative;
          }
          .stat-hint {
            font-family: var(--font-mono);
            font-size: 10px;
            color: var(--admin-ink-3);
            letter-spacing: 0.05em;
            position: relative;
          }

          .toolbar {
            margin-bottom: 28px;
            display: flex;
            justify-content: flex-end;
          }

          .cat-header {
            display: flex;
            align-items: center;
            gap: 14px;
            padding-bottom: 14px;
            margin-bottom: 18px;
            border-bottom: 1px solid var(--admin-line);
            flex-wrap: wrap;
          }
          .cat-dot {
            width: 10px; height: 10px;
            transform: rotate(45deg);
            box-shadow: 0 0 20px currentColor;
          }
          .cat-title {
            font-family: var(--font-display);
            font-size: 22px;
            font-weight: 500;
            letter-spacing: -0.015em;
            margin: 0;
          }
          .cat-count {
            font-family: var(--font-mono);
            font-size: 10px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--admin-ink-3);
            border: 1px solid var(--admin-line-strong);
            padding: 3px 10px;
          }
          .cat-hint {
            color: var(--admin-ink-3);
            font-size: 12px;
            margin-inline-start: auto;
            font-style: italic;
          }

          .tile-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 12px;
          }
          .tile {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 22px 22px 18px;
            background: linear-gradient(180deg, rgba(18,20,24,0.6) 0%, rgba(14,17,20,0.6) 100%);
            border: 1px solid var(--admin-line);
            text-decoration: none;
            color: inherit;
            overflow: hidden;
            transition: transform .35s cubic-bezier(.16,1,.3,1), border-color .25s ease, background .25s ease;
          }
          .tile::after {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 100% 0%, color-mix(in oklch, var(--tile-accent) 12%, transparent), transparent 55%);
            opacity: 0;
            transition: opacity .4s ease;
            pointer-events: none;
          }
          .tile:hover {
            transform: translateY(-3px);
            border-color: var(--tile-accent);
            background: linear-gradient(180deg, rgba(20,25,30,0.8) 0%, rgba(16,20,25,0.8) 100%);
            box-shadow: var(--admin-shadow);
          }
          .tile:hover::after { opacity: 1; }
          .tile-accent {
            position: absolute;
            top: 0; left: 0;
            width: 3px; height: 100%;
            background: var(--tile-accent);
            opacity: 0.9;
          }
          html[dir="rtl"] .tile-accent { left: auto; right: 0; }
          .tile-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .tile-icon {
            font-size: 22px;
            line-height: 1;
            color: var(--tile-accent);
            opacity: 0.85;
            text-shadow: 0 0 16px color-mix(in oklch, var(--tile-accent) 40%, transparent);
          }
          .tile-loc {
            font-family: var(--font-mono);
            font-size: 9px;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: var(--admin-ink-3);
            padding: 2px 7px;
            border: 1px solid var(--admin-line);
          }
          .tile-title {
            font-family: var(--font-display);
            font-size: 19px;
            font-weight: 500;
            letter-spacing: -0.015em;
            line-height: 1.2;
            color: var(--admin-ink);
          }
          .tile-key {
            font-family: var(--font-mono);
            font-size: 10px;
            color: var(--admin-ink-3);
            letter-spacing: 0.04em;
          }
          .tile-meta {
            margin-top: 10px;
            font-family: var(--font-mono);
            font-size: 10px;
            color: var(--admin-ink-3);
            letter-spacing: 0.05em;
            padding-top: 10px;
            border-top: 1px dashed var(--admin-line);
          }
        `}</style>
      </main>
    </>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent
}: {
  label: string;
  value: string;
  hint?: string;
  accent: string;
}) {
  return (
    <div
      className="stat-card"
      style={{['--stat-accent' as string]: accent}}
    >
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  );
}

function prettify(key: string): string {
  if (key.startsWith('home.')) {
    const rest = key.slice(5);
    return rest.charAt(0).toUpperCase() + rest.slice(1);
  }
  const map: Record<string, string> = {
    servicesPage: 'Services page',
    contactPage: 'Contact page',
    register: 'Register / LOI wizard',
    hero: 'Pitch hero',
    thesis: 'Thesis',
    positioning: 'Positioning',
    strategies: 'Strategies',
    financials: 'Financials',
    timeline: 'Timeline',
    team: 'Team',
    cta: 'Pitch CTA',
    gallery: 'Gallery',
    meta: 'Meta / SEO',
    nav: 'Navigation',
    footer: 'Footer'
  };
  return map[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

function relativeTime(d: Date): string {
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'});
}
