import { Hono } from "hono";

export const app = new Hono().get("/api", (c) =>
  c.json({ message: "Hello from Hono!" }),
);
