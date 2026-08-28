import { Router, type Request as ExpressRequest } from "express";
import { db, usersTable } from "@workspace/db";
import {
  bookmarksTable, notesTable, hardAyahsTable, memorizationTable,
  donationsTable, streaksTable, readingLogsTable,
  devFailedLoginsTable, devActivityLogTable, featureFlagsTable,
  announcementsTable, feedbackTable, broadcastLogTable,
  readingGoalsTable, goalProgressTable,
  tasbihTable, ayahMoodsTable, khatmHistoryTable,
  libraryProgressTable, libraryBookmarksTable, libraryNotesTable,
  lastReadTable, pinnedVersesTable,
} from "@workspace/db";
import { eq, sql, desc, count, sum, gte, inArray, isNotNull, and, ilike, type SQL } from "drizzle-orm";
import { z } from "zod/v4";
import { signDevToken, verifyDevToken, devAuthMiddleware } from "../middlewares/devAuth";
import { logger } from "../lib/logger";

/* ── Local user stats / listing (replaces Clerk REST API) ───────── */
async function getUserCounts() {
  try {
    const day1 = new Date(Date.now() - 24 * 3600 * 1000);
    const day7 = new Date(Date.now() - 7 * 24 * 3600 * 1000);

    const [[allUsers], [newToday], [newThisWeek]] = await Promise.all([
      db.select({ c: count() }).from(usersTable),
      db.select({ c: count() }).from(usersTable).where(gte(usersTable.createdAt, day1)),
      db.select({ c: count() }).from(usersTable).where(gte(usersTable.createdAt, day7)),
    ]);

    return {
      totalUsers: Number(allUsers?.c ?? 0),
      newUsers24h: Number(newToday?.c ?? 0),
      newUsers7d: Number(newThisWeek?.c ?? 0),
    };
  } catch (err) {
    logger.warn({ err }, "User count fetch failed");
    return { totalUsers: null, newUsers24h: null, newUsers7d: null };
  }
}

async function getAppUsers(limit = 20, offset = 0, query?: string) {
  try {
    const where = query ? ilike(usersTable.email, `%${query}%`) : undefined;
    const [rows, [{ c: total }]] = await Promise.all([
      db.select().from(usersTable)
        .where(where)
        .orderBy(desc(usersTable.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ c: count() }).from(usersTable).where(where),
    ]);
    return { users: rows, totalCount: Number(total ?? 0) };
  } catch (err) {
    logger.warn({ err }, "User list fetch failed");
    return { users: [], totalCount: 0 };
  }
}

const router = Router();

/* ── In-memory rate limiter for auth attempts ─────────────────── */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5; // max failed attempts before lockout

interface RateRecord { count: number; firstAttempt: number }
const authFailures = new Map<string, RateRecord>();

function isRateLimited(ip: string): boolean {
  const rec = authFailures.get(ip);
  if (!rec) return false;
  if (Date.now() - rec.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    authFailures.delete(ip);
    return false;
  }
  return rec.count >= RATE_LIMIT_MAX;
}

function recordAuthFailure(ip: string): void {
  const rec = authFailures.get(ip);
  const now = Date.now();
  if (!rec || now - rec.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    authFailures.set(ip, { count: 1, firstAttempt: now });
  } else {
    rec.count++;
  }
}

function clearAuthFailures(ip: string): void {
  authFailures.delete(ip);
}

/* ── Auth ─────────────────────────────────────────────────────── */
router.post("/auth", async (req, res) => {
  const { name, pin } = req.body ?? {};
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim()
    ?? req.socket?.remoteAddress
    ?? "unknown";

  if (!name || !pin) return res.status(400).json({ error: "Missing fields" });

  const devName = process.env.DEV_NAME;
  const devPin = process.env.DEV_PIN;

  if (!devName || !devPin) {
    return res.status(500).json({ error: "Dev credentials not configured" });
  }

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many failed attempts. Try again in 10 minutes." });
  }

  if (name === devName && String(pin) === String(devPin)) {
    clearAuthFailures(ip);
    const token = signDevToken(name, Date.now());
    await db.insert(devActivityLogTable).values({
      action: "dev_login",
      details: `Login from ${ip}`,
      devName: name,
    }).catch(() => {});
    return res.json({ token, name });
  }

  recordAuthFailure(ip);
  await db.insert(devFailedLoginsTable).values({
    attemptedName: String(name).slice(0, 100),
    ip,
  }).catch(() => {});

  return res.status(401).json({ error: "Access denied" });
});

