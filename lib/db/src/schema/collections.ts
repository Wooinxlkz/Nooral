import { pgTable, serial, text, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const collectionsTable = pgTable("collections", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const collectionVersesTable = pgTable("collection_verses", {
  id: serial("id").primaryKey(),
  collectionId: integer("collection_id").notNull(),
  userId: text("user_id").notNull(),
  verseKey: text("verse_key").notNull(),
  surahId: integer("surah_id").notNull(),
  ayahNumber: integer("ayah_number").notNull(),
  surahNameEn: text("surah_name_en").notNull(),
  ayahText: text("ayah_text"),
  translation: text("translation"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  uniqueVersePerCollection: unique().on(t.collectionId, t.verseKey),
}));

export const insertCollectionSchema = createInsertSchema(collectionsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCollectionVerseSchema = createInsertSchema(collectionVersesTable).omit({ id: true, createdAt: true });

export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type Collection = typeof collectionsTable.$inferSelect;
export type CollectionVerse = typeof collectionVersesTable.$inferSelect;
