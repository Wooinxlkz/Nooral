import { Router } from "express";
import { getUserId } from "../middlewares/auth";
import { db, collectionsTable, collectionVersesTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { logger } from "../lib/logger";

const router = Router();

const collectionInputSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

const collectionVerseInputSchema = z.object({
  verseKey: z.string(),
  surahId: z.number().int().min(1).max(114),
  ayahNumber: z.number().int().min(1),
  surahNameEn: z.string(),
  ayahText: z.string().optional(),
  translation: z.string().optional(),
  note: z.string().optional(),
});

// GET /collections — list all with verse counts
router.get("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const rows = await db
      .select({
        id: collectionsTable.id,
        userId: collectionsTable.userId,
        name: collectionsTable.name,
        description: collectionsTable.description,
        createdAt: collectionsTable.createdAt,
        updatedAt: collectionsTable.updatedAt,
        verseCount: sql<number>`cast(count(${collectionVersesTable.id}) as int)`,
      })
      .from(collectionsTable)
      .leftJoin(collectionVersesTable, eq(collectionVersesTable.collectionId, collectionsTable.id))
      .where(eq(collectionsTable.userId, userId))
      .groupBy(collectionsTable.id)
      .orderBy(collectionsTable.createdAt);
    return res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to get collections");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /collections
router.post("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const parsed = collectionInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const [row] = await db
      .insert(collectionsTable)
      .values({ userId, ...parsed.data })
      .returning();
    return res.status(201).json({ ...row, verseCount: 0 });
  } catch (err) {
    logger.error({ err }, "Failed to create collection");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /collections/:id — detail with verses
router.get("/:id", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  try {
    const [collection] = await db
      .select()
      .from(collectionsTable)
      .where(and(eq(collectionsTable.id, id), eq(collectionsTable.userId, userId)));
    if (!collection) return res.status(404).json({ error: "Not found" });
    const verses = await db
      .select()
      .from(collectionVersesTable)
      .where(and(eq(collectionVersesTable.collectionId, id), eq(collectionVersesTable.userId, userId)))
      .orderBy(collectionVersesTable.createdAt);
    return res.json({ ...collection, verses });
  } catch (err) {
    logger.error({ err }, "Failed to get collection");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /collections/:id
router.patch("/:id", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const parsed = collectionInputSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const [row] = await db
      .update(collectionsTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(and(eq(collectionsTable.id, id), eq(collectionsTable.userId, userId)))
      .returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(row);
  } catch (err) {
    logger.error({ err }, "Failed to update collection");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /collections/:id
router.delete("/:id", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  try {
    await db.delete(collectionVersesTable).where(eq(collectionVersesTable.collectionId, id));
    await db.delete(collectionsTable).where(and(eq(collectionsTable.id, id), eq(collectionsTable.userId, userId)));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete collection");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /collections/:id/verses
router.post("/:id/verses", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const parsed = collectionVerseInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  // Verify ownership
  const [collection] = await db
    .select({ id: collectionsTable.id })
    .from(collectionsTable)
    .where(and(eq(collectionsTable.id, id), eq(collectionsTable.userId, userId)));
  if (!collection) return res.status(404).json({ error: "Collection not found" });
  try {
    const [row] = await db
      .insert(collectionVersesTable)
      .values({ collectionId: id, userId, ...parsed.data })
      .onConflictDoNothing()
      .returning();
    if (!row) return res.status(409).json({ error: "Already in collection" });
    return res.status(201).json(row);
  } catch (err) {
    logger.error({ err }, "Failed to add verse to collection");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /collections/:id/verses/:verseKey
router.delete("/:id/verses/:verseKey", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const { verseKey } = req.params;
  try {
    await db
      .delete(collectionVersesTable)
      .where(
        and(
          eq(collectionVersesTable.collectionId, id),
          eq(collectionVersesTable.userId, userId),
          eq(collectionVersesTable.verseKey, verseKey)
        )
      );
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to remove verse from collection");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
