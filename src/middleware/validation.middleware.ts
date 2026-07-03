import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "invalid_request",
        details: result.error.flatten(),
      });
    }

    req.body = result.data;
    next();
  };
}

export function validatePlayerId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const playerId = String(req.params.playerId);

  if (!playerId || playerId.length > 64 || !/^[A-Za-z0-9_-]+$/.test(playerId)) {
    return res.status(400).json({
      error: "invalid_player_id",
    });
  }

  next();
}
