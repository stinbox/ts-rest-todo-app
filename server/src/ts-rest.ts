import type { Session } from "better-auth";
import { contract } from "@monorepo/contract";
import { tsr } from "@ts-rest/serverless/fetch";
import {
  createTodo,
  deleteTodo,
  listTodos,
  updateTodo,
} from "./todo-service.ts";

export const tsRestRouter = tsr
  .platformContext<{ session: Session }>()
  .router(contract, {
    listTodos: async (_, { session }) => {
      return {
        status: 200,
        body: await listTodos(session.userId),
      };
    },

    createTodo: async ({ body }, { session }) => {
      const created = await createTodo(session.userId, body.content);
      return {
        status: 201,
        body: created,
      };
    },

    updateTodo: async ({ body, params }, { session }) => {
      const updated = await updateTodo(
        session.userId,
        params.id,
        body.content,
        body.completed,
      );
      if (!updated) {
        return { status: 404, body: { message: "Todo not found" } };
      }
      return { status: 200, body: updated };
    },

    deleteTodo: async ({ params }, { session }) => {
      await deleteTodo(session.userId, params.id);
      return { status: 204, body: undefined };
    },
  });
