import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { IdempotencyKey } from "../models/idempotency.model";

declare global {
  namespace Express {
    interface Request {
      idempotencyKey?: string;
    }
  }
}

function hashBody(body: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(body)).digest("hex");
}

export function idempotencyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const headerKey = req.header("Idempotency-Key");
  const derivedKey = `${req.method}:${req.originalUrl}:${hashBody(req.body)}`;
  req.idempotencyKey = headerKey || derivedKey;
  next();
}

export async function checkIdempotency(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const key = req.idempotencyKey!;
    const existing = await IdempotencyKey.findByPk(key);

    if (existing) {
      const currentHash = hashBody(req.body);
      if (existing.requestHash !== currentHash) {
        return res.status(409).json({
          error: "idempotency_key_conflict",
          message:
            "This Idempotency-Key was already used with a different request body.",
        });
      }
      return res
        .status(existing.statusCode)
        .json(JSON.parse(existing.responseBody));
    }

    next();
  } catch (err) {
    next(err);
  }
}
