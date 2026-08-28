import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const libraryProgressTable = pgTable("library_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  categoryId: text("category_id").notNull(),
  articleId: text("article_id").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const libraryBookmarksTable = pgTable("library_bookmarks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  categoryId: text("category_id").notNull(),
  articleId: text("article_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const libraryNotesTable = pgTable("library_notes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  articleId: text("article_id").notNull(),
  noteText: text("note_text").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertLibraryProgressSchema = createInsertSchema(libraryProgressTable).omit({ id: true, completedAt: true });
export const insertLibraryBookmarkSchema = createInsertSchema(libraryBookmarksTable).omit({ id: true, createdAt: true });
export const insertLibraryNoteSchema = createInsertSchema(libraryNotesTable).omit({ id: true, createdAt: true });

export type LibraryProgress = typeof libraryProgressTable.$inferSelect;
export type LibraryBookmark = typeof libraryBookmarksTable.$inferSelect;
export type LibraryNote = typeof libraryNotesTable.$inferSelect;
export type InsertLibraryProgress = z.infer<typeof insertLibraryProgressSchema>;
export type InsertLibraryBookmark = z.infer<typeof insertLibraryBookmarkSchema>;
export type InsertLibraryNote = z.infer<typeof insertLibraryNoteSchema>;
