import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tasbihTable = pgTable("tasbih_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  dhikrPhrase: text("dhikr_phrase").notNull(),
  count: integer("count").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTasbihSchema = createInsertSchema(tasbihTable).omit({ id: true, createdAt: true });
export type InsertTasbih = z.infer<typeof insertTasbihSchema>;
export type Tasbih = typeof tasbihTable.$inferSelect;
