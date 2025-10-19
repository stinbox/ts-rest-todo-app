import { Hono } from "hono";
import { logger } from "hono/logger";
import { auth } from "./auth.ts";
import { contract } from "@monorepo/contract";
import { fetchRequestHandler } from "@ts-rest/serverless/fetch";
import { tsRestRouter } from "./ts-rest.ts";

export const app = new Hono()

  .use(logger())

  .on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })

  .all("/api/*", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    return fetchRequestHandler({
      router: tsRestRouter,
      contract,
      request: new Request(c.req.raw),
      platformContext: { session: session.session },
      options: {},
    });
  });
