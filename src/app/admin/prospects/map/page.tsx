import Link from 'next/link';
import {redirect} from 'next/navigation';
import {asc} from 'drizzle-orm';
import {db} from '@/db/client';
import {prospects, type ProspectStatus} from '@/db/schema';
import {getSession} from '@/lib/auth';
import {STATUS_META} from '../ui';
import {cityZone, cityCoords, ZONES, ZONE_ORDER, type ZoneKey} from '../zones';
import {LeafletMap, type MapPin} from './leaflet-map';

export const dynamic = 'force-dynamic';

export default async function ProspectsMap() {
  const sess = await getSession();
  if (!sess.userId) redirect('/admin/login');

  const rows = await db
    .select()
    .from(prospects)
    .orderBy(asc(prospects.priority));

  // Build pins. Skip rows we don't have coords for ("Multi-villes" etc).
  const pins: MapPin[] = [];
  const orphans: typeof rows = [];
  for (const r of rows) {
    const coords = cityCoords(r.city);
    if (!coords) {
      orphans.push(r);
      continue;
    }
    // Deterministic jitter so multiple prospects in the same city don't fully
    // overlap. ~500m max offset based on prospect id.
    const jitterLat = (((r.id * 73) % 17) - 8) / 1500;
    const jitterLng = (((r.id * 113) % 19) - 9) / 1500;
    const z = cityZone(r.city);
    pins.push({
      id: r.id,
      name: r.name,
      sector: r.sector,
      city: r.city,
      address: r.address ?? '',
      estimatedMw: r.estimatedMw ?? '',
      status: r.status as ProspectStatus,
      priority: r.priority,
      zone: z,
      zoneLabel: ZONES[z].label,
      zoneColor: ZONES[z].color,
      statusColor: STATUS_META[r.status as ProspectStatus]?.color ?? '#7c7870',
      statusLabel: STATUS_META[r.status as ProspectStatus]?.label ?? r.status,
      lat: coords[0] + jitterLat,
      lng: coords[1] + jitterLng
    });
  }

  // Counts per zone for the legend.
  const zoneCounts = new Map<ZoneKey, number>();
  for (const p of pins) {
    zoneCounts.set(p.zone, (zoneCounts.get(p.zone) ?? 0) + 1);
  }

  return (
    <>
      <nav className="admin-nav">
        <div className="admin-nav-inner">
          <div>
            <div className="admin-brand">
              DiaCorp<span>.</span>Admin
            </div>
            <div className="admin-sub">Prospects · map view</div>
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

      <main className="admin-container" style={{maxWidth: 1400}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
            marginBottom: 16,
            flexWrap: 'wrap'
          }}
        >
          <div>
            <h1 className="admin-h1">Map · {pins.length} prospects</h1>
            <p className="admin-h1-sub">
              Vue cartographique de tous les prospects industriels Oriental.
              Click un pin pour ouvrir le détail. Couleur = statut pipeline,
              taille = priorité.
            </p>
          </div>
          <Link href="/admin/prospects" className="btn">
            ← Back to list
          </Link>
        </div>

        {/* Zone legend */}
        <div className="zone-legend">
          {ZONE_ORDER.map((zk) => {
            const z = ZONES[zk];
            const n = zoneCounts.get(zk) ?? 0;
            if (n === 0) return null;
            return (
              <div key={zk} className="legend-cell" style={{['--z' as string]: z.color}}>
                <span className="legend-dot" />
                <div className="legend-text">
                  <div className="legend-label">{z.label}</div>
                  <div className="legend-count">{n} prospect{n > 1 ? 's' : ''} · {z.driveFromOujda}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="map-shell">
          <LeafletMap pins={pins} />
        </div>

        {/* Status legend */}
        <div className="status-legend">
          <span className="legend-kicker">Status (pin color)</span>
          <div className="status-row">
            {(Object.keys(STATUS_META) as ProspectStatus[]).map((s) => (
              <span key={s} className="status-chip" style={{['--c' as string]: STATUS_META[s].color}}>
                <span className="status-mark" />
                {STATUS_META[s].label}
              </span>
            ))}
          </div>
        </div>

        {orphans.length > 0 && (
          <div className="orphans">
            <span className="legend-kicker">Sans pin (multi-sites)</span>
            <ul>
              {orphans.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/prospects/${o.id}`}>{o.name}</Link>
                  <span className="orphan-city"> — {o.city}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <style>{`
          .zone-legend {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 10px;
            margin-bottom: 14px;
          }
          .legend-cell {
            display: flex; align-items: center; gap: 12px;
            padding: 12px 14px;
            background: linear-gradient(180deg, rgba(18,20,24,0.7), rgba(14,17,20,0.7));
            border: 1px solid var(--admin-line);
            border-left: 3px solid var(--z);
          }
          html[dir="rtl"] .legend-cell {
            border-left: 1px solid var(--admin-line);
            border-right: 3px solid var(--z);
          }
          .legend-dot {
            width: 10px; height: 10px;
            background: var(--z);
            transform: rotate(45deg);
            box-shadow: 0 0 12px var(--z);
            flex-shrink: 0;
          }
          .legend-text { display: flex; flex-direction: column; gap: 2px; }
          .legend-label {
            font-family: var(--font-display);
            font-size: 13.5px;
            color: var(--admin-ink);
            letter-spacing: -0.01em;
          }
          .legend-count {
            font-family: var(--font-mono);
            font-size: 9.5px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: var(--admin-ink-3);
          }

          .map-shell {
            border: 1px solid var(--admin-line-strong);
            background: #0a0b0d;
            overflow: hidden;
          }

          .status-legend {
            margin-top: 18px;
            padding: 14px 16px;
            background: rgba(18,20,24,0.5);
            border: 1px solid var(--admin-line);
          }
          .legend-kicker {
            display: block;
            font-family: var(--font-mono);
            font-size: 9.5px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--admin-ink-3);
            margin-bottom: 8px;
          }
          .status-row {
            display: flex; gap: 14px; flex-wrap: wrap;
          }
          .status-chip {
            display: inline-flex; align-items: center; gap: 6px;
            font-family: var(--font-mono);
            font-size: 10px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--c);
          }
          .status-mark {
            width: 9px; height: 9px;
            background: var(--c);
            border-radius: 50%;
            box-shadow: 0 0 8px var(--c);
          }

          .orphans {
            margin-top: 18px;
            padding: 14px 16px;
            background: rgba(18,20,24,0.5);
            border: 1px solid var(--admin-line);
          }
          .orphans ul {
            list-style: none;
            padding: 0; margin: 0;
            display: flex; flex-wrap: wrap; gap: 16px;
            font-size: 13px;
          }
          .orphans a { color: var(--admin-ink-2); text-decoration: none; border-bottom: 1px dotted var(--admin-line-strong); }
          .orphans a:hover { color: var(--admin-accent); border-color: var(--admin-accent); }
          .orphan-city { color: var(--admin-ink-3); font-size: 11.5px; }
        `}</style>
      </main>
    </>
  );
}
