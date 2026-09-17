"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine, History, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/", label: "Zápis", icon: PenLine },
    { href: "/history", label: "História", icon: History },
    { href: "/prehlad", label: "Prehľad", icon: LayoutGrid },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="border-border bg-card fixed bottom-0 left-0 right-0 flex border-t">
            {navItems.map(({ href, label, icon: Icon }) => {
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