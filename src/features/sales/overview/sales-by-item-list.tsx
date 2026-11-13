import { ChevronDown } from "lucide-react";

type ItemCategory = {
    category: string;
    label: string;
    quantity: number;
    total: number;
    items: { productName: string; quantity: number; total: number }[];
};

function formatEur(value: number) {
    return `${value.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €`;
}

export function SalesByItemList({ categories }: { categories: ItemCategory[] }) {
    return (
        <section className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Podľa položky</h3>
            <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card [&>details+details]:border-t [&>details+details]:border-border">
                {categories.map((category) => (
                    <details key={category.category}>
                        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-3 tabular-nums hover:bg-muted">
                            <span className="flex-1 text-xs font-semibold uppercase tracking-wide text-primary">
                                {category.label}
                            </span>
                            <span className="text-muted-foreground">{category.quantity} ks</span>
                            <span className="min-w-16 text-right font-bold">{formatEur(category.total)}</span>
                            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </summary>
                        <ul className="divide-y divide-border border-t border-border">
                            {category.items.map((item) => (
                                <li
                                    key={item.productName}
                                    className="flex items-baseline gap-3 px-3 py-2 tabular-nums"
                                >
                                    <span className="flex-1 min-w-0">{item.productName}</span>
                                    <span className="text-muted-foreground">{item.quantity} ks</span>
                                    <span className="min-w-16 text-right">{formatEur(item.total)}</span>
                                </li>
                            ))}
                        </ul>
                    </details>
                ))}
            </div>
            <p className="text-xs text-muted-foreground">
                Zoradené podľa tržby. Položky bez predaja v mesiaci sa nezobrazujú.
            </p>
        </section>
    );
}
