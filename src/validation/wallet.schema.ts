import { z } from "zod";

export const creditSchema = z.object({
  amount: z.number().int().positive().max(1_000_000_000),
  reason: z.string().min(1).max(128).trim(),
});

export const purchaseSchema = z.object({
  itemId: z.string().min(1).max(64).trim(),
  price: z.number().int().positive().max(1_000_000_000),
});