/* ── Verify token ─────────────────────────────────────────────── */
router.get("/verify", (req, res) => {
  const token = req.headers["x-dev-session"] as string | undefined;
  if (!token) return res.status(401).json({ valid: false });
  const session = verifyDevToken(token);
  if (!session) return res.status(401).json({ valid: false });
  return res.json({ valid: true, name: session.name, loginTime: session.loginTime });
});

/* ── All routes below require dev auth ───────────────────────── */
router.use(devAuthMiddleware);

async function logActivity(req: ExpressRequest & { devSession?: { name: string } }, action: string, details?: string) {
  const devName = req.devSession?.name ?? "unknown";
  await db.insert(devActivityLogTable).values({ action, details, devName }).catch(() => {});
}

/* ── Stats / Overview ─────────────────────────────────────────── */
router.get("/stats", async (req, res) => {
  try {
    const now = new Date();
    const day1 = new Date(now.getTime() - 24 * 3600 * 1000);
    const day7 = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    const day30 = new Date(now.getTime() - 30 * 24 * 3600 * 1000);

    const [
      dbResults,
      userCounts,
    ] = await Promise.all([
      Promise.all([
        db.select({ totalBookmarks: count() }).from(bookmarksTable),
        db.select({ totalNotes: count() }).from(notesTable),
        db.select({ totalMemorization: count() }).from(memorizationTable),
        db.select({ totalDonationSupport: sum(donationsTable.amount) })
          .from(donationsTable).where(eq(donationsTable.type, "support")),
        db.select({ totalDonationSadaqah: sum(donationsTable.amount) })
          .from(donationsTable).where(eq(donationsTable.type, "sadaqah")),
        db.selectDistinct({ userId: readingLogsTable.userId })
          .from(readingLogsTable).where(gte(readingLogsTable.readAt, day1)),
        db.selectDistinct({ userId: readingLogsTable.userId })
          .from(readingLogsTable).where(gte(readingLogsTable.readAt, day7)),
        db.select({
          date: sql<string>`date_trunc('day', ${readingLogsTable.readAt})::text`,
          count: count(),
        }).from(readingLogsTable)
          .where(gte(readingLogsTable.readAt, day30))
          .groupBy(sql`date_trunc('day', ${readingLogsTable.readAt})`)
          .orderBy(sql`date_trunc('day', ${readingLogsTable.readAt})`),
        db.select({ topSurah: readingLogsTable.surahNameEn, cnt: count() })
          .from(readingLogsTable)
          .where(gte(readingLogsTable.readAt, day1))
          .groupBy(readingLogsTable.surahNameEn)
          .orderBy(desc(count()))
          .limit(1),
      ]),
      getUserCounts(),
    ]);

    const [
      [{ totalBookmarks }],
      [{ totalNotes }],
      [{ totalMemorization }],
      [{ totalDonationSupport }],
      [{ totalDonationSadaqah }],
      activeUsers24h,
      activeUsers7d,
      readingLast30Days,
      topSurahToday,
    ] = dbResults;

    return res.json({
      totalUsers: userCounts.totalUsers,
      totalBookmarks,
      totalNotes,
      totalMemorization,
      totalDonationSupport: totalDonationSupport ?? "0",
      totalDonationSadaqah: totalDonationSadaqah ?? "0",
      activeUsers24h: activeUsers24h.length,
      activeUsers7d: activeUsers7d.length,
      newUsers24h: userCounts.newUsers24h,
      newUsers7d: userCounts.newUsers7d,
      readingLast30Days,
      topSurahToday: topSurahToday[0]?.topSurah ?? null,
    });
  } catch (err) {
    logger.error({ err }, "dev/stats failed");
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
});

/* ── Users ────────────────────────────────────────────────────── */
router.get("/users", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10));
    const limit = 20;
    const offset = (page - 1) * limit;
    const search = (req.query.search as string | undefined)?.trim() || undefined;

    // Fetch real users from our own database
    const { users: appUsers, totalCount } = await getAppUsers(limit, offset, search);

    if (!appUsers.length) {
      return res.json({ users: [], total: 0, page, pages: 0 });
    }

    const userIds = appUsers.map((u) => u.id);

    // Fetch activity data from our DB for these users
    const [bookmarkCounts, noteCounts, activityRows] = await Promise.all([
      db.select({ userId: bookmarksTable.userId, cnt: count() })
        .from(bookmarksTable)
        .where(inArray(bookmarksTable.userId, userIds))
        .groupBy(bookmarksTable.userId),
      db.select({ userId: notesTable.userId, cnt: count() })
        .from(notesTable)
        .where(inArray(notesTable.userId, userIds))
        .groupBy(notesTable.userId),
      db.select({
        userId: readingLogsTable.userId,
        lastActive: sql<string>`max(${readingLogsTable.readAt})::text`,
        sessions: count(),
      })
        .from(readingLogsTable)
        .where(inArray(readingLogsTable.userId, userIds))
        .groupBy(readingLogsTable.userId),
    ]);

    const bookmarkMap = new Map(bookmarkCounts.map((r) => [r.userId, r.cnt]));
    const noteMap     = new Map(noteCounts.map((r) => [r.userId, r.cnt]));
    const activityMap = new Map(activityRows.map((r) => [r.userId, r]));

    const total = totalCount;

    return res.json({
      users: appUsers.map((u) => {
        const activity = activityMap.get(u.id);
        return {
          userId:      u.id,
          email:       u.email,
          firstName:   u.displayName?.split(/\s+/)[0] ?? null,
          lastName:    u.displayName?.split(/\s+/).slice(1).join(" ") || null,
          username:    u.email ? u.email.split("@")[0] : null,
          imageUrl:    u.imageUrl,
          joinDate:    u.createdAt ? u.createdAt.toISOString() : null,
          lastActive:  activity?.lastActive ?? null,
          sessions:    activity?.sessions ?? 0,
          bookmarks:   bookmarkMap.get(u.id) ?? 0,
          notes:       noteMap.get(u.id) ?? 0,
        };
      }),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    logger.error({ err }, "dev/users failed");
    return res.status(500).json({ error: "Failed to fetch users" });
  }
});

