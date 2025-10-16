import { serve } from "@hono/node-server";
import { app } from "./app.ts";
import { value } from "@monorepo/contract";

console.log("Server is starting...");
console.log(value);

serve({
  fetch: app.fetch,
  port: 3001,
});
