import { Hono } from "hono";
import { logger } from "hono/logger";
import { auth } from "./auth.ts";

export const app = new Hono()

  .use(logger())

  .on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });
