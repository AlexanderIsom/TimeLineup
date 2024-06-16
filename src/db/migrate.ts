import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
if (!process.env.DB_URL) {
	throw new Error("DB_HOST environment variable is required.");
}

const connectionString = process.env.DB_URL;

export const connection = postgres(connectionString, { prepare: false, max: 1 });
export const db = drizzle(connection);

await migrate(db, { migrationsFolder: "drizzle" });
await connection.end();
