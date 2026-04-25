'use client';

import {useEffect, useState} from 'react';

const STATUSES: Array<{key: string; label: string}> = [
  {key: '', label: 'All'},
  {key: 'cold', label: 'À contacter'},
  {key: 'contacted', label: 'Contacté'},
  {key: 'meeting_scheduled', label: 'Visite prévue'},
  {key: 'visited', label: 'Visité'},
  {key: 'negotiating', label: 'En négociation'},
  {key: 'signed', label: 'Signé'},
  {key: 'declined', label: 'Pas intéressé'}
];

/**
 * Client-side filter — toggles `display` on prospect cards based on selected
 * status / sector / search query. No round-trip needed because the server
 * gives us the full list anyway.
 */
export function ProspectsToolbar({sectors}: {sectors: string[]}) {
  const [status, setStatus] = useState<string>('');
  const [sector, setSector] = useState<string>('');
  const [q, setQ] = useState('');

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('.prospect-card');
    const needle = q.trim().toLowerCase();
    let visible = 0;
    for (const c of cards) {
      const matchStatus = !status || c.dataset.status === status;
      const matchSector = !sector || c.dataset.sector === sector;
      const matchSearch =
        !needle || (c.dataset.search ?? '').includes(needle);
      const ok = matchStatus && matchSector && matchSearch;
      c.style.display = ok ? '' : 'none';
      if (ok) visible += 1;
    }
    const counter = document.getElementById('prospects-visible-count');
    if (counter) counter.textContent = String(visible);
  }, [status, sector, q]);

  return (
    <div className="filters">
      <div className="filter-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, city, sector…"
          className="search"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="select"
          aria-label="Filter by status"
        >
          {STATUSES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="select"
          aria-label="Filter by sector"
        >
          <option value="">All sectors</option>
          {sectors.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-meta">
        <span id="prospects-visible-count">—</span> visible
      </div>

      <style>{`
        .filters {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid var(--admin-line);
        }
        .filter-row {
          display: flex; gap: 10px; flex: 1; flex-wrap: wrap;
        }
        .search {
          flex: 1; min-width: 240px;
          padding: 10px 14px;
          background: rgba(8,9,11,0.6);
          border: 1px solid var(--admin-line);
          color: var(--admin-ink);
          font-family: inherit;
          font-size: 13px;
        }
        .search:focus { outline: none; border-color: var(--admin-accent); }
        .select {
          padding: 10px 14px;
          background: rgba(8,9,11,0.6);
          border: 1px solid var(--admin-line);
          color: var(--admin-ink);
          font-family: inherit;
          font-size: 12px;
        }
        .select:focus { outline: none; border-color: var(--admin-accent); }
        .filter-meta {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--admin-ink-3);
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}
