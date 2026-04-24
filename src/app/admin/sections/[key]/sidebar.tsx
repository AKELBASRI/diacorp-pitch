'use client';

import {useMemo, useState} from 'react';
import type {SectionSettingsData} from '@/db/schema';

type Revision = {
  id: number;
  locale: string;
  createdAt: Date | string;
  createdBy: string | null;
};

type Props = {
  sectionKey: string;
  settings: SectionSettingsData;
  revisions: Revision[];
  contentByLocale: {fr: unknown; en: unknown; ar: unknown};
  lastEdited: {updatedAt: Date | string | null; updatedBy: string | null};
  revertAction: (formData: FormData) => void;
};

export function SectionSidebar({
  sectionKey,
  settings,
  revisions,
  contentByLocale,
  lastEdited,
  revertAction
}: Props) {
  const [open, setOpen] = useState<'stats' | 'settings' | 'revisions'>('stats');

  const stats = useMemo(
    () => ({
      fr: localeStats(contentByLocale.fr),
      en: localeStats(contentByLocale.en),
      ar: localeStats(contentByLocale.ar)
    }),
    [contentByLocale]
  );

  return (
    <aside className="side-col">
      <div className="panel">
        <div className="panel-tabs">
          <Tab id="stats" open={open} onClick={setOpen} label="Stats" />
          <Tab id="settings" open={open} onClick={setOpen} label="Settings" />
          <Tab id="revisions" open={open} onClick={setOpen} label={`Revisions (${revisions.length})`} />
        </div>

        {open === 'stats' && (
          <div className="pane">
            <h3 className="pane-title">Translation status</h3>
            <div className="loc-matrix">
              {(['fr', 'en', 'ar'] as const).map((l) => {
                const s = stats[l];
                return (
                  <div key={l} className="loc-row">
                    <span className="loc-code">{l.toUpperCase()}</span>
                    <div className="loc-bar">
                      <div
                        className="loc-fill"
                        style={{
                          width: `${s.pct}%`,
                          background:
                            s.pct >= 95 ? '#1f8f78' : s.pct >= 70 ? '#e8a948' : '#c94f3a'
                        }}
                      />
                    </div>
                    <span className="loc-pct">{s.pct}%</span>
                  </div>
                );
              })}
            </div>

            <h3 className="pane-title" style={{marginTop: 22}}>
              Word counts
            </h3>
            <div className="kv">
              {(['fr', 'en', 'ar'] as const).map((l) => (
                <div className="kv-row" key={l}>
                  <span className="k">{l.toUpperCase()}</span>
                  <span className="v">
                    {stats[l].words} words · {stats[l].chars} chars
                  </span>
                </div>
              ))}
            </div>

            <h3 className="pane-title" style={{marginTop: 22}}>
              Metadata
            </h3>
            <div className="kv">
              <div className="kv-row">
                <span className="k">Key</span>
                <span className="v mono">{sectionKey}</span>
              </div>
              <div className="kv-row">
                <span className="k">Last edit</span>
                <span className="v">
                  {lastEdited.updatedAt
                    ? new Date(lastEdited.updatedAt).toLocaleString('en-GB', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                      })
                    : '—'}
                </span>
              </div>
              <div className="kv-row">
                <span className="k">Edited by</span>
                <span className="v">{lastEdited.updatedBy ?? '—'}</span>
              </div>
            </div>
          </div>
        )}

        {open === 'settings' && (
          <div className="pane">
            <h3 className="pane-title">Section settings</h3>
            <p className="pane-hint">
              These apply site-wide. They override theme defaults for this section only.
            </p>

            <label className="switch">
              <input
                type="checkbox"
                name="settings_visible"
                defaultChecked={settings.visible}
              />
              <span>Show this section on the site</span>
            </label>
            <p className="pane-hint" style={{marginTop: 4}}>
              Uncheck to hide this block completely. Useful for staging.
            </p>

            <label className="lbl" style={{marginTop: 18}}>
              Accent color (override)
            </label>
            <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
              <input
                type="color"
                name="settings_accent"
                defaultValue={settings.accentColor ?? '#e8a948'}
                style={{
                  width: 44,
                  height: 36,
                  border: '1px solid #2a2d33',
                  background: '#0a0b0d',
                  padding: 2,
                  cursor: 'pointer'
                }}
              />
              <input
                type="text"
                defaultValue={settings.accentColor ?? ''}
                placeholder="Leave empty to inherit brand color"
                className="input"
                style={{flex: 1, fontFamily: 'ui-monospace, monospace', fontSize: 12}}
                readOnly
              />
            </div>
            <p className="pane-hint" style={{marginTop: 4}}>
              Per-section accent colour — useful to colour-code segments.
            </p>

            <label className="lbl" style={{marginTop: 18}}>
              Custom anchor ID
            </label>
            <input
              type="text"
              name="settings_anchor"
              defaultValue={settings.customAnchor ?? ''}
              placeholder="e.g. why-us (used in URL #anchor)"
              className="input"
            />
            <p className="pane-hint" style={{marginTop: 4}}>
              Lowercase, digits and hyphens only.
            </p>

            <label className="lbl" style={{marginTop: 18}}>
              Editor notes (private)
            </label>
            <textarea
              name="settings_notes"
              className="textarea"
              defaultValue={settings.notes}
              placeholder="Notes for other editors. Never shown on the site."
              rows={4}
            />
          </div>
        )}

        {open === 'revisions' && (
          <div className="pane">
            <h3 className="pane-title">Revisions</h3>
            <p className="pane-hint">
              Every save snapshots the previous version. Click revert to restore.
            </p>
            {revisions.length === 0 && (
              <div className="empty">No revisions yet.</div>
            )}
            <div className="rev-list">
              {revisions.map((r) => (
                <div key={r.id} className="rev-row">
                  <div>
                    <div className="rev-when">
                      {new Date(r.createdAt).toLocaleString('en-GB', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                      })}
                    </div>
                    <div className="rev-meta">
                      {r.locale.toUpperCase()} · {r.createdBy ?? '—'}
                    </div>
                  </div>
                  <RevertButton
                    sectionKey={sectionKey}
                    revisionId={r.id}
                    revertAction={revertAction}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .panel {
          border: 1px solid #1e2024;
          background: #111316;
          position: sticky;
          top: 80px;
        }
        .panel-tabs {
          display: flex;
          border-bottom: 1px solid #1e2024;
        }
        .panel-tab {
          flex: 1;
          background: transparent;
          border: 0;
          border-bottom: 2px solid transparent;
          color: #6b675e;
          padding: 12px 8px;
          font-family: ui-monospace, monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all .2s ease;
        }
        .panel-tab:hover { color: #f5f2ea; }
        .panel-tab.active {
          color: #e8a948;
          border-bottom-color: #e8a948;
        }
        .pane { padding: 18px; max-height: calc(100vh - 180px); overflow-y: auto; }
        .pane-title {
          font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #a39e94;
          font-family: ui-monospace, monospace;
          margin: 0 0 12px;
          font-weight: 500;
        }
        .pane-hint {
          color: #6b675e; font-size: 11px; line-height: 1.5; margin: 0 0 10px;
        }
        .loc-matrix { display: flex; flex-direction: column; gap: 8px; }
        .loc-row { display: flex; align-items: center; gap: 10px; }
        .loc-code {
          font-family: ui-monospace, monospace;
          font-size: 11px;
          font-weight: 600;
          width: 30px;
          color: #f5f2ea;
        }
        .loc-bar { flex: 1; height: 4px; background: #0a0b0d; border: 1px solid #1e2024; }
        .loc-fill { height: 100%; transition: width .3s ease; }
        .loc-pct {
          font-family: ui-monospace, monospace;
          font-size: 11px;
          color: #a39e94;
          width: 42px;
          text-align: end;
        }

        .kv { display: flex; flex-direction: column; gap: 6px; }
        .kv-row {
          display: flex; justify-content: space-between; gap: 10px;
          padding: 6px 0;
          border-bottom: 1px dashed #1e2024;
          font-size: 12px;
        }
        .kv-row:last-child { border-bottom: none; }
        .kv .k {
          font-family: ui-monospace, monospace;
          color: #6b675e;
          letter-spacing: 0.05em;
          font-size: 10px;
          text-transform: uppercase;
        }
        .kv .v { color: #f5f2ea; text-align: end; }
        .kv .mono { font-family: ui-monospace, monospace; font-size: 11px; color: #a39e94; }

        .switch {
          display: inline-flex;
          gap: 10px;
          align-items: center;
          cursor: pointer;
          color: #f5f2ea;
          font-size: 13px;
        }
        .lbl {
          display: block;
          font-family: ui-monospace, monospace;
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #a39e94;
          margin-bottom: 8px;
        }

        .empty { color: #6b675e; font-size: 12px; padding: 12px 0; }
        .rev-list { display: flex; flex-direction: column; gap: 6px; }
        .rev-row {
          display: flex; justify-content: space-between; gap: 10px;
          align-items: center;
          padding: 10px;
          border: 1px solid #1e2024;
          background: #0a0b0d;
        }
        .rev-when { color: #f5f2ea; font-size: 12px; font-weight: 500; }
        .rev-meta { color: #6b675e; font-size: 10px; font-family: ui-monospace, monospace; margin-top: 2px; letter-spacing: 0.1em; }
      `}</style>
    </aside>
  );
}

function Tab({
  id,
  open,
  onClick,
  label
}: {
  id: 'stats' | 'settings' | 'revisions';
  open: string;
  onClick: (id: 'stats' | 'settings' | 'revisions') => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`panel-tab ${open === id ? 'active' : ''}`}
      onClick={() => onClick(id)}
    >
      {label}
    </button>
  );
}

function RevertButton({
  sectionKey,
  revisionId,
  revertAction
}: {
  sectionKey: string;
  revisionId: number;
  revertAction: (formData: FormData) => void;
}) {
  return (
    <form action={revertAction} onSubmit={(e) => {
      if (!confirm('Revert this section to this revision? Current content will be snapshotted as a new revision.')) {
        e.preventDefault();
      }
    }}>
      <input type="hidden" name="__key" value={sectionKey} />
      <input type="hidden" name="__revisionId" value={revisionId} />
      <button
        type="submit"
        style={{
          background: 'transparent',
          border: '1px solid #2a2d33',
          color: '#a39e94',
          padding: '6px 12px',
          fontFamily: 'ui-monospace, monospace',
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          cursor: 'pointer'
        }}
      >
        Revert
      </button>
    </form>
  );
}

function localeStats(v: unknown): {pct: number; words: number; chars: number} {
  let total = 0;
  let filled = 0;
  let words = 0;
  let chars = 0;
  walk(v);
  const pct = total === 0 ? 100 : Math.round((filled / total) * 100);
  return {pct, words, chars};

  function walk(x: unknown) {
    if (x === null || x === undefined) {
      total += 1;
      return;
    }
    if (typeof x === 'string') {
      total += 1;
      if (x.trim() !== '') {
        filled += 1;
        chars += x.length;
        words += x.trim().split(/\s+/).length;
      }
      return;
    }
    if (typeof x === 'number' || typeof x === 'boolean') {
      total += 1;
      filled += 1;
      return;
    }
    if (Array.isArray(x)) {
      for (const it of x) walk(it);
      return;
    }
    if (typeof x === 'object') {
      for (const v of Object.values(x)) walk(v);
    }
  }
}
