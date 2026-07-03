import crypto from "crypto";
import { Transaction } from "sequelize";
import { sequelize } from "../database/sequelize";
import { WalletRepository } from "../repositories/wallet.repository";
import { IdempotencyRepository } from "../repositories/idempotency.repository";
import { LedgerEntry } from "../models/ledger.model";

const walletRepo = new WalletRepository();
const idemRepo = new IdempotencyRepository();

function hashBody(body: unknown) {
  return crypto.createHash("sha256").update(JSON.stringify(body)).digest("hex");
}

export async function creditWallet(
  playerId: string,
  amount: number,
  reason: string,
  idempotencyKey: string,
) {
  const endpoint = "POST /v1/wallets/:playerId/credit";
  const requestHash = hashBody({ playerId, amount, reason });

  return sequelize.transaction(
    // REPEATABLE_READ: our FOR UPDATE lock prevents phantom reads on this row
    { isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ },
    async (t) => {
      const wallet = await walletRepo.getOrCreateForUpdate(playerId, t);
      wallet.balance = Number(wallet.balance) + amount;
      await wallet.save({ transaction: t });

      // Ledger = append-only audit trail (answers the RESILIENCE.md question
      // "how would you detect a double-credit bug after the fact")
      await LedgerEntry.create(
        { playerId, delta: amount, reason, idempotencyKey },
        { transaction: t },
      );

      const responseBody = { balance: Number(wallet.balance) };

      // Writing the idempotency record INSIDE this transaction is critical:
      // if the process is killed before commit, both the balance update AND
      // the idempotency record roll back together → clean slate on restart.
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
