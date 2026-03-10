import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

type GlobalStore = typeof globalThis & {
  __vskoSqlClient?: ReturnType<typeof postgres>;
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
