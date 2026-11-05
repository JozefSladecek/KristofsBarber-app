import { z } from "zod";

export const saleSchema = z.object({
    date: z.date(),
    paymentMethod: z.enum(["CASH", "CARD"]),
    note: z.string().nullable(),
    items: z
        .array(
            z.object({
                productId: z.string(),
                quantity: z.number().int().min(1),
            }),
        )
        .min(1, "Nákup musí obsahovať aspoň jednu položku")
        .refine((items) => new Set(items.map((item) => item.productId)).size === items.length, {
            message: "Nákup obsahuje duplicitný produkt",
        }),
});

export type SaleInput = z.infer<typeof saleSchema>;
