import crypto from "node:crypto";
import type { RequestHandler } from "express";

function expectedPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

function matches(value: string, expected: string): boolean {
  const supplied = Buffer.from(value);
  const target = Buffer.from(expected);
  return supplied.length === target.length && crypto.timingSafeEqual(supplied, target);
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  const expected = expectedPassword();
  if (!expected) {
    res.status(503).json({ error: "ADMIN_PASSWORD is not configured" });
    return;
  }
  const supplied = String(req.header("x-admin-key") || "");
  if (!matches(supplied, expected)) {
    res.status(401).json({ error: "Invalid admin credentials" });
    return;
  }
  next();
};

export const verifyAdmin: RequestHandler = (req, res) => {
  requireAdmin(req, res, () => res.json({ authenticated: true }));
};
