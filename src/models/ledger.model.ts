import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/sequelize";

export class LedgerEntry extends Model {
  declare id: number;
  declare playerId: string;
  declare delta: number;
  declare reason: string;
  declare idempotencyKey: string;
}

LedgerEntry.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    playerId: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    delta: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    idempotencyKey: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "ledger",
    timestamps: true,
    updatedAt: false,
  },
);
