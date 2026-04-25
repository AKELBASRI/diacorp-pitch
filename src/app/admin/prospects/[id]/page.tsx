import Link from 'next/link';
import {notFound, redirect} from 'next/navigation';
import {eq} from 'drizzle-orm';
import {db} from '@/db/client';
import {
  prospects,
  PROSPECT_STATUSES,
  type ProspectStatus
} from '@/db/schema';
import {getSession} from '@/lib/auth';
import {STATUS_META, mapsUrl} from '../ui';
import {DeleteForm} from './delete-form';

export const dynamic = 'force-dynamic';

async function saveAction(formData: FormData) {
  'use server';
  const sess = await getSession();
  if (!sess.userId) redirect('/admin/login');

  const id = Number(formData.get('__id'));
  if (!id) throw new Error('missing id');

  const status = String(formData.get('status') ?? 'cold') as ProspectStatus;
  const wasVisited = formData.get('was_visited') === '1';
  const wasContacted = formData.get('was_contacted') === '1';

  await db
    .update(prospects)
    .set({
      name: String(formData.get('name') ?? '').trim(),
      sector: String(formData.get('sector') ?? '').trim(),
      city: String(formData.get('city') ?? '').trim(),
      address: emptyToNull(String(formData.get('address') ?? '')),
      estimatedMw: emptyToNull(String(formData.get('estimatedMw') ?? '')),
      energyProfile: emptyToNull(String(formData.get('energyProfile') ?? '')),
      contactName: emptyToNull(String(formData.get('contactName') ?? '')),
      contactPhone: emptyToNull(String(formData.get('contactPhone') ?? '')),
      contactEmail: emptyToNull(String(formData.get('contactEmail') ?? '')),
      website: emptyToNull(String(formData.get('website') ?? '')),
      status,
      priority: clampPriority(Number(formData.get('priority') ?? 2)),
      notes: emptyToNull(String(formData.get('notes') ?? '')),
      visitedAt:
        status === 'visited' && !wasVisited
          ? new Date()
          : undefined,
      lastContactedAt:
        status !== 'cold' && !wasContacted ? new Date() : undefined,
      updatedAt: new Date()
    })
    .where(eq(prospects.id, id));

  redirect(`/admin/prospects/${id}?saved=1`);
}

async function deleteAction(formData: FormData) {
  'use server';
  const sess = await getSession();
  if (!sess.userId) redirect('/admin/login');
  const id = Number(formData.get('__id'));
  if (!id) throw new Error('missing id');
  await db.delete(prospects).where(eq(prospects.id, id));
  redirect('/admin/prospects');
}

async function quickStatusAction(formData: FormData) {
  'use server';
  const sess = await getSession();
  if (!sess.userId) redirect('/admin/login');
  const id = Number(formData.get('__id'));
  const next = String(formData.get('next_status')) as ProspectStatus;
  if (!id || !PROSPECT_STATUSES.includes(next)) throw new Error('bad input');
  await db
    .update(prospects)
    .set({
      status: next,
      visitedAt: next === 'visited' ? new Date() : undefined,
      lastContactedAt: next !== 'cold' ? new Date() : undefined,
      updatedAt: new Date()
    })
    .where(eq(prospects.id, id));
  redirect(`/admin/prospects/${id}?saved=1`);
}

function emptyToNull(s: string): string | null {
  const t = s.trim();
  return t === '' ? null : t;
}
function clampPriority(n: number): number {
  if (n <= 1) return 1;
  if (n >= 3) return 3;
  return 2;
}

