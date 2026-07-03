import { Router } from "express";
import {
  creditController,
  getWalletController,
} from "../controllers/wallet.controller";
import {
  validateBody,
  validatePlayerId,
} from "../middleware/validation.middleware";
import { creditSchema } from "../validation/wallet.schema";
import {
  idempotencyMiddleware,
  checkIdempotency,
} from "../middleware/idempotency.middleware";

const router = Router();

router.post(
  "/:playerId/credit",
  validatePlayerId,
  validateBody(creditSchema),
  idempotencyMiddleware,
  checkIdempotency,
  creditController,
);

router.get("/:playerId", validatePlayerId, getWalletController);

export default router;
