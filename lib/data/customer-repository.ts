import { customers as seedCustomers, type Customer } from '@/lib/admin-data';

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
  updateById(id: string, patch: CustomerPatch): Promise<Customer | null>;
  addHistory(id: string, payload: NewHistoryInput): Promise<Customer | null>;
}

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

type SupabaseCustomerRow = {
  id: string;
  name: string;
  hsm_count: number;
  model: string;
  serials: string[];
  engineer: string;
  contacts: Customer['contacts'];
  histories: Customer['histories'];
};

class SupabaseCustomerRepository implements CustomerRepository {
  constructor(
    private readonly url: string,
    private readonly anonKey: string,
    private readonly table: string,
  ) {}

  private headers() {
    return {
      apikey: this.anonKey,
      Authorization: `Bearer ${this.anonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    };
  }

  private mapRow(row: SupabaseCustomerRow): Customer {
    return {
      id: row.id,
      name: row.name,
      hsmCount: row.hsm_count,
      model: row.model,
      serials: row.serials ?? [],
      engineer: row.engineer,
      contacts: row.contacts ?? [],
      histories: row.histories ?? [],
    };
  }

  async list(query?: string): Promise<Customer[]> {
    const search = query
      ? `?select=*&name=ilike.*${encodeURIComponent(query)}*&order=name.asc`
      : '?select=*&order=name.asc';

    const response = await fetch(`${this.url}/rest/v1/${this.table}${search}`, {
      headers: this.headers(),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Supabase list failed: ${response.status}`);
    }

    const rows = (await response.json()) as SupabaseCustomerRow[];
    return rows.map((row) => this.mapRow(row));
  }

  async getById(id: string): Promise<Customer | null> {
    const response = await fetch(
      `${this.url}/rest/v1/${this.table}?select=*&id=eq.${encodeURIComponent(id)}&limit=1`,
      {
        headers: this.headers(),
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      throw new Error(`Supabase getById failed: ${response.status}`);
    }

    const rows = (await response.json()) as SupabaseCustomerRow[];
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async updateById(id: string, patch: CustomerPatch): Promise<Customer | null> {
    const payload: Partial<SupabaseCustomerRow> = {};

    if (typeof patch.hsmCount !== 'undefined') payload.hsm_count = patch.hsmCount;
    if (typeof patch.model !== 'undefined') payload.model = patch.model;
    if (typeof patch.engineer !== 'undefined') payload.engineer = patch.engineer;
    if (typeof patch.serials !== 'undefined') payload.serials = patch.serials;
    if (typeof patch.contacts !== 'undefined') payload.contacts = patch.contacts;

    const response = await fetch(
      `${this.url}/rest/v1/${this.table}?id=eq.${encodeURIComponent(id)}&select=*`,
      {
        method: 'PATCH',
        headers: this.headers(),
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error(`Supabase updateById failed: ${response.status}`);
    }

    const rows = (await response.json()) as SupabaseCustomerRow[];
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async addHistory(id: string, payload: NewHistoryInput): Promise<Customer | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const now = new Date();
    const dateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate(),
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updatedHistories = [
      { dateTime, title: payload.title, note: payload.note },
      ...existing.histories,
    ];

    const response = await fetch(
      `${this.url}/rest/v1/${this.table}?id=eq.${encodeURIComponent(id)}&select=*`,
      {
        method: 'PATCH',
        headers: this.headers(),
        body: JSON.stringify({ histories: updatedHistories }),
      },
    );

    if (!response.ok) {
      throw new Error(`Supabase addHistory failed: ${response.status}`);
    }

    const rows = (await response.json()) as SupabaseCustomerRow[];
    return rows[0] ? this.mapRow(rows[0]) : null;
  }
}

type GlobalStore = typeof globalThis & {
  __vskoCustomerRepository?: CustomerRepository;
};

const g = globalThis as GlobalStore;

function createRepository(): CustomerRepository {
  const provider = process.env.DATA_PROVIDER ?? 'memory';

  if (provider === 'supabase') {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
    const table = process.env.SUPABASE_CUSTOMERS_TABLE ?? 'customers';

    if (!supabaseUrl || !supabaseAnonKey) {
      return new InMemoryCustomerRepository(seedCustomers);
    }

    return new SupabaseCustomerRepository(supabaseUrl, supabaseAnonKey, table);
  }

  // TODO: DATA_PROVIDER=prisma 구현 연결
  return new InMemoryCustomerRepository(seedCustomers);
}

export function getCustomerRepository() {
  if (!g.__vskoCustomerRepository) {
    g.__vskoCustomerRepository = createRepository();
  }

  return g.__vskoCustomerRepository;
}
