import { Router } from "express";
import { db } from "@workspace/db";
import { feedbackTable } from "@workspace/db/schema";
import { z } from "zod/v4";

const router = Router();

const submitSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.email().max(200),
  country: z.string().max(100).optional(),
  type: z.enum(["bug", "feature", "translate", "general"]),
  message: z.string().min(10).max(5000),
});

router.post("/", async (req, res) => {
  const parsed = submitSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", issues: parsed.error.issues });
  }

  const { name, email, country, type, message } = parsed.data;

  const subjectMap: Record<string, string> = {
    bug: "Bug Report",
    feature: "Feature Request",
    translate: "Translation Help",
    general: "General Inquiry",
  };

  const [row] = await db
    .insert(feedbackTable)
    .values({ name, email, country: country ?? null, type, subject: subjectMap[type] ?? type, message })
    .returning();

  return res.status(201).json({ ok: true, id: row.id });
});

export default router;
