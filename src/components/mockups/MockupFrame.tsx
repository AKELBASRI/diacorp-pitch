import type {ReactNode} from 'react';

export function MockupFrame({
  title,
  subtitle,
  children,
  tint = '32 88% 60%',
  dense = false
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  tint?: string;
  dense?: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden border border-[var(--color-line)] bg-gradient-to-br from-[var(--color-bg-elev)] to-[var(--color-bg)] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.8)]"
      style={
        {
          ['--tint' as string]: `hsl(${tint})`,
          ['--tint-soft' as string]: `hsl(${tint} / 0.18)`,
          ['--tint-ghost' as string]: `hsl(${tint} / 0.08)`
        } as React.CSSProperties
      }
    >
      {/* Chrome header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-line)] bg-[var(--color-bg)]/60 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-line-strong)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-line-strong)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-line-strong)]" />
          <div className="ltr:ml-4 rtl:mr-4 flex items-baseline gap-2">
            <span className="font-mono text-[11px] text-[var(--color-ink)] tracking-wider">
              {title}
            </span>
            <span className="font-mono text-[10px] text-[var(--color-ink-faint)]">
              {subtitle}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--tint)] glow-pulse" />
          <span className="font-mono text-[10px] text-[var(--color-ink-faint)]">LIVE</span>
        </div>
      </div>

      <div className={dense ? 'p-4' : 'p-5 md:p-6'}>{children}</div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(circle at 80% 0%, var(--tint-ghost), transparent 50%)'
        }}
      />
    </div>
  );
}
