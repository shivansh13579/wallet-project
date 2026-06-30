import { app } from "./app";
import { env } from "./config/env";
import { connectWithRetry, sequelize } from "./database/sequelize";

async function main() {
  await connectWithRetry();
  await sequelize.sync();

  const server = app.listen(env.port, () => {
    console.log(`Listening on port ${env.port}`);
  });

  const shutdown = async () => {
    console.log("Shutting down...");
    server.close(async () => {
      await sequelize.close();
      process.exit(0);
    });
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
