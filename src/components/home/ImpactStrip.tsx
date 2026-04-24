import {getTranslations} from 'next-intl/server';

export async function ImpactStrip() {
  const t = await getTranslations('home.impact');

  const items = [
    {label: t('capacity'), value: t('capacityValue'), hint: 'DIA1 + DIA2 + DIA3 + ext.'},
    {label: t('energy'), value: t('energyValue'), hint: '@ 28% capacity factor'},
    {label: t('co2'), value: t('co2Value'), hint: 'vs mix électrique ONEE'},
    {label: t('offtakers'), value: t('offtakersValue'), hint: 'Pipeline commercial 2026-2029'}
  ];

  return (
    <section className="relative border-b border-[var(--color-line)] bg-[var(--color-bg-elev)]/60 overflow-hidden">
      <div aria-hidden className="absolute inset-0 zellige opacity-[0.02]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 40% 100% at 50% 50%, rgba(232,169,72,0.08), transparent 60%)'
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 py-10 lg:py-12">
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <span className="block w-6 h-px bg-[var(--color-sun)]" />
          <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-[var(--color-sun)]">
            IMPACT · CIBLE 2029
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 lg:gap-x-10">
          {items.map((it, i) => (
            <div
              key={i}
              className={`${
                i > 0 ? 'lg:border-l lg:rtl:border-r lg:rtl:border-l-0 lg:border-[var(--color-line)]' : ''
              } lg:pl-8 lg:rtl:pr-8 lg:rtl:pl-0`}
            >
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-faint)] mb-2">
                {it.label}
              </div>
              <div className="font-display num text-[32px] lg:text-[44px] leading-[1] tracking-tight text-[var(--color-ink)]">
                {it.value}
              </div>
              <div className="font-mono text-[10px] tracking-[0.1em] text-[var(--color-ink-muted)] mt-2">
                {it.hint}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
