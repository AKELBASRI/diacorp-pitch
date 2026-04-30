import {getTranslations} from 'next-intl/server';

type Item = {n: string; title: string; body: string};

export async function Capabilities() {
  const t = await getTranslations('home.capabilities');
  const items = t.raw('items') as Item[];

  return (
    <section className="relative border-b border-[var(--color-line)] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 40% 55% at 100% 20%, hsl(32 88% 60% / 0.06), transparent 65%)'
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 lg:mb-16">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[var(--color-sun)]" />
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-sun)]">
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

        <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[1px] bg-[var(--color-line)] border border-[var(--color-line)]">
          {items.map((it, i) => {
            const accents = [
              'var(--color-sun)',
              'var(--color-copper)',
              'var(--color-spark-deep)',
              'var(--color-violet)',
              'var(--color-sun)'
            ];
            const accent = accents[i % accents.length];
            return (
              <article
                key={it.n}
                className="relative bg-[var(--color-bg)] p-6 lg:p-7 min-h-[260px] flex flex-col group overflow-hidden"
              >
                <div
                  aria-hidden
                  className="absolute top-0 ltr:left-0 rtl:right-0 h-[2px] w-full transition-all duration-500 group-hover:h-[4px]"
                  style={{background: accent}}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 80% 80% at 50% 100%, ${accent === 'var(--color-sun)' ? 'hsl(32 88% 60% / 0.04)' : accent === 'var(--color-copper)' ? 'hsl(24 80% 62% / 0.04)' : accent === 'var(--color-spark-deep)' ? 'hsl(168 72% 55% / 0.04)' : 'hsl(278 68% 68% / 0.04)'}, transparent 60%)`
                  }}
                />

                <div
                  className="font-display num text-[48px] lg:text-[56px] leading-none tracking-[-0.02em] mb-6 transition-transform duration-500 group-hover:-translate-y-0.5"
                  style={{color: accent, opacity: 0.85}}
                >
                  {it.n}
                </div>
                <h3 className="font-display text-[18px] lg:text-[20px] leading-tight tracking-tight mb-3">
                  {it.title}
                </h3>
                <p className="text-[12.5px] lg:text-[13.5px] leading-[1.55] text-[var(--color-ink-muted)] mt-auto">
                  {it.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
