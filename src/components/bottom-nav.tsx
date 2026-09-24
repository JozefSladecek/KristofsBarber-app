"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine, History, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/", label: "Zápis", icon: PenLine, visibleToAll: true },
    { href: "/history", label: "História", icon: History, visibleToAll: true },
    { href: "/overview", label: "Prehľad", icon: LayoutGrid, visibleToAll: false },
];

export function BottomNav({ role }: { role: string | undefined }) {
    const pathname = usePathname();
    const isAdmin = role === "ADMIN" || role === "OWNER";

    const visibleItems = navItems.filter((item) => item.visibleToAll || isAdmin);

    return (
        <nav className="border-border bg-card flex shrink-0 border-t">
            {visibleItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "flex flex-1 flex-col items-center gap-1 py-3 text-xs uppercase tracking-wide transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        <Icon className="h-5 w-5" />
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}