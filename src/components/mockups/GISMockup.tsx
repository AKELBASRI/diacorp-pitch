import {getTranslations} from 'next-intl/server';
import {MockupFrame} from './MockupFrame';

// Simplified Morocco outline path
const MOROCCO_PATH =
  'M38 82 L42 70 L52 52 L70 42 L92 32 L118 28 L142 30 L162 38 L184 48 L206 56 L226 64 L246 72 L262 82 L276 96 L286 112 L292 130 L290 148 L282 164 L268 176 L250 180 L228 178 L208 172 L186 160 L162 148 L138 136 L118 122 L96 108 L74 96 L54 92 L42 88 Z';

const SITES = [
  {x: 78, y: 74, score: 97, label: 'DIA-1', active: true, label2: 'Ain Beni Mathar'},
  {x: 216, y: 142, score: 92, label: 'DKH', label2: 'Dakhla'},
  {x: 176, y: 128, score: 88, label: 'LYN', label2: 'Laayoune'},
  {x: 118, y: 108, score: 85, label: 'TZN', label2: 'Tiznit'},
  {x: 92, y: 96, score: 81, label: 'ERR', label2: 'Errachidia'},
  {x: 132, y: 76, score: 78, label: 'MDL', label2: 'Midelt'}
];

export async function GISMockup({tint}: {tint: string}) {
  const t = await getTranslations('strategies.items.gis-permitting.mockup');

  return (
    <MockupFrame title={t('title')} subtitle={t('subtitle')} tint={tint}>
      <div className="grid grid-cols-[1fr_180px] gap-4">
        <div className="relative border border-[var(--color-line)] bg-[var(--color-bg)] overflow-hidden">
          <svg viewBox="0 0 320 200" className="w-full h-[220px]">
            <defs>
              <pattern id="grid-pat" width="16" height="16" patternUnits="userSpaceOnUse">
                <path
                  d="M 16 0 L 0 0 0 16"
                  fill="none"
                  stroke="var(--color-line)"
                  strokeWidth="0.5"
                />
              </pattern>
              <radialGradient id="hot-grad">
                <stop offset="0%" stopColor="hsl(32 88% 60%)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="hsl(32 88% 60%)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="320" height="200" fill="url(#grid-pat)" />

            {/* Irradiance heat zones */}
            <circle cx="80" cy="80" r="60" fill="url(#hot-grad)" />
            <circle cx="200" cy="140" r="80" fill="url(#hot-grad)" />

            {/* Morocco outline */}
            <path
              d={MOROCCO_PATH}
              fill="hsl(96 15% 25% / 0.4)"
              stroke="hsl(96 55% 55%)"
              strokeWidth="1"
            />

            {/* Sites */}
            {SITES.map((s) => (
              <g key={s.label}>
                {s.active && (
                  <circle
                    cx={s.x}
                    cy={s.y}
                    r="14"
                    fill="none"
                    stroke="var(--tint)"
                    strokeWidth="1"
                    className="glow-pulse"
                  />
                )}
                <circle
                  cx={s.x}
                  cy={s.y}
                  r="3.5"
                  fill={s.active ? 'var(--tint)' : 'hsl(32 88% 60%)'}
                />
                <text
                  x={s.x + 7}
                  y={s.y + 3}
                  fontSize="7"
                  fontFamily="monospace"
                  fill="var(--color-ink)"
                >
                  {s.label}
                </text>
              </g>
            ))}
          </svg>
          <div className="absolute bottom-2 ltr:left-2 rtl:right-2 font-mono text-[9px] text-[var(--color-ink-faint)] tracking-wider uppercase">
            MA · GEODETIC · 6 CANDIDATES
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--color-ink-faint)] mb-0.5">
            DIA-1 · {t('labels.score')}
          </div>
          <div className="border border-[var(--tint)] bg-[var(--tint-ghost)] p-3">
            <div className="font-display num text-3xl text-[var(--tint)]">97<span className="text-[14px] text-[var(--color-ink-muted)]">/100</span></div>
            <div className="font-mono text-[10px] text-[var(--color-ink)]">Ain Beni Mathar</div>
          </div>

          <ScoreRow label={t('labels.irradiance')} value={96} tag="2,340 kWh/m²" />
          <ScoreRow label={t('labels.grid')} value={89} tag="1.4 km HT" />
          <ScoreRow label={t('labels.land')} value={94} tag="ready-to-build" />
        </div>
      </div>
    </MockupFrame>
  );
}

function ScoreRow({label, value, tag}: {label: string; value: number; tag: string}) {
  return (
    <div className="border border-[var(--color-line)] bg-[var(--color-bg)] p-2">
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--color-ink-faint)]">
          {label}
        </span>
        <span className="font-mono num text-[11px] text-[var(--color-ink)]">{value}</span>
      </div>
      <div className="h-[3px] bg-[var(--color-bg-panel)] overflow-hidden">
        <div
          className="h-full"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, var(--tint), hsl(32 88% 60%))`
          }}
        />
      </div>
      <div className="font-mono text-[9px] text-[var(--color-ink-muted)] mt-1">{tag}</div>
    </div>
  );
}
