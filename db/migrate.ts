import "dotenv/config";

import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, client } from "./client";

async function main() {
    await migrate(db, {
        migrationsFolder: "./drizzle",
    });

    await client.end();
}

main().catch(async (err) => {
    console.error(err);
    await client.end();
    process.exit(1);
});