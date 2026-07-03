import { Request, Response, NextFunction } from "express";
import { claimReward } from "../services/reward.service";

export async function claimController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { rewardId } = req.params;
    const { playerId } = req.body;
    const result = await claimReward(rewardId, playerId, req.idempotencyKey!);
    res.status(result.statusCode).json(result.body);
  } catch (err) {
    next(err);
  }
}
