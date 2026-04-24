import {getTranslations} from 'next-intl/server';

const GROUPS = [
  {key: 'epc', names: ['KermaSys']},
  {key: 'finance', names: ['BMCE Bank', 'AttijariWafa']},
  {key: 'panels', names: ['Jinko Solar', 'JA Solar', 'Trina', 'LONGi', 'Canadian Solar']},
  {key: 'inverters', names: ['Sungrow', 'Huawei', 'Fronius']},
  {key: 'institutional', names: ['ONEE', 'AMDIE', 'CRI Oriental', 'Min. Énergie']}
] as const;

export async function Partners() {
  const t = await getTranslations('home.partners');

  // Flat roll of all partner names (with gaps) — for the infinite marquee
  const marqueeItems = GROUPS.flatMap((g) =>
    g.names.map((name) => ({group: g.key, name}))
  );

  return (
    <section className="relative border-b border-[var(--color-line)] overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 pt-20 lg:pt-28 pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[var(--color-sun)]" />
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-sun)]">
                {t('kicker')}
              </span>
            </div>
            <h2 className="font-display text-[32px] lg:text-[44px] leading-[1.05] tracking-[-0.025em]">
              {t('title')}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 flex items-end">
            <p className="text-[15px] lg:text-[17px] leading-[1.6] text-[var(--color-ink-muted)] max-w-[55ch]">
              {t('sub')}
            </p>
          </div>
        </div>

        <div className="space-y-10">
          {GROUPS.map((g) => (
            <div
              key={g.key}
              className="grid grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr] gap-6 items-start border-t border-[var(--color-line)] pt-8"
            >
              <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-muted)] pt-2">
                {t(`groups.${g.key}`)}
              </div>
              <div className="flex flex-wrap gap-3">
                {g.names.map((name) => (
                  <div
                    key={name}
                    className="px-5 py-3 border border-[var(--color-line)] bg-[var(--color-bg-elev)]/50 text-[var(--color-ink)] font-display text-[17px] tracking-tight hover:border-[var(--color-sun)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite marquee strip */}
      <div
        className="relative border-t border-[var(--color-line)] py-6 overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)'
        }}
      >
        <div className="marquee gap-12">
          {[...marqueeItems, ...marqueeItems].map((it, i) => (
            <div
              key={`${it.name}-${i}`}
              className="flex items-center gap-5 shrink-0"
            >
              <span className="font-display text-[22px] lg:text-[28px] tracking-tight text-[var(--color-ink)]/80">
                {it.name}
              </span>
              <span
                aria-hidden
                className="block w-1.5 h-1.5 rotate-45 bg-[var(--color-sun)]/60"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
