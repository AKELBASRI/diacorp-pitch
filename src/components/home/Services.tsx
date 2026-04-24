import {getTranslations} from 'next-intl/server';

const SERVICES = [
  {id: 'feasibility', tint: '200 78% 58%', icon: 'feasibility'},
  {id: 'utility', tint: '32 88% 60%', icon: 'utility'},
  {id: 'onsite', tint: '24 80% 62%', icon: 'onsite'},
  {id: 'om', tint: '168 72% 55%', icon: 'om'},
  {id: 'audit', tint: '278 68% 68%', icon: 'audit'},
  {id: 'thermal', tint: '12 82% 60%', icon: 'thermal'}
] as const;

export async function Services() {
  const t = await getTranslations('home.services');

  return (
    <section id="services" className="relative border-b border-[var(--color-line)]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[var(--color-sun)]" />
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-sun)]">
                {t('kicker')}
              </span>
            </div>
            <h2 className="font-display text-[32px] lg:text-[48px] leading-[1.05] tracking-[-0.025em]">
              {t('title')}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 flex items-end">
            <p className="text-[15px] lg:text-[17px] leading-[1.6] text-[var(--color-ink-muted)] max-w-[55ch]">
              {t('sub')}
            </p>
          </div>
        </div>

        <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[var(--color-line)] border border-[var(--color-line)]">
          {SERVICES.map((s, idx) => (
            <div
              key={s.id}
              className="relative bg-[var(--color-bg)] p-7 lg:p-8 group lift"
              style={
                {['--svc' as string]: `hsl(${s.tint})`} as React.CSSProperties
              }
            >
              <div
                aria-hidden
                className="absolute top-0 ltr:left-0 rtl:right-0 h-[2px] w-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{background: `hsl(${s.tint})`}}
              />
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-11 h-11 border border-[var(--color-line)] flex items-center justify-center"
                  style={{color: `hsl(${s.tint})`}}
                >
                  <ServiceIcon type={s.icon} />
                </div>
                <span
                  className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-ink-faint)]"
                >
                  0{idx + 1}
                </span>
              </div>
              <h3 className="font-display text-[20px] lg:text-[24px] leading-tight tracking-tight mb-3">
                {t(`items.${s.id}.name`)}
              </h3>
              <p className="text-[13px] lg:text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
                {t(`items.${s.id}.body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceIcon({type}: {type: string}) {
  const p = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  };
  switch (type) {
    case 'feasibility':
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="6" />
          <path d="M15.5 15.5L20 20" />
          <path d="M9 11h4M11 9v4" />
        </svg>
      );
    case 'utility':
      return (
        <svg {...p}>
          <rect x="3" y="6" width="18" height="12" rx="1" />
          <path d="M3 10h18M3 14h18M7 6v12M12 6v12M17 6v12" />
        </svg>
      );
    case 'onsite':
      return (
        <svg {...p}>
          <path d="M3 21V10l9-6 9 6v11" />
          <rect x="8" y="13" width="8" height="6" />
          <path d="M10 13v6M14 13v6" />
        </svg>
      );
    case 'om':
      return (
        <svg {...p}>
          <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
    case 'audit':
      return (
        <svg {...p}>
          <rect x="4" y="3" width="16" height="18" rx="1" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );
    case 'thermal':
      return (
        <svg {...p}>
          <path d="M12 2v10M9 8l3-3 3 3M7 18a5 5 0 0 1 10 0" />
          <circle cx="12" cy="18" r="3" />
        </svg>
      );
    default:
      return null;
  }
}
