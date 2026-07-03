import { Request, Response, NextFunction } from "express";
import { claimReward } from "../services/reward.service";

export async function claimController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const rewardId = String(req.params.rewardId);
    const playerId = String(req.body.playerId);

    const result = await claimReward(rewardId, playerId, req.idempotencyKey!);

    return res.status(result.statusCode).json(result.body);
  } catch (err) {
    next(err);
  }
}
