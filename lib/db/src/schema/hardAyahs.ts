import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const hardAyahsTable = pgTable("hard_ayahs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  surahId: integer("surah_id").notNull(),
  ayahNumber: integer("ayah_number").notNull(),
  surahNameEn: text("surah_name_en"),
  nextReviewDate: timestamp("next_review_date", { withTimezone: true }).notNull().defaultNow(),
  reviewCount: integer("review_count").notNull().default(0),
  lastResult: text("last_result"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertHardAyahSchema = createInsertSchema(hardAyahsTable).omit({ id: true, createdAt: true, reviewCount: true });
export type InsertHardAyah = z.infer<typeof insertHardAyahSchema>;
export type HardAyah = typeof hardAyahsTable.$inferSelect;
