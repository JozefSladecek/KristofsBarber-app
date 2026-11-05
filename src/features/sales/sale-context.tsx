"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { PaymentMethod, Product } from "@/generated/prisma/client";

export type CartItem = {
    product: Product;
    quantity: number;
};

type SaleContextValue = {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    cartItems: CartItem[];
    addItem: (product: Product) => void;
    decrementItem: (productId: string) => void;
    removeItem: (productId: string) => void;
    paymentMethod: PaymentMethod;
    setPaymentMethod: (paymentMethod: PaymentMethod) => void;
    note: string;
    setNote: (note: string) => void;
    clear: () => void;
};

const SaleContext = createContext<SaleContextValue | null>(null);

export function SaleProvider({ children }: { children: ReactNode }) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
    const [note, setNote] = useState("");

    function addItem(product: Product) {
        setCartItems((items) => {
            const existing = items.find((item) => item.product.id === product.id);
            if (existing) {
                return items.map((item) =>
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
                );
            }
            return [...items, { product, quantity: 1 }];
        });
    }

    function decrementItem(productId: string) {
        setCartItems((items) =>
            items
                .map((item) => (item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
                .filter((item) => item.quantity > 0),
        );
    }

    function removeItem(productId: string) {
        setCartItems((items) => items.filter((item) => item.product.id !== productId));
    }

    function clear() {
        setDate(new Date());
        setCartItems([]);
        setPaymentMethod("CASH");
        setNote("");
    }

    return (
        <SaleContext.Provider
            value={{
                date,
                setDate,
                cartItems,
                addItem,
                decrementItem,
                removeItem,
                paymentMethod,
                setPaymentMethod,
                note,
                setNote,
                clear,
            }}
        >
            {children}
        </SaleContext.Provider>
    );
}

export function useSale() {
    const context = useContext(SaleContext);
    if (!context) {
        throw new Error("useSale must be used within SaleProvider");
    }
    return context;
}
