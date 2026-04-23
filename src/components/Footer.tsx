import {getTranslations} from 'next-intl/server';

export async function Footer() {
  const t = await getTranslations('footer');

  return (
    <footer className="border-t border-[var(--color-line)]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-[var(--color-sun)]"
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
    </footer>
  );
}
