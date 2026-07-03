import { Transaction } from "sequelize";
import { ClaimedReward } from "../models/reward.model";

export class RewardRepository {
  async hasClaimed(playerId: string, rewardId: string, t?: Transaction) {
    const row = await ClaimedReward.findOne({
      where: { playerId, rewardId },
      transaction: t,
    });
    return !!row;
  }

  async markClaimed(playerId: string, rewardId: string, t: Transaction) {
    return ClaimedReward.create({ playerId, rewardId }, { transaction: t });
  }

  async listForPlayer(playerId: string): Promise<string[]> {
    const rows = await ClaimedReward.findAll({ where: { playerId } });
    return rows.map((r) => r.rewardId);
  }
}
