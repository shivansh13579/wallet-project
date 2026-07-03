import { Request, Response, NextFunction } from "express";
import { creditWallet } from "../services/wallet.service";
import { Wallet } from "../models/wallet.model";

export async function creditController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const playerId = req.params.playerId as string;
    const { amount, reason } = req.body;
    const result = await creditWallet(
      playerId,
      amount,
      reason,
      req.idempotencyKey!,
    );
    res.status(result.statusCode).json(result.body);
  } catch (err) {
    next(err);
  }
}

export async function getWalletController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { playerId } = req.params;
    const wallet = await Wallet.findOne({ where: { playerId } });
    res.status(200).json({
      balance: wallet ? Number(wallet.balance) : 0,
      inventory: [],
      claimedRewards: [],
    });
  } catch (err) {
    next(err);
  }
}
