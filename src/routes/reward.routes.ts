import { Router } from "express";
import { claimController } from "../controllers/reward.controller";
import { validateBody } from "../middleware/validation.middleware";
import { claimSchema } from "../validation/reward.schema";
import {
  idempotencyMiddleware,
  checkIdempotency,
} from "../middleware/idempotency.middleware";

const router = Router();

router.post(
  "/:rewardId/claim",
  validateBody(claimSchema),
  idempotencyMiddleware,
  checkIdempotency,
  claimController,
);

export default router;
