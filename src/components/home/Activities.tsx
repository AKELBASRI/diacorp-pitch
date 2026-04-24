import {getTranslations} from 'next-intl/server';

const ITEMS = [
  {id: 'industry', tint: '32 88% 60%', icon: 'industry'},
  {id: 'agro', tint: '96 55% 55%', icon: 'agro'},
  {id: 'cold', tint: '200 78% 58%', icon: 'cold'},
  {id: 'zone', tint: '24 80% 62%', icon: 'zone'}
] as const;

export async function Activities() {
  const t = await getTranslations('home.activities');

  return (
    <section id="activites" className="relative border-b border-[var(--color-line)]">
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

        <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--color-line)] border border-[var(--color-line)]">
          {ITEMS.map((item) => (
            <div
              key={item.id}
              className="group relative bg-[var(--color-bg)] p-7 lg:p-10 transition-all lift min-h-[280px]"
              style={
                {
                  ['--act-tint' as string]: `hsl(${item.tint})`
                } as React.CSSProperties
              }
            >
              {/* Subtle accent bar */}
              <div
                aria-hidden
                className="absolute top-0 ltr:left-0 rtl:right-0 h-[2px] w-full opacity-20 group-hover:opacity-80 transition-opacity"
                style={{background: `hsl(${item.tint})`}}
              />

              <div className="flex items-start justify-between mb-6">
                <span
                  className="font-mono text-[10px] tracking-[0.22em]"
                  style={{color: `hsl(${item.tint})`}}
                >
                  {t(`items.${item.id}.tag`)}
                </span>
                <ActivityIcon type={item.icon} tint={item.tint} />
              </div>

              <h3 className="font-display text-[22px] lg:text-[28px] leading-tight tracking-tight mb-4">
                {t(`items.${item.id}.name`)}
              </h3>

              <p className="text-[14px] lg:text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
                {t(`items.${item.id}.body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ActivityIcon({type, tint}: {type: string; tint: string}) {
  const stroke = `hsl(${tint})`;
  const common = {
    width: 32,
    height: 32,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  };
  switch (type) {
    case 'industry':
      return (
        <svg {...common}>
          <path d="M3 21h18M5 21V9l5 3V9l5 3V9l4 2.5V21" />
          <rect x="9" y="15" width="2" height="3" />
          <rect x="14" y="15" width="2" height="3" />
        </svg>
      );
    case 'agro':
      return (
        <svg {...common}>
          <path d="M12 21v-7M12 14c-4 0-6-3-6-6 3 0 6 2 6 6ZM12 14c4 0 6-3 6-6-3 0-6 2-6 6Z" />
          <path d="M6 21h12" />
        </svg>
      );
    case 'cold':
      return (
        <svg {...common}>
          <path d="M12 3v18M5 7l14 10M5 17l14-10" />
          <path d="M12 5.5l-2-1.5M12 5.5l2-1.5M12 18.5l-2 1.5M12 18.5l2 1.5M5 7l2 0M5 7l0 2M19 7l-2 0M19 7l0 2M5 17l0-2M5 17l2 0M19 17l0-2M19 17l-2 0" />
        </svg>
      );
    case 'zone':
      return (
        <svg {...common}>
          <rect x="3" y="11" width="7" height="10" />
          <rect x="14" y="7" width="7" height="14" />
          <path d="M5 7l2-3 3 1M14 5l3-2 4 3" />
        </svg>
      );
    default:
      return null;
  }
}
