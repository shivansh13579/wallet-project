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
  const { playerId } = req.params;
  if (!playerId || playerId.length > 64 || !/^[\w-]+$/.test(playerId)) {
    return res.status(400).json({ error: "invalid_player_id" });
  }
  next();
}
