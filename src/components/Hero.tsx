import {getTranslations} from 'next-intl/server';

export async function Hero() {
  const t = await getTranslations('hero');

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Background */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,169,72,0.13), transparent 60%), radial-gradient(ellipse 60% 60% at 85% 40%, rgba(86,240,200,0.06), transparent 60%)'
        }}
      />
      <div aria-hidden className="absolute inset-0 zellige opacity-[0.025]" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px hairline"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Kicker */}
        <div className="flex items-center gap-3 mb-12 rise" style={{animationDelay: '0ms'}}>
          <span className="block w-8 h-px bg-[var(--color-sun)]" />
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-sun)]">
            {t('kicker')}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display leading-[0.92] text-[14vw] md:text-[10vw] lg:text-[8.5rem] tracking-[-0.035em]">
          <span className="block rise" style={{animationDelay: '80ms'}}>
            {t('titleLine1')}
          </span>
          <span
            className="block rise text-[var(--color-ink-muted)]"
            style={{animationDelay: '220ms'}}
          >
            {t('titleLine2')}
          </span>
          <span className="block rise relative" style={{animationDelay: '360ms'}}>
            <span className="text-[var(--color-sun)]">{t('titleLine3')}</span>
          </span>
        </h1>

        {/* Lede */}
        <div
          className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 rise"
          style={{animationDelay: '520ms'}}
        >
          <div className="md:col-span-7 md:col-start-6">
            <p className="text-[17px] md:text-[19px] leading-[1.55] text-[var(--color-ink)]/85 max-w-[60ch]">
              {t('lede')}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="mt-16 md:mt-24 border-t border-[var(--color-line)] grid grid-cols-2 md:grid-cols-4 rise"
          style={{animationDelay: '720ms'}}
        >
          {(
            [
              ['capex', 'capexValue'],
              ['capacity', 'capacityValue'],
              ['revenue', 'revenueValue'],
              ['margin', 'marginValue']
            ] as const
          ).map(([labelKey, valueKey], i) => (
            <div
              key={labelKey}
              className={`py-6 md:py-8 ltr:md:border-r rtl:md:border-l border-[var(--color-line)] ${
                i === 3 ? 'ltr:md:border-r-0 rtl:md:border-l-0' : ''
              } ${
                i % 2 === 1 ? 'ltr:pl-6 rtl:pr-6' : 'ltr:md:pl-0 rtl:md:pr-0'
              } ${i >= 2 ? 'border-t md:border-t-0' : ''}`}
            >
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-faint)] mb-3">
                {t(`stats.${labelKey}`)}
              </div>
              <div className="font-display num text-3xl md:text-4xl tracking-tight">
                {t(`stats.${valueKey}`)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
