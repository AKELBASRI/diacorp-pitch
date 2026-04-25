import {revalidatePath} from 'next/cache';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {eq} from 'drizzle-orm';
import {db} from '@/db/client';
import {siteSettings, DEFAULT_SITE_SETTINGS, type SiteSettings} from '@/db/schema';
import {getSession} from '@/lib/auth';
import {getSiteSettings} from '@/lib/settings';

export const dynamic = 'force-dynamic';

async function saveAction(formData: FormData) {
  'use server';
  const sess = await getSession();
  if (!sess.userId) redirect('/admin/login');

  const heroImageUrl = String(formData.get('heroImageUrl') ?? '').trim();
  const next: SiteSettings = {
    brandColor: String(formData.get('brandColor') ?? DEFAULT_SITE_SETTINGS.brandColor),
    accentSpark: String(formData.get('accentSpark') ?? DEFAULT_SITE_SETTINGS.accentSpark),
    heroImageUrl: heroImageUrl === '' ? null : heroImageUrl,
    logoText: String(formData.get('logoText') ?? DEFAULT_SITE_SETTINGS.logoText),
    tagline: String(formData.get('tagline') ?? ''),
    showPartnersMarquee: formData.get('showPartnersMarquee') === 'on',
    showAnchorLoi: formData.get('showAnchorLoi') === 'on',
    showImpactStrip: formData.get('showImpactStrip') === 'on',
    contactEmail: String(formData.get('contactEmail') ?? DEFAULT_SITE_SETTINGS.contactEmail),
    theme: (['dark', 'light', 'auto'] as const).includes(
      formData.get('theme') as 'dark' | 'light' | 'auto'
    )
      ? (formData.get('theme') as 'dark' | 'light' | 'auto')
      : 'dark'
  };

  await db
    .insert(siteSettings)
    .values({scope: 'global', data: next, updatedBy: sess.email ?? String(sess.userId)})
    .onConflictDoUpdate({
      target: siteSettings.scope,
      set: {data: next, updatedAt: new Date(), updatedBy: sess.email ?? String(sess.userId)}
    });

  revalidatePath('/', 'layout');
  redirect('/admin/settings?saved=1');
}

