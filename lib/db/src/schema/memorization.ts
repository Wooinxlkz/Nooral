import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const memorizationTable = pgTable("memorization_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  surahId: integer("surah_id").notNull(),
  ayahNumber: integer("ayah_number").notNull(),
  memorized: boolean("memorized").notNull().default(false),
  memorizedAt: timestamp("memorized_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertMemorizationSchema = createInsertSchema(memorizationTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMemorization = z.infer<typeof insertMemorizationSchema>;
export type Memorization = typeof memorizationTable.$inferSelect;
