import {getTranslations} from 'next-intl/server';

type Item = {
  code: string;
  capacity: string;
  location: string;
  status: string;
  commissioning: string;
  offtakers: string;
};

export async function Projects() {
  const t = await getTranslations('home.projects');
  const items = t.raw('items') as Item[];

  return (
    <section id="projets" className="relative border-b border-[var(--color-line)] bg-[var(--color-bg-elev)]/40">
      <div aria-hidden className="absolute inset-0 zellige opacity-[0.025]" />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 py-20 lg:py-28">
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

        {/* Project cards */}
        <div className="reveal-stagger grid grid-cols-1 lg:grid-cols-3 gap-5">
          {items.map((it, idx) => {
            const accents = ['var(--color-sun)', 'var(--color-copper)', 'var(--color-spark-deep)'];
            const accent = accents[idx % 3];
            return (
              <article
                key={it.code}
                className="lift relative border border-[var(--color-line)] bg-[var(--color-bg)] overflow-hidden"
              >
                {/* Top accent band */}
                <div
                  aria-hidden
                  className="absolute top-0 ltr:left-0 rtl:right-0 h-[3px] w-full"
                  style={{background: accent}}
                />

                <div className="p-7 lg:p-8">
                  <div className="flex items-baseline justify-between mb-6">
                    <span
                      className="font-display text-[36px] lg:text-[44px] leading-none tracking-tight"
                      style={{color: accent}}
                    >
                      {it.code}
                    </span>
                    <span className="font-display num text-[28px] lg:text-[32px] text-[var(--color-ink)]">
                      {it.capacity}
                    </span>
                  </div>

                  <dl className="space-y-3.5 border-t border-[var(--color-line)] pt-4">
                    <Row label={t('columns.location')} value={it.location} />
                    <Row label={t('columns.status')} value={it.status} highlight={idx === 0} />
                    <Row label={t('columns.commissioning')} value={it.commissioning} mono />
                    <Row label={t('columns.offtakers')} value={it.offtakers} />
                  </dl>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-10 text-center font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink-faint)]">
          · {t('extensions')} ·
        </p>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  mono,
  highlight
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 items-baseline">
      <dt className="font-mono text-[9px] tracking-[0.18em] uppercase text-[var(--color-ink-faint)]">
        {label}
      </dt>
      <dd
        className={`text-[13px] leading-snug ${
          mono ? 'font-mono' : ''
        } ${highlight ? 'text-[var(--color-sun)]' : 'text-[var(--color-ink)]'}`}
      >
        {value}
      </dd>
    </div>
  );
}
