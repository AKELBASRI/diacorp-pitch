import {getTranslations} from 'next-intl/server';

type Item = {
  code: string;
  name: string;
  client: string;
  location: string;
  capacity: string;
  role: string;
  year: string;
  scope: string;
};

export async function TrackRecord() {
  const t = await getTranslations('home.track');
  const items = t.raw('items') as Item[];

  return (
    <section id="references" className="relative border-b border-[var(--color-line)]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-20 lg:py-28">
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

        <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((it, idx) => {
            const accents = [
              'var(--color-sun)',
              'var(--color-copper)',
              'var(--color-spark-deep)',
              'var(--color-violet)'
            ];
            const accent = accents[idx % accents.length];
            return (
              <article
                key={it.code}
                className="lift relative border border-[var(--color-line)] bg-[var(--color-bg)] overflow-hidden flex flex-col"
              >
                <div
                  aria-hidden
                  className="absolute top-0 ltr:left-0 rtl:right-0 h-[3px] w-full"
                  style={{background: accent}}
                />

                <div className="p-7 lg:p-8 flex-1">
                  <div className="flex items-start justify-between mb-5">
                    <span
                      className="font-mono text-[11px] tracking-[0.2em] px-2 py-1 border"
                      style={{borderColor: accent, color: accent}}
                    >
                      {it.code}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--color-ink-faint)]">
                      {it.year}
                    </span>
                  </div>

                  <h3
                    className="font-display text-[22px] lg:text-[26px] leading-tight tracking-tight mb-4"
                    style={{color: accent}}
                  >
                    {it.name}
                  </h3>

                  <p className="text-[13px] lg:text-[14px] leading-relaxed text-[var(--color-ink-muted)] mb-5">
                    {it.scope}
                  </p>

                  <dl className="grid grid-cols-2 gap-x-5 gap-y-3 border-t border-[var(--color-line)] pt-4">
                    <Row label="Client" value={it.client} />
                    <Row label="Site" value={it.location} />
                    <Row label="Capacité" value={it.capacity} />
                    <Row label="Rôle" value={it.role} mono />
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  mono
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="font-mono text-[9px] tracking-[0.18em] uppercase text-[var(--color-ink-faint)] mb-1">
        {label}
      </dt>
      <dd
        className={`text-[12px] text-[var(--color-ink)] leading-snug ${
          mono ? 'font-mono' : ''
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
