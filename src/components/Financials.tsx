import {getTranslations} from 'next-intl/server';
import {SectionEyebrow} from './Thesis';
import {STRATEGIES} from '@/lib/strategies';

export async function Financials() {
  const t = await getTranslations('financials');

  const total = STRATEGIES.reduce((sum, s) => sum + s.revenueY5Musd, 0);

  return (
    <section id="financials" className="relative bg-[var(--color-bg-elev)]/40 border-y border-[var(--color-line)]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
          <div className="lg:col-span-4">
            <SectionEyebrow index="iv" label={t('eyebrow')} />
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-[32px] md:text-[48px] lg:text-[60px] leading-[1.03] tracking-[-0.03em]">
              {t('heading')}
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-[var(--color-ink-muted)] max-w-[70ch]">
              {t('subheading')}
            </p>
          </div>
        </div>

        <div className="reveal-stagger grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <Card label={t('cards.plant.label')} value={t('cards.plant.value')} note={t('cards.plant.note')} />
          <Card label={t('cards.software.label')} value={t('cards.software.value')} note={t('cards.software.note')} highlight />
          <Card label={t('cards.combined.label')} value={t('cards.combined.value')} note={t('cards.combined.note')} />
        </div>

        {/* Revenue stack visualization */}
        <div className="reveal-up mt-12 border border-[var(--color-line)] bg-[var(--color-bg)] p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-faint)]">
              REVENUE STACK · YEAR 5 (USD, M)
            </div>
            <div className="font-display num text-2xl text-[var(--color-sun)]">
              ${(total / 1000).toFixed(2)}B
            </div>
          </div>
          <div className="flex h-10 w-full border border-[var(--color-line)] overflow-hidden">
            {STRATEGIES.map((s) => (
              <div
                key={s.id}
                className="relative group cursor-default"
                style={{
                  width: `${(s.revenueY5Musd / total) * 100}%`,
                  background: `hsl(${s.tintHsl})`
                }}
                title={`${s.id}: $${s.revenueY5Musd}M`}
              >
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-[var(--color-bg)] opacity-0 group-hover:opacity-100 transition">
                  {s.number}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-2 mt-6">
            {STRATEGIES.map((s) => (
              <div key={s.id} className="flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2" style={{background: `hsl(${s.tintHsl})`}} />
                <span className="font-mono text-[var(--color-ink-faint)]">{s.number}</span>
                <span className="font-mono num text-[var(--color-ink-muted)] ltr:ml-auto rtl:mr-auto">
                  ${s.revenueY5Musd}M
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({
  label,
  value,
  note,
  highlight
}: {
  label: string;
  value: string;
  note: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative border p-8 ${
        highlight
          ? 'border-[var(--color-sun)] bg-[var(--color-sun)]/5'
          : 'border-[var(--color-line)] bg-[var(--color-bg)]'
      } overflow-hidden`}
    >
      {highlight && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 80% 20%, hsl(32 88% 60% / 0.3), transparent 60%)'
          }}
        />
      )}
      <div className="relative font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-faint)] mb-4">
        {label}
      </div>
      <div
        className={`relative font-display num leading-none tracking-tight ${
          highlight ? 'text-[var(--color-sun)]' : 'text-[var(--color-ink)]'
        } text-5xl md:text-6xl`}
      >
        {value}
      </div>
      <div className="relative mt-3 text-[13px] text-[var(--color-ink-muted)]">
        {note}
      </div>
    </div>
  );
}
