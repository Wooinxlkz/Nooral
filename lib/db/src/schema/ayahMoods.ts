import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const ayahMoodsTable = pgTable("ayah_moods", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  surahId: integer("surah_id").notNull(),
  ayahNumber: integer("ayah_number").notNull(),
  mood: text("mood").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type AyahMood = typeof ayahMoodsTable.$inferSelect;
