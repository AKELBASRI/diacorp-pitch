import {getTranslations} from 'next-intl/server';
import {MockupFrame} from './MockupFrame';

export async function PredictiveOMMockup({tint}: {tint: string}) {
  const t = await getTranslations('strategies.items.predictive-om.mockup');

  // 24 x 12 grid of panels, with some marked as warning/critical
  const grid: ('h' | 'w' | 'c')[] = Array(24 * 12).fill('h');
  const warnings = [14, 15, 38, 67, 89, 112, 145, 180, 220, 244, 260];
  const criticals = [55, 113, 201];
  warnings.forEach((i) => (grid[i] = 'w'));
  criticals.forEach((i) => (grid[i] = 'c'));

  return (
    <MockupFrame title={t('title')} subtitle={t('subtitle')} tint={tint}>
      <div className="grid grid-cols-[1fr_auto] gap-4">
        <div>
          <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--color-ink-faint)] mb-2">
            ARRAY N-8 · 288 PANELS
          </div>
          <div
            className="grid gap-[2px]"
            style={{gridTemplateColumns: 'repeat(24, minmax(0, 1fr))'}}
          >
            {grid.map((s, i) => (
              <div
                key={i}
                className="aspect-square"
                style={{
                  background:
                    s === 'h'
                      ? 'hsl(144 35% 30% / 0.55)'
                      : s === 'w'
                      ? 'hsl(48 90% 58%)'
                      : 'hsl(0 75% 55%)'
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 font-mono text-[9px] tracking-wider uppercase">
            <LegendDot color="hsl(144 35% 45%)" label={t('labels.healthy')} />
            <LegendDot color="hsl(48 90% 58%)" label={t('labels.warning')} />
            <LegendDot color="hsl(0 75% 55%)" label={t('labels.critical')} />
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[160px]">
          <div className="border border-[var(--color-line)] bg-[var(--color-bg)] p-3">
            <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--color-ink-faint)] mb-1">
              {t('labels.yield')}
            </div>
            <div className="font-display num text-xl text-[var(--tint)]">
              214.6<span className="font-mono text-[10px] text-[var(--color-ink-muted)] ltr:ml-1 rtl:mr-1">MWh</span>
            </div>
            <div className="font-mono text-[10px] text-[var(--tint)] mt-1">↑ +3.2%</div>
          </div>

          <AlertItem code="C-201" msg="Hotspot 74°C" level="c" />
          <AlertItem code="W-145" msg="Soiling 12%" level="w" />
          <AlertItem code="W-112" msg="String drop" level="w" />
        </div>
      </div>
    </MockupFrame>
  );
}

function LegendDot({color, label}: {color: string; label: string}) {
  return (
    <div className="flex items-center gap-1.5 text-[var(--color-ink-muted)]">
      <span
        className="w-2 h-2 block"
        style={{background: color}}
      />
      {label}
    </div>
  );
}

function AlertItem({code, msg, level}: {code: string; msg: string; level: 'w' | 'c'}) {
  return (
    <div
      className="border-l-2 px-2 py-1.5 bg-[var(--color-bg)]"
      style={{
        borderColor: level === 'w' ? 'hsl(48 90% 58%)' : 'hsl(0 75% 55%)'
      }}
    >
      <div className="font-mono text-[10px] text-[var(--color-ink)]">{code}</div>
      <div className="font-mono text-[10px] text-[var(--color-ink-muted)]">{msg}</div>
    </div>
  );
}
