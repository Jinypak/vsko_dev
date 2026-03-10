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

export async function ensureCoreTables() {
  if (g.__vskoCoreTablesReady) return;

  const db = getDb();

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS customers (
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

  await db.execute(sql`
    ALTER TABLE customers
      ADD COLUMN IF NOT EXISTS hsm_count integer NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS model text NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS serials jsonb NOT NULL DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS engineer text NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS contacts jsonb NOT NULL DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS histories jsonb NOT NULL DEFAULT '[]'::jsonb;
  `);

  await db.execute(sql`
    UPDATE customers
    SET histories = (
      SELECT COALESCE(jsonb_agg(
        CASE
          WHEN jsonb_typeof(h) = 'object' AND NOT (h ? 'category')
            THEN h || jsonb_build_object('category', 'etc')
          ELSE h
        END
      ), '[]'::jsonb)
      FROM jsonb_array_elements(histories) AS t(h)
    )
    WHERE histories IS NOT NULL;
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS customers_name_idx ON customers (name);
  `);

  await db.execute(sql`
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS customers_name_trgm_idx ON customers USING gin (name gin_trgm_ops);
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS traffic_events (
      id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      path text NOT NULL,
      visited_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  g.__vskoCoreTablesReady = true;
}
