import { Transaction } from "sequelize";
import { Wallet } from "../models/wallet.model";

export class WalletRepository {
  async getOrCreateForUpdate(
    playerId: string,
    t: Transaction,
  ): Promise<Wallet> {
    const [wallet] = await Wallet.findOrCreate({
      where: { playerId },
      defaults: { playerId, balance: 0 },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    return wallet;
  }

  async readOnly(playerId: string): Promise<Wallet | null> {
    return Wallet.findOne({ where: { playerId } });
  }
}
