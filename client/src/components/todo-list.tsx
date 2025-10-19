import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import useSWR from "swr";
import type { Todo } from "@monorepo/contract/models/todo";
import { tsRestClient } from "../lib/ts-rest-client";

const TODOS_KEY = "todos";

const fetchTodos = async (): Promise<Todo[]> => {
  const response = await tsRestClient.listTodos();
  if (response.status !== 200) {
    throw new Error("Failed to fetch todos");
  }
  return response.body;
};

const TodoItem: React.FC<{
  todo: Todo;
  mutate: () => void;
}> = ({ todo, mutate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.content);

  const handleToggle = async (event: ChangeEvent<HTMLInputElement>) => {
    const nextCompleted = event.currentTarget.checked;
    const updated = await tsRestClient.updateTodo({
      params: { id: todo.id },
      body: { completed: nextCompleted },
    });
    if (updated.status !== 200) {
      throw new Error("Failed to update todo");
    }
    mutate();
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (trimmed === todo.content) {
      setIsEditing(false);
      return;
    }
    const updated = await tsRestClient.updateTodo({
      params: { id: todo.id },
      body: { content: trimmed },
    });
    if (updated.status !== 200) {
      throw new Error("Failed to update todo");
    }
    mutate();
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await tsRestClient.deleteTodo({ params: { id: todo.id } });
    mutate();
  };

  const handleCancelEdit = () => {
    setDraft(todo.content);
    setIsEditing(false);
  };

  return (
    <div
      className={`card border transition-colors ${
        todo.completed
          ? "border-success/60 bg-success/10"
          : "border-base-200 bg-base-100 shadow-sm"
      }`}
    >
      <div className="card-body gap-4 md:flex-row md:items-start md:justify-between">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={todo.completed}
            onChange={handleToggle}
          />
          <span
            className={`badge ${todo.completed ? "badge-success" : "badge-info badge-outline"}`}
          >
            {todo.completed ? "Completed" : "Active"}
          </span>
        </label>
        <div className="flex-1 w-full">
          {isEditing ? (
            <form
              onSubmit={handleSave}
              className="flex flex-col gap-3 md:flex-row md:items-center"
            >
              <input
                className="input input-bordered w-full"
                placeholder="Update todo content"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary btn-sm">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <p
                className={`text-lg font-medium break-words ${
                  todo.completed ? "line-through text-base-content/60" : ""
                }`}
              >
                {todo.content}
              </p>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setDraft(todo.content);
                  setIsEditing(true);
                }}
              >
                Edit
              </button>
            </div>
          )}
        </div>
        <button
          type="button"
          className="btn btn-error btn-sm self-start"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export const TodoList: React.FC = () => {
  const {
    data: todos,
    error,
    isLoading,
    mutate,
  } = useSWR(TODOS_KEY, fetchTodos);
  const [newContent, setNewContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = newContent.trim();
    if (trimmed.length === 0) {
      setActionError("Todo content cannot be empty.");
      return;
    }
    setActionError(null);
    setIsCreating(true);
    try {
      const response = await tsRestClient.createTodo({
        body: { content: trimmed },
      });
      if (response.status !== 201) {
        throw new Error("Failed to create todo");
      }
      setNewContent("");
      await mutate();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create todo";
      setActionError(message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
      <form
        onSubmit={handleCreate}
        className="card bg-base-100 shadow-xl"
        aria-label="Add new todo"
      >
        <div className="card-body gap-4">
          <h2 className="card-title">Add a new todo</h2>
          <div className="join w-full">
            <input
              className="input input-bordered join-item w-full"
              placeholder="e.g. Prepare meeting notes"
              value={newContent}
              onChange={(event) => setNewContent(event.target.value)}
            />
            <button
              className="btn btn-primary join-item"
              type="submit"
              disabled={isCreating || newContent.trim().length === 0}
            >
              {isCreating ? (
                <span className="loading loading-spinner" />
              ) : (
                "Add"
              )}
            </button>
          </div>
        </div>
      </form>

      {actionError ? (
        <div className="alert alert-error shadow-md" role="alert">
          <span>{actionError}</span>
        </div>
      ) : null}

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <span
              className="loading loading-spinner loading-lg text-primary"
              aria-label="Loading todos..."
            />
          </div>
        ) : error ? (
          <div className="alert alert-error" role="alert">
            <span>
              {error instanceof Error
                ? `Failed to load todos: ${error.message}`
                : "Failed to load todos."}
            </span>
          </div>
        ) : todos == null || todos.length === 0 ? (
          <div className="card border border-dashed border-base-300 bg-base-100/80 py-12 text-center">
            <div className="card-body items-center justify-center">
              <p className="text-lg text-base-content/70">
                Your todos will appear here. Start by adding a new task above!
              </p>
            </div>
          </div>
        ) : (
          todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} mutate={mutate} />
          ))
        )}
      </div>
    </div>
  );
};
