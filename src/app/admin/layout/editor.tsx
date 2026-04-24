'use client';

import {useState, useRef, useCallback} from 'react';

type Item = {
  key: string;
  label: string;
  visible: boolean;
  order: number;
};

/**
 * Drag-and-drop section reorder + visibility toggles for the homepage.
 *
 * Implementation detail: uses native HTML5 drag-and-drop. We track the
 * dragged index and the hovered index in refs + state for the visual cue,
 * then mutate the items array on drop. Auto-save happens only when the user
 * clicks "Save layout" — preventing accidental writes while dragging.
 */
export function LayoutEditor({initial}: {initial: Item[]}) {
  const [items, setItems] = useState<Item[]>(initial);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const initialSnapshot = useRef(JSON.stringify(initial));
  const dirty = JSON.stringify(items) !== initialSnapshot.current;

  const handleDragStart = useCallback((i: number) => (e: React.DragEvent) => {
    setDragIdx(i);
    e.dataTransfer.effectAllowed = 'move';
    // Safari needs data set to fire drag
    e.dataTransfer.setData('text/plain', String(i));
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragIdx(null);
    setOverIdx(null);
  }, []);

  const handleDragOver = useCallback(
    (i: number) => (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (overIdx !== i) setOverIdx(i);
    },
    [overIdx]
  );

  const handleDrop = useCallback(
    (toIdx: number) => (e: React.DragEvent) => {
      e.preventDefault();
      const fromIdx = dragIdx;
      if (fromIdx === null || fromIdx === toIdx) {
        handleDragEnd();
        return;
      }
      setItems((prev) => {
        const next = [...prev];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved!);
        return next.map((it, i) => ({...it, order: i}));
      });
      handleDragEnd();
    },
    [dragIdx, handleDragEnd]
  );

  const toggleVisible = (i: number) => {
    setItems((prev) => {
      const next = [...prev];
      next[i] = {...next[i]!, visible: !next[i]!.visible};
      return next;
    });
  };

  const reset = () => {
    setItems(JSON.parse(initialSnapshot.current) as Item[]);
  };

  return (
    <div>
      <div className="layout-toolbar">
        <div className="layout-legend">
          <span className="legend-pill">
            <span className="legend-dot" style={{background: 'var(--admin-accent-2)'}} />
            Visible on site
          </span>
          <span className="legend-pill">
            <span className="legend-dot" style={{background: 'var(--admin-ink-3)'}} />
            Hidden
          </span>
          <span className="layout-count">
            {items.filter((i) => i.visible).length} of {items.length} visible
          </span>
        </div>
        {dirty && (
          <div className="layout-dirty">
            ● unsaved changes
          </div>
        )}
      </div>

      <ol className="layout-list">
        {items.map((it, i) => (
          <li
            key={it.key}
            draggable
            onDragStart={handleDragStart(i)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver(i)}
            onDrop={handleDrop(i)}
            className={`layout-item ${!it.visible ? 'is-hidden' : ''} ${
              dragIdx === i ? 'is-dragging' : ''
            } ${overIdx === i && dragIdx !== null && dragIdx !== i ? 'is-over' : ''}`}
          >
            <span className="drag-handle" aria-label="Drag to reorder">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="7" cy="5" r="1" /><circle cx="13" cy="5" r="1" />
                <circle cx="7" cy="10" r="1" /><circle cx="13" cy="10" r="1" />
                <circle cx="7" cy="15" r="1" /><circle cx="13" cy="15" r="1" />
              </svg>
            </span>
            <span className="layout-num">{String(i + 1).padStart(2, '0')}</span>
            <div className="layout-main">
              <div className="layout-label">{it.label}</div>
              <div className="layout-key">{it.key}</div>
            </div>
            <label className="layout-toggle" title={it.visible ? 'Hide from site' : 'Show on site'}>
              <input
                type="checkbox"
                checked={it.visible}
                onChange={() => toggleVisible(i)}
              />
              <span className="toggle-track">
                <span className="toggle-thumb" />
              </span>
              <span className="toggle-text">{it.visible ? 'Shown' : 'Hidden'}</span>
            </label>
            <a
              href={`/admin/sections/${encodeURIComponent(it.key)}`}
              className="layout-edit"
              aria-label="Edit this section"
            >
              Edit →
            </a>
          </li>
        ))}
      </ol>

      <input type="hidden" name="layout" value={JSON.stringify(items)} />

      <div className="layout-actions">
        <button type="submit" className="btn btn-primary" disabled={!dirty}>
          Save layout
        </button>
        <button type="button" className="btn" onClick={reset} disabled={!dirty}>
          Revert
        </button>
        {!dirty && (
          <span className="hint" style={{marginInlineStart: 12}}>
            No changes yet. Drag a section by the handle on the left, or toggle
            the switch to hide one.
          </span>
        )}
      </div>

      <style>{`
        .layout-toolbar {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 16px; flex-wrap: wrap; gap: 12px;
        }
        .layout-legend {
          display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
          color: var(--admin-ink-3);
          font-size: 12px;
        }
        .legend-pill {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-mono);
          font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
        }
        .legend-dot {
          width: 8px; height: 8px; transform: rotate(45deg);
        }
        .layout-count {
          font-family: var(--font-mono);
          font-size: 11px; color: var(--admin-ink-2);
          padding-inline-start: 12px;
          border-inline-start: 1px solid var(--admin-line-strong);
        }
        .layout-dirty {
          color: var(--admin-accent);
          font-family: var(--font-mono);
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
        }

        .layout-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 8px;
          border-top: 1px solid var(--admin-line);
          padding-top: 12px;
        }
        .layout-item {
          display: grid;
          grid-template-columns: auto auto 1fr auto auto;
          gap: 16px;
          align-items: center;
          padding: 14px 18px;
          background: linear-gradient(180deg, rgba(18,20,24,0.55), rgba(14,17,20,0.55));
          border: 1px solid var(--admin-line);
          cursor: grab;
          user-select: none;
          position: relative;
          transition: background .2s ease, border-color .2s ease, transform .18s ease, opacity .18s ease;
        }
        .layout-item:hover { border-color: var(--admin-line-strong); }
        .layout-item.is-dragging {
          opacity: 0.4;
          cursor: grabbing;
          border-color: var(--admin-accent);
        }
        .layout-item.is-over {
          border-top: 3px solid var(--admin-accent);
          padding-top: 12px;
          background: linear-gradient(180deg, color-mix(in oklch, var(--admin-accent) 8%, rgba(18,20,24,0.55)) 0%, rgba(14,17,20,0.55) 100%);
        }
        .layout-item.is-hidden {
          opacity: 0.55;
        }
        .layout-item.is-hidden .layout-label {
          text-decoration: line-through;
          text-decoration-color: var(--admin-ink-3);
        }

        .drag-handle {
          color: var(--admin-ink-3);
          display: inline-flex;
          align-items: center;
          padding: 4px;
          transition: color .2s ease;
          cursor: grab;
        }
        .layout-item:hover .drag-handle { color: var(--admin-accent); }

        .layout-num {
          font-family: var(--font-display);
          font-size: 20px;
          letter-spacing: -0.01em;
          color: var(--admin-ink-2);
          width: 30px;
          text-align: center;
        }

        .layout-main { min-width: 0; }
        .layout-label {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--admin-ink);
        }
        .layout-key {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--admin-ink-3);
          letter-spacing: 0.05em;
          margin-top: 2px;
        }

        .layout-toggle {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .layout-toggle input { display: none; }
        .toggle-track {
          position: relative;
          width: 44px;
          height: 22px;
          background: var(--admin-bg-3);
          border: 1px solid var(--admin-line-strong);
          transition: background .25s ease, border-color .25s ease;
          flex-shrink: 0;
        }
        .toggle-thumb {
          position: absolute;
          top: 2px; inset-inline-start: 2px;
          width: 16px; height: 16px;
          background: var(--admin-ink-3);
          transition: transform .25s cubic-bezier(.2,.65,.2,1), background .25s ease;
        }
        .layout-toggle input:checked + .toggle-track {
          background: color-mix(in oklch, var(--admin-accent-2) 14%, var(--admin-bg-3));
          border-color: var(--admin-accent-2);
        }
        .layout-toggle input:checked + .toggle-track .toggle-thumb {
          transform: translateX(22px);
          background: var(--admin-accent-2);
        }
        html[dir="rtl"] .layout-toggle input:checked + .toggle-track .toggle-thumb {
          transform: translateX(-22px);
        }
        .toggle-text {
          font-family: var(--font-mono);
          font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--admin-ink-3);
          min-width: 54px;
        }
        .layout-toggle input:checked ~ .toggle-text { color: var(--admin-accent-2); }

        .layout-edit {
          font-family: var(--font-mono);
          font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--admin-ink-2);
          text-decoration: none;
          padding: 8px 14px;
          border: 1px solid var(--admin-line-strong);
          transition: all .2s ease;
        }
        .layout-edit:hover {
          color: var(--admin-accent);
          border-color: var(--admin-accent);
        }

        .layout-actions {
          margin-top: 28px;
          padding: 16px 0;
          border-top: 1px solid var(--admin-line);
          display: flex; align-items: center; gap: 10px;
          flex-wrap: wrap;
          position: sticky;
          bottom: 0;
          background: linear-gradient(180deg, rgba(8,9,11,0.4), rgba(8,9,11,0.92));
          backdrop-filter: blur(12px);
        }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }

        @media (max-width: 680px) {
          .layout-item {
            grid-template-columns: auto 1fr auto;
            gap: 10px;
          }
          .layout-num { display: none; }
          .layout-toggle .toggle-text { display: none; }
          .layout-edit { padding: 6px 10px; }
        }
      `}</style>
    </div>
  );
}
