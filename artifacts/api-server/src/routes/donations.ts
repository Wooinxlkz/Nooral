import { Router } from "express";
import { db, donationsTable } from "@workspace/db";
import { z } from "zod/v4";
import { logger } from "../lib/logger";

const router = Router();

const donationInputSchema = z.object({
  type: z.enum(["support", "sadaqah"]),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/).optional().nullable(),
  currency: z.string().min(2).max(5).default("DZD"),
  frequency: z.enum(["one-time", "monthly"]).optional().nullable(),
  email: z.string().max(255).optional().nullable(),
  note: z.string().max(500).optional().nullable(),
  sadaqahFor: z.string().max(300).optional().nullable(),
  isAnonymous: z.boolean().default(true),
});

router.post("/", async (req, res) => {
  const parsed = donationInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const data = parsed.data;

  try {
    const [created] = await db
      .insert(donationsTable)
      .values({
        type: data.type,
        amount: data.amount ?? null,
        currency: data.currency,
        frequency: data.frequency ?? null,
        email: data.email ?? null,
        note: data.note ?? null,
        sadaqahFor: data.sadaqahFor ?? null,
        isAnonymous: data.isAnonymous,
      })
      .returning();

    return res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Failed to record donation intent");
    return res.status(500).json({ error: "Failed to record donation" });
  }
});

export default router;
