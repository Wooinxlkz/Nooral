import { Router } from "express";
import { getUserId } from "../middlewares/auth";
import { db, libraryProgressTable, libraryBookmarksTable, libraryNotesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod/v4";
import { logger } from "../lib/logger";

const router = Router();

const progressInputSchema = z.object({
  categoryId: z.string().min(1),
  articleId: z.string().min(1),
});

const bookmarkInputSchema = z.object({
  categoryId: z.string().min(1),
  articleId: z.string().min(1),
});

const noteInputSchema = z.object({
  articleId: z.string().min(1),
  noteText: z.string().min(1),
});

const noteUpdateSchema = z.object({
  noteText: z.string().min(1),
});

// ── Progress ─────────────────────────────────────────────────────────

router.get("/progress", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const rows = await db.select().from(libraryProgressTable)
      .where(eq(libraryProgressTable.userId, userId));
    return res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to get library progress");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/progress", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const parsed = progressInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const existing = await db.select().from(libraryProgressTable)
      .where(and(
        eq(libraryProgressTable.userId, userId),
        eq(libraryProgressTable.articleId, parsed.data.articleId),
      ));
    if (existing.length > 0) return res.json(existing[0]);
    const [row] = await db.insert(libraryProgressTable)
      .values({ userId, ...parsed.data })
      .returning();
    return res.status(201).json(row);
  } catch (err) {
    logger.error({ err }, "Failed to mark article complete");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/progress/:articleId", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    await db.delete(libraryProgressTable)
      .where(and(
        eq(libraryProgressTable.userId, userId),
        eq(libraryProgressTable.articleId, req.params.articleId),
      ));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to unmark article complete");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Bookmarks ────────────────────────────────────────────────────────

router.get("/bookmarks", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const rows = await db.select().from(libraryBookmarksTable)
      .where(eq(libraryBookmarksTable.userId, userId));
    return res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to get library bookmarks");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/bookmarks", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const parsed = bookmarkInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const existing = await db.select().from(libraryBookmarksTable)
      .where(and(
        eq(libraryBookmarksTable.userId, userId),
        eq(libraryBookmarksTable.articleId, parsed.data.articleId),
      ));
    if (existing.length > 0) return res.json(existing[0]);
    const [row] = await db.insert(libraryBookmarksTable)
      .values({ userId, ...parsed.data })
      .returning();
    return res.status(201).json(row);
  } catch (err) {
    logger.error({ err }, "Failed to bookmark article");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/bookmarks/:articleId", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    await db.delete(libraryBookmarksTable)
      .where(and(
        eq(libraryBookmarksTable.userId, userId),
        eq(libraryBookmarksTable.articleId, req.params.articleId),
      ));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to remove bookmark");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Notes ────────────────────────────────────────────────────────────

router.get("/notes", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const articleId = req.query.articleId as string | undefined;
  try {
    const rows = await db.select().from(libraryNotesTable)
      .where(eq(libraryNotesTable.userId, userId));
    const result = articleId ? rows.filter((r) => r.articleId === articleId) : rows;
    return res.json(result);
  } catch (err) {
    logger.error({ err }, "Failed to get library notes");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/notes", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const parsed = noteInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const [row] = await db.insert(libraryNotesTable)
      .values({ userId, ...parsed.data })
      .returning();
    return res.status(201).json(row);
  } catch (err) {
    logger.error({ err }, "Failed to create library note");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/notes/:id", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const parsed = noteUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const [row] = await db.update(libraryNotesTable)
      .set({ noteText: parsed.data.noteText })
      .where(and(eq(libraryNotesTable.id, id), eq(libraryNotesTable.userId, userId)))
      .returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(row);
  } catch (err) {
    logger.error({ err }, "Failed to update library note");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/notes/:id", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  try {
    await db.delete(libraryNotesTable)
      .where(and(eq(libraryNotesTable.id, id), eq(libraryNotesTable.userId, userId)));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete library note");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
