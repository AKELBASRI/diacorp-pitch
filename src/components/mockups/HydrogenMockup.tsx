import {getTranslations} from 'next-intl/server';
import {MockupFrame} from './MockupFrame';

export async function HydrogenMockup({tint}: {tint: string}) {
  const t = await getTranslations('strategies.items.green-hydrogen.mockup');

  return (
    <MockupFrame title={t('title')} subtitle={t('subtitle')} tint={tint}>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <PathCard
          label={t('labels.sell')}
          value="$72/MWh"
          secondary="Spot Market"
          active={false}
        />
        <PathCard
          label={t('labels.store')}
          value="BESS 82%"
          secondary="SOC current"
          active={false}
        />
        <PathCard
          label={t('labels.electrolyze')}
          value="€6.40/kg"
          secondary="H₂ → NH₃ FOB"
          active
        />
      </div>

      <div className="border border-[var(--color-line)] bg-[var(--color-bg)] p-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--color-ink-faint)]">
            {t('labels.forecast')}
          </span>
          <span className="font-mono text-[10px] text-[var(--tint)]">
            DECISION · ELECTROLYZE 78%
          </span>
        </div>

        <svg viewBox="0 0 400 100" className="w-full h-[100px]">
          {/* Grid lines */}
          {[0, 25, 50, 75].map((y) => (
            <line
              key={y}
              x1="0"
              x2="400"
              y1={y}
              y2={y}
              stroke="var(--color-line)"
              strokeWidth="0.5"
            />
          ))}
          {/* Electricity price */}
          <path
            d="M0 70 Q 50 55, 100 40 T 200 35 T 300 50 T 400 30"
            fill="none"
            stroke="hsl(32 88% 60%)"
            strokeWidth="1.5"
          />
          {/* H2 price */}
          <path
            d="M0 50 Q 50 45, 100 30 T 200 25 T 300 45 T 400 20"
            fill="none"
            stroke="hsl(200 78% 58%)"
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
          {/* Decision zones */}
          <rect x="80" y="0" width="70" height="100" fill="hsl(200 78% 58% / 0.08)" />
          <rect x="270" y="0" width="60" height="100" fill="hsl(32 88% 60% / 0.08)" />
          {/* Now marker */}
          <line x1="130" x2="130" y1="0" y2="100" stroke="var(--tint)" strokeWidth="1" />
          <circle cx="130" cy="28" r="3" fill="var(--tint)" />
        </svg>

        <div className="flex items-center gap-4 mt-2 font-mono text-[9px] tracking-wider uppercase text-[var(--color-ink-muted)]">
          <LegendLine color="hsl(32 88% 60%)" label="€/MWh" />
          <LegendLine color="hsl(200 78% 58%)" label="€/kg H₂" dashed />
        </div>
      </div>
    </MockupFrame>
  );
}

function PathCard({
  label,
  value,
  secondary,
  active
}: {
  label: string;
  value: string;
  secondary: string;
  active: boolean;
}) {
  return (
    <div
      className="border p-3 relative overflow-hidden"
      style={{
        borderColor: active ? 'var(--tint)' : 'var(--color-line)',
        background: active ? 'var(--tint-ghost)' : 'var(--color-bg)'
      }}
    >
      <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--color-ink-faint)] mb-1.5">
        {label}
      </div>
      <div className="font-display num text-lg text-[var(--color-ink)]">{value}</div>
      <div className="font-mono text-[9px] text-[var(--color-ink-muted)] mt-0.5">
        {secondary}
      </div>
      {active && (
        <div
          className="absolute bottom-0 ltr:left-0 rtl:right-0 h-[2px] bg-[var(--tint)] glow-pulse"
          style={{width: '100%'}}
        />
      )}
    </div>
  );
}

function LegendLine({
  color,
  label,
  dashed
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="12" height="4">
        <line
          x1="0"
          x2="12"
          y1="2"
          y2="2"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray={dashed ? '2 2' : undefined}
        />
      </svg>
      <span>{label}</span>
    </div>
  );
}
