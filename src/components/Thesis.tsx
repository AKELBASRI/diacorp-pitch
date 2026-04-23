import {getTranslations} from 'next-intl/server';

export async function Thesis() {
  const t = await getTranslations('thesis');

  return (
    <section id="thesis" className="relative">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-24 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionEyebrow index="i" label={t('eyebrow')} />
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-[34px] md:text-[52px] lg:text-[64px] leading-[1.02] tracking-[-0.03em]">
              {t('heading')}
            </h2>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 border-t border-[var(--color-line)] pt-10">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <div className="font-mono text-[11px] text-[var(--color-sun)] tracking-[0.2em] mb-3">
                    0{i + 1}
                  </div>
                  <h3 className="font-display text-xl leading-tight mb-3 text-[var(--color-ink)]">
                    {t(`subPoints.${i}.title`)}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
                    {t(`subPoints.${i}.body`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionEyebrow({index, label}: {index: string; label: string}) {
  return (
    <div className="flex items-start gap-4">
      <span className="font-mono text-[11px] text-[var(--color-ink-faint)] tracking-[0.2em] pt-1 uppercase">
        ❏ {index}
      </span>
      <div className="flex-1">
        <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-ink-muted)]">
          {label}
        </div>
      </div>
    </div>
  );
}
