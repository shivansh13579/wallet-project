import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/sequelize";

export class IdempotencyKey extends Model {
  declare key: string;
  declare endpoint: string;
  declare requestHash: string;
  declare statusCode: number;
  declare responseBody: string;
  declare createdAt: Date;
}

IdempotencyKey.init(
  {
    key: { type: DataTypes.STRING(128), primaryKey: true },
    endpoint: { type: DataTypes.STRING(128), allowNull: false },
    requestHash: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    statusCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    responseBody: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "idempotency_keys",
    timestamps: true,
    updatedAt: false,
  },
);
