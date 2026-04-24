import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

type Item = {
  badge: string;
  title: string;
  subtitle: string;
  body: string;
  features: string[];
  bestFor: string;
};

export async function Models() {
  const t = await getTranslations('home.models');
  const items = t.raw('items') as Item[];

  return (
    <section
      id="models"
      className="relative border-b border-[var(--color-line)] overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 100% 0%, hsl(32 88% 60% / 0.08), transparent 60%), radial-gradient(ellipse 40% 45% at 0% 100%, hsl(168 72% 55% / 0.08), transparent 60%)'
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14 lg:mb-16">
          <div className="lg:col-span-6">
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
          <div className="lg:col-span-5 lg:col-start-8 flex items-end">
            <p className="text-[15px] lg:text-[17px] leading-[1.6] text-[var(--color-ink-muted)] max-w-[55ch]">
              {t('sub')}
            </p>
          </div>
        </div>

        <div className="reveal-stagger grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          {items.map((it, i) => {
            const accent = i === 0 ? 'var(--color-sun)' : 'var(--color-spark-deep)';
            const glowColor =
              i === 0
                ? 'hsl(32 88% 60% / 0.10)'
                : 'hsl(168 72% 55% / 0.10)';
            return (
              <article
                key={i}
                className="lift relative border border-[var(--color-line)] bg-[var(--color-bg)] overflow-hidden flex flex-col"
              >
                <div
                  aria-hidden
                  className="absolute top-0 ltr:left-0 rtl:right-0 h-[3px] w-full"
                  style={{background: accent}}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-70 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 60% 60% at 100% 0%, ${glowColor}, transparent 60%)`
                  }}
                />

                {/* Diagram */}
                <div className="relative px-8 lg:px-10 pt-8 lg:pt-10 pb-4">
                  {i === 0 ? <WheelingDiagram accent={accent} /> : <DirectDiagram accent={accent} />}
                </div>

                <div className="relative px-8 lg:px-10 pt-4 pb-8 lg:pb-10 flex-1 flex flex-col">
                  <div className="font-mono text-[10px] tracking-[0.22em] uppercase mb-5" style={{color: accent}}>
                    {it.badge}
                  </div>
                  <h3 className="font-display text-[26px] lg:text-[32px] leading-[1.05] tracking-[-0.02em] mb-2">
                    {it.title}
                  </h3>
                  <div className="text-[13px] lg:text-[14px] text-[var(--color-ink-muted)] mb-5">
                    {it.subtitle}
                  </div>

                  <p className="text-[14px] lg:text-[15px] leading-[1.65] text-[var(--color-ink)] max-w-[56ch] mb-7">
                    {it.body}
                  </p>

                  <ul className="space-y-2.5 mb-7">
                    {it.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-3 text-[13.5px] text-[var(--color-ink-muted)] leading-[1.4]"
                      >
                        <span
                          aria-hidden
                          className="mt-2 block w-1.5 h-1.5 shrink-0"
                          style={{background: accent}}
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6 border-t border-[var(--color-line)]">
                    <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-[var(--color-ink-faint)] mb-2">
                      Idéal pour
                    </div>
                    <div className="text-[13px] text-[var(--color-ink)] leading-snug">
                      {it.bestFor}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 lg:mt-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-[var(--color-line)] bg-[var(--color-bg-elev)]/60 px-7 lg:px-10 py-6 lg:py-7 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute top-0 ltr:left-0 rtl:right-0 h-full w-[3px] bg-[var(--color-sun)]"
          />
          <p className="relative text-[14px] lg:text-[15px] text-[var(--color-ink-muted)] max-w-[70ch] leading-[1.55] ltr:pl-4 rtl:pr-4">
            {t('footnote')}
          </p>
          <Link
            href="/register"
            className="relative shrink-0 inline-flex items-center gap-2 bg-[var(--color-sun)] text-[var(--color-bg)] px-6 py-3.5 font-mono text-[11px] tracking-[0.18em] uppercase hover:bg-[var(--color-ink)] transition-colors"
          >
            {t('cta')}
            <span className="ltr:rotate-0 rtl:rotate-180">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* === Diagrams === */

/* Option 1 — Cable delivery: plant on left, cable (wheeling OR direct) to client on right */
function WheelingDiagram({accent}: {accent: string}) {
  return (
    <svg
      viewBox="0 0 360 130"
      className="w-full h-[110px] lg:h-[130px]"
      fill="none"
      aria-hidden
    >
      {/* Plant (left) */}
      <g>
        <rect x="12" y="48" width="60" height="54" stroke="var(--color-ink-faint)" strokeWidth="1" fill="var(--color-bg-panel)" />
        {/* Solar roof */}
        <path d="M18 70h18v22H18zM40 70h18v22H40z" stroke={accent} strokeWidth="1" fill="none" />
        <path d="M18 76h18M18 83h18M40 76h18M40 83h18M27 70v22M49 70v22" stroke={accent} strokeWidth="0.5" opacity="0.6" />
        {/* Sun over plant */}
        <circle cx="42" cy="38" r="5" fill={accent} opacity="0.85" />
        <g stroke={accent} strokeWidth="0.8" opacity="0.5">
          <path d="M42 28v-4M42 52v-4M32 38h-4M56 38h-4M35 31l-3-3M52 45l-3-3M35 45l-3 3M52 31l-3 3" />
        </g>
        <text x="42" y="118" className="font-mono" fontSize="8" fill="var(--color-ink-faint)" textAnchor="middle" style={{letterSpacing: '0.12em'}}>CENTRALE DIA1</text>
      </g>

      {/* Grid pylons */}
      <g stroke="var(--color-ink-faint)" strokeWidth="1">
        <path d="M130 82l-6 -30M130 82l6 -30M130 52l-8 0M130 52l8 0M124 52l6 -8M136 52l-6 -8" />
      </g>
      <g stroke="var(--color-ink-faint)" strokeWidth="1">
        <path d="M200 82l-6 -30M200 82l6 -30M200 52l-8 0M200 52l8 0M194 52l6 -8M206 52l-6 -8" />
      </g>

      {/* Cable line — dashed (wheeling) */}
      <path d="M72 72 L 124 52 L 194 52 L 254 60" stroke={accent} strokeWidth="1.5" strokeDasharray="5 3" />

      {/* Label */}
      <text x="145" y="28" className="font-mono" fontSize="8" fill="var(--color-ink-faint)" textAnchor="middle" style={{letterSpacing: '0.15em'}}>
        CÂBLE · WHEELING ONEE OU DIRECT
      </text>

      {/* Client (right) = factory with chimney */}
      <g>
        <rect x="254" y="50" width="90" height="52" stroke={accent} strokeWidth="1.2" fill="var(--color-bg)" />
        <path d="M290 50l0 -12l10 0l0 12" stroke={accent} strokeWidth="1" fill="none" />
        <path d="M264 66h12M282 66h12M300 66h12M318 66h12M264 78h12M282 78h12M300 78h12M318 78h12M264 90h12M282 90h12M300 90h12M318 90h12" stroke={accent} strokeWidth="0.6" opacity="0.55" />
        <text x="299" y="118" className="font-mono" fontSize="8" fill={accent} textAnchor="middle" style={{letterSpacing: '0.12em'}}>VOTRE SITE</text>
      </g>

      {/* Flow pulse */}
      <circle r="2.2" fill={accent}>
        <animateMotion dur="3.2s" repeatCount="indefinite" path="M72 72 L 124 52 L 194 52 L 254 60" />
      </circle>
    </svg>
  );
}

/* Option 2 — On-site PV install: panels sitting ON the client's own facility.
   No plant, no cable from outside. Sun → panels → client's building. */
function DirectDiagram({accent}: {accent: string}) {
  return (
    <svg
      viewBox="0 0 360 130"
      className="w-full h-[110px] lg:h-[130px]"
      fill="none"
      aria-hidden
    >
      {/* Sun top-left */}
      <g>
        <circle cx="50" cy="30" r="8" fill={accent} opacity="0.85" />
        <g stroke={accent} strokeWidth="1" opacity="0.5">
          <path d="M50 14v-6M50 52v-6M34 30h-6M72 30h-6M40 20l-4-4M64 40l-4-4M40 40l-4 4M64 20l-4 4" />
        </g>
      </g>

      {/* Sun rays to panels (photons) */}
      <g stroke={accent} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.45">
        <path d="M60 40 L 170 80" />
        <path d="M66 45 L 205 80" />
        <path d="M72 50 L 240 80" />
      </g>

      {/* Client facility (big, centered) with PV panels on roof */}
      <g>
        {/* Building body */}
        <rect x="120" y="78" width="200" height="28" stroke={accent} strokeWidth="1.2" fill="var(--color-bg)" />
        <path d="M138 106v-20M160 106v-20M182 106v-20M204 106v-20M226 106v-20M248 106v-20M270 106v-20M292 106v-20" stroke={accent} strokeWidth="0.5" opacity="0.45" />

        {/* Angled roof line */}
        <path d="M120 78 L 220 56 L 320 78" stroke={accent} strokeWidth="1.2" fill="none" />

        {/* PV panel array on the roof (angled) */}
        <g transform="translate(148 64) rotate(-12)">
          <rect x="0" y="0" width="36" height="12" stroke={accent} strokeWidth="1" fill={accent} fillOpacity="0.15" />
          <path d="M9 0v12M18 0v12M27 0v12M0 6h36" stroke={accent} strokeWidth="0.5" opacity="0.7" />
        </g>
        <g transform="translate(188 55) rotate(-12)">
          <rect x="0" y="0" width="36" height="12" stroke={accent} strokeWidth="1" fill={accent} fillOpacity="0.15" />
          <path d="M9 0v12M18 0v12M27 0v12M0 6h36" stroke={accent} strokeWidth="0.5" opacity="0.7" />
        </g>
        <g transform="translate(228 46) rotate(-12)">
          <rect x="0" y="0" width="36" height="12" stroke={accent} strokeWidth="1" fill={accent} fillOpacity="0.15" />
          <path d="M9 0v12M18 0v12M27 0v12M0 6h36" stroke={accent} strokeWidth="0.5" opacity="0.7" />
        </g>

        <text x="220" y="118" className="font-mono" fontSize="8" fill={accent} textAnchor="middle" style={{letterSpacing: '0.12em'}}>VOTRE SITE · PANNEAUX SUR PLACE</text>
      </g>

      {/* Label top-right */}
      <text x="335" y="28" className="font-mono" fontSize="8" fill="var(--color-ink-faint)" textAnchor="end" style={{letterSpacing: '0.15em'}}>
        ZÉRO CÂBLE EXTERNE
      </text>

      {/* Pulse on one panel to suggest production */}
      <circle cx="220" cy="54" r="2.4" fill={accent} className="glow-pulse" />
    </svg>
  );
}
