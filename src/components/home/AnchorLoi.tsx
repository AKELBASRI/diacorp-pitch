import {getTranslations} from 'next-intl/server';

export async function AnchorLoi() {
  const t = await getTranslations('home.anchor');

  return (
    <section
      id="anchor"
      className="relative border-b border-[var(--color-line)] overflow-hidden bg-[var(--color-bg-elev)]/30"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 40% 55% at 15% 20%, hsl(96 55% 40% / 0.08), transparent 65%)'
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 lg:mb-14">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[var(--color-spark-deep)]" />
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-spark-deep)]">
                {t('kicker')}
              </span>
            </div>
            <h2 className="font-display text-[30px] lg:text-[46px] leading-[1.05] tracking-[-0.025em]">
              {t('title')}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 flex items-end">
            <p className="text-[15px] lg:text-[17px] leading-[1.6] text-[var(--color-ink-muted)] max-w-[55ch]">
              {t('sub')}
            </p>
          </div>
        </div>

        <article className="relative border border-[var(--color-line)] bg-[var(--color-bg)] p-7 lg:p-10 flex flex-col md:flex-row md:items-center gap-7 lg:gap-10">
          <div
            aria-hidden
            className="absolute top-0 ltr:left-0 rtl:right-0 h-[3px] w-full"
            style={{
              background:
                'linear-gradient(90deg, hsl(96 55% 40%), var(--color-sun))'
            }}
          />

          <div className="shrink-0 w-[72px] h-[72px] lg:w-[88px] lg:h-[88px] border border-[var(--color-line-strong)] bg-[var(--color-bg-panel)] flex items-center justify-center relative overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0 opacity-50"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, hsl(96 55% 40% / 0.2), transparent 70%)'
              }}
            />
            <svg
              width="54"
              height="54"
              viewBox="0 0 56 56"
              fill="none"
              className="relative"
            >
              <path
                d="M28 46V22"
                stroke="var(--color-ink-muted)"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <path
                d="M28 28c-6 0-10-5-10-11 5 0 10 4 10 11ZM28 28c6 0 10-5 10-11-5 0-10 4-10 11Z"
                stroke="var(--color-spark-deep)"
                strokeWidth="1.4"
                fill="hsl(96 55% 40% / 0.10)"
                strokeLinejoin="round"
              />
              <circle cx="28" cy="16" r="2" fill="var(--color-sun)" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-faint)]">
                {t('code')}
              </span>
              <span className="block w-6 h-px bg-[var(--color-line-strong)]" />
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-spark-deep)]">
                {t('tagline')}
              </span>
            </div>
            <h3 className="font-display text-[28px] lg:text-[38px] leading-[1.05] tracking-[-0.02em] mb-3">
              {t('name')}
            </h3>
            <p className="text-[14px] lg:text-[16px] leading-[1.6] text-[var(--color-ink-muted)] max-w-[62ch]">
              {t('pitch')}
            </p>
          </div>

          <div className="shrink-0 self-start md:self-center">
            <div className="relative">
              <div
                aria-hidden
                className="absolute inset-0 -rotate-2 border border-[var(--color-spark-deep)] opacity-40"
              />
              <div className="relative rotate-1 inline-flex items-center gap-2 border border-[var(--color-spark-deep)] bg-[var(--color-bg)] px-4 py-2.5">
                <span className="block w-1.5 h-1.5 rounded-full bg-[var(--color-spark)] glow-pulse" />
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-spark-deep)]">
                  {t('badge')}
                </span>
              </div>
            </div>
          </div>
        </article>

        <p className="mt-6 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-ink-faint)] leading-relaxed max-w-[80ch]">
          {t('footnote')}
        </p>
      </div>
    </section>
  );
}
