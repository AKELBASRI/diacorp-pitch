import {getTranslations} from 'next-intl/server';
import {MockupFrame} from './MockupFrame';

const TENANTS = [
  {name: 'Managem Jerada', mwh: 4200, scope: 'S1+S2', bill: '€312k', pct: 100},
  {name: 'Ciments Holcim Oujda', mwh: 2850, scope: 'S1+S2', bill: '€210k', pct: 68},
  {name: 'Briqueteries BMO', mwh: 1940, scope: 'S2', bill: '€143k', pct: 46},
  {name: 'SATEC Oujda', mwh: 1610, scope: 'S1+S2+S3', bill: '€119k', pct: 38},
  {name: 'Copag Berkane', mwh: 1380, scope: 'S2', bill: '€102k', pct: 33},
  {name: 'Unimer Nador', mwh: 980, scope: 'S1', bill: '€72k', pct: 23}
];

export async function IndustrialZoneMockup({tint}: {tint: string}) {
  const t = await getTranslations('strategies.items.industrial-zone.mockup');

  return (
    <MockupFrame title={t('title')} subtitle={t('subtitle')} tint={tint}>
      <div className="grid grid-cols-[10%_1fr_15%_15%] gap-x-3 items-center font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--color-ink-faint)] pb-2 border-b border-[var(--color-line)]">
        <span>#</span>
        <span>{t('labels.tenant')}</span>
        <span className="text-right">{t('labels.consumption')}</span>
        <span className="text-right">{t('labels.bill')}</span>
      </div>
      <div className="mt-2 space-y-2">
        {TENANTS.map((tn, i) => (
          <div key={tn.name} className="grid grid-cols-[10%_1fr_15%_15%] gap-x-3 items-center">
            <span className="font-mono text-[10px] text-[var(--color-ink-faint)]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] text-[var(--color-ink)]">{tn.name}</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-ink-faint)]">
                  {tn.scope}
                </span>
              </div>
              <div className="mt-1.5 h-1 bg-[var(--color-bg)] border border-[var(--color-line)] overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${tn.pct}%`,
                    background: `linear-gradient(90deg, var(--tint), var(--color-copper))`
                  }}
                />
              </div>
            </div>
            <span className="font-mono num text-[11px] text-right text-[var(--color-ink-muted)]">
              {tn.mwh.toLocaleString()}
            </span>
            <span className="font-mono num text-[11px] text-right text-[var(--tint)]">
              {tn.bill}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--color-line)] flex items-center justify-between">
        <div className="font-mono text-[10px] text-[var(--color-ink-faint)]">
          ZONE ABM · 42 TENANTS · 128 MW CONTRACTED
        </div>
        <div className="font-mono text-[10px] text-[var(--tint)]">
          CO₂ saved ↓ 18,400 t/yr
        </div>
      </div>
    </MockupFrame>
  );
}
