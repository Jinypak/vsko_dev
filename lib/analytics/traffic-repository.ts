import { asc, gte } from 'drizzle-orm';
import { getDb } from '@/lib/db/client';
import { trafficEventsTable } from '@/lib/db/schema';

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

class DrizzleTrafficRepository implements TrafficRepository {
  async track(path: string): Promise<void> {
    const db = getDb();
    await db.insert(trafficEventsTable).values({ path });
  }

  async getSummary(): Promise<TrafficSummary> {
    const from = startOfDayBefore(6);

    try {
      const db = getDb();
      const rows = await db
        .select({
          path: trafficEventsTable.path,
          visitedAt: trafficEventsTable.visitedAt,
        })
        .from(trafficEventsTable)
        .where(gte(trafficEventsTable.visitedAt, from))
        .orderBy(asc(trafficEventsTable.visitedAt));

      const events: TrafficEvent[] = rows.map((row) => ({
        path: row.path,
        visitedAt: new Date(row.visitedAt).toISOString(),
      }));

      return summarizeEvents(events);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Drizzle traffic summary fetch failed | table=traffic_events | from=${from.toISOString()} | detail=${message}`);
    }
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

function createRepository(): TrafficRepository {
  if (process.env.DATABASE_URL?.trim()) {
    return new DrizzleTrafficRepository();
  }

  return new InMemoryTrafficRepository();
}

export function getTrafficRepository() {
  if (!g.__vskoTrafficRepository) {
    g.__vskoTrafficRepository = createRepository();
  }

  return g.__vskoTrafficRepository;
}
