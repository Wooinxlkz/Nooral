import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pinnedVersesTable = pgTable("pinned_verses", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  surahId: integer("surah_id").notNull(),
  ayahNumber: integer("ayah_number").notNull(),
  surahNameEn: text("surah_name_en").notNull(),
  surahNameAr: text("surah_name_ar"),
  ayahText: text("ayah_text"),
  translation: text("translation"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPinnedVerseSchema = createInsertSchema(pinnedVersesTable).omit({ id: true, createdAt: true });
export type InsertPinnedVerse = z.infer<typeof insertPinnedVerseSchema>;
export type PinnedVerse = typeof pinnedVersesTable.$inferSelect;
