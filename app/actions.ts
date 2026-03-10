'use server';

import { neon } from '@neondatabase/serverless';

type CustomerRow = {
  id: string;
  name: string;
  hsm_count: number;
  model: string;
  engineer: string;
};

export async function getData(query?: string) {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured.');
  }

  const sql = neon(databaseUrl);
  const keyword = (query ?? '').trim();

  if (!keyword) {
    return sql<CustomerRow[]>`
      SELECT id, name, hsm_count, model, engineer
      FROM customers
      ORDER BY name ASC
      LIMIT 100;
    `;
  }

  return sql<CustomerRow[]>`
    SELECT id, name, hsm_count, model, engineer
    FROM customers
    WHERE name ILIKE ${`%${keyword}%`}
    ORDER BY name ASC
    LIMIT 100;
  `;
}
