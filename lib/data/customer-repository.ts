import { asc, eq, ilike } from 'drizzle-orm';
import { customers as seedCustomers, type Customer } from '@/lib/admin-data';
import { ensureCoreTables, getDb } from '@/lib/db/client';
import { customersTable } from '@/lib/db/schema';

export type CustomerPatch = Partial<
  Pick<Customer, 'hsmCount' | 'model' | 'engineer' | 'serials' | 'contacts'>
>;

export type NewHistoryInput = {
  title: string;
  note?: string;
};

export interface CustomerRepository {
  list(query?: string): Promise<Customer[]>;
  getById(id: string): Promise<Customer | null>;
  create(payload: { name: string }): Promise<Customer>;
  updateById(id: string, patch: CustomerPatch): Promise<Customer | null>;
  addHistory(id: string, payload: NewHistoryInput): Promise<Customer | null>;
}

export type CustomerRepositoryInfo = {
  provider: 'memory' | 'drizzle';
  table?: string;
  dbHost?: string;
};

class InMemoryCustomerRepository implements CustomerRepository {
  private data: Customer[];

  constructor(initial: Customer[]) {
    this.data = structuredClone(initial);
  }

  async list(query?: string): Promise<Customer[]> {
    if (!query) return this.data;
    const q = query.toLowerCase();
    return this.data.filter((customer) => customer.name.toLowerCase().includes(q));
  }

  async getById(id: string): Promise<Customer | null> {
    return this.data.find((customer) => customer.id === id) ?? null;
  }

  async create(payload: { name: string }): Promise<Customer> {
    const baseId = payload.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const id = `${baseId || 'customer'}-${Date.now()}`;

    const created: Customer = {
      id,
      name: payload.name.trim(),
      hsmCount: 0,
      model: '',
      serials: [],
      engineer: '',
      contacts: [],
      histories: [],
    };

    this.data.unshift(created);
    return created;
  }

  async updateById(id: string, patch: CustomerPatch): Promise<Customer | null> {
    const target = this.data.find((customer) => customer.id === id);
    if (!target) return null;

    Object.assign(target, patch);
    return target;
  }

  async addHistory(id: string, payload: NewHistoryInput): Promise<Customer | null> {
    const target = this.data.find((customer) => customer.id === id);
    if (!target) return null;

    const now = new Date();
    const dateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate(),
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    target.histories.unshift({
      dateTime,
      title: payload.title,
      note: payload.note,
    });

    return target;
  }
}

class DrizzleCustomerRepository implements CustomerRepository {
  private mapRow(row: typeof customersTable.$inferSelect): Customer {
    return {
      id: row.id,
      name: row.name,
      hsmCount: row.hsmCount,
      model: row.model,
      serials: row.serials ?? [],
      engineer: row.engineer,
      contacts: row.contacts ?? [],
      histories: row.histories ?? [],
    };
  }

  async list(query?: string): Promise<Customer[]> {
    await ensureCoreTables();
    const db = getDb();
    const rows = await db
      .select()
      .from(customersTable)
      .where(query ? ilike(customersTable.name, `%${query}%`) : undefined)
      .orderBy(asc(customersTable.name));

    return rows.map((row) => this.mapRow(row));
  }

  async getById(id: string): Promise<Customer | null> {
    await ensureCoreTables();
    const db = getDb();
    const rows = await db.select().from(customersTable).where(eq(customersTable.id, id)).limit(1);
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async create(payload: { name: string }): Promise<Customer> {
    await ensureCoreTables();
    const db = getDb();

    const baseId = payload.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const id = `${baseId || 'customer'}-${Date.now()}`;

    const rows = await db
      .insert(customersTable)
      .values({
        id,
        name: payload.name.trim(),
        hsmCount: 0,
        model: '',
        serials: [],
        engineer: '',
        contacts: [],
        histories: [],
      })
      .returning();

    return this.mapRow(rows[0]);
  }

  async updateById(id: string, patch: CustomerPatch): Promise<Customer | null> {
    await ensureCoreTables();
    const db = getDb();

    const payload: Partial<typeof customersTable.$inferInsert> = {};
    if (typeof patch.hsmCount !== 'undefined') payload.hsmCount = patch.hsmCount;
    if (typeof patch.model !== 'undefined') payload.model = patch.model;
    if (typeof patch.engineer !== 'undefined') payload.engineer = patch.engineer;
    if (typeof patch.serials !== 'undefined') payload.serials = patch.serials;
    if (typeof patch.contacts !== 'undefined') payload.contacts = patch.contacts;

    if (Object.keys(payload).length === 0) {
      return this.getById(id);
    }

    const rows = await db.update(customersTable).set(payload).where(eq(customersTable.id, id)).returning();
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async addHistory(id: string, payload: NewHistoryInput): Promise<Customer | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const now = new Date();
    const dateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate(),
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updatedHistories = [{ dateTime, title: payload.title, note: payload.note }, ...existing.histories];

    await ensureCoreTables();
    const db = getDb();
    const rows = await db
      .update(customersTable)
      .set({ histories: updatedHistories })
      .where(eq(customersTable.id, id))
      .returning();

    return rows[0] ? this.mapRow(rows[0]) : null;
  }
}

type GlobalStore = typeof globalThis & {
  __vskoCustomerRepository?: CustomerRepository;
  __vskoCustomerRepositoryInfo?: CustomerRepositoryInfo;
};

const g = globalThis as GlobalStore;

function createRepository(): { repository: CustomerRepository; info: CustomerRepositoryInfo } {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (databaseUrl) {
    return {
      repository: new DrizzleCustomerRepository(),
      info: {
        provider: 'drizzle',
        table: 'customers',
        dbHost: new URL(databaseUrl).host,
      },
    };
  }

  return {
    repository: new InMemoryCustomerRepository(seedCustomers),
    info: {
      provider: 'memory',
    },
  };
}

export function getCustomerRepository() {
  if (!g.__vskoCustomerRepository || !g.__vskoCustomerRepositoryInfo) {
    const created = createRepository();
    g.__vskoCustomerRepository = created.repository;
    g.__vskoCustomerRepositoryInfo = created.info;
  }

  return g.__vskoCustomerRepository;
}

export function getCustomerRepositoryInfo(): CustomerRepositoryInfo {
  if (!g.__vskoCustomerRepositoryInfo) {
    getCustomerRepository();
  }

  return g.__vskoCustomerRepositoryInfo ?? { provider: 'memory' };
}