/* ── Feedback ────────────────────────────────────────────────── */
router.get("/feedback", async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const type = req.query.type as string | undefined;

    const conditions: SQL[] = [];
    if (status && status !== "all") conditions.push(eq(feedbackTable.status, status));
    if (type && type !== "all") conditions.push(eq(feedbackTable.type, type));

    const rows = await db
      .select()
      .from(feedbackTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(feedbackTable.createdAt))
      .limit(100);
    const [{ total }] = await db.select({ total: count() }).from(feedbackTable);
    const [{ unread }] = await db.select({ unread: count() }).from(feedbackTable)
      .where(eq(feedbackTable.status, "new"));
    return res.json({ feedback: rows, total, unread });
  } catch (err) {
    logger.error({ err }, "dev/feedback failed");
    return res.status(500).json({ error: "Failed" });
  }
});

router.post("/feedback", async (req, res) => {
  const { name, email, country, type, subject, message } = req.body ?? {};
  if (!message) return res.status(400).json({ error: "Missing message" });
  const [row] = await db.insert(feedbackTable)
    .values({ name, email, country, type: type ?? "general", subject, message })
    .returning();
  return res.status(201).json(row);
});

router.patch("/feedback/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, devNote } = req.body ?? {};
    const [row] = await db.update(feedbackTable)
      .set({ ...(status ? { status } : {}), ...(devNote !== undefined ? { devNote } : {}) })
      .where(eq(feedbackTable.id, id))
      .returning();
    await logActivity(req as any, "feedback_update", `id=${id} status=${status}`);
    return res.json(row);
  } catch (err) {
    return res.status(500).json({ error: "Failed" });
  }
});

router.delete("/feedback/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await db.delete(feedbackTable).where(eq(feedbackTable.id, id));
  await logActivity(req as any, "feedback_delete", `id=${id}`);
  return res.json({ ok: true });
});

