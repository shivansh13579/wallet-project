import { z } from "zod";

export const claimSchema = z.object({
  playerId: z.string().min(1).max(64),
});
