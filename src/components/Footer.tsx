import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

type RegionalLine = {label: string; phone: string};

export async function Footer() {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');
  const lines = t.raw('regional.lines') as RegionalLine[];

  return (
    <footer className="relative border-t border-[var(--color-line)] overflow-hidden bg-[var(--color-bg-elev)]/40">
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 55% at 15% 0%, hsl(32 88% 60% / 0.08), transparent 65%)'
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 border-b border-[var(--color-line)] pb-12 lg:pb-16">
          <div className="lg:col-span-5">
            <Link href="/" className="group inline-flex items-center gap-3 mb-6">
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 text-[var(--color-sun)] group-hover:rotate-45 transition-transform duration-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
              </svg>
              <span className="font-display text-[22px] tracking-tight">
                DiaCorp<span className="text-[var(--color-ink-muted)]">.</span>Energy
              </span>
            </Link>
            <p className="text-[14px] lg:text-[15px] text-[var(--color-ink-muted)] leading-[1.65] max-w-[46ch]">
              {t('tagline')}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="mailto:contact@diacorp.energy"
                className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-sun)] underline-sweep"
              >
                contact@diacorp.energy
              </a>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-faint)] mb-5">
              {t('regional.title')}
            </div>
            <ul className="space-y-4">
              {lines.map((l) => (
                <li key={l.label} className="flex flex-col gap-1">
                  <span className="text-[13px] text-[var(--color-ink)] leading-tight">
                    {l.label}
                  </span>
                  <span className="font-mono text-[12px] num text-[var(--color-ink-muted)] tracking-tight">
                    {l.phone}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-[var(--color-line)] font-mono text-[11px] text-[var(--color-ink-muted)] tracking-tight">
              {t('regional.hours')}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-faint)] mb-5">
              {t('nav') ?? 'Navigation'}
            </div>
            <ul className="space-y-3 text-[13px] text-[var(--color-ink-muted)]">
              <li><Link href="/#activites" className="underline-sweep hover:text-[var(--color-ink)] transition-colors">{nav('activites')}</Link></li>
              <li><Link href="/services" className="underline-sweep hover:text-[var(--color-ink)] transition-colors">{nav('services')}</Link></li>
              <li><Link href="/#produits" className="underline-sweep hover:text-[var(--color-ink)] transition-colors">{nav('produits')}</Link></li>
              <li><Link href="/#projets" className="underline-sweep hover:text-[var(--color-ink)] transition-colors">{nav('realisations')}</Link></li>
              <li><Link href="/#references" className="underline-sweep hover:text-[var(--color-ink)] transition-colors">{nav('references')}</Link></li>
              <li><Link href="/pitch" className="underline-sweep hover:text-[var(--color-ink)] transition-colors">{nav('pitch')}</Link></li>
              <li><Link href="/register" className="underline-sweep text-[var(--color-sun)] hover:text-[var(--color-ink)] transition-colors">{nav('loi')}</Link></li>
              <li><Link href="/contact" className="underline-sweep hover:text-[var(--color-ink)] transition-colors">{nav('contact')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 pb-6 border-b border-[var(--color-line)]">
          <p className="text-[11px] lg:text-[12px] leading-[1.7] text-[var(--color-ink-faint)] max-w-[90ch]">
            {t('disclaimer')}
          </p>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 text-[var(--color-sun)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-faint)]">
              {t('confidential')}
            </span>
          </div>
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-faint)]">
            {t('version')}
          </div>
        </div>
      </div>
    </footer>
  );
}
