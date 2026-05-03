import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Nav} from '@/components/Nav';
import {Footer} from '@/components/Footer';
import {Link} from '@/i18n/navigation';

export const dynamic = 'force-dynamic';

type Item = {
  n: string;
  icon: string;
  q: string;
  short: string;
  detail: string;
  points: string[];
};

const TINTS = [
  '32 88% 60%', // sun
  '200 78% 58%',
  '168 72% 55%',
  '24 80% 62%',
  '278 68% 68%',
  '12 82% 60%',
  '160 64% 50%',
  '48 72% 60%'
];

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'scenariosPage.meta'});
  return {title: t('title'), description: t('description')};
}

export default async function ScenariosPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('scenariosPage');
  const items = t.raw('items') as Item[];

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

        {/* SCENARIOS */}
        {items.map((item, idx) => (
          <ScenarioBlock
            key={item.n}
            item={item}
            tint={TINTS[idx % TINTS.length]!}
            alternate={idx % 2 === 1}
            inPracticeLabel={t('labels.inPractice')}
          />
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
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--color-sun)] text-[var(--color-bg)] font-mono text-[12px] tracking-[0.16em] uppercase hover:bg-[var(--color-ink)] transition-colors"
              >
                {t('cta.primary')}
                <span className="ltr:rotate-0 rtl:rotate-180">→</span>
              </Link>
              <Link
                href="/register"
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

function ScenarioBlock({
  item,
  tint,
  alternate,
  inPracticeLabel
}: {
  item: Item;
  tint: string;
  alternate: boolean;
  inPracticeLabel: string;
}) {
  return (
    <section
      id={`scenario-${item.n}`}
      className={`relative border-b border-[var(--color-line)] ${
        alternate ? 'bg-[var(--color-bg-elev)]/40' : ''
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-24">
        <div className="reveal-up grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: number + icon */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-4 mb-4">
              <span
                className="font-display num text-[42px] lg:text-[56px] leading-none tracking-[-0.02em]"
                style={{color: `hsl(${tint})`, opacity: 0.85}}
              >
                {item.n}
              </span>
              <span
                aria-hidden
                className="block flex-1 h-px"
                style={{background: `hsl(${tint} / 0.4)`}}
              />
            </div>
            <div className="text-[hsl(${tint})]" style={{color: `hsl(${tint})`}}>
              <ScenarioIcon name={item.icon} />
            </div>
          </div>

          {/* Right: content */}
          <div className="lg:col-span-9">
            <h2
              className="font-display text-[28px] lg:text-[40px] leading-[1.1] tracking-[-0.025em] mb-5"
            >
              {item.q}
            </h2>
            <p className="text-[16px] lg:text-[18px] leading-[1.55] text-[var(--color-ink)] italic mb-8 max-w-[68ch]">
              {item.short}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
              <div className="md:col-span-3">
                <p className="text-[14.5px] lg:text-[16px] leading-[1.7] text-[var(--color-ink-muted)]">
                  {item.detail}
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-faint)] mb-4">
                  {inPracticeLabel}
                </div>
                <ul className="space-y-3">
                  {item.points.map((p, i) => (
                    <li
                      key={i}
                      className="text-[13.5px] lg:text-[14px] leading-snug text-[var(--color-ink)] flex items-start gap-3"
                    >
                      <span
                        className="inline-block shrink-0 mt-2 w-1.5 h-1.5"
                        style={{background: `hsl(${tint})`}}
                      />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScenarioIcon({name}: {name: string}) {
  const common = {
    width: 56,
    height: 56,
    viewBox: '0 0 32 32',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  };
  switch (name) {
    case 'cloud':
      return (
        <svg {...common} aria-hidden>
          <circle cx="11" cy="11" r="4" />
          <path d="M11 4v2M11 16v2M4 11h2M16 11h2M6 6l1.5 1.5M14.5 14.5L16 16M6 16l1.5-1.5M14.5 7.5L16 6" />
          <path d="M14 22h10a4 4 0 0 0 0-8 6 6 0 0 0-11.7-1.4" />
        </svg>
      );
    case 'moon':
      return (
        <svg {...common} aria-hidden>
          <path d="M22 18A10 10 0 0 1 12 8a10 10 0 0 1 4-8 10 10 0 1 0 8 18z" />
          <circle cx="24" cy="6" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="20" cy="3" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'snow':
      return (
        <svg {...common} aria-hidden>
          <path d="M16 3v26M5 8.5l22 15M5 23.5l22-15" />
          <path d="M16 7l-2-2 2-2 2 2-2 2zM16 25l-2 2 2 2 2-2-2-2zM6 12l-2.5-1L5 9M26 20l2.5 1-1.5 2M26 12l2.5 1-1.5-2M6 20l-2.5 1L5 23" />
        </svg>
      );
    case 'wrench':
      return (
        <svg {...common} aria-hidden>
          <path d="M21.5 4a6 6 0 0 0-7.5 7.7L4 21.7a2 2 0 0 0 2.8 2.8l10-10a6 6 0 0 0 7.7-7.5l-3.4 3.4-3.5-.5-.5-3.5L21.5 4z" />
        </svg>
      );
    case 'grow':
      return (
        <svg {...common} aria-hidden>
          <path d="M5 27V19M11 27v-12M17 27V11M23 27V7" />
          <path d="M20 4l3-3 3 3M23 1v8" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...common} aria-hidden>
          <path d="M4 26h24" />
          <path d="M4 26V8" />
          <path d="M7 22l5-7 5 4 8-12" />
          <circle cx="25" cy="7" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common} aria-hidden>
          <path d="M16 3l11 4v8c0 7-5 12-11 14C10 27 5 22 5 15V7l11-4z" />
          <path d="M11 16l3.5 3.5L21 13" />
        </svg>
      );
    case 'door':
      return (
        <svg {...common} aria-hidden>
          <path d="M9 4h11a1 1 0 0 1 1 1v22a1 1 0 0 1-1 1H9z" />
          <path d="M9 4L4 6v20l5 2" />
          <circle cx="17" cy="16" r="0.8" fill="currentColor" stroke="none" />
          <path d="M24 16h6M27 13l3 3-3 3" />
        </svg>
      );
    default:
      return (
        <svg {...common} aria-hidden>
          <circle cx="16" cy="16" r="10" />
        </svg>
      );
  }
}
