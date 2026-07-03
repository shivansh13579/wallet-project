import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/sequelize";

export class InventoryItem extends Model {
  declare id: number;
  declare playerId: string;
  declare itemId: string;
}

InventoryItem.init(
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    playerId: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    itemId: { type: DataTypes.STRING(64), allowNull: false },
  },
  {
    sequelize,
    tableName: "inventory",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["playerId", "itemId"],
      },
    ],
  },
);
