import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const readingLogsTable = pgTable("reading_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  surahId: integer("surah_id").notNull(),
  surahNameEn: text("surah_name_en").notNull().default(""),
  ayahCount: integer("ayah_count").notNull().default(1),
  readAt: timestamp("read_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertReadingLogSchema = createInsertSchema(readingLogsTable).omit({ id: true, readAt: true });
export type InsertReadingLog = z.infer<typeof insertReadingLogSchema>;
export type ReadingLog = typeof readingLogsTable.$inferSelect;