/* ── Financial ───────────────────────────────────────────────── */
router.get("/financial", async (req, res) => {
  try {
    const rows = await db.select().from(donationsTable)
      .orderBy(desc(donationsTable.createdAt)).limit(200);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekStart = new Date(now.getTime() - 7 * 24 * 3600 * 1000);

    const [
      [{ totalSupport }],
      [{ totalSadaqah }],
      [{ thisMonth }],
      [{ thisWeek }],
      monthly,
    ] = await Promise.all([
      db.select({ totalSupport: sum(donationsTable.amount) }).from(donationsTable)
        .where(eq(donationsTable.type, "support")),
      db.select({ totalSadaqah: sum(donationsTable.amount) }).from(donationsTable)
        .where(eq(donationsTable.type, "sadaqah")),
      db.select({ thisMonth: sum(donationsTable.amount) }).from(donationsTable)
        .where(gte(donationsTable.createdAt, monthStart)),
      db.select({ thisWeek: sum(donationsTable.amount) }).from(donationsTable)
        .where(gte(donationsTable.createdAt, weekStart)),
      db.select({
        month: sql<string>`to_char(date_trunc('month', ${donationsTable.createdAt}), 'YYYY-MM')`,
        type: donationsTable.type,
        total: sum(donationsTable.amount),
      }).from(donationsTable)
        .groupBy(sql`date_trunc('month', ${donationsTable.createdAt})`, donationsTable.type)
        .orderBy(sql`date_trunc('month', ${donationsTable.createdAt})`),
    ]);

    return res.json({
      donations: rows,
      summary: {
        totalSupport: totalSupport ?? "0",
        totalSadaqah: totalSadaqah ?? "0",
        thisMonth: thisMonth ?? "0",
        thisWeek: thisWeek ?? "0",
      },
      monthly,
    });
  } catch (err) {
    logger.error({ err }, "dev/financial failed");
    return res.status(500).json({ error: "Failed" });
  }
});

/* ── Feature Flags ───────────────────────────────────────────── */
const DEFAULT_FLAGS = [
  "quran_reader", "library", "memorization", "ahadith", "duas_adhkar",
  "prayer_times", "support_sadaqah", "user_registration", "audio_player",
  "maintenance_mode",
];

router.get("/feature-flags", async (req, res) => {
  try {
    const existing = await db.select().from(featureFlagsTable);
    const existingNames = new Set(existing.map((f) => f.flagName));

    const missing = DEFAULT_FLAGS.filter((f) => !existingNames.has(f));
    if (missing.length) {
      await db.insert(featureFlagsTable)
        .values(missing.map((flagName) => ({ flagName, enabled: true })))
        .onConflictDoNothing();
    }

    const flags = await db.select().from(featureFlagsTable).orderBy(featureFlagsTable.flagName);
    return res.json(flags);
  } catch (err) {
    return res.status(500).json({ error: "Failed" });
  }
});

router.patch("/feature-flags/:flagName", async (req, res) => {
  try {
    const { enabled } = req.body ?? {};
    const flagName = req.params.flagName;
    await db.insert(featureFlagsTable)
      .values({ flagName, enabled: Boolean(enabled), updatedAt: new Date() })
      .onConflictDoUpdate({
        target: featureFlagsTable.flagName,
        set: { enabled: Boolean(enabled), updatedAt: new Date() },
      });
    await logActivity(req as any, "feature_flag_toggle", `${flagName}=${enabled}`);
    const [flag] = await db.select().from(featureFlagsTable)
      .where(eq(featureFlagsTable.flagName, flagName));
    return res.json(flag);
  } catch (err) {
    return res.status(500).json({ error: "Failed" });
  }
});

/* ── Announcements ───────────────────────────────────────────── */
router.get("/announcements", async (req, res) => {
  const rows = await db.select().from(announcementsTable)
    .orderBy(desc(announcementsTable.createdAt)).limit(20);
  return res.json(rows);
});

router.get("/announcements/active", async (_req, res) => {
  const [row] = await db.select().from(announcementsTable)
    .where(eq(announcementsTable.active, true))
    .orderBy(desc(announcementsTable.createdAt))
    .limit(1);
  return res.json(row ?? null);
});

router.post("/announcements", async (req, res) => {
  try {
    const { messageEn, messageAr, active } = req.body ?? {};
    if (active) {
      await db.update(announcementsTable).set({ active: false });
    }
    const [row] = await db.insert(announcementsTable)
      .values({ messageEn, messageAr, active: Boolean(active) })
      .returning();
    await logActivity(req as any, "announcement_created", `active=${active}`);
    return res.status(201).json(row);
  } catch (err) {
    return res.status(500).json({ error: "Failed" });
  }
});

router.patch("/announcements/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { messageEn, messageAr, active } = req.body ?? {};
    if (active) {
      await db.update(announcementsTable).set({ active: false });
    }
    const [row] = await db.update(announcementsTable)
      .set({ messageEn, messageAr, active: Boolean(active) })
      .where(eq(announcementsTable.id, id))
      .returning();
    await logActivity(req as any, "announcement_updated", `id=${id} active=${active}`);
    return res.json(row);
  } catch (err) {
    return res.status(500).json({ error: "Failed" });
  }
});

