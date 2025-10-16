import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.ts";
import path from "node:path";

const databaseUrl = path.join(process.cwd(), "db.sqlite");

export const drizzleClient = drizzle<typeof schema>("file:" + databaseUrl);
