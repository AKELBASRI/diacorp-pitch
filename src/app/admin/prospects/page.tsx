import Link from 'next/link';
import {redirect} from 'next/navigation';
import {asc, desc, sql} from 'drizzle-orm';
import {db} from '@/db/client';
import {prospects, type ProspectStatus} from '@/db/schema';
import {getSession} from '@/lib/auth';
import {ProspectsToolbar} from './toolbar';
import {STATUS_META, sectorColor, mapsUrl} from './ui';

export const dynamic = 'force-dynamic';

export default async function ProspectsList({
  searchParams
}: {
  searchParams: Promise<{
    status?: string;
    sector?: string;
    sort?: string;
  }>;
}) {
  const sess = await getSession();
  if (!sess.userId) redirect('/admin/login');
  const sp = await searchParams;

  const sortKey = sp.sort ?? 'priority';
  const sortCol =
    sortKey === 'name'
      ? asc(prospects.name)
      : sortKey === 'city'
        ? asc(prospects.city)
        : sortKey === 'updated'
          ? desc(prospects.updatedAt)
          : asc(prospects.priority);

  const rows = await db.select().from(prospects).orderBy(sortCol);

  // Client-side filter is done by a tiny script in ProspectsToolbar; the DB
  // gives us all of them and we just toggle CSS visibility.
  const counts = await db
    .select({
      status: prospects.status,
      n: sql<number>`count(*)::int`
    })
    .from(prospects)
    .groupBy(prospects.status);
  const countByStatus = new Map(counts.map((c) => [c.status, c.n]));

  const sectors = Array.from(new Set(rows.map((r) => r.sector))).sort();

  return (
    <>
      <nav className="admin-nav">
        <div className="admin-nav-inner">
          <div>
            <div className="admin-brand">
              DiaCorp<span>.</span>Admin
            </div>
            <div className="admin-sub">Prospects pipeline</div>
          </div>
          <div style={{display: 'flex', gap: 20, alignItems: 'center'}}>
            <Link href="/admin" className="nav-link">Content</Link>
            <Link href="/admin/layout" className="nav-link">Layout</Link>
            <Link
              href="/admin/prospects"
              className="nav-link"
              style={{color: 'var(--admin-accent)', borderBottomColor: 'var(--admin-accent)'}}
            >
              Prospects
            </Link>
            <Link href="/admin/settings" className="nav-link">Site settings</Link>
            <a href="/fr" target="_blank" className="nav-link">View site ↗</a>
          </div>
        </div>
      </nav>

      <main className="admin-container">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
            marginBottom: 14,
            flexWrap: 'wrap'
          }}
        >
          <div>
            <h1 className="admin-h1">Prospects</h1>
            <p className="admin-h1-sub">
              Pipeline interne de prospects industriels Oriental — jamais affichée
              publiquement. Les adresses listées sont issues d'informations publiques
              et doivent être vérifiées sur Google Maps avant toute visite terrain.
            </p>
          </div>
          <Link href="/admin/prospects/new" className="btn btn-primary">
            + Add prospect
          </Link>
        </div>

        {/* Status pipeline summary */}
        <div className="pipeline">
          {(Object.keys(STATUS_META) as ProspectStatus[]).map((s) => (
            <div key={s} className="pipeline-cell" style={{['--p-accent' as string]: STATUS_META[s].color}}>
              <div className="pipeline-num">{countByStatus.get(s) ?? 0}</div>
              <div className="pipeline-label">{STATUS_META[s].label}</div>
            </div>
          ))}
        </div>

        <ProspectsToolbar sectors={sectors} />

        <div className="prospect-grid">
          {rows.map((r) => {
            const meta = STATUS_META[r.status as ProspectStatus] ?? STATUS_META.cold;
            const pri = r.priority === 1 ? 'high' : r.priority === 3 ? 'low' : 'med';
            return (
              <article
                key={r.id}
                className={`prospect-card pri-${pri}`}
                data-status={r.status}
                data-sector={r.sector}
                data-search={`${r.name} ${r.city} ${r.sector}`.toLowerCase()}
              >
                <div className="prospect-head">
                  <span className="prospect-status" style={{['--s-color' as string]: meta.color}}>
                    <span className="prospect-dot" />
                    {meta.label}
                  </span>
                  <span
                    className="prospect-pri"
                    title={
                      r.priority === 1
                        ? 'High priority'
                        : r.priority === 3
                          ? 'Low priority'
                          : 'Medium priority'
                    }
                  >
                    {r.priority === 1 ? '★★★' : r.priority === 3 ? '★' : '★★'}
                  </span>
                </div>

                <h3 className="prospect-name">{r.name}</h3>
                <div className="prospect-sector" style={{color: sectorColor(r.sector)}}>
                  {r.sector}
                </div>

                <div className="prospect-loc">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>
                    {r.city}
                    {r.address ? ' · ' + r.address : ''}
                  </span>
                </div>

                {r.estimatedMw && (
                  <div className="prospect-mw">
                    <span className="kicker">Estimated demand</span>
                    <span className="mw">{r.estimatedMw}</span>
                  </div>
                )}

                {r.energyProfile && (
                  <p className="prospect-profile">{r.energyProfile}</p>
                )}

                {r.notes && (
                  <p className="prospect-notes">📝 {r.notes}</p>
                )}

                <div className="prospect-actions">
                  <Link
                    href={`/admin/prospects/${r.id}`}
                    className="card-btn primary"
                  >
                    Open
                  </Link>
                  <a
                    href={mapsUrl(r.name, r.address ?? r.city)}
                    target="_blank"
                    rel="noopener"
                    className="card-btn"
                  >
                    Google Maps ↗
                  </a>
                  {r.website && (
                    <a
                      href={r.website}
                      target="_blank"
                      rel="noopener"
                      className="card-btn"
                    >
                      Site ↗
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <style>{`
          .pipeline {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 8px;
            margin-bottom: 24px;
          }
          .pipeline-cell {
            position: relative;
            padding: 16px 14px;
            background: linear-gradient(180deg, rgba(18,20,24,0.7), rgba(14,17,20,0.7));
            border: 1px solid var(--admin-line);
            overflow: hidden;
          }
          .pipeline-cell::before {
            content: "";
            position: absolute;
            top: 0; left: 0;
            width: 3px; height: 100%;
            background: var(--p-accent);
          }
          .pipeline-num {
            font-family: var(--font-display);
            font-size: 28px;
            font-weight: 400;
            color: var(--p-accent);
            letter-spacing: -0.02em;
            line-height: 1;
            margin-bottom: 6px;
          }
          .pipeline-label {
            font-family: var(--font-mono);
            font-size: 9px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--admin-ink-3);
          }

          .prospect-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 14px;
            margin-top: 24px;
          }
          .prospect-card {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 22px;
            background: linear-gradient(180deg, rgba(18,20,24,0.65), rgba(14,17,20,0.65));
            border: 1px solid var(--admin-line);
            transition: border-color .25s ease, transform .25s cubic-bezier(.16,1,.3,1);
          }
          .prospect-card:hover {
            border-color: var(--admin-line-strong);
            transform: translateY(-2px);
          }
          .prospect-card.pri-high {
            border-left: 3px solid var(--admin-accent);
          }
          html[dir="rtl"] .prospect-card.pri-high {
            border-left: 1px solid var(--admin-line);
            border-right: 3px solid var(--admin-accent);
          }

          .prospect-head {
            display: flex; justify-content: space-between; align-items: center;
          }
          .prospect-status {
            display: inline-flex; align-items: center; gap: 8px;
            font-family: var(--font-mono);
            font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
            color: var(--s-color);
          }
          .prospect-dot {
            width: 8px; height: 8px;
            background: var(--s-color);
            transform: rotate(45deg);
            box-shadow: 0 0 12px var(--s-color);
          }
          .prospect-pri {
            color: var(--admin-accent);
            font-size: 11px;
            letter-spacing: 0.05em;
          }

          .prospect-name {
            font-family: var(--font-display);
            font-size: 19px;
            font-weight: 500;
            letter-spacing: -0.015em;
            line-height: 1.2;
            margin: 0;
            color: var(--admin-ink);
          }
          .prospect-sector {
            font-family: var(--font-mono);
            font-size: 10px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          .prospect-loc {
            display: flex; gap: 8px; align-items: flex-start;
            font-size: 12px;
            color: var(--admin-ink-2);
            line-height: 1.5;
          }
          .prospect-loc svg { flex-shrink: 0; margin-top: 2px; color: var(--admin-ink-3); }
          .prospect-mw {
            display: flex; flex-direction: column; gap: 2px;
            padding-top: 8px;
            border-top: 1px dashed var(--admin-line);
          }
          .prospect-mw .kicker {
            font-family: var(--font-mono);
            font-size: 9px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--admin-ink-3);
          }
          .prospect-mw .mw {
            font-family: var(--font-display);
            font-size: 18px;
            color: var(--admin-accent);
            letter-spacing: -0.01em;
          }
          .prospect-profile {
            font-size: 12.5px;
            color: var(--admin-ink-2);
            line-height: 1.55;
            margin: 0;
          }
          .prospect-notes {
            font-size: 11.5px;
            font-style: italic;
            color: var(--admin-ink-3);
            background: rgba(232, 169, 72, 0.04);
            border-left: 2px solid color-mix(in oklch, var(--admin-accent) 40%, transparent);
            padding: 6px 10px;
            margin: 0;
          }

          .prospect-actions {
            display: flex; gap: 6px; flex-wrap: wrap;
            margin-top: auto; padding-top: 12px;
            border-top: 1px solid var(--admin-line);
          }
          .card-btn {
            display: inline-flex; align-items: center;
            padding: 7px 12px;
            border: 1px solid var(--admin-line-strong);
            color: var(--admin-ink-2);
            font-family: var(--font-mono);
            font-size: 10px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            text-decoration: none;
            transition: all .2s ease;
          }
          .card-btn:hover { border-color: var(--admin-accent); color: var(--admin-accent); }
          .card-btn.primary { background: var(--admin-accent); color: var(--admin-bg); border-color: var(--admin-accent); }
          .card-btn.primary:hover { background: var(--admin-ink); border-color: var(--admin-ink); color: var(--admin-bg); }
        `}</style>
      </main>
    </>
  );
}
