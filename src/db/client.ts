import {drizzle, type NodePgDatabase} from 'drizzle-orm/node-postgres';
import {Pool} from 'pg';
import * as schema from './schema';

declare global {
  // eslint-disable-next-line no-var
  var __diacorp_db: NodePgDatabase<typeof schema> | undefined;
  // eslint-disable-next-line no-var
  var __diacorp_pool: Pool | undefined;
}

/**
 * Lazy DB accessor.
 *
 * The pool is created on first call so module evaluation at build time
 * doesn't explode when DATABASE_URL is unset (pages are pre-rendered
 * without the runtime env wired in).
 */
function makeDb(): NodePgDatabase<typeof schema> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  const pool = new Pool({
    connectionString: url,
    max: 10,
    idleTimeoutMillis: 30_000
  });
  globalThis.__diacorp_pool = pool;
  return drizzle(pool, {schema});
}

export const db: NodePgDatabase<typeof schema> = new Proxy(
  {} as NodePgDatabase<typeof schema>,
  {
    get(_t, prop, receiver) {
      if (!globalThis.__diacorp_db) {
        globalThis.__diacorp_db = makeDb();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return Reflect.get(globalThis.__diacorp_db as any, prop, receiver);
    }
  }
);

export {schema};
