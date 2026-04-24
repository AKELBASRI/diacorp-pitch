'use client';

import {useEffect, useState} from 'react';

/**
 * Client-side filter that greys out non-matching tiles in the server-rendered
 * grid. Matches against the tile's `data-search` attribute (title + key).
 */
export function DashboardSearch() {
  const [q, setQ] = useState('');

  useEffect(() => {
    const tiles = document.querySelectorAll<HTMLElement>('[data-search]');
    const needle = q.trim().toLowerCase();
    for (const tile of tiles) {
      const hay = tile.dataset.search ?? '';
      const match = !needle || hay.includes(needle);
      tile.style.display = match ? '' : 'none';
    }
    // Also hide empty category sections.
    const sections = document.querySelectorAll<HTMLElement>('[data-cat]');
    for (const sec of sections) {
      const visible = sec.querySelectorAll<HTMLElement>(
        '[data-search]:not([style*="display: none"])'
      );
      sec.style.display = visible.length > 0 ? '' : 'none';
    }
  }, [q]);

  return (
    <div className="search-wrap">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search sections — title, key…"
        className="search-input"
        autoComplete="off"
      />
      {q && (
        <button
          type="button"
          className="search-clear"
          onClick={() => setQ('')}
          aria-label="Clear search"
        >
          ×
        </button>
      )}

      <style>{`
        .search-wrap {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border: 1px solid #2a2d33;
          background: #111316;
          min-width: 320px;
          color: #6b675e;
        }
        .search-wrap:focus-within {
          border-color: #e8a948;
          color: #e8a948;
        }
        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #f5f2ea;
          font-size: 13px;
          font-family: inherit;
        }
        .search-input::placeholder { color: #6b675e; }
        .search-clear {
          background: transparent;
          border: none;
          color: #6b675e;
          font-size: 18px;
          cursor: pointer;
          padding: 0 4px;
        }
        .search-clear:hover { color: #e8a948; }
      `}</style>
    </div>
  );
}
