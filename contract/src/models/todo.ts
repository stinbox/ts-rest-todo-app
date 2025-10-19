import * as z from "zod";

export const TodoSchema = z.object({
  id: z.uuid(),
  content: z.string().min(1).max(255),
  completed: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
});

export type Todo = z.infer<typeof TodoSchema>;