router.delete("/announcements/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await db.delete(announcementsTable).where(eq(announcementsTable.id, id));
  await logActivity(req as any, "announcement_deleted", `id=${id}`);
  return res.json({ ok: true });
});

/* ── DB Stats ────────────────────────────────────────────────── */
router.get("/db-stats", async (_req, res) => {
  try {
    const tables = [
      { name: "reading_logs",       table: readingLogsTable },
      { name: "bookmarks",          table: bookmarksTable },
      { name: "notes",              table: notesTable },
      { name: "hard_ayahs",         table: hardAyahsTable },
      { name: "memorization_progress", table: memorizationTable },
      { name: "streaks",            table: streaksTable },
      { name: "reading_goals",      table: readingGoalsTable },
      { name: "goal_progress",      table: goalProgressTable },
      { name: "last_read",          table: lastReadTable },
      { name: "pinned_verses",      table: pinnedVersesTable },
      { name: "ayah_moods",         table: ayahMoodsTable },
      { name: "tasbih_history",     table: tasbihTable },
      { name: "khatm_history",      table: khatmHistoryTable },
      { name: "library_progress",   table: libraryProgressTable },
      { name: "library_bookmarks",  table: libraryBookmarksTable },
      { name: "library_notes",      table: libraryNotesTable },
      { name: "donations",          table: donationsTable },
      { name: "feature_flags",      table: featureFlagsTable },
      { name: "announcements",      table: announcementsTable },
      { name: "feedback",           table: feedbackTable },
      { name: "dev_failed_logins",  table: devFailedLoginsTable },
      { name: "dev_activity_log",   table: devActivityLogTable },
      { name: "broadcast_log",      table: broadcastLogTable },
    ];

    const counts = await Promise.all(
      tables.map(async ({ name, table }) => {
        const [{ cnt }] = await db.select({ cnt: count() }).from(table);
        return { name, count: cnt };
      })
    );

    return res.json(counts);
  } catch (err) {
    return res.status(500).json({ error: "Failed" });
  }
});

/* ── Security Log ────────────────────────────────────────────── */
router.get("/security-log", async (_req, res) => {
  try {
    const logs = await db.select().from(devFailedLoginsTable)
      .orderBy(desc(devFailedLoginsTable.timestamp)).limit(100);
    const activity = await db.select().from(devActivityLogTable)
      .orderBy(desc(devActivityLogTable.timestamp)).limit(50);
    return res.json({ failedLogins: logs, activity });
  } catch (err) {
    return res.status(500).json({ error: "Failed" });
  }
});

/* ── Broadcast ───────────────────────────────────────────────── */
router.get("/broadcast-log", async (_req, res) => {
  const logs = await db.select().from(broadcastLogTable)
    .orderBy(desc(broadcastLogTable.sentAt)).limit(50);
  return res.json(logs);
});

router.post("/broadcast", async (req, res) => {
  try {
    const { subject, recipientType, body, specificEmail } = req.body ?? {};
    if (!subject || !recipientType) return res.status(400).json({ error: "Missing fields" });

    // Calculate real recipient count
    let recipientCount = 0;
    try {
      if (recipientType === "specific") {
        recipientCount = specificEmail ? 1 : 0;
      } else if (recipientType === "active") {
        const day7 = new Date(Date.now() - 7 * 24 * 3600 * 1000);
        const rows = await db
          .selectDistinct({ userId: readingLogsTable.userId })
          .from(readingLogsTable)
          .where(gte(readingLogsTable.readAt, day7));
        recipientCount = rows.length;
      } else {
        // "all" → total registered users
        const [{ c }] = await db.select({ c: count() }).from(usersTable);
        recipientCount = Number(c ?? 0);
      }
    } catch { recipientCount = 0; }

    const devName = ((req as any).devSession as any)?.name ?? "dev";
    const [row] = await db.insert(broadcastLogTable).values({
      subject,
      recipientType,
      recipientCount,
      bodyPreview: String(body ?? "").slice(0, 200),
      sentBy: devName,
    }).returning();

    await logActivity(req as any, "broadcast_sent", `subject="${subject}" to=${recipientType} count=${recipientCount}`);
    return res.status(201).json({ ...row, recipientCount, note: "logged_only" });
  } catch (err) {
    return res.status(500).json({ error: "Failed" });
  }
});

export default router;
