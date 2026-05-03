import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {LocaleSwitcher} from './LocaleSwitcher';
import {ThemeToggle} from './ThemeToggle';

export async function Nav() {
  const t = await getTranslations('nav');

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[var(--color-bg)]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-[1500px] px-5 lg:px-10 flex items-center justify-between h-14 gap-3 lg:gap-6">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-[var(--color-sun)] group-hover:rotate-45 transition-transform duration-500"
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
        <nav className="hidden xl:flex items-center gap-5 font-mono text-[10.5px] tracking-[0.14em] uppercase text-[var(--color-ink-muted)]">
          <Link href="/#activites" className="underline-sweep hover:text-[var(--color-ink)] transition-colors">
            {t('activites')}
          </Link>
          <Link href="/services" className="underline-sweep hover:text-[var(--color-ink)] transition-colors">
            {t('services')}
          </Link>
          <Link href="/#produits" className="underline-sweep hover:text-[var(--color-ink)] transition-colors">
            {t('produits')}
          </Link>
          <Link href="/#scenarios" className="underline-sweep hover:text-[var(--color-ink)] transition-colors">
            {t('scenarios')}
          </Link>
          <Link href="/#projets" className="underline-sweep hover:text-[var(--color-ink)] transition-colors">
            {t('realisations')}
          </Link>
          <Link href="/#references" className="underline-sweep hover:text-[var(--color-ink)] transition-colors">
            {t('references')}
          </Link>
          <Link
            href="/register"
            className="text-[var(--color-sun)] hover:text-[var(--color-ink)] transition-colors"
          >
            {t('loi')}
          </Link>
          <Link href="/pitch" className="underline-sweep hover:text-[var(--color-ink)] transition-colors">
            {t('pitch')}
          </Link>
          <Link href="/contact" className="underline-sweep hover:text-[var(--color-ink)] transition-colors">
            {t('contact')}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
