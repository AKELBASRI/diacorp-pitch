import {getLocale, getTranslations} from 'next-intl/server';
import {STRATEGIES} from '@/lib/strategies';
import {SectionEyebrow} from './Thesis';
import {StrategyCard} from './StrategyCard';

export async function Strategies() {
  const t = await getTranslations('strategies');
  const locale = await getLocale();

  return (
    <section id="strategies" className="relative">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 pt-24 md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionEyebrow index="iii" label={t('eyebrow')} />
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-[32px] md:text-[48px] lg:text-[64px] leading-[1.02] tracking-[-0.03em]">
              {t('heading')}
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-[var(--color-ink-muted)] max-w-[70ch]">
              {t('subheading')}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 mt-12">
        {STRATEGIES.map((strategy, idx) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            locale={locale}
            mirror={idx % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}
