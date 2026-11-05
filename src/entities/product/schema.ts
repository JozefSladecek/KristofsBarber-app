import { z } from "zod";

export const restockSchema = z.object({
    productId: z.string(),
    newStock: z.number().int().min(0),
});

export type RestockInput = z.infer<typeof restockSchema>;

export const productIdSchema = z.object({
    productId: z.string(),
});

export type ProductIdInput = z.infer<typeof productIdSchema>;
