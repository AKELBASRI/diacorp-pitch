import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {LocaleSwitcher} from './LocaleSwitcher';

export async function Nav() {
  const t = await getTranslations('nav');

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[var(--color-bg)]/85 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2.5 group">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-[var(--color-sun)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
          </svg>
          <span className="font-display text-[15px] tracking-tight">
            DiaCorp<span className="text-[var(--color-ink-muted)]">.</span>Energy
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-ink-muted)]">
          <Link href="/#thesis" className="hover:text-[var(--color-ink)] transition-colors">
            {t('thesis')}
          </Link>
          <Link href="/#strategies" className="hover:text-[var(--color-ink)] transition-colors">
            {t('strategies')}
          </Link>
          <Link
            href="/prototypes"
            className="text-[var(--color-sun)] hover:text-[var(--color-ink)] transition-colors"
          >
            {t('gallery')}
          </Link>
          <Link href="/#financials" className="hover:text-[var(--color-ink)] transition-colors">
            {t('financials')}
          </Link>
          <Link href="/#timeline" className="hover:text-[var(--color-ink)] transition-colors">
            {t('timeline')}
          </Link>
        </nav>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
