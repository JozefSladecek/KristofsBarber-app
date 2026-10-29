import { z } from "zod";

export const entrySchema = z
    .object({
        date: z.date(),
        clients: z.number().int().min(0, "Počet klientov nemôže byť záporný"),
        cash: z.number().min(0, "Hotovosť nemôže byť záporná"),
        card: z.number().min(0, "Karta nemôže byť záporná"),
        envelopeCash: z.number().min(0, "Do obálky nemôže byť záporné").nullable(),
        note: z.string().nullable(),
    })
    .refine((data) => data.envelopeCash === null || data.envelopeCash >= data.cash, {
        message: "Do obálky nemôže byť menej ako hotovosť",
        path: ["envelopeCash"],
    });

export type EntryInput = z.infer<typeof entrySchema>;
