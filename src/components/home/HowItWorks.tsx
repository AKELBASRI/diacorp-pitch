import {getTranslations} from 'next-intl/server';

type Step = {n: string; title: string; body: string};

export async function HowItWorks() {
  const t = await getTranslations('home.howItWorks');
  const steps = t.raw('steps') as Step[];

  return (
    <section className="relative border-b border-[var(--color-line)] overflow-hidden bg-[var(--color-bg-elev)]/30">
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 0% 50%, hsl(168 72% 55% / 0.05), transparent 65%)'
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 lg:mb-16">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[var(--color-spark-deep)]" />
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-spark-deep)]">
                {t('kicker')}
              </span>
            </div>
            <h2 className="font-display text-[32px] lg:text-[46px] leading-[1.05] tracking-[-0.025em]">
              {t('title')}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 flex items-end">
            <p className="text-[15px] lg:text-[17px] leading-[1.6] text-[var(--color-ink-muted)] max-w-[55ch]">
              {t('sub')}
            </p>
          </div>
        </div>

        <ol className="reveal-stagger grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[var(--color-line)] border border-[var(--color-line)]">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className="relative bg-[var(--color-bg)] p-7 lg:p-10 min-h-[260px] flex flex-col"
            >
              <div
                aria-hidden
                className="absolute top-0 ltr:left-0 rtl:right-0 h-[2px] w-full"
                style={{background: 'var(--color-spark-deep)'}}
              />
              <div className="flex items-baseline gap-4 mb-6">
                <span
                  className="font-display num text-[44px] lg:text-[56px] leading-none tracking-[-0.02em]"
                  style={{color: 'var(--color-spark-deep)', opacity: 0.85}}
                >
                  {s.n}
                </span>
                {i < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="hidden md:block flex-1 h-px bg-[var(--color-line)]"
                  />
                )}
              </div>
              <h3 className="font-display text-[20px] lg:text-[24px] leading-tight tracking-tight mb-3">
                {s.title}
              </h3>
              <p className="text-[13px] lg:text-[14.5px] leading-[1.6] text-[var(--color-ink-muted)] mt-auto">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
