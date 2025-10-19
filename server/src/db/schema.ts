import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const createdAt = integer("created_at", { mode: "timestamp_ms" })
  .$defaultFn(() => new Date())
  .notNull();

const updatedAt = integer("updated_at", { mode: "timestamp_ms" })
  .$defaultFn(() => new Date())
  .$onUpdateFn(() => new Date())
  .notNull();

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("image"),
  role: text("role"),
  banned: integer("banned", { mode: "boolean" }).notNull().default(false),
  banReason: text("ban_reason"),
  banExpires: integer("ban_expires", { mode: "timestamp" }),
  createdAt,
  updatedAt,
});

export const userRelations = relations(user, ({ many }) => ({
  todos: many(todo),
}));

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
  createdAt,
  updatedAt,
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt,
  updatedAt,
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt,
  updatedAt,
});

export const todo = sqliteTable(
  "todo",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    content: text("content").notNull(),
    completed: integer("completed", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt,
    updatedAt,
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("idx_todo_created_by").on(t.createdBy)],
);

export const todoRelations = relations(todo, ({ one }) => ({
  creator: one(user, {
    fields: [todo.createdBy],
    references: [user.id],
  }),
}));
