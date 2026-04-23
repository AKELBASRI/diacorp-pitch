import {getTranslations} from 'next-intl/server';
import type {Strategy} from '@/lib/strategies';
import {DataCenterMockup} from './mockups/DataCenterMockup';
import {EnergyMarketMockup} from './mockups/EnergyMarketMockup';
import {CarbonTokensMockup} from './mockups/CarbonTokensMockup';
import {PredictiveOMMockup} from './mockups/PredictiveOMMockup';
import {IndustrialZoneMockup} from './mockups/IndustrialZoneMockup';
import {HydrogenMockup} from './mockups/HydrogenMockup';
import {BESSMockup} from './mockups/BESSMockup';
import {PPAMockup} from './mockups/PPAMockup';
import {RetailSolarMockup} from './mockups/RetailSolarMockup';
import {GISMockup} from './mockups/GISMockup';

async function renderMockup(id: Strategy['id'], tint: string) {
  switch (id) {
    case 'data-center':
      return <DataCenterMockup tint={tint} />;
    case 'energy-market':
      return <EnergyMarketMockup tint={tint} />;
    case 'carbon-tokens':
      return <CarbonTokensMockup tint={tint} />;
    case 'predictive-om':
      return <PredictiveOMMockup tint={tint} />;
    case 'industrial-zone':
      return <IndustrialZoneMockup tint={tint} />;
    case 'green-hydrogen':
      return <HydrogenMockup tint={tint} />;
    case 'bess-arbitrage':
      return <BESSMockup tint={tint} />;
    case 'corporate-ppa':
      return <PPAMockup tint={tint} />;
    case 'retail-solar':
      return <RetailSolarMockup tint={tint} />;
    case 'gis-permitting':
      return <GISMockup tint={tint} />;
  }
}

function formatMusd(m: number, locale: string) {
  if (m >= 1000) {
    const bn = m / 1000;
    return locale === 'ar'
      ? `${bn.toFixed(2)} مليار $`
      : `$${bn.toFixed(2)}B`;
  }
  return locale === 'ar' ? `${m.toFixed(0)} م $` : `$${m.toFixed(0)}M`;
}

export async function StrategyCard({
  strategy,
  locale,
  mirror
}: {
  strategy: Strategy;
  locale: string;
  mirror: boolean;
}) {
  const t = await getTranslations(`strategies.items.${strategy.id}`);
  const tTags = await getTranslations('strategies.tags');
  const mockup = await renderMockup(strategy.id, strategy.tintHsl);

  return (
    <article
      id={strategy.id}
      className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start py-16 md:py-24 border-t border-[var(--color-line)]"
    >
      {/* Left text column */}
      <div
        className={`lg:col-span-5 ${
          mirror ? 'lg:col-start-8 lg:row-start-1' : ''
        } relative`}
      >
        <div className="flex items-center gap-4 mb-6">
          <span
            className="font-mono text-[11px] tracking-[0.2em] px-2 py-1 border"
            style={{
              borderColor: `hsl(${strategy.tintHsl})`,
              color: `hsl(${strategy.tintHsl})`
            }}
          >
            {strategy.number}
          </span>
          <span className="h-px flex-1 bg-[var(--color-line)]" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-ink-faint)]">
            {tTags('phase')} {strategy.phase}
          </span>
        </div>

        <h3
          className="font-display text-[30px] md:text-[40px] leading-[1.05] tracking-[-0.025em] mb-4"
          style={{color: `hsl(${strategy.tintHsl})`}}
        >
          {t('name')}
        </h3>

        <p className="text-[17px] leading-[1.45] text-[var(--color-ink)] mb-4 max-w-[50ch]">
          {t('pitch')}
        </p>

        <p className="text-[14px] leading-relaxed text-[var(--color-ink-muted)] mb-6 max-w-[55ch]">
          {t('description')}
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <TagBox
            label={tTags('revenue')}
            value={formatMusd(strategy.revenueY5Musd, locale)}
            accent={`hsl(${strategy.tintHsl})`}
          />
          <TagBox
            label={tTags('margin')}
            value={`${strategy.marginPct}%`}
          />
          <TagBox
            label={tTags('capex')}
            value={formatMusd(strategy.capexMusd, locale)}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {strategy.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] tracking-wider uppercase px-2 py-1 border border-[var(--color-line)] text-[var(--color-ink-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Mockup column */}
      <div
        className={`lg:col-span-7 ${
          mirror ? 'lg:col-start-1 lg:row-start-1' : ''
        }`}
      >
        <div className="relative">{mockup}</div>
      </div>
    </article>
  );
}

function TagBox({
  label,
  value,
  accent
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="border border-[var(--color-line)] p-3">
      <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--color-ink-faint)] mb-1">
        {label}
      </div>
      <div
        className="font-display num text-lg md:text-xl"
        style={{color: accent || 'var(--color-ink)'}}
      >
        {value}
      </div>
    </div>
  );
}
