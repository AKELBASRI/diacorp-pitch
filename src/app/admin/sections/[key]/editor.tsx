'use client';

import {useState, useMemo, useEffect, useRef} from 'react';
import {fieldMeta} from './labels';

type LocaleData = {fr: unknown; en: unknown; ar: unknown};
type Locale = 'fr' | 'en' | 'ar';

/**
 * Rich section editor.
 *
 * Structure rendered for each locale:
 *   - A tabbed pane (FR / EN / AR)
 *   - A visual, recursive form driven by the data's shape
 *   - Labels + hints from labels.ts so the UI doesn't expose raw JSON keys
 *   - Optional raw-JSON mode per locale for power users
 *
 * Unsaved-changes warning + save toast are triggered via `?saved=1` on the
 * server-redirect. Toast fades after 3s.
 */
export function SectionEditor({
  sectionKey,
  data
}: {
  sectionKey: string;
  data: LocaleData;
}) {
  const [activeLocale, setActiveLocale] = useState<Locale>('fr');
  const [state, setState] = useState<LocaleData>(data);
  const [rawMode, setRawMode] = useState<Record<Locale, boolean>>({
    fr: false,
    en: false,
    ar: false
  });
  const initialRef = useRef<string>(JSON.stringify(data));
  const dirty = JSON.stringify(state) !== initialRef.current;

  // beforeunload guard — spec-compliant is `event.preventDefault()`.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  // Toast auto-hide.
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('saved') === '1') {
      setToast('✓ Saved — changes are live.');
      url.searchParams.delete('saved');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  // Count leaves per locale to compute completion % for the badges.
  const completion = useMemo(
    () => ({
      fr: computeCompletion(state.fr),
      en: computeCompletion(state.en),
      ar: computeCompletion(state.ar)
    }),
    [state]
  );

  const update = (locale: Locale, next: unknown) => {
    setState((prev) => ({...prev, [locale]: next}));
  };

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}

      <div className="locale-tabs">
        {(['fr', 'en', 'ar'] as const).map((l) => (
          <button
            type="button"
            key={l}
            onClick={() => setActiveLocale(l)}
            className={`locale-tab ${activeLocale === l ? 'active' : ''}`}
          >
            <span className="locale-tab-code">{l.toUpperCase()}</span>
            <span className="locale-tab-pct">{completion[l].pct}%</span>
          </button>
        ))}
        <div style={{flex: 1}} />
        {dirty && (
          <span className="dirty-dot" title="Unsaved changes">
            ● unsaved
          </span>
        )}
        <label className="raw-toggle">
          <input
            type="checkbox"
            checked={rawMode[activeLocale]}
            onChange={(e) =>
              setRawMode((prev) => ({...prev, [activeLocale]: e.target.checked}))
            }
          />
          Raw JSON
        </label>
      </div>

      {(['fr', 'en', 'ar'] as const).map((l) => (
        <div
          key={l}
          style={{display: activeLocale === l ? 'block' : 'none'}}
          dir={l === 'ar' ? 'rtl' : 'ltr'}
        >
          <LocalePane
            locale={l}
            value={state[l]}
            rawMode={rawMode[l]}
            onChange={(next) => update(l, next)}
          />
        </div>
      ))}

      {(['fr', 'en', 'ar'] as const).map((l) => (
        <input
          key={l}
          type="hidden"
          name={`data_${l}`}
          value={JSON.stringify(state[l] ?? null)}
        />
      ))}

      <div className="editor-footer-hint">
        <strong>Tip:</strong> switch to Raw JSON mode to add or rename keys the
        visual form doesn't expose. Anything you type is kept in sync across
        views.
      </div>
      <div className="editor-key-line">
        Section key: <code>{sectionKey}</code>
      </div>

      <style>{`
        .toast {
          position: fixed; top: 80px; right: 24px;
          padding: 12px 18px;
          border: 1px solid #1f8f78;
          background: #0a0b0d;
          color: #56f0c8;
          font-family: ui-monospace, monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          z-index: 50;
          box-shadow: 0 10px 30px -10px #1f8f7855;
          animation: slideIn .3s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        html[dir="rtl"] .toast { right: auto; left: 24px; }

        .locale-tabs { display: flex; gap: 6px; margin-bottom: 20px; align-items: center; }
        .locale-tab {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 8px 14px;
          border: 1px solid #2a2d33; background: transparent;
          color: #a39e94; cursor: pointer;
          font-family: ui-monospace, monospace;
          font-size: 11px; letter-spacing: 0.12em;
          transition: all .2s ease;
        }
        .locale-tab:hover { color: #f5f2ea; border-color: #6b675e; }
        .locale-tab.active { background: #e8a948; color: #0a0b0d; border-color: #e8a948; }
        .locale-tab-code { font-weight: 600; }
        .locale-tab-pct { opacity: 0.7; font-size: 10px; }
        .locale-tab.active .locale-tab-pct { opacity: 1; }

        .dirty-dot {
          color: #e8a948; font-family: ui-monospace, monospace;
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          margin-inline-end: 12px;
        }
        .raw-toggle {
          display: inline-flex; align-items: center; gap: 8px;
          color: #a39e94; font-size: 12px;
          font-family: ui-monospace, monospace;
        }

        .field {
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px dashed #1e2024;
        }
        .field:last-child { border-bottom: none; }
        .field-header {
          display: flex; align-items: baseline; gap: 10px;
          margin-bottom: 8px; flex-wrap: wrap;
        }
        .field-label {
          font-family: ui-monospace, monospace;
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #a39e94;
        }
        .field-key {
          font-family: ui-monospace, monospace;
          font-size: 9px;
          color: #6b675e;
          letter-spacing: 0.05em;
        }
        .field-hint {
          color: #6b675e;
          font-size: 11px;
          line-height: 1.5;
          margin-top: -2px;
          margin-bottom: 8px;
        }
        .subfield {
          margin: 10px 0;
          padding-inline-start: 16px;
          border-inline-start: 2px solid #1e2024;
        }
        .array-item {
          position: relative;
          border: 1px solid #2a2d33;
          padding: 16px 16px 14px;
          background: #0a0b0d;
          margin-bottom: 10px;
        }
        .array-item-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 10px;
        }
        .array-item-idx {
          font-family: ui-monospace, monospace;
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          color: #6b675e;
        }
        .array-item-title {
          color: #f5f2ea;
          font-size: 13px;
          font-weight: 500;
          margin-inline-start: 12px;
        }
        .array-move {
          display: inline-flex; gap: 6px;
        }
        .icon-btn {
          display: inline-flex;
          padding: 4px 10px;
          border: 1px solid #2a2d33;
          background: transparent;
          color: #a39e94;
          cursor: pointer;
          font-family: ui-monospace, monospace;
          font-size: 10px; letter-spacing: 0.14em;
        }
        .icon-btn:hover { border-color: #e8a948; color: #e8a948; }
        .icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .icon-btn.danger { border-color: #c94f3a33; color: #c94f3a; }
        .icon-btn.danger:hover { background: #c94f3a; color: #0a0b0d; }

        .editor-footer-hint { color: #a39e94; font-size: 12px; margin-top: 20px; line-height: 1.5; }
        .editor-key-line { color: #6b675e; font-size: 11px; margin-top: 6px; font-family: ui-monospace, monospace; }
      `}</style>
    </div>
  );
}

