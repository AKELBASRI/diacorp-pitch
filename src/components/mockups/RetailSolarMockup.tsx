import {getTranslations} from 'next-intl/server';
import {MockupFrame} from './MockupFrame';

export async function RetailSolarMockup({tint}: {tint: string}) {
  const t = await getTranslations('strategies.items.retail-solar.mockup');

  return (
    <MockupFrame title={t('title')} subtitle={t('subtitle')} tint={tint}>
      <div className="grid grid-cols-[220px_1fr] gap-5">
        {/* Phone */}
        <div className="relative mx-auto w-full max-w-[220px] aspect-[9/18] border-2 border-[var(--color-line-strong)] rounded-[26px] overflow-hidden bg-[var(--color-bg)] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-[var(--color-line-strong)] rounded-b-lg" />
          <div className="px-4 pt-8 pb-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-[13px] text-[var(--color-ink)]">
                DiaCorp
              </span>
              <span className="w-6 h-6 border border-[var(--color-line)] rounded-full flex items-center justify-center text-[10px] text-[var(--color-ink-muted)]">
                S
              </span>
            </div>

            <div className="mb-4">
              <div className="font-mono text-[8px] tracking-[0.15em] uppercase text-[var(--color-ink-faint)] mb-1">
                {t('labels.saved')}
              </div>
              <div className="font-display num text-3xl text-[var(--tint)]">
                1,240
                <span className="font-mono text-[10px] text-[var(--color-ink-muted)] ltr:ml-1 rtl:mr-1">
                  MAD
                </span>
              </div>
              <div className="font-mono text-[9px] text-[var(--color-ink-muted)] mt-0.5">
                vs. tarif standard
              </div>
            </div>

            <div className="relative h-16 mb-3 border border-[var(--color-line)] bg-[var(--color-bg-panel)] p-2">
              <svg viewBox="0 0 180 50" className="w-full h-full">
                <path
                  d="M0 40 Q 30 25, 60 20 T 120 10 T 180 15"
                  fill="none"
                  stroke="var(--tint)"
                  strokeWidth="1.5"
                />
                <path
                  d="M0 40 Q 30 25, 60 20 T 120 10 T 180 15 L180 50 L0 50 Z"
                  fill="var(--tint)"
                  opacity="0.14"
                />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <MiniStat label={t('labels.produced')} value="286 kWh" />
              <MiniStat label={t('labels.consumed')} value="194 kWh" />
            </div>

            <div className="mt-auto border border-[var(--tint)] bg-[var(--tint-ghost)] px-2 py-1.5 text-center">
              <div className="font-mono text-[9px] text-[var(--tint)] tracking-wider uppercase">
                {t('labels.offset')}
              </div>
              <div className="font-display num text-[13px] text-[var(--color-ink)]">
                184 kg CO₂
              </div>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-3">
          <div className="border border-[var(--color-line)] bg-[var(--color-bg)] p-3">
            <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--color-ink-faint)] mb-1">
              ROOFS INSTALLED
            </div>
            <div className="font-display num text-2xl text-[var(--color-ink)]">
              24,180
            </div>
            <div className="font-mono text-[10px] text-[var(--tint)] mt-1">
              +3,420 / month
            </div>
          </div>
          <div className="border border-[var(--color-line)] bg-[var(--color-bg)] p-3">
            <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--color-ink-faint)] mb-1">
              MRR
            </div>
            <div className="font-display num text-2xl text-[var(--color-ink)]">
              $2.41M
            </div>
            <div className="font-mono text-[10px] text-[var(--tint)] mt-1">
              ↑ 14% MoM
            </div>
          </div>
          <div className="border border-[var(--color-line)] bg-[var(--color-bg)] p-3">
            <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--color-ink-faint)] mb-1">
              FINANCING · BMCE
            </div>
            <div className="font-display num text-2xl text-[var(--color-ink)]">
              $180M
            </div>
            <div className="font-mono text-[10px] text-[var(--color-ink-muted)] mt-1">
              Facility drawn 62%
            </div>
          </div>
        </div>
      </div>
    </MockupFrame>
  );
}

function MiniStat({label, value}: {label: string; value: string}) {
  return (
    <div className="border border-[var(--color-line)] p-1.5">
      <div className="font-mono text-[8px] tracking-[0.12em] uppercase text-[var(--color-ink-faint)]">
        {label}
      </div>
      <div className="font-mono num text-[12px] text-[var(--color-ink)] mt-0.5">
        {value}
      </div>
    </div>
  );
}
