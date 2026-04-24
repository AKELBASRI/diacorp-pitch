import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

type Category = {
  key: string;
  label: string;
  desc: string;
  brands: string[];
};

const ICON_KEYS: Record<string, string> = {
  panels: 'panels',
  inverters: 'inverter',
  hybrid: 'hybrid',
  pumps: 'pump',
  storage: 'battery',
  monitoring: 'scada'
};

export async function Products() {
  const t = await getTranslations('home.products');
  const categories = t.raw('categories') as Category[];

  return (
    <section
      id="produits"
      className="relative border-b border-[var(--color-line)] overflow-hidden bg-[var(--color-bg-elev)]/30"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 45% 50% at 10% 100%, hsl(200 78% 58% / 0.06), transparent 60%), radial-gradient(ellipse 45% 50% at 95% 0%, hsl(32 88% 60% / 0.06), transparent 60%)'
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
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
          {categories.map((c, i) => {
            const accents = [
              'var(--color-sun)',
              'var(--color-copper)',
              'var(--color-spark-deep)',
              'var(--color-violet)',
              'var(--color-sun)',
              'var(--color-copper)'
            ];
            const accent = accents[i % accents.length];
            return (
              <article
                key={c.key}
                className="group relative bg-[var(--color-bg)] p-7 lg:p-8 min-h-[280px] flex flex-col overflow-hidden"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, transparent 50%, ${accent === 'var(--color-sun)' ? 'hsl(32 88% 60% / 0.04)' : accent === 'var(--color-copper)' ? 'hsl(24 80% 62% / 0.04)' : accent === 'var(--color-spark-deep)' ? 'hsl(168 72% 55% / 0.04)' : 'hsl(278 68% 68% / 0.04)'} 140%)`
                  }}
                />

                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-14 h-14 border flex items-center justify-center transition-all duration-500 group-hover:-translate-y-1"
                    style={{borderColor: accent}}
                  >
                    <ProductIcon kind={ICON_KEYS[c.key] ?? 'panels'} color={accent} />
                  </div>
                  <span
                    className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-70"
                    style={{color: accent}}
                  >
                    0{i + 1}
                  </span>
                </div>

                <h3 className="font-display text-[20px] lg:text-[24px] leading-tight tracking-tight mb-2">
                  {c.label}
                </h3>
                <p className="text-[13px] lg:text-[14px] text-[var(--color-ink-muted)] leading-relaxed mb-5">
                  {c.desc}
                </p>

                <div className="mt-auto pt-5 border-t border-[var(--color-line)]">
                  <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-[var(--color-ink-faint)] mb-2">
                    Marques
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.brands.map((b) => (
                      <span
                        key={b}
                        className="font-mono text-[10px] tracking-[0.08em] px-2 py-1 border border-[var(--color-line)] text-[var(--color-ink-muted)] group-hover:border-[var(--color-line-strong)] transition-colors"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 lg:mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-[var(--color-line)] bg-[var(--color-bg)] px-7 lg:px-10 py-6 lg:py-7 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute top-0 ltr:left-0 rtl:right-0 h-full w-[3px] bg-[var(--color-sun)]"
          />
          <p className="relative text-[14px] lg:text-[15px] text-[var(--color-ink-muted)] max-w-[70ch] leading-[1.55] ltr:pl-4 rtl:pr-4">
            {t('note')}
          </p>
          <Link
            href="/contact"
            className="relative shrink-0 inline-flex items-center gap-2 border border-[var(--color-line-strong)] px-6 py-3.5 font-mono text-[11px] tracking-[0.18em] uppercase hover:border-[var(--color-sun)] hover:text-[var(--color-sun)] transition-colors"
          >
            {t('cta')}
            <span className="ltr:rotate-0 rtl:rotate-180">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductIcon({
  kind,
  color
}: {
  kind: string;
  color: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    panels: (
      <>
        <rect x="6" y="8" width="20" height="14" stroke={color} strokeWidth="1.2" fill="none" />
        <path d="M11 8v14M16 8v14M21 8v14M6 15h20" stroke={color} strokeWidth="0.8" />
      </>
    ),
    inverter: (
      <>
        <rect x="8" y="6" width="16" height="20" stroke={color} strokeWidth="1.2" fill="none" />
        <path d="M12 12h8M12 16h8M12 20h4" stroke={color} strokeWidth="1" />
        <circle cx="12" cy="10" r="0.8" fill={color} />
        <circle cx="15" cy="10" r="0.8" fill={color} opacity="0.5" />
      </>
    ),
    hybrid: (
      <>
        <circle cx="12" cy="16" r="4" stroke={color} strokeWidth="1.2" fill="none" />
        <circle cx="20" cy="16" r="4" stroke={color} strokeWidth="1.2" fill="none" />
        <path d="M6 16h2M24 16h2M16 10v12" stroke={color} strokeWidth="1" />
      </>
    ),
    pump: (
      <>
        <circle cx="16" cy="16" r="8" stroke={color} strokeWidth="1.2" fill="none" />
        <path d="M12 12l8 8M20 12l-8 8" stroke={color} strokeWidth="1" />
        <circle cx="16" cy="16" r="2" fill={color} />
      </>
    ),
    battery: (
      <>
        <rect x="6" y="10" width="18" height="14" stroke={color} strokeWidth="1.2" fill="none" />
        <rect x="24" y="13" width="2" height="8" fill={color} />
        <path d="M10 14v6M14 14v6M18 14v6" stroke={color} strokeWidth="1.5" />
      </>
    ),
    scada: (
      <>
        <rect x="6" y="8" width="20" height="12" stroke={color} strokeWidth="1.2" fill="none" />
        <path d="M9 14l3-2 3 3 3-4 3 2 3 -1" stroke={color} strokeWidth="1" fill="none" />
        <path d="M12 24h8M14 20v4M18 20v4" stroke={color} strokeWidth="1" />
      </>
    )
  };
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      {paths[kind]}
    </svg>
  );
}
