import type { Request, Response, NextFunction } from "express";

interface AuthedRequest extends Request {
  userId?: string;
}

export function getUserId(req: Request): string | null {
  return (req as AuthedRequest).userId ?? null;
}

export function attachAuth(req: Request, _res: Response, next: NextFunction): void {
  const userId = req.signedCookies?.session as string | undefined;
  if (userId) {
    (req as AuthedRequest).userId = userId;
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!getUserId(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
