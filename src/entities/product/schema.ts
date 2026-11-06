import { z } from "zod";

export const productSchema = z.object({
    name: z.string().trim().min(1, "Zadaj názov"),
    category: z.enum(["PRODUCT", "DRINK"]),
    price: z.number().gt(0, "Cena musí byť väčšia ako 0 €"),
    stock: z.number().int().min(0),
    lowStockThreshold: z.number().int().min(0),
});

export type ProductInput = z.infer<typeof productSchema>;

export const restockSchema = z.object({
    productId: z.string(),
    newStock: z.number().int().min(0),
});

export type RestockInput = z.infer<typeof restockSchema>;

export const productIdSchema = z.object({
    productId: z.string(),
});

export type ProductIdInput = z.infer<typeof productIdSchema>;
