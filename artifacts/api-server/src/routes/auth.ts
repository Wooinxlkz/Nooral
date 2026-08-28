import { Router, type Request, type Response } from "express";
import { randomUUID } from "crypto";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { hashPassword, verifyPassword } from "../lib/password";
import { getUserId } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

const COOKIE_NAME = "session";
const COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function setSessionCookie(res: Response, userId: string): void {
  res.cookie(COOKIE_NAME, userId, {
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_MS,
    path: "/",
  });
}

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(200),
});

type UserRow = typeof usersTable.$inferSelect;

function toUserResponse(row: UserRow) {
  return {
    id: row.id,
    email: row.email,
    displayName: row.displayName,
    imageUrl: row.imageUrl,
  };
}

router.post("/signup", async (req: Request, res: Response) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
  }
  const { email, password } = parsed.data;

  try {
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (existing) {
      if (existing.passwordHash) {
        return res.status(409).json({ error: "An account with this email already exists." });
      }
      // Legacy row with no password set yet — claim it instead of failing.
      const passwordHash = await hashPassword(password);
      const [updated] = await db
        .update(usersTable)
        .set({ passwordHash, lastSeenAt: new Date() })
        .where(eq(usersTable.id, existing.id))
        .returning();
      setSessionCookie(res, updated.id);
      return res.status(200).json(toUserResponse(updated));
    }

    const passwordHash = await hashPassword(password);
    const [created] = await db
      .insert(usersTable)
      .values({ id: randomUUID(), email, passwordHash })
      .returning();
    setSessionCookie(res, created.id);
    return res.status(201).json(toUserResponse(created));
  } catch (err) {
    logger.error({ err }, "Signup failed");
    return res.status(500).json({ error: "Could not create account." });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Enter a valid email and password." });
  }
  const { email, password } = parsed.data;

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password. If you haven't signed up yet, please create an account." });
    }
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Incorrect password." });
    }
    await db.update(usersTable).set({ lastSeenAt: new Date() }).where(eq(usersTable.id, user.id));
    setSessionCookie(res, user.id);
    return res.json(toUserResponse(user));
  } catch (err) {
    logger.error({ err }, "Signin failed");
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

router.post("/signout", (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  return res.json({ ok: true });
});

router.get("/me", async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) return res.status(200).json(null);

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) return res.status(200).json(null);
    return res.json(toUserResponse(user));
  } catch (err) {
    logger.error({ err }, "Failed to fetch current user");
    return res.status(500).json({ error: "Internal server error" });
  }
});

const profileUpdateSchema = z.object({
  displayName: z.string().trim().min(1).max(100).optional(),
});

router.patch("/profile", async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const parsed = profileUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input." });
  }

  try {
    const [updated] = await db
      .update(usersTable)
      .set(parsed.data)
      .where(eq(usersTable.id, userId))
      .returning();
    if (!updated) return res.status(404).json({ error: "User not found" });
    return res.json(toUserResponse(updated));
  } catch (err) {
    logger.error({ err }, "Failed to update profile");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
