import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

export async function LOISection() {
  const t = await getTranslations('home.loi');

  return (
    <section id="loi" className="relative border-b border-[var(--color-line)] bg-[var(--color-bg-elev)]/30 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(232,169,72,0.12), transparent 60%)'
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 py-20 lg:py-28">
        <div className="max-w-[820px] mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-8 h-px bg-[var(--color-sun)]" />
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-sun)]">
              {t('kicker')}
            </span>
          </div>
          <h2 className="font-display text-[32px] lg:text-[48px] leading-[1.05] tracking-[-0.025em] mb-6">
            {t('title')}
          </h2>
          <p className="text-[15px] lg:text-[17px] leading-[1.6] text-[var(--color-ink-muted)] max-w-[62ch]">
            {t('sub')}
          </p>
        </div>

        <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 gap-4">
          <LoiCard
            title={t('industryTitle')}
            body={t('industryBody')}
            cta={t('industryCta')}
            href="/LOI_Industrie.pdf"
            accent="var(--color-sun)"
            iconKind="industry"
          />
          <LoiCard
            title={t('agroTitle')}
            body={t('agroBody')}
            cta={t('agroCta')}
            href="/LOI_Agriculture.pdf"
            accent="var(--color-spark-deep)"
            iconKind="agro"
          />
        </div>

        {/* Online form CTA */}
        <div className="mt-10 relative">
          <div className="relative border border-[var(--color-sun)] bg-[var(--color-sun)]/5 p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 overflow-hidden">
            <div
              aria-hidden
              className="absolute top-0 ltr:left-0 rtl:right-0 h-full w-[3px] bg-[var(--color-sun)]"
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 40% 80% at 90% 50%, rgba(232,169,72,0.15), transparent 60%)'
              }}
            />
            <div className="relative ltr:pl-4 rtl:pr-4">
              <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-sun)] mb-3">
                {t('onlineKicker')}
              </div>
              <h3 className="font-display text-[24px] lg:text-[30px] leading-tight tracking-tight mb-2">
                {t('onlineTitle')}
              </h3>
              <p className="text-[14px] text-[var(--color-ink-muted)] max-w-[54ch]">
                {t('onlineBody')}
              </p>
            </div>
            <Link
              href="/register"
              className="relative shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--color-sun)] text-[var(--color-bg)] font-mono text-[11px] tracking-[0.16em] uppercase hover:bg-[var(--color-ink)] transition-colors"
            >
              {t('onlineCta')}
              <span className="ltr:rotate-0 rtl:rotate-180">→</span>
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--color-ink-muted)]">
          {t('help')}{' '}
          <a
            href="mailto:contact@diacorp.energy"
            className="text-[var(--color-sun)] hover:underline"
          >
            contact@diacorp.energy
          </a>
        </p>
      </div>
    </section>
  );
}

function LoiCard({
  title,
  body,
  cta,
  href,
  accent,
  iconKind
}: {
  title: string;
  body: string;
  cta: string;
  href: string;
  accent: string;
  iconKind: 'industry' | 'agro';
}) {
  return (
    <a
      href={href}
      download
      className="lift group relative border border-[var(--color-line)] bg-[var(--color-bg)] p-8 lg:p-10 overflow-hidden block"
    >
      <div
        aria-hidden
        className="absolute top-0 ltr:left-0 rtl:right-0 h-[3px] w-full"
        style={{background: accent}}
      />

      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 border border-[var(--color-line)] flex items-center justify-center">
          {iconKind === 'industry' ? (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={accent} strokeWidth="1.3">
              <path d="M3 21h18M5 21V9l5 3V9l5 3V9l4 2.5V21" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={accent} strokeWidth="1.3">
              <path d="M12 21v-7M12 14c-4 0-6-3-6-6 3 0 6 2 6 6ZM12 14c4 0 6-3 6-6-3 0-6 2-6 6Z" />
            </svg>
          )}
        </div>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-ink-faint)" strokeWidth="1.2" className="group-hover:translate-y-1 transition-transform">
          <path d="M12 4v14M6 12l6 6 6-6" strokeLinecap="round" />
        </svg>
      </div>

      <h3 className="font-display text-[22px] lg:text-[26px] leading-tight tracking-tight mb-3">
        {title}
      </h3>
      <p className="text-[14px] leading-relaxed text-[var(--color-ink-muted)] mb-7">
        {body}
      </p>

      <div
        className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase group-hover:gap-4 transition-all"
        style={{color: accent}}
      >
        {cta} <span>↓</span>
      </div>
    </a>
  );
}
