import { relations } from 'drizzle-orm';
import {
	pgTable,
	serial,
	timestamp,
	text, json, varchar, boolean, integer
} from 'drizzle-orm/pg-core';


export const events = pgTable('event', {
	id: serial('id').primaryKey(),
	userId: text('user_id').notNull(),
	start: timestamp('start', { mode: 'date' }).defaultNow().notNull(),
	end: timestamp('end', { mode: 'date' }).defaultNow().notNull(),
	title: varchar('title', { length: 50 }).default("Title").notNull(),
	description: varchar('description', { length: 500 }).default("").notNull(),
	invitedUsers: text('invited_users').array().notNull(),
});

export type Event = typeof events.$inferSelect;

export const eventRelations = relations(events, ({ many }) => ({
	rsvps: many(rsvps)
}));

export const rsvps = pgTable('rsvp', {
	id: serial('id').primaryKey(),
	userId: text('user_id').notNull(),
	eventId: integer('event_id').notNull(),
	schedules: json("spans").$type<{ id: string, start: number, duration: number }[]>().default([]).notNull(),
	rejected: boolean('rejected').default(false).notNull()
});
export type Rsvp = typeof rsvps.$inferSelect;

export const rsvpRelations = relations(rsvps, ({ one }) => ({
	event: one(events, {
		fields: [rsvps.eventId],
		references: [events.id]
	})
}))
