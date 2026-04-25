import Link from 'next/link';
import {redirect} from 'next/navigation';
import {db} from '@/db/client';
import {prospects, PROSPECT_STATUSES, type ProspectStatus} from '@/db/schema';
import {getSession} from '@/lib/auth';
import {STATUS_META} from '../ui';

export const dynamic = 'force-dynamic';

async function createAction(formData: FormData) {
  'use server';
  const sess = await getSession();
  if (!sess.userId) redirect('/admin/login');

  const status = String(formData.get('status') ?? 'cold') as ProspectStatus;
  const name = String(formData.get('name') ?? '').trim();
  const sector = String(formData.get('sector') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  if (!name || !sector || !city) {
    redirect('/admin/prospects/new?e=missing');
  }

  const [created] = await db
    .insert(prospects)
    .values({
      name,
      sector,
      city,
      address: emptyToNull(String(formData.get('address') ?? '')),
      estimatedMw: emptyToNull(String(formData.get('estimatedMw') ?? '')),
      energyProfile: emptyToNull(String(formData.get('energyProfile') ?? '')),
      contactName: emptyToNull(String(formData.get('contactName') ?? '')),
      contactPhone: emptyToNull(String(formData.get('contactPhone') ?? '')),
      contactEmail: emptyToNull(String(formData.get('contactEmail') ?? '')),
      website: emptyToNull(String(formData.get('website') ?? '')),
      status,
      priority: clampPriority(Number(formData.get('priority') ?? 2)),
      notes: emptyToNull(String(formData.get('notes') ?? ''))
    })
    .returning({id: prospects.id});

  redirect(`/admin/prospects/${created!.id}?saved=1`);
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

export default async function NewProspect({
  searchParams
}: {
  searchParams: Promise<{e?: string}>;
}) {
  const sess = await getSession();
  if (!sess.userId) redirect('/admin/login');
  const sp = await searchParams;

  return (
    <>
      <nav className="admin-nav">
        <div className="admin-nav-inner">
          <div>
            <div className="admin-brand">
              DiaCorp<span>.</span>Admin
            </div>
            <div className="admin-sub">New prospect</div>
          </div>
          <div style={{display: 'flex', gap: 20}}>
            <Link href="/admin/prospects" className="nav-link">
              ← All prospects
            </Link>
          </div>
        </div>
      </nav>

      <main className="admin-container" style={{maxWidth: 760}}>
        <h1 className="admin-h1">Add prospect</h1>
        <p className="admin-h1-sub">
          Saisis les informations de base. Tu pourras compléter le profil
          énergétique et le contact après.
        </p>

        {sp?.e === 'missing' && (
          <div
            style={{
              padding: 12,
              marginBottom: 16,
              border: '1px solid var(--admin-danger)',
              color: 'var(--admin-danger)',
              fontSize: 13
            }}
          >
            Name, sector and city are required.
          </div>
        )}

        <form action={createAction}>
          <div className="card">
            <h2 style={{fontFamily: 'var(--font-display)', fontSize: 18, marginTop: 0, marginBottom: 14}}>
              Identity
            </h2>
            <div className="grid-two">
              <div>
                <label className="label">Company name *</label>
                <input className="input" name="name" required autoFocus />
              </div>
              <div>
                <label className="label">Sector *</label>
                <input
                  className="input"
                  name="sector"
                  required
                  placeholder="e.g. Mining, Cement, Healthcare…"
                />
              </div>
            </div>
            <div className="grid-two" style={{marginTop: 14}}>
              <div>
                <label className="label">City *</label>
                <input className="input" name="city" required placeholder="Oujda, Nador, Berkane…" />
              </div>
              <div>
                <label className="label">Address</label>
                <input className="input" name="address" placeholder="Zone industrielle…" />
              </div>
            </div>
            <div style={{marginTop: 14}}>
              <label className="label">Website</label>
              <input className="input" name="website" placeholder="https://" />
            </div>
          </div>

          <div className="card">
            <h2 style={{fontFamily: 'var(--font-display)', fontSize: 18, marginTop: 0, marginBottom: 14}}>
              Energy + status
            </h2>
            <div className="grid-two">
              <div>
                <label className="label">Estimated demand</label>
                <input className="input" name="estimatedMw" placeholder="1–3 MW, 5 MW…" />
              </div>
              <div>
                <label className="label">Priority</label>
                <select className="input" name="priority" defaultValue="2">
                  <option value="1">★★★ High</option>
                  <option value="2">★★ Medium</option>
                  <option value="3">★ Low</option>
                </select>
              </div>
            </div>
            <div style={{marginTop: 14}}>
              <label className="label">Energy profile</label>
              <textarea
                className="textarea"
                name="energyProfile"
                rows={3}
                placeholder="Pourquoi ce site est intéressant — usage 24/7, pic, exposition CBAM, etc."
              />
            </div>
            <div style={{marginTop: 14}}>
              <label className="label">Initial status</label>
              <select className="input" name="status" defaultValue="cold">
                {PROSPECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="card">
            <h2 style={{fontFamily: 'var(--font-display)', fontSize: 18, marginTop: 0, marginBottom: 14}}>
              Contact (optional)
            </h2>
            <div className="grid-two">
              <div>
                <label className="label">Contact name</label>
                <input className="input" name="contactName" />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" name="contactPhone" placeholder="+212 …" />
              </div>
            </div>
            <div style={{marginTop: 14}}>
              <label className="label">Email</label>
              <input className="input" type="email" name="contactEmail" />
            </div>
          </div>

          <div className="card">
            <label className="label">Notes (private)</label>
            <textarea
              className="textarea"
              name="notes"
              rows={4}
              placeholder="Notes internes pour les prochaines étapes…"
            />
          </div>

          <div style={{display: 'flex', gap: 10, marginTop: 20}}>
            <button type="submit" className="btn btn-primary">
              Create prospect
            </button>
            <Link href="/admin/prospects" className="btn">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}
