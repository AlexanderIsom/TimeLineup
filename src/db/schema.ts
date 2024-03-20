import { relations } from 'drizzle-orm';
import {
	pgTable,
	timestamp,
	text, json, varchar, boolean, uuid,
	pgEnum
} from 'drizzle-orm/pg-core';

export const friendshipStatus = pgEnum("friendship_status", ['accepted', 'pending', 'blocked'])

export const events = pgTable('event', {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	start: timestamp('start', { mode: 'date' }).defaultNow().notNull(),
	end: timestamp('end', { mode: 'date' }).defaultNow().notNull(),
	title: varchar('title', { length: 50 }).default("Title").notNull(),
	description: varchar('description', { length: 500 }).default("").notNull(),
	invitedUsers: uuid('invited_users').array().notNull(),
});

export const eventRelations = relations(events, ({ many }) => ({
	rsvps: many(rsvps),
}));

export const rsvps = pgTable('rsvp', {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
	eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: "cascade" }),
	schedules: json("schedules").$type<{ id: string, start: number, duration: number }[]>().default([]).notNull(),
	rejected: boolean('rejected').default(false).notNull()
});

export const rsvpRelations = relations(rsvps, ({ one }) => ({
	event: one(events, {
		fields: [rsvps.eventId],
		references: [events.id]
	}),
	user: one(profiles, {
		fields: [rsvps.userId],
		references: [profiles.id]
	})
}))

export const profiles = pgTable("profile", {
	id: uuid("id").primaryKey().notNull(),
	username: text("username"),
	avatarUrl: text("avatar_url"),
	email: text("email").notNull(),
})

export const profileRelations = relations(profiles, ({ many, one }) => ({
	rsvps: many(rsvps),
	friends: many(friendships)
}));

export const friendships = pgTable('friendship', {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	user_1: uuid("user_1").notNull().references(() => profiles.id, { onDelete: "cascade" }),
	user_2: uuid("user_2").notNull().references(() => profiles.id, { onDelete: "cascade" }),
	status: friendshipStatus("status").default('pending').notNull(),
})

export const friendshipRelations = relations(friendships, ({ one }) => ({
	sendingUser: one(profiles, {
		fields: [friendships.user_1],
		references: [profiles.id]
	}),
	targetUser: one(profiles, {
		fields: [friendships.user_2],
		references: [profiles.id]
	}),
}));

export type Event = typeof events.$inferSelect;
export type Rsvp = typeof rsvps.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Friendship = typeof friendships.$inferSelect;
