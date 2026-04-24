import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getSectionContent} from '@/lib/content';
import {getSiteSettings} from '@/lib/settings';

type HeroContent = {
  kicker: string;
  title: string;
  sub: string;
  ctaLoi: string;
  ctaScroll: string;
  stat1: string;
  stat1v: string;
  stat2: string;
  stat2v: string;
  stat3: string;
  stat3v: string;
  stat4: string;
  stat4v: string;
};

export async function HomeHero() {
  const [t, db, settings] = await Promise.all([
    getTranslations('home.hero'),
    getSectionContent<HeroContent>('home.hero'),
    getSiteSettings()
  ]);
  const tAny = t as unknown as (k: string) => string;
  const k = <K extends keyof HeroContent>(key: K): string =>
    db?.[key] ?? tAny(key as string);
  const hasPhoto = Boolean(settings.heroImageUrl);

  return (
    <section className="relative overflow-hidden border-b border-[var(--color-line)]">
      {/* Optional hero photo background (editable from /admin/settings). */}
      {hasPhoto && (
        <>
          <div
            aria-hidden
            className="hero-photo-bg absolute inset-0"
          />
          {/* Gradient mesh overlay on top of the photo */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-70 mix-blend-soft-light"
            style={{
              background:
                'radial-gradient(ellipse 60% 60% at 20% 0%, var(--color-brand), transparent 60%), radial-gradient(ellipse 50% 50% at 100% 100%, var(--color-accent-spark), transparent 60%)'
            }}
          />
          <div aria-hidden className="absolute inset-0 grain" />
        </>
      )}
      {/* Default background (when no photo) — layered gradient + zellige + SVG panels */}
      {!hasPhoto && (
        <>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 55% at 20% 0%, color-mix(in oklch, var(--color-brand) 14%, transparent), transparent 60%), radial-gradient(ellipse 60% 60% at 100% 80%, color-mix(in oklch, var(--color-accent-spark) 10%, transparent), transparent 55%)'
            }}
          />
          <div aria-hidden className="absolute inset-0 zellige opacity-[0.028]" />
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 bottom-0 w-[55%] h-[70%] hidden lg:block opacity-30"
          >
            <SolarPanelsSvg />
          </div>
        </>
      )}

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-[880px]">
          {/* Kicker */}
          <div className="flex items-center gap-3 mb-10 rise">
            <span className="block w-10 h-px bg-[var(--color-sun)]" />
            <span className="font-mono text-[11px] tracking-[0.24em] uppercase text-[var(--color-sun)]">
              {k('kicker')}
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-display text-[42px] sm:text-[54px] lg:text-[72px] leading-[1.02] tracking-[-0.03em] rise whitespace-pre-line"
            style={{animationDelay: '120ms'}}
          >
            {k('title')}
          </h1>

          {/* Sub */}
          <p
            className="mt-8 lg:mt-10 text-[17px] lg:text-[19px] leading-[1.6] text-[var(--color-ink)]/85 max-w-[62ch] rise"
            style={{animationDelay: '280ms'}}
          >
            {k('sub')}
          </p>

          {/* CTAs */}
          <div
            className="mt-10 flex flex-col sm:flex-row gap-3 rise"
            style={{animationDelay: '440ms'}}
          >
            <Link
              href="/register"
              className="cta-glow inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[var(--color-brand)] text-[var(--color-bg)] font-mono text-[12px] tracking-[0.16em] uppercase hover:bg-[var(--color-ink)] transition-colors"
            >
              {k('ctaLoi')}
              <span className="ltr:rotate-0 rtl:rotate-180">→</span>
            </Link>
            <a
              href="#activites"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[var(--color-line-strong)] text-[var(--color-ink)] font-mono text-[12px] tracking-[0.16em] uppercase hover:border-[var(--color-sun)] hover:text-[var(--color-sun)] transition-colors"
            >
              {k('ctaScroll')}
              <span>↓</span>
            </a>
          </div>
        </div>

        {/* Stats */}
        <div
          className="mt-20 lg:mt-28 border-t border-[var(--color-line)] grid grid-cols-2 lg:grid-cols-4 rise"
          style={{animationDelay: '600ms'}}
        >
          {(
            [
              ['stat1', 'stat1v'],
              ['stat2', 'stat2v'],
              ['stat3', 'stat3v'],
              ['stat4', 'stat4v']
            ] as const
          ).map(([labelKey, valueKey], i) => (
            <div
              key={labelKey}
              className={`py-7 lg:py-9 ltr:lg:border-r rtl:lg:border-l border-[var(--color-line)] ${
                i === 3 ? 'ltr:lg:border-r-0 rtl:lg:border-l-0' : ''
              } ${i % 2 === 1 ? 'ltr:pl-6 rtl:pr-6' : 'ltr:lg:pl-0 rtl:lg:pr-0'} ${
                i >= 2 ? 'border-t lg:border-t-0' : ''
              }`}
            >
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-faint)] mb-3">
                {k(labelKey)}
              </div>
              <div className="font-display num text-3xl lg:text-[40px] tracking-tight digit-in" style={{animationDelay: `${i * 90}ms`}}>
                {k(valueKey)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolarPanelsSvg() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-full">
      <defs>
        <linearGradient id="panel-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(220 40% 28% / 0.9)" />
          <stop offset="100%" stopColor="hsl(220 50% 15% / 0.9)" />
        </linearGradient>
        <linearGradient id="sun-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(32 88% 60%)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(32 88% 60%)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Sun */}
      <circle cx="660" cy="140" r="50" fill="hsl(32 88% 60%)" opacity="0.8" />
      <circle cx="660" cy="140" r="90" fill="url(#sun-glow)" />

      {/* Horizon line */}
      <line x1="0" y1="380" x2="800" y2="380" stroke="hsl(32 88% 40%)" strokeWidth="0.6" opacity="0.4" />

      {/* Panel rows (perspective) */}
      {[0, 1, 2, 3, 4, 5].map((row) => {
        const y = 420 + row * 28;
        const skew = row * 2;
        const opacity = 1 - row * 0.1;
        return (
          <g key={row} opacity={opacity}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((col) => {
              const x = col * 80 - 40 + skew * col;
              return (
                <g key={col}>
                  <rect
                    x={x}
                    y={y}
                    width={70 - skew}
                    height={22 - row * 1.5}
                    fill="url(#panel-grad)"
                    stroke="hsl(32 50% 45%)"
                    strokeWidth="0.4"
                  />
                  {/* Cell lines */}
                  {[1, 2, 3].map((c) => (
                    <line
                      key={c}
                      x1={x + (c * (70 - skew)) / 4}
                      y1={y}
                      x2={x + (c * (70 - skew)) / 4}
                      y2={y + 22 - row * 1.5}
                      stroke="hsl(32 40% 35%)"
                      strokeWidth="0.3"
                    />
                  ))}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
