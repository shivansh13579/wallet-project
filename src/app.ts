import express from "express";
import pinoHttp from "pino-http";

export const app = express();

app.use(pinoHttp());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((req, res) => res.status(404).json({ error: "not_found" }));
