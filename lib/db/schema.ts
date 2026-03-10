import { integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const customersTable = pgTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  hsmCount: integer('hsm_count').notNull().default(0),
  model: text('model').notNull().default(''),
  serials: jsonb('serials').$type<string[]>().notNull().default([]),
  engineer: text('engineer').notNull().default(''),
  contacts: jsonb('contacts')
    .$type<Array<{ name: string; team: string; phone: string; email: string }>>()
    .notNull()
    .default([]),
  histories: jsonb('histories')
    .$type<Array<{ dateTime: string; title: string; note?: string }>>()
    .notNull()
    .default([]),
});

export const trafficEventsTable = pgTable('traffic_events', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  path: text('path').notNull(),
  visitedAt: timestamp('visited_at', { withTimezone: true }).notNull().defaultNow(),
});
