import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

type GlobalStore = typeof globalThis & {
  __vskoSqlClient?: ReturnType<typeof postgres>;
  __vskoCoreTablesReady?: boolean;
};

const g = globalThis as GlobalStore;

export function getDb() {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error('[db] DATABASE_URL is missing. Set Neon pooled/direct connection string.');
  }

  if (!g.__vskoSqlClient) {
    g.__vskoSqlClient = postgres(connectionString, {
      max: 5,
      prepare: false,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }

  return drizzle(g.__vskoSqlClient, { schema });
}

async function tableExists(tableName: 'customers' | 'traffic_events') {
  const db = getDb();
  const result = await db.execute<{ exists: string | null }>(
    sql`SELECT to_regclass(${`public.${tableName}`}) as exists`,
  );

  return Boolean(result[0]?.exists);
}

export async function ensureCoreTables() {
  if (g.__vskoCoreTablesReady) return;

  const db = getDb();

  const hasCustomers = await tableExists('customers');
  if (!hasCustomers) {
    await db.execute(sql`
      CREATE TABLE customers (
        id text PRIMARY KEY,
        name text NOT NULL,
        hsm_count integer NOT NULL DEFAULT 0,
        model text NOT NULL DEFAULT '',
        serials jsonb NOT NULL DEFAULT '[]'::jsonb,
        engineer text NOT NULL DEFAULT '',
        contacts jsonb NOT NULL DEFAULT '[]'::jsonb,
        histories jsonb NOT NULL DEFAULT '[]'::jsonb
      );
    `);
  }

  const hasTrafficEvents = await tableExists('traffic_events');
  if (!hasTrafficEvents) {
    await db.execute(sql`
      CREATE TABLE traffic_events (
        id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        path text NOT NULL,
        visited_at timestamptz NOT NULL DEFAULT now()
      );
    `);
  }

  g.__vskoCoreTablesReady = true;
}
