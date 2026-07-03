import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/sequelize";

export class ClaimedReward extends Model {
  declare id: number;
  declare playerId: string;
  declare rewardId: string;
}

ClaimedReward.init(
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    playerId: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    rewardId: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "claimed_rewards",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["playerId", "rewardId"],
      },
    ],
  },
);
