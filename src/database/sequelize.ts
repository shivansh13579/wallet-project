import { Sequelize } from "sequelize";
import { env } from "../config/env";

export const sequelize = new Sequelize(
  env.db.name,
  env.db.user,
  env.db.password,
  {
    host: env.db.host,
    port: env.db.port,
    dialect: "mysql",
    logging: false,
    pool: { max: 10, min: 0, idle: 10000 },
  },
);

export async function connectWithRetry(
  retries = 10,
  delayMs = 2000,
): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log("DB connected");
      return;
    } catch (err) {
      console.log(`DB not ready (attempt ${i + 1}/${retries}), retrying...`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error("Could not connect to DB after retries");
}
