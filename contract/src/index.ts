import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const contract = c.router(
  {
    greeting: {
      method: "GET",
      path: "/greeting",
      query: z.object({
        name: z.string(),
      }),
      responses: {
        200: z.object({ message: z.string() }),
      },
      summary: "Greet by name",
    },
  },
  { pathPrefix: "/api" },
);