function LocalePane({
  locale,
  value,
  rawMode,
  onChange
}: {
  locale: Locale;
  value: unknown;
  rawMode: boolean;
  onChange: (v: unknown) => void;
}) {
  const [rawText, setRawText] = useState<string>(() =>
    JSON.stringify(value ?? null, null, 2)
  );
  const [rawErr, setRawErr] = useState<string | null>(null);

  useEffect(() => {
    if (!rawMode) {
      setRawText(JSON.stringify(value ?? null, null, 2));
      setRawErr(null);
    }
  }, [value, rawMode]);

  if (rawMode) {
    return (
      <div>
        <textarea
          className="textarea"
          value={rawText}
          spellCheck={false}
          onChange={(e) => {
            const v = e.target.value;
            setRawText(v);
            try {
              const parsed = JSON.parse(v);
              setRawErr(null);
              onChange(parsed);
            } catch (err) {
              setRawErr((err as Error).message);
            }
          }}
          style={{minHeight: 450, fontFamily: 'ui-monospace, monospace', fontSize: 12}}
        />
        {rawErr && (
          <div style={{color: '#c94f3a', fontSize: 12, marginTop: 6}}>
            JSON error: {rawErr}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <FieldRenderer value={value} path="" onChange={onChange} root />
    </div>
  );
}

function isTextareaString(s: string) {
  return s.length > 80 || s.includes('\n');
}

function FieldRenderer({
  value,
  path,
  onChange,
  root,
  labelOverride
}: {
  value: unknown;
  path: string;
  onChange: (next: unknown) => void;
  root?: boolean;
  labelOverride?: string;
}) {
  const leaf = path.split(/[\].]/).filter(Boolean).pop() ?? '';
  const meta = leaf ? fieldMeta(path) : undefined;
  const label = labelOverride ?? meta?.label;
  const hint = meta?.hint;

  if (value === null || value === undefined) {
    return (
      <Field label={label} hint={hint} keyPath={leaf}>
        <input
          className="input"
          type="text"
          placeholder="(empty — type to set)"
          onChange={(e) => onChange(e.target.value)}
        />
      </Field>
    );
  }

  if (typeof value === 'string') {
    const ta = isTextareaString(value);
    return (
      <Field label={label} hint={hint} keyPath={leaf}>
        {ta ? (
          <textarea
            className="textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input
            className="input"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </Field>
    );
  }

  if (typeof value === 'number') {
    return (
      <Field label={label} hint={hint} keyPath={leaf}>
        <input
          className="input"
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </Field>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <Field label={label} hint={hint} keyPath={leaf}>
        <label style={{display: 'inline-flex', gap: 8, alignItems: 'center'}}>
          <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
          <span style={{color: '#a39e94', fontSize: 13}}>
            {value ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </Field>
    );
  }

  if (Array.isArray(value)) {
    return (
      <Field label={label} hint={hint} keyPath={leaf}>
        <DraggableArray value={value} path={path} onChange={onChange} />
      </Field>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    const body = (
      <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
        {entries.map(([k, v]) => (
          <FieldRenderer
            key={k}
            value={v}
            path={path ? `${path}.${k}` : k}
            onChange={(nv) => {
              onChange({...(value as Record<string, unknown>), [k]: nv});
            }}
          />
        ))}
      </div>
    );
    if (root) return body;
    return (
      <Field label={label} hint={hint} keyPath={leaf}>
        <div className="subfield">{body}</div>
      </Field>
    );
  }

  return (
    <Field label={label} hint={hint} keyPath={leaf}>
      <span style={{color: '#c94f3a'}}>Unsupported type: {typeof value}</span>
    </Field>
  );
}

function itemSummary(item: unknown): string {
  if (!item || typeof item !== 'object') {
    return typeof item === 'string' ? (item as string).slice(0, 60) : '';
  }
  const obj = item as Record<string, unknown>;
  // Pick a human-y field for the card title preview.
  const candidate =
    obj.title ?? obj.label ?? obj.name ?? obj.phase ?? obj.code ?? obj.key;
  return typeof candidate === 'string' ? candidate.slice(0, 80) : '';
}

function defaultFor(v: unknown): unknown {
  if (typeof v === 'string') return '';
  if (typeof v === 'number') return 0;
  if (typeof v === 'boolean') return false;
  if (Array.isArray(v)) return [];
  if (v && typeof v === 'object') return {};
  return '';
}

function Field({
  label,
  hint,
  keyPath,
  children
}: {
  label?: string;
  hint?: string;
  keyPath?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      {label && (
        <div className="field-header">
          <span className="field-label">{label}</span>
          {keyPath && <span className="field-key">{keyPath}</span>}
        </div>
      )}
      {hint && <div className="field-hint">{hint}</div>}
      {children}
    </div>
  );
}

/**
 * Walk the value tree, count how many leaf strings/numbers/bools are
 * non-empty — returns {pct, filled, total}.
 */
function computeCompletion(value: unknown): {pct: number; filled: number; total: number} {
  let total = 0;
  let filled = 0;
  walk(value);
  const pct = total === 0 ? 100 : Math.round((filled / total) * 100);
  return {pct, filled, total};

  function walk(v: unknown): void {
    if (v === null || v === undefined) {
      total += 1;
      return;
    }
    if (typeof v === 'string') {
      total += 1;
      if (v.trim() !== '') filled += 1;
      return;
    }
    if (typeof v === 'number' || typeof v === 'boolean') {
      total += 1;
      filled += 1;
      return;
    }
    if (Array.isArray(v)) {
      for (const item of v) walk(item);
      return;
    }
    if (typeof v === 'object') {
      for (const val of Object.values(v)) walk(val);
    }
  }
}

/**
 * Drag-and-drop array renderer.
 *
 * Each item is a draggable card. Drag by the handle to reorder.
 * Also exposes remove button + "add item" at the end.
 */
function DraggableArray({
  value,
  path,
  onChange
}: {
  value: unknown[];
  path: string;
  onChange: (next: unknown[]) => void;
}) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const addItem = () => {
    const sample = value[0];
    const fresh =
      sample && typeof sample === 'object' && !Array.isArray(sample)
        ? Object.fromEntries(
            Object.entries(sample as Record<string, unknown>).map(([k, v]) => [
              k,
              defaultFor(v)
            ])
          )
        : defaultFor(sample);
    onChange([...value, fresh]);
  };

  const handleDrop = (toIdx: number) => {
    if (dragIdx === null || dragIdx === toIdx) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    const next = [...value];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(toIdx, 0, moved);
    onChange(next);
    setDragIdx(null);
    setOverIdx(null);
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
      {value.map((item, i) => (
        <div
          key={i}
          draggable
          onDragStart={(e) => {
            setDragIdx(i);
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', String(i));
          }}
          onDragEnd={() => {
            setDragIdx(null);
            setOverIdx(null);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (overIdx !== i) setOverIdx(i);
          }}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop(i);
          }}
          className={`array-item ${dragIdx === i ? 'is-dragging' : ''} ${
            overIdx === i && dragIdx !== null && dragIdx !== i ? 'is-over' : ''
          }`}
        >
          <div className="array-item-header">
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <span className="drag-grip" title="Drag to reorder">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <circle cx="7" cy="5" r="1" /><circle cx="13" cy="5" r="1" />
                  <circle cx="7" cy="10" r="1" /><circle cx="13" cy="10" r="1" />
                  <circle cx="7" cy="15" r="1" /><circle cx="13" cy="15" r="1" />
                </svg>
              </span>
              <span className="array-item-idx">#{String(i + 1).padStart(2, '0')}</span>
              <span className="array-item-title">{itemSummary(item)}</span>
            </div>
            <button
              type="button"
              className="icon-btn danger"
              onClick={() => {
                const next = [...value];
                next.splice(i, 1);
                onChange(next);
              }}
              title="Remove item"
            >
              ✕ remove
            </button>
          </div>
          <FieldRenderer
            value={item}
            path={`${path}[${i}]`}
            onChange={(nv) => {
              const next = [...value];
              next[i] = nv;
              onChange(next);
            }}
          />
        </div>
      ))}
      <button
        type="button"
        className="btn"
        style={{alignSelf: 'flex-start'}}
        onClick={addItem}
      >
        + Add item
      </button>
      <style>{`
        .array-item.is-dragging { opacity: 0.4; cursor: grabbing; border-color: var(--admin-accent); }
        .array-item.is-over { border-top: 3px solid var(--admin-accent); padding-top: 13px; }
        .drag-grip { color: var(--admin-ink-3); cursor: grab; display: inline-flex; padding: 2px; }
        .drag-grip:hover { color: var(--admin-accent); }
      `}</style>
    </div>
  );
}
