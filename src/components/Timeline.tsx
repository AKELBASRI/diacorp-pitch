import {getTranslations} from 'next-intl/server';
import {SectionEyebrow} from './Thesis';

export async function Timeline() {
  const t = await getTranslations('timeline');

  return (
    <section id="timeline" className="relative">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
          <div className="lg:col-span-4">
            <SectionEyebrow index="v" label={t('eyebrow')} />
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-[32px] md:text-[48px] lg:text-[60px] leading-[1.02] tracking-[-0.03em]">
              {t('heading')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[var(--color-line)]">
          {[0, 1, 2].map((i) => {
            const items = t.raw(`phases.${i}.items`) as string[];
            const accent = i === 0 ? 'var(--color-spark)' : i === 1 ? 'var(--color-sun)' : 'var(--color-copper)';
            return (
              <div key={i} className="bg-[var(--color-bg)] p-8 md:p-10 relative">
                <div
                  className="absolute top-0 ltr:left-0 rtl:right-0 h-[2px] w-full"
                  style={{background: accent}}
                />
                <div
                  className="font-mono text-[10px] tracking-[0.2em] uppercase mb-4"
                  style={{color: accent}}
                >
                  {t(`phases.${i}.label`)}
                </div>
                <h3 className="font-display text-2xl md:text-3xl leading-tight mb-6 tracking-tight">
                  {t(`phases.${i}.title`)}
                </h3>
                <ul className="space-y-2 mb-6">
                  {items.map((item, j) => (
                    <li
                      key={j}
                      className="text-[14px] text-[var(--color-ink-muted)] flex gap-3 items-start"
                    >
                      <span
                        className="inline-block mt-2 w-1 h-1"
                        style={{background: accent}}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-[var(--color-line)]">
                  <div className="font-mono text-[11px] text-[var(--color-ink-muted)]">
                    {t(`phases.${i}.investment`)}
                  </div>
                  <div
                    className="font-mono text-[12px] mt-1"
                    style={{color: accent}}
                  >
                    {t(`phases.${i}.revenue`)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
