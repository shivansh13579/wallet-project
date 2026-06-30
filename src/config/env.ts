import dotenv from "dotenv";
dotenv.config();

function required(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required env var: ${key}`);
  return v;
}

export const env = {
  port: parseInt(process.env.PORT || "3000", 10),
  db: {
    host: required("DB_HOST"),
    port: parseInt(process.env.DB_PORT || "3306", 10),
    name: required("DB_NAME"),
    user: required("DB_USER"),
    password: required("DB_PASSWORD"),
  },
  nodeEnv: process.env.NODE_ENV || "development",
  idempotencyKeyTtlHours: parseInt(
    process.env.IDEMPOTENCY_TTL_HOURS || "72",
    10,
  ),
};
