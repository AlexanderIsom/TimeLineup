import {
    mysqlTable,
    serial,
    timestamp,
    text
} from 'drizzle-orm/mysql-core';

const event = mysqlTable('event', {
    id: serial('id').primaryKey().notNull(),
    userId: text('userId').notNull(),
    start: timestamp('start', { mode: 'date' }).defaultNow().notNull(),
    end: timestamp('end', { mode: 'date' }).defaultNow().notNull(),
    title: text('Title').notNull(),
    description: text('description').default("").notNull(),
});

export default event;