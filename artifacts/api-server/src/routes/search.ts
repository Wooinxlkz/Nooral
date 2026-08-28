import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (req, res) => {
  const q = req.query.q as string;
  const language = (req.query.language as string) || "en";
  if (!q || q.trim().length === 0) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }
  try {
    const url = `https://api.quran.com/api/v4/search?q=${encodeURIComponent(q)}&language=${language}&size=20`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(502).json({ error: "Upstream API error" });
    }
    const data = await response.json() as { search?: { results?: Array<{ verse_key: string; text: string; words?: unknown[] }> } };
    const results = (data.search?.results ?? []).map((r) => {
      const [surahStr, ayahStr] = r.verse_key.split(":");
      const surahId = parseInt(surahStr, 10);
      const ayahNumber = parseInt(ayahStr, 10);
      return {
        surahId,
        surahName: `Surah ${surahId}`,
        ayahNumber,
        text: r.text,
        verseKey: r.verse_key,
      };
    });
    return res.json(results);
  } catch (err) {
    logger.error({ err }, "Failed to search quran");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
