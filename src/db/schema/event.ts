import {
    mysqlTable,
    serial,
    timestamp,
    text
} from 'drizzle-orm/mysql-core';

const event = mysqlTable('event', {
    id: serial('id').primaryKey().notNull(),
    userId: text('userId').notNull(),
    from: timestamp('from', { mode: 'date' }).defaultNow(),
    title: text('Title').notNull(),
    description: text('description').default(""),
});

export default event;