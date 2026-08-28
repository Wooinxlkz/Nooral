import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const lastReadTable = pgTable("last_read", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  surahId: integer("surah_id").notNull(),
  ayahNumber: integer("ayah_number").notNull(),
  surahNameEn: text("surah_name_en"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertLastReadSchema = createInsertSchema(lastReadTable).omit({ id: true, updatedAt: true });
export type InsertLastRead = z.infer<typeof insertLastReadSchema>;
export type LastRead = typeof lastReadTable.$inferSelect;
