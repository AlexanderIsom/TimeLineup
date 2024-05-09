import { Config } from 'drizzle-kit';

if (!process.env.DB_URL) {
    throw new Error('DB_URL environment variable is required.');
}

export default {
    schema: './src/db/schema.ts',
    driver: 'pg',
    out: './drizzle',
    dbCredentials: {
        connectionString: process.env.DB_URL,
    },
    verbose: true,
    strict: true,
} satisfies Config;