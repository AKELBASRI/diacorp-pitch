import type {Metadata} from 'next';
import {Fraunces, Archivo, IBM_Plex_Mono} from 'next/font/google';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz']
});
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  display: 'swap'
});
const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600']
});

export const metadata: Metadata = {
  title: 'DiaCorp Admin',
  robots: {index: false, follow: false}
};

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${archivo.variable} ${plexMono.variable}`}
    >
      <body>
        <div className="ambient-bg" aria-hidden />
        <div className="grain-layer" aria-hidden />
        <div className="admin-shell">{children}</div>
        <style>{`
          :root {
            --admin-bg: #08090b;
            --admin-bg-1: #0e1114;
            --admin-bg-2: #14181c;
            --admin-bg-3: #1a1f24;
            --admin-line: #1f2329;
            --admin-line-strong: #2d323a;
            --admin-ink: #f5f2ea;
            --admin-ink-2: #b8b3a8;
            --admin-ink-3: #7c7870;
            --admin-ink-4: #4a4742;
            --admin-accent: #e8a948;
            --admin-accent-2: #56f0c8;
            --admin-accent-3: #c9824a;
            --admin-danger: #e5574a;
            --admin-radius: 0;
            --admin-shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
            --admin-shadow: 0 14px 40px -18px rgba(0,0,0,0.6);
            --admin-shadow-lg: 0 40px 80px -30px rgba(0,0,0,0.8);
            --font-display: var(--font-fraunces), "Fraunces", serif;
            --font-body: var(--font-archivo), "Archivo", system-ui, sans-serif;
            --font-mono: var(--font-plex-mono), "IBM Plex Mono", ui-monospace, monospace;
          }

          * { box-sizing: border-box; }

          html, body {
            background: var(--admin-bg);
            color: var(--admin-ink);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            font-family: var(--font-body);
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
          }
          body { position: relative; overflow-x: hidden; }

          /* Ambient radial gradients that give the admin depth */
          .ambient-bg {
            position: fixed;
            inset: 0;
            pointer-events: none;
            background:
              radial-gradient(ellipse 55% 45% at 10% 0%, color-mix(in oklch, var(--admin-accent) 12%, transparent), transparent 60%),
              radial-gradient(ellipse 60% 55% at 100% 100%, color-mix(in oklch, var(--admin-accent-2) 8%, transparent), transparent 65%);
            z-index: 0;
          }
          .grain-layer {
            position: fixed;
            inset: 0;
            pointer-events: none;
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='220' height='220' filter='url(%23n)' opacity='0.35'/></svg>");
            opacity: 0.05;
            mix-blend-mode: overlay;
            z-index: 1;
          }
          .admin-shell {
            position: relative;
            z-index: 2;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          ::selection { background: var(--admin-accent); color: var(--admin-bg); }

          /* ============  Top nav  ============ */
          .admin-nav {
            position: sticky;
            top: 0;
            z-index: 20;
            background: rgba(8, 9, 11, 0.72);
            backdrop-filter: blur(20px) saturate(140%);
            border-bottom: 1px solid var(--admin-line);
          }
          .admin-nav-inner {
            max-width: 1400px;
            margin: 0 auto;
            padding: 16px 28px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
          }
          .admin-brand {
            font-family: var(--font-display);
            font-size: 20px;
            font-weight: 500;
            letter-spacing: -0.02em;
            color: var(--admin-ink);
          }
          .admin-brand span { color: var(--admin-accent); }
          .admin-sub {
            color: var(--admin-ink-3);
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.22em;
            font-family: var(--font-mono);
            margin-top: 2px;
          }
          .admin-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 44px 28px 120px;
            width: 100%;
          }

          /* ============  Buttons  ============ */
          .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 11px 20px;
            border: 1px solid var(--admin-line-strong);
            background: transparent;
            color: var(--admin-ink);
            font-family: var(--font-mono);
            font-size: 11px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.2, 0.65, 0.2, 1);
            text-decoration: none;
            position: relative;
            overflow: hidden;
          }
          .btn::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, transparent 40%, color-mix(in oklch, var(--admin-accent) 22%, transparent) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          }
          .btn:hover { border-color: var(--admin-accent); color: var(--admin-accent); transform: translateY(-1px); }
          .btn:hover::after { opacity: 1; }
          .btn-primary {
            background: var(--admin-accent);
            color: var(--admin-bg);
            border-color: var(--admin-accent);
            font-weight: 500;
          }
          .btn-primary:hover {
            background: var(--admin-ink);
            border-color: var(--admin-ink);
            color: var(--admin-bg);
          }
          .btn-primary::after { display: none; }
          .btn-danger { border-color: color-mix(in oklch, var(--admin-danger) 45%, transparent); color: var(--admin-danger); }
          .btn-danger:hover { background: var(--admin-danger); border-color: var(--admin-danger); color: var(--admin-bg); }

          /* ============  Inputs  ============ */
          .input, .textarea {
            width: 100%;
            padding: 12px 16px;
            background: rgba(8, 9, 11, 0.6);
            border: 1px solid var(--admin-line);
            color: var(--admin-ink);
            font-family: inherit;
            font-size: 14px;
            border-radius: 0;
            transition: border-color 0.25s ease, background 0.25s ease;
          }
          .input::placeholder, .textarea::placeholder { color: var(--admin-ink-3); }
          .input:focus, .textarea:focus {
            outline: none;
            border-color: var(--admin-accent);
            background: rgba(8, 9, 11, 0.85);
          }
          .textarea { min-height: 120px; resize: vertical; line-height: 1.55; }

          .label {
            display: block;
            font-family: var(--font-mono);
            font-size: 10px;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: var(--admin-ink-2);
            margin-bottom: 10px;
          }

          /* ============  Cards  ============ */
          .card {
            border: 1px solid var(--admin-line);
            padding: 24px;
            background: linear-gradient(180deg, rgba(18, 20, 24, 0.7) 0%, rgba(14, 17, 20, 0.7) 100%);
            margin-bottom: 18px;
            box-shadow: var(--admin-shadow-sm);
          }

          a.nav-link {
            color: var(--admin-ink-2);
            text-decoration: none;
            font-family: var(--font-mono);
            font-size: 11px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            padding: 6px 2px;
            border-bottom: 1px solid transparent;
            transition: all 0.25s ease;
          }
          a.nav-link:hover { color: var(--admin-accent); border-bottom-color: var(--admin-accent); }

          .hint { color: var(--admin-ink-3); font-size: 12px; line-height: 1.6; }

          /* ============  Tags / chips  ============ */
          .tag {
            display: inline-block;
            font-family: var(--font-mono);
            font-size: 9px;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            padding: 4px 10px;
            border: 1px solid var(--admin-line-strong);
            color: var(--admin-ink-2);
          }
          .tag-active { border-color: var(--admin-accent); color: var(--admin-accent); }

          /* ============  Grid two (for form groups)  ============ */
          .grid-two { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
          @media (max-width: 820px) { .grid-two { grid-template-columns: 1fr; } }

          /* ============  Page display title  ============ */
          .admin-h1 {
            font-family: var(--font-display);
            font-size: 44px;
            font-weight: 400;
            letter-spacing: -0.032em;
            line-height: 1.02;
            margin: 0 0 8px;
          }
          .admin-h1-sub {
            color: var(--admin-ink-3);
            font-size: 13px;
            line-height: 1.6;
            margin: 0 0 28px;
            max-width: 72ch;
          }

          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
