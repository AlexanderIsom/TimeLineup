import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
if (!process.env.DB_URL) {
	throw new Error("DB_HOST environment variable is required.");
}

const connectionString = process.env.DB_URL;

export const connection = postgres(connectionString, { prepare: false });
export const db = drizzle(connection, { schema: schema });
