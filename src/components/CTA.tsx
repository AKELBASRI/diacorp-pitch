import {getTranslations} from 'next-intl/server';

export async function CTA() {
  const t = await getTranslations('cta');

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(232,169,72,0.18), transparent 60%)'
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 py-24 md:py-40 text-center">
        <div className="inline-flex items-center gap-3 mb-10">
          <span className="block w-8 h-px bg-[var(--color-sun)]" />
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-sun)]">
            {t('eyebrow')}
          </span>
          <span className="block w-8 h-px bg-[var(--color-sun)]" />
        </div>
        <h2 className="font-display text-[36px] md:text-[56px] lg:text-[76px] leading-[1.02] tracking-[-0.035em] max-w-[22ch] mx-auto">
          {t('heading')}
        </h2>
        <p className="mt-8 text-[15px] md:text-[17px] leading-[1.55] text-[var(--color-ink-muted)] max-w-[60ch] mx-auto">
          {t('body')}
        </p>
        <div className="mt-12 flex items-center justify-center">
          <a
            href="mailto:wahb@diacorp.energy"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-sun)] text-[var(--color-bg)] font-mono text-[12px] tracking-[0.16em] uppercase hover:bg-[var(--color-ink)] transition-colors"
          >
            {t('primary')}
            <span className="ltr:rotate-0 rtl:rotate-180">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
