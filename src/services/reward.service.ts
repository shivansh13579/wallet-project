import crypto from "crypto";
import { sequelize } from "../database/sequelize";
import { Transaction } from "sequelize";
import { RewardRepository } from "../repositories/reward.repository";
import { IdempotencyRepository } from "../repositories/idempotency.repository";

const rewardRepo = new RewardRepository();
const idemRepo = new IdempotencyRepository();

function hashBody(body: unknown) {
  return crypto.createHash("sha256").update(JSON.stringify(body)).digest("hex");
}

export async function claimReward(
  rewardId: string,
  playerId: string,
  idempotencyKey: string,
) {
  const endpoint = `POST /v1/rewards/:rewardId/claim`;
  const requestHash = hashBody({ rewardId, playerId });

  return sequelize.transaction(
    { isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ },
    async (t) => {
      const already = await rewardRepo.hasClaimed(playerId, rewardId, t);
      if (already) {
        const responseBody = { error: "already_claimed", rewardId };
        await idemRepo.record(
          idempotencyKey,
          endpoint,
          requestHash,
          409,
          responseBody,
          t,
        );
        return { statusCode: 409, body: responseBody };
      }

      // The UNIQUE(player_id, reward_id) constraint is the real backstop here —
      // even if two requests both pass the check above (race), one INSERT wins
      // and the other throws a unique-constraint violation, which we catch below.
      try {
        await rewardRepo.markClaimed(playerId, rewardId, t);
      } catch (err: any) {
        if (err.name === "SequelizeUniqueConstraintError") {
          const responseBody = { error: "already_claimed", rewardId };
          await idemRepo.record(
            idempotencyKey,
            endpoint,
            requestHash,
            409,
            responseBody,
            t,
          );
          return { statusCode: 409, body: responseBody };
        }
        throw err;
      }

      const responseBody = { rewardId, claimed: true };
      await idemRepo.record(
        idempotencyKey,
        endpoint,
        requestHash,
        200,
        responseBody,
        t,
      );
      return { statusCode: 200, body: responseBody };
    },
  );
}
