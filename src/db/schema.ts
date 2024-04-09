import { relations } from 'drizzle-orm';
import {
	pgTable,
	timestamp,
	text, json, varchar, boolean, uuid,
	pgEnum
} from 'drizzle-orm/pg-core';

export const friendshipStatus = pgEnum("friendship_status", ['accepted', 'pending', 'blocked'])
export const notificationType = pgEnum("notification_type", ['event', 'friend'])
export const rsvpStatus = pgEnum("rsvp_status", ["attending", "pending", "declined"])

export const events = pgTable('event', {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	start: timestamp('start', { mode: 'date' }).notNull(),
	end: timestamp('end', { mode: 'date' }).notNull(),
	title: varchar('title', { length: 50 }).notNull(),
	description: varchar('description', { length: 500 }).default("").notNull(),
});

export const eventRelations = relations(events, ({ many, one }) => ({
	rsvps: many(rsvps),
	host: one(profiles, {
		fields: [events.userId],
		references: [profiles.id]
	})
}));

export const rsvps = pgTable('rsvp', {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
	eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: "cascade" }),
	schedules: json("schedules").$type<{ id: string, start: number, duration: number }[]>().default([]).notNull(),
	status: rsvpStatus("status").default("pending").notNull(),
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
})

export const profileRelations = relations(profiles, ({ many, one }) => ({
	rsvps: many(rsvps),
	friends: many(friendships)
}));

export const friendships = pgTable('friendship', {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	sending_user: uuid("sending_user").notNull().references(() => profiles.id, { onDelete: "cascade" }),
	receiving_user: uuid("receiving_user").notNull().references(() => profiles.id, { onDelete: "cascade" }),
	status: friendshipStatus("status").default('pending').notNull(),
})

export const friendshipRelations = relations(friendships, ({ one }) => ({
	sendingUser: one(profiles, {
		fields: [friendships.sending_user],
		references: [profiles.id]
	}),
	targetUser: one(profiles, {
		fields: [friendships.receiving_user],
		references: [profiles.id]
	}),
}));

export const notifications = pgTable('notification', {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	type: notificationType("type").default('event').notNull(),
	message: text("message"),
	seen: boolean("seen").notNull().default(false),
	target: uuid("target").notNull(),
	sender: uuid("sender").notNull(),
	event: uuid("event"),
})

export const notificationRelations = relations(notifications, ({ one }) => ({
	sender: one(profiles, {
		fields: [notifications.sender],
		references: [profiles.id]
	}),
	event: one(events, {
		fields: [notifications.event],
		references: [events.id]
	})
}))

export type InsertNotification = typeof notifications.$inferInsert;
export type Notifications = typeof notifications.$inferSelect;

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export type Rsvp = typeof rsvps.$inferSelect;
export type InsertRsvp = typeof rsvps.$inferInsert;
export type RsvpStatus = typeof rsvpStatus.enumValues[number];

export type Profile = typeof profiles.$inferSelect;
export type Friendship = typeof friendships.$inferSelect;
