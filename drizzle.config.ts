import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
config({ path: '.env' })

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required.');
}

export default defineConfig({
    schema: './src/db/schema.ts',
    driver: 'mysql2',
    out: './drizzle',
    dbCredentials: {
        uri: process.env.DATABASE_URL,
    },
});