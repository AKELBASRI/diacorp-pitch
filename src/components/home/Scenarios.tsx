import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

type Item = {icon: string; q: string; a: string};

export async function Scenarios() {
  const t = await getTranslations('home.scenarios');
  const items = t.raw('items') as Item[];
  // Optional CTA at the bottom — falls back to a default if not present in i18n.
  let ctaLabel: string | null = null;
  try {
    ctaLabel = t('cta');
  } catch {
    ctaLabel = null;
  }

  return (
    <section
      id="scenarios"
      className="relative border-b border-[var(--color-line)] overflow-hidden bg-[var(--color-bg-elev)]/30"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 100% 50%, hsl(32 88% 60% / 0.06), transparent 65%)'
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

        <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[var(--color-line)] border border-[var(--color-line)]">
          {items.map((it, i) => (
            <article
              key={i}
              className="relative bg-[var(--color-bg)] p-7 lg:p-9 min-h-[260px] flex flex-col group overflow-hidden"
            >
              <div
                aria-hidden
                className="absolute top-0 ltr:left-0 rtl:right-0 h-[2px] w-full transition-all duration-500 group-hover:h-[4px]"
                style={{background: 'var(--color-sun)'}}
              />
              <div className="text-[var(--color-sun)] mb-5 transition-transform duration-500 group-hover:-translate-y-0.5">
                <ScenarioIcon name={it.icon} />
              </div>
              <h3 className="font-display text-[19px] lg:text-[22px] leading-tight tracking-tight mb-3">
                {it.q}
              </h3>
              <p className="text-[13px] lg:text-[14.5px] leading-[1.6] text-[var(--color-ink-muted)] mt-auto">
                {it.a}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 lg:mt-14 flex justify-center">
          <Link
            href="/scenarios"
            className="inline-flex items-center gap-3 px-6 py-3 border border-[var(--color-line-strong)] text-[var(--color-ink)] font-mono text-[11.5px] tracking-[0.2em] uppercase hover:border-[var(--color-sun)] hover:text-[var(--color-sun)] transition-colors"
          >
            {ctaLabel ?? 'Voir tous les détails'}
            <span className="ltr:rotate-0 rtl:rotate-180">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ScenarioIcon({name}: {name: string}) {
  const common = {
    width: 32,
    height: 32,
    viewBox: '0 0 32 32',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  };
  switch (name) {
    case 'cloud':
      // Sun behind a cloud
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
      // Bar chart with up arrow
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
    default:
      return (
        <svg {...common} aria-hidden>
          <circle cx="16" cy="16" r="10" />
        </svg>
      );
  }
}
