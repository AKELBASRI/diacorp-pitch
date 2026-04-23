import {getTranslations} from 'next-intl/server';
import {MockupFrame} from './MockupFrame';

const BIDS = [
  {qty: 42, price: 0.071, who: 'OCP Khouribga'},
  {qty: 18, price: 0.070, who: 'Renault Tanger'},
  {qty: 25, price: 0.069, who: 'Managem'},
  {qty: 60, price: 0.068, who: 'Stellantis Kénitra'},
  {qty: 14, price: 0.067, who: 'Ynna'}
];
const ASKS = [
  {qty: 50, price: 0.072, who: 'DIA1 · N-8'},
  {qty: 28, price: 0.074, who: 'DIA1 · S-3'},
  {qty: 12, price: 0.075, who: 'VPP · Agadir'},
  {qty: 40, price: 0.078, who: 'DIA1 · E-2'},
  {qty: 22, price: 0.082, who: 'VPP · Oujda'}
];

export async function EnergyMarketMockup({tint}: {tint: string}) {
  const t = await getTranslations('strategies.items.energy-market.mockup');

  return (
    <MockupFrame title={t('title')} subtitle={t('subtitle')} tint={tint} dense>
      <div className="grid grid-cols-2 gap-px bg-[var(--color-line)]">
        <OrderColumn
          title={t('columns.bids')}
          rows={BIDS}
          side="bid"
          align="end"
        />
        <OrderColumn
          title={t('columns.asks')}
          rows={ASKS}
          side="ask"
          align="start"
        />
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-line)]">
        <div>
          <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--color-ink-faint)]">
            {t('columns.last')}
          </div>
          <div className="font-mono num text-[var(--tint)] text-xl mt-0.5">
            $0.0715
            <span className="text-[11px] text-[var(--color-ink-muted)] ltr:ml-2 rtl:mr-2">
              /kWh
            </span>
          </div>
        </div>
        <Sparkline />
      </div>
    </MockupFrame>
  );
}

function OrderColumn({
  title,
  rows,
  side,
  align
}: {
  title: string;
  rows: {qty: number; price: number; who: string}[];
  side: 'bid' | 'ask';
  align: 'start' | 'end';
}) {
  const max = Math.max(...rows.map((r) => r.qty));
  return (
    <div className="bg-[var(--color-bg-panel)] p-3">
      <div
        className={`font-mono text-[9px] tracking-[0.15em] uppercase mb-2 ${
          side === 'bid' ? 'text-[var(--tint)]' : 'text-[var(--color-copper)]'
        } text-${align}`}
      >
        {title}
      </div>
      <div className="space-y-1">
        {rows.map((row, i) => (
          <div
            key={i}
            className="relative flex items-center justify-between font-mono text-[11px] num px-2 py-1 overflow-hidden"
          >
            <div
              className={`absolute inset-y-0 ${
                side === 'bid' ? 'right-0' : 'left-0'
              }`}
              style={{
                width: `${(row.qty / max) * 100}%`,
                background:
                  side === 'bid'
                    ? 'hsl(168 72% 55% / 0.14)'
                    : 'hsl(24 80% 62% / 0.14)'
              }}
            />
            <span className="relative text-[var(--color-ink-muted)] truncate">{row.who}</span>
            <div className="relative flex items-center gap-2">
              <span className="text-[var(--color-ink-faint)]">{row.qty}</span>
              <span
                className={
                  side === 'bid' ? 'text-[var(--tint)]' : 'text-[var(--color-copper)]'
                }
              >
                ${row.price.toFixed(4)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Sparkline() {
  const path =
    'M0 28 L10 26 L20 22 L30 24 L40 18 L50 14 L60 16 L70 10 L80 12 L90 6 L100 8 L110 4';
  return (
    <svg
      width="120"
      height="36"
      viewBox="0 0 120 36"
      className="overflow-visible"
    >
      <path
        d={path}
        fill="none"
        stroke="hsl(168 72% 55%)"
        strokeWidth="1.5"
      />
      <circle cx="110" cy="4" r="2.5" fill="hsl(168 72% 55%)" className="glow-pulse" />
    </svg>
  );
}
