import "dotenv/config";
import { serve } from "@hono/node-server";
import { app } from "./app.ts";

console.log("Server is starting...");

serve({
  fetch: app.fetch,
  port: 3001,
});
