'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';

const LABELS: Record<string, string> = {
  fr: 'FR',
  en: 'EN',
  ar: 'عـر'
};

export function LocaleSwitcher({className = ''}: {className?: string}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className={`inline-flex items-center gap-px border border-[var(--color-line)] bg-[var(--color-bg-elev)]/60 backdrop-blur ${className}`}
    >
      {routing.locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            onClick={() => router.replace(pathname, {locale: l})}
            aria-current={active ? 'true' : undefined}
            className={`font-mono text-[11px] tracking-[0.18em] uppercase px-3 py-1.5 transition-colors ${
              active
                ? 'bg-[var(--color-sun)] text-[var(--color-bg)]'
                : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
            }`}
          >
            {LABELS[l]}
          </button>
        );
      })}
    </div>
  );
}
