import { Transaction } from "sequelize";
import { IdempotencyKey } from "../models/idempotency.model";

export class IdempotencyRepository {
  async record(
    key: string,
    endpoint: string,
    requestHash: string,
    statusCode: number,
    responseBody: unknown,
    t: Transaction,
  ) {
    return IdempotencyKey.create(
      {
        key,
        endpoint,
        requestHash,
        statusCode,
        responseBody: JSON.stringify(responseBody),
        // Keep for 72 hours; in prod a cron cleans up expired keys
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
      },
      { transaction: t },
    );
  }
}
