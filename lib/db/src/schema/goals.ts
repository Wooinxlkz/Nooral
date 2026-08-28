import { pgTable, serial, text, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const readingGoalsTable = pgTable("reading_goals", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  goalType: text("goal_type").notNull(), // 'ayahs' | 'pages' | 'juz'
  targetAmount: integer("target_amount").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const goalProgressTable = pgTable("goal_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  date: date("date", { mode: "string" }).notNull(),
  amountRead: integer("amount_read").notNull().default(0),
  goalMet: boolean("goal_met").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertGoalSchema = createInsertSchema(readingGoalsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertGoalProgressSchema = createInsertSchema(goalProgressTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type InsertGoalProgress = z.infer<typeof insertGoalProgressSchema>;
export type ReadingGoal = typeof readingGoalsTable.$inferSelect;
export type GoalProgress = typeof goalProgressTable.$inferSelect;
