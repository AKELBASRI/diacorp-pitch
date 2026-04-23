import {getTranslations} from 'next-intl/server';
import {MockupFrame} from './MockupFrame';

const DEALS = [
  {name: 'OCP Group', logo: 'OCP', mw: 250, term: 20, lcoe: 0.068, stage: 'signed', probability: 100},
  {name: 'Stellantis Kénitra', logo: 'STL', mw: 85, term: 15, lcoe: 0.074, stage: 'term-sheet', probability: 75},
  {name: 'Citic Dicastal', logo: 'CTC', mw: 500, term: 25, lcoe: 0.065, stage: 'negotiation', probability: 55},
  {name: 'Managem Hahone', logo: 'MNG', mw: 42, term: 10, lcoe: 0.082, stage: 'LOI', probability: 30}
];

export async function PPAMockup({tint}: {tint: string}) {
  const t = await getTranslations('strategies.items.corporate-ppa.mockup');

  return (
    <MockupFrame title={t('title')} subtitle={t('subtitle')} tint={tint}>
      <div className="space-y-2.5">
        {DEALS.map((deal) => (
          <div
            key={deal.name}
            className="border border-[var(--color-line)] bg-[var(--color-bg)] p-3 grid grid-cols-[auto_1fr_auto] items-center gap-4"
          >
            <div className="w-10 h-10 border border-[var(--color-line)] flex items-center justify-center font-mono text-[10px] tracking-wider text-[var(--color-ink-muted)]">
              {deal.logo}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[14px] text-[var(--color-ink)]">{deal.name}</span>
                <StageBadge stage={deal.stage} />
              </div>
              <div className="flex items-center gap-5 font-mono text-[10px] text-[var(--color-ink-muted)]">
                <span>
                  {t('labels.capacity')}: <span className="text-[var(--color-ink)]">{deal.mw} MW</span>
                </span>
                <span>
                  {t('labels.term')}: <span className="text-[var(--color-ink)]">{deal.term} yr</span>
                </span>
                <span>
                  {t('labels.lcoe')}:{' '}
                  <span className="text-[var(--tint)]">${deal.lcoe.toFixed(3)}</span>
                </span>
              </div>
              <div className="mt-2 h-1 bg-[var(--color-bg-panel)] border border-[var(--color-line)] overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${deal.probability}%`,
                    background: 'linear-gradient(90deg, var(--tint), hsl(32 88% 60%))'
                  }}
                />
              </div>
            </div>
            <div className="text-right">
              <div className="font-display num text-xl text-[var(--tint)]">{deal.probability}%</div>
              <div className="font-mono text-[9px] text-[var(--color-ink-faint)] uppercase tracking-wider">
                confidence
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--color-line)] flex items-center justify-between font-mono text-[10px]">
        <span className="text-[var(--color-ink-faint)]">PIPELINE · 877 MW · $4.2B TCV</span>
        <span className="text-[var(--tint)]">FEE ACCRUED: $84.4M</span>
      </div>
    </MockupFrame>
  );
}

function StageBadge({stage}: {stage: string}) {
  const tone =
    stage === 'signed'
      ? 'hsl(168 72% 55%)'
      : stage === 'term-sheet'
      ? 'hsl(32 88% 60%)'
      : stage === 'negotiation'
      ? 'hsl(200 78% 58%)'
      : 'hsl(0 0% 60%)';
  return (
    <span
      className="font-mono text-[9px] tracking-[0.15em] uppercase px-1.5 py-0.5 border"
      style={{borderColor: tone, color: tone}}
    >
      {stage}
    </span>
  );
}
