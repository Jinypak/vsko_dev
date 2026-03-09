import { customers as seedCustomers, type Customer } from '@/lib/admin-data';

export type CustomerPatch = Partial<Pick<Customer, 'hsmCount' | 'model' | 'engineer' | 'serials' | 'contacts'>>;

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

type GlobalStore = typeof globalThis & {
  __vskoCustomerRepository?: CustomerRepository;
};

const g = globalThis as GlobalStore;

function createRepository(): CustomerRepository {
  const provider = process.env.DATA_PROVIDER ?? 'memory';

  if (provider === 'memory') {
    return new InMemoryCustomerRepository(seedCustomers);
  }

  // TODO: DATA_PROVIDER=prisma 또는 supabase 일 때 실제 DB 리포지토리 구현 연결
  return new InMemoryCustomerRepository(seedCustomers);
}

export function getCustomerRepository() {
  if (!g.__vskoCustomerRepository) {
    g.__vskoCustomerRepository = createRepository();
  }

  return g.__vskoCustomerRepository;
}
