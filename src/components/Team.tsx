import {getTranslations} from 'next-intl/server';
import {SectionEyebrow} from './Thesis';

export async function Team() {
  const t = await getTranslations('team');

  return (
    <section className="relative bg-[var(--color-bg-elev)]/30 border-y border-[var(--color-line)]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionEyebrow index="vi" label={t('eyebrow')} />
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-[32px] md:text-[44px] lg:text-[54px] leading-[1.05] tracking-[-0.03em] mb-8">
              {t('heading')}
            </h2>
            <p className="text-[17px] md:text-[19px] leading-[1.55] text-[var(--color-ink)]/85 max-w-[65ch]">
              {t('body')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
