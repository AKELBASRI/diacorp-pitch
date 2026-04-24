import {redirect} from 'next/navigation';
import {getSession, verifyCredentials} from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function loginAction(formData: FormData) {
  'use server';
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/admin');

  const user = await verifyCredentials(email, password);
  if (!user) {
    redirect(`/admin/login?next=${encodeURIComponent(next)}&e=1`);
  }

  const sess = await getSession();
  sess.userId = user.id;
  sess.email = user.email;
  sess.role = user.role;
  await sess.save();

  redirect(next);
}

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{next?: string; e?: string}>;
}) {
  const sp = await searchParams;
  const next = sp?.next ?? '/admin';
  const failed = sp?.e === '1';

  return (
    <main className="login-shell">
      <div className="login-card">
        <div className="login-logo">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--admin-accent)" strokeWidth="1.4">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
          </svg>
          <div className="login-brand">
            DiaCorp<span>.</span>Admin
          </div>
        </div>

        <h1 className="login-title">Welcome back.</h1>
        <p className="login-sub">
          Content management for diacorp.energy. Sign in to publish updates
          across the public site.
        </p>

        {failed && (
          <div className="login-error">
            Invalid email or password.
          </div>
        )}

        <form action={loginAction} className="login-form">
          <input type="hidden" name="next" value={next} />
          <div className="field-block">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              required
              autoFocus
              type="email"
              name="email"
              id="email"
              className="input"
              placeholder="admin@diacorp.energy"
              autoComplete="email"
            />
          </div>
          <div className="field-block">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              required
              type="password"
              name="password"
              id="password"
              className="input"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary login-submit">
            Sign in
            <span style={{display: 'inline-block', marginInlineStart: 4}}>→</span>
          </button>
        </form>

        <div className="login-footnote">
          All admin activity is logged. Changes publish immediately.
        </div>
      </div>

      <style>{`
        .login-shell {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          position: relative;
        }
        .login-card {
          width: 100%;
          max-width: 440px;
          border: 1px solid var(--admin-line);
          background: linear-gradient(180deg, rgba(18,20,24,0.85), rgba(14,17,20,0.85));
          padding: 44px 38px 36px;
          box-shadow: var(--admin-shadow-lg);
          position: relative;
          overflow: hidden;
        }
        .login-card::before {
          content: "";
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--admin-accent), var(--admin-accent-2));
        }
        .login-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 100% 0%, color-mix(in oklch, var(--admin-accent) 14%, transparent), transparent 50%);
          pointer-events: none;
        }
        .login-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 36px;
          position: relative;
        }
        .login-brand {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: var(--admin-ink);
        }
        .login-brand span { color: var(--admin-accent); }
        .login-title {
          font-family: var(--font-display);
          font-size: 38px;
          font-weight: 400;
          letter-spacing: -0.03em;
          line-height: 1.02;
          margin: 0 0 10px;
          position: relative;
        }
        .login-sub {
          color: var(--admin-ink-3);
          font-size: 13px;
          line-height: 1.6;
          margin: 0 0 28px;
          max-width: 48ch;
          position: relative;
        }
        .login-error {
          padding: 12px 14px;
          border: 1px solid color-mix(in oklch, var(--admin-danger) 45%, transparent);
          background: color-mix(in oklch, var(--admin-danger) 8%, transparent);
          color: var(--admin-danger);
          font-size: 13px;
          margin-bottom: 20px;
          font-family: var(--font-mono);
          letter-spacing: 0.06em;
          position: relative;
        }
        .login-form { display: flex; flex-direction: column; gap: 20px; position: relative; }
        .field-block { display: flex; flex-direction: column; }
        .login-submit { width: 100%; justify-content: center; padding: 14px; font-size: 12px; letter-spacing: 0.18em; }
        .login-footnote {
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px dashed var(--admin-line);
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          color: var(--admin-ink-3);
          text-align: center;
          position: relative;
        }
      `}</style>
    </main>
  );
}
