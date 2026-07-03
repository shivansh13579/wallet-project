import { Transaction } from "sequelize";
import { InventoryItem } from "../models/inventory.model";

export class InventoryRepository {
  async grant(playerId: string, itemId: string, t: Transaction) {
    return InventoryItem.create({ playerId, itemId }, { transaction: t });
  }

  async listForPlayer(playerId: string): Promise<string[]> {
    const rows = await InventoryItem.findAll({ where: { playerId } });
    return rows.map((r) => r.itemId);
  }
}
