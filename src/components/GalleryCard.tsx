import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
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

async function pick(id: Strategy['id'], tint: string) {
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

export async function GalleryCard({strategy}: {strategy: Strategy}) {
  const t = await getTranslations(`strategies.items.${strategy.id}`);
  const mockup = await pick(strategy.id, strategy.tintHsl);

  return (
    <article
      id={strategy.id}
      className="relative border border-[var(--color-line)] bg-[var(--color-bg)]/60 backdrop-blur p-5 md:p-7 hover:border-[var(--color-line-strong)] transition-colors"
    >
      <header className="flex items-start justify-between mb-5 gap-4">
        <div className="flex items-baseline gap-3">
          <span
            className="font-mono text-[11px] tracking-[0.2em] px-2 py-1 border"
            style={{
              borderColor: `hsl(${strategy.tintHsl})`,
              color: `hsl(${strategy.tintHsl})`
            }}
          >
            {strategy.number}
          </span>
          <div>
            <h3
              className="font-display text-xl md:text-2xl leading-tight tracking-tight"
              style={{color: `hsl(${strategy.tintHsl})`}}
            >
              {t('name')}
            </h3>
            <p className="mt-1 text-[13px] leading-snug text-[var(--color-ink-muted)] max-w-[52ch]">
              {t('pitch')}
            </p>
          </div>
        </div>
        <Link
          href={`/#${strategy.id}`}
          className="shrink-0 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-ink-faint)] hover:text-[var(--color-sun)] transition-colors ltr:rotate-0 rtl:rotate-180"
          aria-label="Details"
        >
          ↗
        </Link>
      </header>

      <div>{mockup}</div>
    </article>
  );
}
