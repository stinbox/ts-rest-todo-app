import { and, desc, eq } from "drizzle-orm";
import type { Todo } from "@monorepo/contract/models/todo";
import { drizzleClient } from "./db/client.ts";
import { todo } from "./db/schema.ts";

export async function listTodos(userId: string): Promise<Todo[]> {
  const selected = await drizzleClient
    .select()
    .from(todo)
    .where(eq(todo.createdBy, userId))
    .orderBy(desc(todo.createdAt));

  return selected.map((todo) => ({
    id: todo.id,
    content: todo.content,
    completed: todo.completed,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
    createdBy: todo.createdBy,
  }));
}

export async function createTodo(
  userId: string,
  content: string,
): Promise<Todo> {
  const [result] = await drizzleClient
    .insert(todo)
    .values({
      content,
      createdBy: userId,
    })
    .returning();

  return {
    id: result.id,
    content: result.content,
    completed: result.completed,
    createdAt: result.createdAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
    createdBy: result.createdBy,
  };
}

export async function updateTodo(
  userId: string,
  id: string,
  content?: string,
  completed?: boolean,
): Promise<Todo | null> {
  const [result] = await drizzleClient
    .update(todo)
    .set({
      completed: completed,
      content: content,
    })
    .where(and(eq(todo.id, id), eq(todo.createdBy, userId)))
    .returning();

  if (!result) {
    return null;
  }

  return {
    id: result.id,
    content: result.content,
    completed: result.completed,
    createdAt: result.createdAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
    createdBy: result.createdBy,
  };
}

export async function deleteTodo(userId: string, id: string): Promise<void> {
  await drizzleClient
    .delete(todo)
    .where(and(eq(todo.id, id), eq(todo.createdBy, userId)));
}
