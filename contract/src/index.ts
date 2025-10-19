import { initContract } from "@ts-rest/core";
import { TodoSchema } from "./models/todo.js";
import * as z from "zod";

const c = initContract();

export const contract = c.router(
  {
    listTodos: {
      method: "GET",
      path: "/todos",
      responses: {
        200: TodoSchema.array(),
      },
      summary: "Get all todos",
    },
    createTodo: {
      method: "POST",
      path: "/todos",
      body: z.object({
        content: z.string().min(1).max(255),
      }),
      responses: {
        201: TodoSchema,
      },
      summary: "Create a new todo",
    },
    updateTodo: {
      method: "PUT",
      path: "/todos/:id",
      pathParams: z.object({
        id: z.uuid(),
      }),
      body: z
        .object({
          content: z.string().min(1).max(255).optional(),
          completed: z.boolean().optional(),
        })
        .refine((data) => data.content != null || data.completed != null, {
          error: "At least one of 'content' or 'completed' must be provided",
        }),
      responses: {
        200: TodoSchema,
        404: z.object({ message: z.string() }),
      },
    },
    deleteTodo: {
      method: "DELETE",
      path: "/todos/:id",
      pathParams: z.object({
        id: z.uuid(),
      }),
      responses: {
        204: c.noBody(),
      },
    },
  },
  {
    pathPrefix: "/api",
    commonResponses: {
      401: z.object({ message: z.string() }),
    },
  },
);
