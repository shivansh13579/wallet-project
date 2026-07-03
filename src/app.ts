import express from "express";
import pinoHttp from "pino-http";
import walletRoutes from "./routes/wallet.routes";
import rewardRoutes from "./routes/reward.routes";
import {
  errorMiddleware,
  jsonErrorMiddleware,
} from "./middleware/error.middleware";

export const app = express();

app.use(pinoHttp());
app.use(express.json({ limit: "10kb" }));
app.use(jsonErrorMiddleware);

// app.use("/v1/wallets", walletRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use((req, res) => res.status(404).json({ error: "not_found" }));
app.use(errorMiddleware);
