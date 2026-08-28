import { createHmac, timingSafeEqual } from "crypto";
import type { Request, Response, NextFunction } from "express";

const SESSION_TTL_MS = 30 * 60 * 1000;

export function signDevToken(name: string, loginTime: number): string {
  const payload = `${name}:${loginTime}`;
  const sig = createHmac("sha256", process.env.DEV_PIN ?? "")
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifyDevToken(token: string): { name: string; loginTime: number } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return null;
    const [name, loginTimeStr, sig] = parts;
    const loginTime = parseInt(loginTimeStr, 10);
    if (isNaN(loginTime)) return null;

    if (Date.now() - loginTime > SESSION_TTL_MS) return null;

    const expected = createHmac("sha256", process.env.DEV_PIN ?? "")
      .update(`${name}:${loginTimeStr}`)
      .digest("hex");

    const sigBuf = Buffer.from(sig, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expBuf)) return null;

    return { name, loginTime };
  } catch {
    return null;
  }
}

export function devAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers["x-dev-session"] as string | undefined;
  if (!token) { res.status(401).json({ error: "No dev session" }); return; }

  const session = verifyDevToken(token);
  if (!session) { res.status(401).json({ error: "Invalid or expired dev session" }); return; }

  (req as any).devSession = session;
  next();
}
