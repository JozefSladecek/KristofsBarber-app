import { z } from "zod";

export const saleSchema = z.object({
    date: z.date(),
    paymentMethod: z.enum(["CASH", "CARD"]),
    note: z.string().nullable(),
    items: z
        .array(
            z.object({
                productId: z.string(),
                productName: z.string(),
                pricePerUnit: z.number(),
                quantity: z.number().int().min(1),
            }),
        )
        .min(1, "Nákup musí obsahovať aspoň jednu položku"),
});

export type SaleInput = z.infer<typeof saleSchema>;
