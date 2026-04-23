import {getTranslations} from 'next-intl/server';
import {MockupFrame} from './MockupFrame';

export async function DataCenterMockup({tint}: {tint: string}) {
  const t = await getTranslations('strategies.items.data-center.mockup');

  const racks = [
    {id: 'R-01', util: 94, temp: 34},
    {id: 'R-02', util: 87, temp: 32},
    {id: 'R-03', util: 98, temp: 36},
    {id: 'R-04', util: 72, temp: 29},
    {id: 'R-05', util: 91, temp: 33},
    {id: 'R-06', util: 68, temp: 28},
    {id: 'R-07', util: 89, temp: 32},
    {id: 'R-08', util: 96, temp: 35}
  ];

  return (
    <MockupFrame title={t('title')} subtitle={t('subtitle')} tint={tint}>
      <div className="grid grid-cols-4 gap-3 mb-4">
        <Metric label={t('metrics.utilization')} value="87.4" unit="%" />
        <Metric label={t('metrics.pue')} value="1.08" unit="" />
        <Metric label={t('metrics.carbon')} value="11" unit="g/kWh" />
        <Metric label={t('metrics.contracted')} value="412" unit="MW" />
      </div>

      <div className="grid grid-cols-8 gap-1.5 mb-4">
        {racks.map((rack) => (
          <div
            key={rack.id}
            className="relative aspect-[3/5] border border-[var(--color-line)] bg-[var(--color-bg)] flex flex-col justify-end overflow-hidden"
          >
            <div
              className="absolute bottom-0 left-0 right-0 bg-[var(--tint)] opacity-80"
              style={{height: `${rack.util}%`}}
            />
            <div className="relative font-mono text-[8px] text-center pb-0.5 text-[var(--color-bg)] mix-blend-difference">
              {rack.id}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-ink-faint)] pt-3 border-t border-[var(--color-line)]">
        <span>CLUSTER-ORIENTAL-1 · H100 · 4,096 GPU</span>
        <span className="text-[var(--tint)]">↑ 2.4 EF/s</span>
      </div>
    </MockupFrame>
  );
}

function Metric({label, value, unit}: {label: string; value: string; unit: string}) {
  return (
    <div className="bg-[var(--color-bg)] border border-[var(--color-line)] p-3">
      <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--color-ink-faint)] mb-1.5">
        {label}
      </div>
      <div className="flex items-baseline gap-1 font-mono num">
        <span className="text-[var(--color-ink)] text-xl font-semibold">{value}</span>
        <span className="text-[10px] text-[var(--color-ink-muted)]">{unit}</span>
      </div>
    </div>
  );
}
