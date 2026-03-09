export type TrafficEvent = {
  path: string;
  visitedAt: string;
};

export type DailyVisit = {
  date: string;
  count: number;
};

export type TopPage = {
  path: string;
  count: number;
};

export type TrafficSummary = {
  totalVisits: number;
  todayVisits: number;
  last7DaysVisits: number;
  uniquePathsLast7Days: number;
  topPagesLast7Days: TopPage[];
  dailyVisitsLast7Days: DailyVisit[];
};

export interface TrafficRepository {
  track(path: string): Promise<void>;
  getSummary(): Promise<TrafficSummary>;
}

class InMemoryTrafficRepository implements TrafficRepository {
  private readonly events: TrafficEvent[] = [];

  async track(path: string) {
    this.events.push({
      path,
      visitedAt: new Date().toISOString(),
    });
  }

  async getSummary(): Promise<TrafficSummary> {
    return summarizeEvents(this.events);
  }
}

type SupabaseTrafficRow = {
  path: string;
  visited_at: string;
};

<<<<<<< codex/redesign-company-website-completely-ghx3mq
async function parseSupabaseError(response: Response) {
  const fallback = `status=${response.status}`;

  try {
    const payload = (await response.json()) as { message?: string; hint?: string; code?: string };
    return [payload.code, payload.message, payload.hint].filter(Boolean).join(' | ') || fallback;
  } catch {
    return fallback;
  }
}

class SupabaseTrafficRepository implements TrafficRepository {
  constructor(
    private readonly url: string,
    private readonly key: string,
=======
class SupabaseTrafficRepository implements TrafficRepository {
  constructor(
    private readonly url: string,
    private readonly anonKey: string,
>>>>>>> main
    private readonly table: string,
  ) {}

  private headers() {
    return {
<<<<<<< codex/redesign-company-website-completely-ghx3mq
      apikey: this.key,
      Authorization: `Bearer ${this.key}`,
=======
      apikey: this.anonKey,
      Authorization: `Bearer ${this.anonKey}`,
>>>>>>> main
      'Content-Type': 'application/json',
    };
  }

  async track(path: string): Promise<void> {
    const response = await fetch(`${this.url}/rest/v1/${this.table}`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
<<<<<<< codex/redesign-company-website-completely-ghx3mq
      throw new Error(`Supabase traffic track failed: ${await parseSupabaseError(response)}`);
=======
      throw new Error(`Supabase traffic track failed: ${response.status}`);
>>>>>>> main
    }
  }

  async getSummary(): Promise<TrafficSummary> {
    const from = startOfDayBefore(6).toISOString();
    const response = await fetch(
      `${this.url}/rest/v1/${this.table}?select=path,visited_at&visited_at=gte.${encodeURIComponent(from)}&order=visited_at.asc`,
      {
        headers: this.headers(),
        cache: 'no-store',
      },
    );

    if (!response.ok) {
<<<<<<< codex/redesign-company-website-completely-ghx3mq
      throw new Error(`Supabase traffic summary failed: ${await parseSupabaseError(response)}`);
=======
      throw new Error(`Supabase traffic summary failed: ${response.status}`);
>>>>>>> main
    }

    const rows = (await response.json()) as SupabaseTrafficRow[];
    const events: TrafficEvent[] = rows.map((row) => ({
      path: row.path,
      visitedAt: row.visited_at,
    }));

    return summarizeEvents(events);
  }
}

function toKstDateString(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
}

function startOfDayBefore(daysAgo: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date;
}

function summarizeEvents(events: TrafficEvent[]): TrafficSummary {
  const today = toKstDateString(new Date());
  const dateKeys = Array.from({ length: 7 }, (_, i) => toKstDateString(startOfDayBefore(6 - i)));

  const dailyCountMap = new Map<string, number>(dateKeys.map((key) => [key, 0]));
  const pageCountMap = new Map<string, number>();

  let todayVisits = 0;

  for (const event of events) {
    const dateKey = toKstDateString(event.visitedAt);

    if (!dailyCountMap.has(dateKey)) {
      continue;
    }

    dailyCountMap.set(dateKey, (dailyCountMap.get(dateKey) ?? 0) + 1);
    pageCountMap.set(event.path, (pageCountMap.get(event.path) ?? 0) + 1);

    if (dateKey === today) {
      todayVisits += 1;
    }
  }

  const dailyVisitsLast7Days = dateKeys.map((date) => ({
    date,
    count: dailyCountMap.get(date) ?? 0,
  }));

  const topPagesLast7Days = Array.from(pageCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, count]) => ({ path, count }));

  const last7DaysVisits = dailyVisitsLast7Days.reduce((acc, item) => acc + item.count, 0);

  return {
    totalVisits: events.length,
    todayVisits,
    last7DaysVisits,
    uniquePathsLast7Days: pageCountMap.size,
    topPagesLast7Days,
    dailyVisitsLast7Days,
  };
}

type GlobalStore = typeof globalThis & {
  __vskoTrafficRepository?: TrafficRepository;
};

const g = globalThis as GlobalStore;

<<<<<<< codex/redesign-company-website-completely-ghx3mq
function resolveSupabaseConnection() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  return { url, key };
}

=======
>>>>>>> main
function createRepository(): TrafficRepository {
  const provider = (process.env.DATA_PROVIDER ?? 'memory').toLowerCase();

  if (provider === 'supabase') {
<<<<<<< codex/redesign-company-website-completely-ghx3mq
    const { url, key } = resolveSupabaseConnection();

    if (url && key) {
      return new SupabaseTrafficRepository(url, key, process.env.SUPABASE_TRAFFIC_TABLE ?? 'traffic_events');
=======
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      return new SupabaseTrafficRepository(
        supabaseUrl,
        supabaseAnonKey,
        process.env.SUPABASE_TRAFFIC_TABLE ?? 'traffic_events',
      );
>>>>>>> main
    }
  }

  return new InMemoryTrafficRepository();
}

export function getTrafficRepository() {
  if (!g.__vskoTrafficRepository) {
    g.__vskoTrafficRepository = createRepository();
  }

  return g.__vskoTrafficRepository;
}
