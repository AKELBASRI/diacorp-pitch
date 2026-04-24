import {getTranslations} from 'next-intl/server';

export async function HomeContact() {
  const t = await getTranslations('home.contact');

  return (
    <section id="contact" className="relative">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[var(--color-sun)]" />
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-sun)]">
                {t('kicker')}
              </span>
            </div>
            <h2 className="font-display text-[48px] lg:text-[72px] leading-[1] tracking-[-0.03em] mb-8">
              {t('title')}
            </h2>
            <p className="text-[15px] lg:text-[17px] leading-[1.6] text-[var(--color-ink-muted)] max-w-[52ch]">
              {t('sub')}
            </p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 border border-[var(--color-line)] p-8 bg-[var(--color-bg-elev)]/50">
            <div className="space-y-6">
              <div>
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-faint)] mb-2">
                  {t('emailLabel')}
                </div>
                <a
                  href="mailto:contact@diacorp.energy"
                  className="font-display text-xl tracking-tight text-[var(--color-sun)] hover:text-[var(--color-ink)] transition-colors"
                >
                  {t('emailValue')}
                </a>
              </div>
              <div className="border-t border-[var(--color-line)] pt-5">
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-faint)] mb-2">
                  {t('phoneLabel')}
                </div>
                <div className="font-mono text-[15px] text-[var(--color-ink)]">
                  {t('phoneValue')}
                </div>
              </div>

              <a
                href="#loi"
                className="mt-4 inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[var(--color-sun)] text-[var(--color-bg)] font-mono text-[12px] tracking-[0.16em] uppercase hover:bg-[var(--color-ink)] transition-colors"
              >
                {t('send')}
                <span className="ltr:rotate-0 rtl:rotate-180">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
