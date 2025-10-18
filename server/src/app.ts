import { Hono } from "hono";
import { logger } from "hono/logger";
import { auth } from "./auth.ts";
import { contract } from "@monorepo/contract";
import { fetchRequestHandler, tsr } from "@ts-rest/serverless/fetch";

const tsrRouter = tsr.router(contract, {
  greeting: async ({ query: { name } }) => {
    return {
      status: 200,
      body: { message: `Hello, ${name}!` },
    };
  },
});

export const app = new Hono()

  .use(logger())

  .on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })

  .all("/api/*", (c) =>
    fetchRequestHandler({
      router: tsrRouter,
      contract,
      request: new Request(c.req.raw),
      options: {},
    }),
  );
