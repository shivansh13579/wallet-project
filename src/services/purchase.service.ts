import crypto from "crypto";
import { sequelize } from "../database/sequelize";
import { Transaction } from "sequelize";
import { WalletRepository } from "../repositories/wallet.repository";
import { InventoryRepository } from "../repositories/inventory.repository";
import { IdempotencyRepository } from "../repositories/idempotency.repository";
import { LedgerEntry } from "../models/ledger.model";

const walletRepo = new WalletRepository();
const inventoryRepo = new InventoryRepository();
const idemRepo = new IdempotencyRepository();

function hashBody(body: unknown) {
  return crypto.createHash("sha256").update(JSON.stringify(body)).digest("hex");
}

export async function purchaseItem(
  playerId: string,
  itemId: string,
  price: number,
  idempotencyKey: string,
) {
  const endpoint = `POST /v1/wallets/:playerId/purchase`;
  const requestHash = hashBody({ playerId, itemId, price });

  return sequelize.transaction(
    { isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ },
    async (t) => {
      // Row lock — this is what makes two concurrent purchases on the same
      // wallet serialize instead of racing. The second transaction blocks here
      // until the first commits or rolls back.
      const wallet = await walletRepo.getOrCreateForUpdate(playerId, t);
      const currentBalance = Number(wallet.balance);

      if (currentBalance < price) {
        const responseBody = {
          error: "insufficient_funds",
          balance: currentBalance,
          price,
        };
        // We still record the idempotency key for the REJECTION, so a retried
        // duplicate of a failed purchase gets the same rejection, not a recheck
        // against a balance that may have changed since.
        await idemRepo.record(
          idempotencyKey,
          endpoint,
          requestHash,
          402,
          responseBody,
          t,
        );
        return { statusCode: 402, body: responseBody };
      }

      wallet.balance = currentBalance - price;
      await wallet.save({ transaction: t });

      await inventoryRepo.grant(playerId, itemId, t);

      await LedgerEntry.create(
        {
          playerId,
          delta: -price,
          reason: `purchase:${itemId}`,
          idempotencyKey,
        },
        { transaction: t },
      );

      const responseBody = { balance: Number(wallet.balance), itemId };
      await idemRepo.record(
        idempotencyKey,
        endpoint,
        requestHash,
        200,
        responseBody,
        t,
      );

      return { statusCode: 200, body: responseBody };
      // Everything above is inside ONE transaction. If the process is killed
      // here, MySQL's InnoDB redo/undo log ensures on restart this transaction
      // is either fully committed or fully rolled back — never half-applied.
    },
  );
}