export default async function SettingsPage({
  searchParams
}: {
  searchParams: Promise<{saved?: string}>;
}) {
  const sess = await getSession();
  if (!sess.userId) redirect('/admin/login');
  const sp = await searchParams;
  const s = await getSiteSettings();

  return (
    <>
      <nav className="admin-nav">
        <div className="admin-nav-inner">
          <div>
            <div className="admin-brand">
              DiaCorp<span>.</span>Admin
            </div>
            <div className="admin-sub">Site settings</div>
          </div>
          <div style={{display: 'flex', gap: 20, alignItems: 'center'}}>
            <Link href="/admin" className="nav-link">
              Content
            </Link>
            <Link href="/admin/layout" className="nav-link">
              Layout
            </Link>
            <Link href="/admin/prospects" className="nav-link">
              Prospects
            </Link>
            <Link href="/admin/settings" className="nav-link" style={{color: 'var(--admin-accent)', borderBottomColor: 'var(--admin-accent)'}}>
              Site settings
            </Link>
            <a href="/fr" target="_blank" className="nav-link">
              View site ↗
            </a>
          </div>
        </div>
      </nav>

      <main className="admin-container">
        <h1
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            marginBottom: 6
          }}
        >
          Global site settings
        </h1>
        <p className="hint" style={{marginBottom: 28}}>
          These apply site-wide. Save publishes live in ~2 seconds.
        </p>

        {sp?.saved === '1' && (
          <div
            style={{
              padding: 12,
              marginBottom: 18,
              border: '1px solid #1f8f78',
              background: '#1f8f7811',
              color: '#56f0c8',
              fontSize: 13
            }}
          >
            ✓ Settings saved & published.
          </div>
        )}

        <form action={saveAction}>
          <div className="card">
            <h2 style={{fontSize: 16, marginBottom: 14}}>Brand</h2>
            <div className="grid-two">
              <div>
                <label className="label">Brand color (primary)</label>
                <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                  <input
                    type="color"
                    name="brandColor"
                    defaultValue={s.brandColor}
                    style={{
                      width: 46,
                      height: 40,
                      border: '1px solid #2a2d33',
                      background: '#0a0b0d',
                      padding: 2,
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    className="input"
                    defaultValue={s.brandColor}
                    readOnly
                    style={{flex: 1}}
                  />
                </div>
                <p className="hint" style={{fontSize: 11, marginTop: 4}}>
                  Used on CTAs, highlights, kickers, hero accent.
                </p>
              </div>
              <div>
                <label className="label">Secondary accent</label>
                <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                  <input
                    type="color"
                    name="accentSpark"
                    defaultValue={s.accentSpark}
                    style={{
                      width: 46,
                      height: 40,
                      border: '1px solid #2a2d33',
                      background: '#0a0b0d',
                      padding: 2,
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    className="input"
                    defaultValue={s.accentSpark}
                    readOnly
                    style={{flex: 1}}
                  />
                </div>
                <p className="hint" style={{fontSize: 11, marginTop: 4}}>
                  Used on stats, graph pulses, subtle details.
                </p>
              </div>
            </div>

            <div style={{marginTop: 16}}>
              <label className="label">Logo text</label>
              <input
                type="text"
                name="logoText"
                className="input"
                defaultValue={s.logoText}
              />
            </div>
            <div style={{marginTop: 16}}>
              <label className="label">Footer tagline</label>
              <input
                type="text"
                name="tagline"
                className="input"
                defaultValue={s.tagline}
              />
            </div>
            <div style={{marginTop: 16}}>
              <label className="label">Contact email</label>
              <input
                type="email"
                name="contactEmail"
                className="input"
                defaultValue={s.contactEmail}
              />
            </div>
          </div>

          <div className="card">
            <h2 style={{fontSize: 16, marginBottom: 14}}>Hero</h2>
            <label className="label">Hero background image URL (optional)</label>
            <input
              type="url"
              name="heroImageUrl"
              className="input"
              placeholder="https://example.com/hero.jpg — leave empty to use default SVG"
              defaultValue={s.heroImageUrl ?? ''}
            />
            <p className="hint" style={{fontSize: 11, marginTop: 6}}>
              Paste a public URL (e.g. Unsplash, Cloudflare Images). Tip: aerial
              solar-panel photos work well. Use 2400×1200 or larger.
            </p>
          </div>

          <div className="card">
            <h2 style={{fontSize: 16, marginBottom: 14}}>Sections visibility</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              <Toggle name="showImpactStrip" label="Impact strip" defaultChecked={s.showImpactStrip} />
              <Toggle name="showAnchorLoi" label="Anchor offtaker spotlight (Taza)" defaultChecked={s.showAnchorLoi} />
              <Toggle name="showPartnersMarquee" label="Partners marquee (infinite scroll strip)" defaultChecked={s.showPartnersMarquee} />
            </div>
          </div>

          <div className="card">
            <h2 style={{fontSize: 16, marginBottom: 14}}>Theme</h2>
            <label className="label">Default theme</label>
            <div style={{display: 'flex', gap: 10}}>
              {(['dark', 'light', 'auto'] as const).map((th) => (
                <label key={th} style={{display: 'inline-flex', gap: 6, alignItems: 'center'}}>
                  <input type="radio" name="theme" value={th} defaultChecked={s.theme === th} />
                  <span style={{fontSize: 13, textTransform: 'capitalize'}}>{th}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{display: 'flex', gap: 12, marginTop: 28}}>
            <button type="submit" className="btn btn-primary">
              Save & publish
            </button>
            <Link href="/admin" className="btn">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}

function Toggle({
  name,
  label,
  defaultChecked
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label style={{display: 'inline-flex', gap: 10, alignItems: 'center'}}>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <span style={{fontSize: 14}}>{label}</span>
    </label>
  );
}
