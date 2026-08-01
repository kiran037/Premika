import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, {
  prepare: false,
  max: process.env.NODE_ENV === "production" ? 10 : 5,
  idle_timeout: 10,
  connect_timeout: 10,
  max_lifetime: 60,
});

export const db = drizzle(client);
export { client };