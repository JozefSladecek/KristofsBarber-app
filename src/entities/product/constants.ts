export const CATEGORY_LABELS = {
    PRODUCT: "Produkty",
    DRINK: "Nápoje",
} as const;

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[];
