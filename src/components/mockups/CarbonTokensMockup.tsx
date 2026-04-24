import {getTranslations} from 'next-intl/server';
import {MockupFrame} from './MockupFrame';

const TXS = [
  {h: '0x7a2f…e1b4', who: 'Managem Jerada', tons: 1420, type: 'retire'},
  {h: '0x3d8c…9f02', who: 'Unimer Nador', tons: 680, type: 'issue'},
  {h: '0xc4a1…7bd9', who: 'Copag Berkane', tons: 912, type: 'retire'},
  {h: '0xb9e7…3a1c', who: 'Nador West Med', tons: 2100, type: 'transfer'},
  {h: '0x18f4…d0e5', who: 'Ciments Oujda', tons: 340, type: 'issue'}
];

export async function CarbonTokensMockup({tint}: {tint: string}) {
  const t = await getTranslations('strategies.items.carbon-tokens.mockup');

  return (
    <MockupFrame title={t('title')} subtitle={t('subtitle')} tint={tint}>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard label={t('labels.portfolio')} value="48,216" unit="REC" primary />
        <StatCard label={t('labels.retired')} value="12,804" unit="tCO₂e" />
        <StatCard label={t('labels.price')} value="€18.40" unit="/tCO₂" />
        <StatCard label={t('labels.vintage')} value="2026" unit="" />
      </div>

      <div className="border-t border-[var(--color-line)] pt-3">
        <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--color-ink-faint)] mb-2">
          LEDGER · POLYGON
        </div>
        <div className="space-y-1.5 mock-scroll max-h-[140px] overflow-auto">
          {TXS.map((tx, i) => (
            <div
              key={i}
              className="flex items-center justify-between font-mono text-[11px] num py-1 px-2 border-l-2"
              style={{
                borderColor:
                  tx.type === 'retire'
                    ? 'hsl(144 62% 52%)'
                    : tx.type === 'issue'
                    ? 'hsl(32 88% 60%)'
                    : 'hsl(200 78% 58%)',
                background: 'hsl(0 0% 100% / 0.02)'
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-[var(--color-ink-faint)]">{tx.h}</span>
                <span className="text-[var(--color-ink-muted)] text-[10px] uppercase tracking-wider">
                  {tx.type}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[var(--color-ink)]">{tx.who}</span>
                <span className="text-[var(--tint)]">
                  {tx.tons.toLocaleString()} t
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MockupFrame>
  );
}

function StatCard({
  label,
  value,
  unit,
  primary
}: {
  label: string;
  value: string;
  unit: string;
  primary?: boolean;
}) {
  return (
    <div className="border border-[var(--color-line)] p-3 bg-[var(--color-bg)] relative overflow-hidden">
      {primary && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(circle at 80% 0%, var(--tint), transparent 60%)'
          }}
        />
      )}
      <div className="relative font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--color-ink-faint)] mb-1.5">
        {label}
      </div>
      <div className="relative flex items-baseline gap-1.5 font-display num">
        <span className="text-xl text-[var(--color-ink)]">{value}</span>
        <span className="font-mono text-[10px] text-[var(--color-ink-muted)]">{unit}</span>
      </div>
    </div>
  );
}
