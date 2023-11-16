import {
    mysqlTable,
    serial,
    timestamp,
} from 'drizzle-orm/mysql-core';

const event = mysqlTable('event', {
    id: serial('id').primaryKey().notNull(),
    startTime: timestamp('startTime', { mode: 'date' }).defaultNow(),
    endTime: timestamp('endTime', { mode: 'date' }).defaultNow(),
    createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
});

export default event;