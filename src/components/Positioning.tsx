import {getTranslations} from 'next-intl/server';
import {SectionEyebrow} from './Thesis';

const ROWS = ['price', 'green', 'cbam', 'flex', 'time'] as const;

export async function Positioning() {
  const t = await getTranslations('positioning');

  return (
    <section className="relative bg-[var(--color-bg-elev)]/50 border-y border-[var(--color-line)]">
      <div aria-hidden className="absolute inset-0 zellige opacity-[0.02]" />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
          <div className="lg:col-span-4">
            <SectionEyebrow index="ii" label={t('eyebrow')} />
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-[32px] md:text-[44px] lg:text-[56px] leading-[1.05] tracking-[-0.03em]">
              {t('heading')}
            </h2>
          </div>
        </div>

        <div className="reveal-up grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] border border-[var(--color-line)]">
          {/* Header row */}
          <div className="hidden md:block py-4 px-6 border-b border-[var(--color-line)] bg-[var(--color-bg)]/40" />
          <div className="py-4 px-6 border-b border-[var(--color-line)] bg-[var(--color-bg)]/40">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-brick)]">
              ◻ {t('onee')}
            </div>
          </div>
          <div className="py-4 px-6 border-b border-[var(--color-line)] bg-[var(--color-bg)]/40">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-sun)]">
              ◼ {t('diacorp')}
            </div>
          </div>

          {/* Data rows */}
          {ROWS.map((row, i) => (
            <Row
              key={row}
              label={t(`rows.${row}.label`)}
              onee={t(`rows.${row}.onee`)}
              diacorp={t(`rows.${row}.diacorp`)}
              last={i === ROWS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  onee,
  diacorp,
  last
}: {
  label: string;
  onee: string;
  diacorp: string;
  last: boolean;
}) {
  const border = last ? '' : 'border-b';
  return (
    <>
      <div
        className={`py-6 px-6 ${border} border-[var(--color-line)] font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--color-ink-muted)] md:border-b md:border-r-0 rtl:md:border-l-0`}
      >
        <span className="block md:pt-0 pt-2">{label}</span>
      </div>
      <div
        className={`py-6 px-6 ${border} border-[var(--color-line)] text-[var(--color-ink-muted)] font-mono text-[13px] num`}
      >
        <span className="opacity-70 line-through decoration-[var(--color-brick)]/40">
          {onee}
        </span>
      </div>
      <div
        className={`py-6 px-6 ${border} border-[var(--color-line)] font-mono text-[13px] num text-[var(--color-sun)]`}
      >
        <span className="font-semibold">{diacorp}</span>
      </div>
    </>
  );
}
