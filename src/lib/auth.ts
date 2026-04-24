import {cookies} from 'next/headers';
import {getIronSession, type SessionOptions} from 'iron-session';
import {eq} from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import {db} from '@/db/client';
import {users} from '@/db/schema';

export type AdminSession = {
  userId?: number;
  email?: string;
  role?: string;
};

function sessionOptions(): SessionOptions {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET is missing or shorter than 32 chars');
  }
  return {
    cookieName: 'diacorp_admin',
    password: secret,
    cookieOptions: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    },
    ttl: 60 * 60 * 12 // 12h
  };
}

export async function getSession() {
  const store = await cookies();
  return getIronSession<AdminSession>(store, sessionOptions());
}

export async function requireAdmin(): Promise<AdminSession> {
  const sess = await getSession();
  if (!sess.userId || sess.role !== 'admin') {
    throw new Error('Not authenticated');
  }
  return sess;
}

export async function verifyCredentials(email: string, password: string) {
  const [row] = await db
    .select({
      id: users.id,
      email: users.email,
      passwordHash: users.passwordHash,
      role: users.role
    })
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);
  if (!row) return null;
  const ok = await bcrypt.compare(password, row.passwordHash);
  if (!ok) return null;
  return {id: row.id, email: row.email, role: row.role};
}
