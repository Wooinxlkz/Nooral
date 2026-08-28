import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const khatmHistoryTable = pgTable("khatm_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
  reciterUsed: text("reciter_used"),
});

export type KhatmHistory = typeof khatmHistoryTable.$inferSelect;
