import {getTranslations} from 'next-intl/server';
import {MockupFrame} from './MockupFrame';

export async function BESSMockup({tint}: {tint: string}) {
  const t = await getTranslations('strategies.items.bess-arbitrage.mockup');

  // SOC curve over 24 hours
  const hours = Array.from({length: 24}, (_, i) => i);
  const soc = [18, 15, 14, 13, 12, 15, 22, 35, 52, 68, 82, 95, 98, 92, 78, 62, 48, 32, 22, 18, 20, 19, 18, 18];
  const price = [60, 58, 55, 53, 50, 48, 62, 85, 95, 70, 45, 25, 15, 20, 35, 55, 90, 140, 165, 135, 95, 75, 68, 62];

  return (
    <MockupFrame title={t('title')} subtitle={t('subtitle')} tint={tint}>
      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatTile label={t('labels.soc')} value="68" unit="%" tone="default" />
        <StatTile label={t('labels.buy')} value="12:15" unit="MWh" tone="mute" />
        <StatTile label={t('labels.sell')} value="19:40" unit="MWh" tone="mute" />
        <StatTile label={t('labels.pnl')} value="+$18.4k" unit="day" tone="good" />
      </div>

      <div className="border border-[var(--color-line)] bg-[var(--color-bg)] p-4">
        <svg viewBox="0 0 480 140" className="w-full h-[150px]">
          {/* horizontal grid */}
          {[0, 35, 70, 105, 140].map((y) => (
            <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="var(--color-line)" strokeWidth="0.5" />
          ))}
          {/* Price bars */}
          {price.map((p, i) => {
            const h = (p / 180) * 100;
            return (
              <rect
                key={i}
                x={i * 20 + 2}
                y={140 - h}
                width="16"
                height={h}
                fill={p < 40 ? 'hsl(168 72% 55% / 0.45)' : p > 120 ? 'hsl(24 80% 62% / 0.55)' : 'hsl(0 0% 100% / 0.04)'}
              />
            );
          })}
          {/* SOC line */}
          <path
            d={hours
              .map(
                (h, i) =>
                  `${i === 0 ? 'M' : 'L'} ${h * 20 + 10} ${140 - (soc[i] / 100) * 130}`
              )
              .join(' ')}
            fill="none"
            stroke="var(--tint)"
            strokeWidth="2"
          />
          {/* Buy markers */}
          {[11, 12, 13].map((i) => (
            <circle key={`b${i}`} cx={i * 20 + 10} cy={140 - (soc[i] / 100) * 130} r="3" fill="hsl(168 72% 55%)" />
          ))}
          {/* Sell markers */}
          {[17, 18, 19].map((i) => (
            <circle key={`s${i}`} cx={i * 20 + 10} cy={140 - (soc[i] / 100) * 130} r="3" fill="hsl(24 80% 62%)" />
          ))}
        </svg>
        <div className="flex items-center justify-between mt-2 font-mono text-[9px] text-[var(--color-ink-faint)] uppercase tracking-wider">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>
    </MockupFrame>
  );
}

function StatTile({
  label,
  value,
  unit,
  tone
}: {
  label: string;
  value: string;
  unit: string;
  tone: 'default' | 'mute' | 'good';
}) {
  const color =
    tone === 'good' ? 'var(--tint)' : tone === 'mute' ? 'var(--color-ink-muted)' : 'var(--color-ink)';
  return (
    <div className="border border-[var(--color-line)] p-3 bg-[var(--color-bg)]">
      <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--color-ink-faint)] mb-1.5">
        {label}
      </div>
      <div className="flex items-baseline gap-1.5 font-mono num">
        <span className="text-lg font-semibold" style={{color}}>
          {value}
        </span>
        <span className="text-[10px] text-[var(--color-ink-muted)]">{unit}</span>
      </div>
    </div>
  );
}
