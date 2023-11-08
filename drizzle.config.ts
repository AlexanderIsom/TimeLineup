import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';
config({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required.');
}

export default {
    schema: './db/schema/*',
    out: './drizzle',
    driver: 'mysql2',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL,
    },
} satisfies Config;