export default async function ProspectDetail({
  params,
  searchParams
}: {
  params: Promise<{id: string}>;
  searchParams: Promise<{saved?: string}>;
}) {
  const sess = await getSession();
  if (!sess.userId) redirect('/admin/login');
  const {id} = await params;
  const sp = await searchParams;
  const numId = Number(id);
  if (!Number.isFinite(numId)) notFound();

  const [p] = await db.select().from(prospects).where(eq(prospects.id, numId)).limit(1);
  if (!p) notFound();

  return (
    <>
      <nav className="admin-nav">
        <div className="admin-nav-inner">
          <div>
            <div className="admin-brand">
              DiaCorp<span>.</span>Admin
            </div>
            <div className="admin-sub">{p.name}</div>
          </div>
          <div style={{display: 'flex', gap: 20}}>
            <Link href="/admin/prospects" className="nav-link">
              ← All prospects
            </Link>
            <a
              href={mapsUrl(p.name, p.address ?? p.city)}
              target="_blank"
              rel="noopener"
              className="nav-link"
            >
              Open in Google Maps ↗
            </a>
          </div>
        </div>
      </nav>

      <main className="admin-container" style={{maxWidth: 980}}>
        <h1 className="admin-h1">{p.name}</h1>
        <p className="admin-h1-sub">
          Édite les informations de ce prospect. Statut, notes et adresse sont
          actualisés à chaque visite terrain.
        </p>

        {sp?.saved === '1' && (
          <div
            style={{
              padding: 12,
              marginBottom: 18,
              border: '1px solid var(--admin-accent-2)',
              background: 'color-mix(in oklch, var(--admin-accent-2) 8%, transparent)',
              color: 'var(--admin-accent-2)',
              fontSize: 13,
              fontFamily: 'var(--font-mono)'
            }}
          >
            ✓ Prospect saved.
          </div>
        )}

        {/* Quick status pipeline */}
        <div className="quick-status">
          <div className="qs-label">Quick status</div>
          <div className="qs-buttons">
            {PROSPECT_STATUSES.map((s) => {
              const meta = STATUS_META[s];
              const active = p.status === s;
              return (
                <form key={s} action={quickStatusAction} style={{display: 'inline'}}>
                  <input type="hidden" name="__id" value={p.id} />
                  <input type="hidden" name="next_status" value={s} />
                  <button
                    type="submit"
                    className={`qs-btn ${active ? 'is-active' : ''}`}
                    style={{['--qs-color' as string]: meta.color}}
                  >
                    {meta.label}
                  </button>
                </form>
              );
            })}
          </div>
        </div>

        {/* Main form */}
        <form action={saveAction} className="prospect-form">
          <input type="hidden" name="__id" value={p.id} />
          <input type="hidden" name="was_visited" value={p.visitedAt ? '1' : '0'} />
          <input type="hidden" name="was_contacted" value={p.lastContactedAt ? '1' : '0'} />

          <div className="card">
            <h2 className="form-section-title">Identity</h2>
            <div className="grid-two">
              <div>
                <label className="label">Company name</label>
                <input className="input" name="name" defaultValue={p.name} required />
              </div>
              <div>
                <label className="label">Sector</label>
                <input className="input" name="sector" defaultValue={p.sector} required />
              </div>
            </div>
            <div className="grid-two" style={{marginTop: 14}}>
              <div>
                <label className="label">City</label>
                <input className="input" name="city" defaultValue={p.city} required />
              </div>
              <div>
                <label className="label">Address (verify on Google Maps)</label>
                <input
                  className="input"
                  name="address"
                  defaultValue={p.address ?? ''}
                  placeholder="Zone industrielle, route, repère…"
                />
              </div>
            </div>
            <div style={{marginTop: 14}}>
              <label className="label">Website</label>
              <input
                className="input"
                name="website"
                defaultValue={p.website ?? ''}
                placeholder="https://"
              />
            </div>
          </div>

          <div className="card">
            <h2 className="form-section-title">Energy profile</h2>
            <div className="grid-two">
              <div>
                <label className="label">Estimated demand</label>
                <input
                  className="input"
                  name="estimatedMw"
                  defaultValue={p.estimatedMw ?? ''}
                  placeholder="e.g. 1–3 MW, 5 MW, etc."
                />
              </div>
              <div>
                <label className="label">Priority</label>
                <select className="input" name="priority" defaultValue={String(p.priority)}>
                  <option value="1">★★★ High</option>
                  <option value="2">★★ Medium</option>
                  <option value="3">★ Low</option>
                </select>
              </div>
            </div>
            <div style={{marginTop: 14}}>
              <label className="label">Energy use profile</label>
              <textarea
                className="textarea"
                name="energyProfile"
                defaultValue={p.energyProfile ?? ''}
                placeholder="Pourquoi ce site est un bon prospect — usage, pic, contraintes…"
                rows={3}
              />
            </div>
          </div>

          <div className="card">
            <h2 className="form-section-title">Contact</h2>
            <div className="grid-two">
              <div>
                <label className="label">Contact name</label>
                <input
                  className="input"
                  name="contactName"
                  defaultValue={p.contactName ?? ''}
                  placeholder="Directeur Technique, Responsable Énergie…"
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  className="input"
                  name="contactPhone"
                  defaultValue={p.contactPhone ?? ''}
                  placeholder="+212 …"
                />
              </div>
            </div>
            <div style={{marginTop: 14}}>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                name="contactEmail"
                defaultValue={p.contactEmail ?? ''}
              />
            </div>
          </div>

          <div className="card">
            <h2 className="form-section-title">Pipeline</h2>
            <div className="grid-two">
              <div>
                <label className="label">Status</label>
                <select className="input" name="status" defaultValue={p.status}>
                  {PROSPECT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_META[s].label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Last contacted / visited</label>
                <div
                  style={{
                    padding: 10,
                    border: '1px solid var(--admin-line)',
                    color: 'var(--admin-ink-3)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    background: 'rgba(8,9,11,0.4)'
                  }}
                >
                  {p.lastContactedAt
                    ? new Date(p.lastContactedAt).toLocaleString('en-GB', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })
                    : '— jamais contacté —'}
                  {p.visitedAt && (
                    <div style={{marginTop: 4, color: 'var(--admin-accent-2)'}}>
                      Visité le {new Date(p.visitedAt).toLocaleDateString('en-GB')}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={{marginTop: 14}}>
              <label className="label">Notes (private)</label>
              <textarea
                className="textarea"
                name="notes"
                defaultValue={p.notes ?? ''}
                placeholder="Échange du 14/04 avec le DT, blocage budget Q3, attente nouvelle réunion octobre…"
                rows={4}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save prospect
            </button>
            <Link href="/admin/prospects" className="btn">
              Cancel
            </Link>
            <span style={{flex: 1}} />
            <DeleteForm id={p.id} action={deleteAction} />
          </div>
        </form>

        <style>{`
          .quick-status {
            display: flex; align-items: center; gap: 18px;
            padding: 16px 0 22px;
            border-bottom: 1px solid var(--admin-line);
            margin-bottom: 24px;
            flex-wrap: wrap;
          }
          .qs-label {
            font-family: var(--font-mono);
            font-size: 10px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--admin-ink-3);
          }
          .qs-buttons { display: flex; gap: 6px; flex-wrap: wrap; }
          .qs-btn {
            padding: 8px 14px;
            background: transparent;
            border: 1px solid var(--admin-line-strong);
            color: var(--admin-ink-2);
            font-family: var(--font-mono);
            font-size: 10px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all .2s ease;
          }
          .qs-btn:hover {
            border-color: var(--qs-color);
            color: var(--qs-color);
          }
          .qs-btn.is-active {
            background: var(--qs-color);
            border-color: var(--qs-color);
            color: var(--admin-bg);
          }
          .form-section-title {
            font-family: var(--font-display);
            font-size: 18px;
            font-weight: 500;
            letter-spacing: -0.01em;
            margin: 0 0 14px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--admin-line);
          }
          .form-actions {
            display: flex; gap: 10px; align-items: center;
            margin-top: 24px;
            padding: 14px 0;
            border-top: 1px solid var(--admin-line);
            position: sticky;
            bottom: 0;
            background: linear-gradient(180deg, rgba(8,9,11,0.4), rgba(8,9,11,0.95));
            backdrop-filter: blur(12px);
          }
        `}</style>
      </main>
    </>
  );
}

