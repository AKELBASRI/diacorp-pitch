import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Nav} from '@/components/Nav';
import {Footer} from '@/components/Footer';
import {Link} from '@/i18n/navigation';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'servicesPage.meta'});
  return {title: t('title'), description: t('description')};
}

const ITEMS = [
  {id: 'feasibility', tint: '200 78% 58%'},
  {id: 'utility', tint: '32 88% 60%'},
  {id: 'onsite', tint: '24 80% 62%'},
  {id: 'om', tint: '168 72% 55%'},
  {id: 'audit', tint: '278 68% 68%'},
  {id: 'thermal', tint: '12 82% 60%'}
] as const;

export default async function ServicesPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('servicesPage');

  return (
    <>
      <Nav />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-[var(--color-line)]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-50"
            style={{
              background:
                'radial-gradient(ellipse 80% 55% at 20% 0%, rgba(232,169,72,0.14), transparent 60%), radial-gradient(ellipse 60% 60% at 100% 80%, rgba(86,240,200,0.045), transparent 55%)'
            }}
          />
          <div aria-hidden className="absolute inset-0 zellige opacity-[0.028]" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 pt-16 pb-14 lg:pt-24 lg:pb-20">
            <div className="max-w-[820px]">
              <div className="flex items-center gap-3 mb-10 rise">
                <span className="block w-10 h-px bg-[var(--color-sun)]" />
                <span className="font-mono text-[11px] tracking-[0.24em] uppercase text-[var(--color-sun)]">
                  {t('hero.kicker')}
                </span>
              </div>
              <h1
                className="font-display text-[40px] sm:text-[54px] lg:text-[66px] leading-[1.02] tracking-[-0.03em] rise"
                style={{animationDelay: '120ms'}}
              >
                {t('hero.title')}
              </h1>
              <p
                className="mt-8 lg:mt-10 text-[17px] lg:text-[19px] leading-[1.6] text-[var(--color-ink)]/85 max-w-[62ch] rise"
                style={{animationDelay: '280ms'}}
              >
                {t('hero.sub')}
              </p>
            </div>
          </div>
        </section>

        {/* SERVICES DETAIL */}
        {ITEMS.map((s, idx) => (
          <ServiceSection key={s.id} id={s.id} tint={s.tint} index={idx + 1} />
        ))}

        {/* BOTTOM CTA */}
        <section className="relative overflow-hidden border-t border-[var(--color-line)]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(232,169,72,0.18), transparent 60%)'
            }}
          />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 py-20 lg:py-28 text-center">
            <h2 className="font-display text-[34px] lg:text-[54px] leading-[1.03] tracking-[-0.03em] max-w-[22ch] mx-auto mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-[15px] lg:text-[17px] leading-[1.6] text-[var(--color-ink-muted)] max-w-[58ch] mx-auto mb-10">
              {t('cta.sub')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--color-sun)] text-[var(--color-bg)] font-mono text-[12px] tracking-[0.16em] uppercase hover:bg-[var(--color-ink)] transition-colors"
              >
                {t('cta.primary')}
                <span className="ltr:rotate-0 rtl:rotate-180">→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--color-line-strong)] text-[var(--color-ink)] font-mono text-[12px] tracking-[0.16em] uppercase hover:border-[var(--color-sun)] hover:text-[var(--color-sun)] transition-colors"
              >
                {t('cta.secondary')}
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

async function ServiceSection({
  id,
  tint,
  index
}: {
  id: string;
  tint: string;
  index: number;
}) {
  const t = await getTranslations('servicesPage');
  const deliverables = t.raw(`items.${id}.deliverables`) as string[];

  return (
    <section
      id={id}
      className={`relative border-b border-[var(--color-line)] ${
        index % 2 === 0 ? 'bg-[var(--color-bg-elev)]/40' : ''
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-20 lg:py-28">
        <div className="reveal-up grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Number + title */}
          <div className="lg:col-span-4">
            <span
              className="font-mono text-[11px] tracking-[0.22em] px-2 py-1 border inline-block mb-6"
              style={{borderColor: `hsl(${tint})`, color: `hsl(${tint})`}}
            >
              {String(index).padStart(2, '0')}
            </span>
            <h2
              className="font-display text-[30px] lg:text-[44px] leading-[1.05] tracking-[-0.025em] mb-4"
              style={{color: `hsl(${tint})`}}
            >
              {t(`items.${id}.name`)}
            </h2>
            <p className="text-[15px] lg:text-[17px] leading-[1.5] text-[var(--color-ink)] italic">
              {t(`items.${id}.tagline`)}
            </p>
          </div>

          {/* Body + deliverables */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <p className="text-[15px] lg:text-[16px] leading-[1.65] text-[var(--color-ink-muted)] mb-8">
                {t(`items.${id}.body`)}
              </p>
              <div className="border-t border-[var(--color-line)] pt-5">
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-faint)] mb-2">
                  {t('labels.typical')}
                </div>
                <div
                  className="font-display num text-[22px] lg:text-[26px] tracking-tight"
                  style={{color: `hsl(${tint})`}}
                >
                  {t(`items.${id}.typical`)}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-faint)] mb-4">
                {t('labels.deliverables')}
              </div>
              <ul className="space-y-2.5">
                {deliverables.map((d, i) => (
                  <li
                    key={i}
                    className="text-[14px] leading-snug text-[var(--color-ink)] flex items-start gap-3"
                  >
                    <span
                      className="inline-block shrink-0 mt-2 w-1.5 h-1.5"
                      style={{background: `hsl(${tint})`}}
                    />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
