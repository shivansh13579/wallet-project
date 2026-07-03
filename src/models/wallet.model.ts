import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/sequelize";

export class Wallet extends Model {
  declare playerId: string;
  declare balance: number;
}

Wallet.init(
  {
    playerId: {
      type: DataTypes.STRING(64),
      primaryKey: true,
    },
    balance: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: "wallets",
    timestamps: true,
  },
);
