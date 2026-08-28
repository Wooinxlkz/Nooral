import { Router } from "express";
import { getUserId } from "../middlewares/auth";
import { db, hardAyahsTable } from "@workspace/db";
import { eq, and, lte } from "drizzle-orm";
import { z } from "zod/v4";
import { logger } from "../lib/logger";

const router = Router();

const hardAyahInputSchema = z.object({
  surahId: z.number().int().min(1),
  ayahNumber: z.number().int().min(1),
  surahNameEn: z.string().optional(),
});

const reviewSchema = z.object({
  result: z.enum(["correct", "needs_review"]),
});

// Spaced repetition intervals in days
const INTERVALS: Record<string, number> = {
  correct: 3,
  needs_review: 1,
};

function getNextReviewDate(result: string, reviewCount: number): Date {
  let days = INTERVALS[result] ?? 1;
  // Progressive: correct review doubles interval up to 14 days
  if (result === "correct" && reviewCount > 0) {
    days = Math.min(days * Math.pow(2, reviewCount - 1), 14);
  }
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

router.get("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const now = new Date();
    const rows = await db
      .select()
      .from(hardAyahsTable)
      .where(and(eq(hardAyahsTable.userId, userId), lte(hardAyahsTable.nextReviewDate, now)));
    return res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to get hard ayahs");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const parsed = hardAyahInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const [row] = await db
      .insert(hardAyahsTable)
      .values({ userId, ...parsed.data, nextReviewDate: new Date(), reviewCount: 0 })
      .returning();
    return res.status(201).json(row);
  } catch (err) {
    logger.error({ err }, "Failed to flag hard ayah");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/review", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const [existing] = await db
      .select()
      .from(hardAyahsTable)
      .where(and(eq(hardAyahsTable.id, id), eq(hardAyahsTable.userId, userId)));
    if (!existing) return res.status(404).json({ error: "Not found" });
    const newCount = existing.reviewCount + 1;
    const nextReviewDate = getNextReviewDate(parsed.data.result, newCount);
    const [row] = await db
      .update(hardAyahsTable)
      .set({ reviewCount: newCount, lastResult: parsed.data.result, nextReviewDate })
      .where(eq(hardAyahsTable.id, id))
      .returning();
    return res.json(row);
  } catch (err) {
    logger.error({ err }, "Failed to review hard ayah");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  try {
    await db
      .delete(hardAyahsTable)
      .where(and(eq(hardAyahsTable.id, id), eq(hardAyahsTable.userId, userId)));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to remove hard ayah");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
