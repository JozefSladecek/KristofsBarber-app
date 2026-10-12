type SummarizableEntry = {
    clients: number;
    cash: number;
    card: number;
    envelopeCash: number | null;
};

export function summarizeEntries(entries: SummarizableEntry[]) {
    return entries.reduce(
        (acc, entry) => ({
            clients: acc.clients + entry.clients,
            cash: acc.cash + entry.cash,
            card: acc.card + entry.card,
            total: acc.total + entry.cash + entry.card,
            toReturn: acc.toReturn + (entry.envelopeCash ?? entry.cash) - entry.cash,
        }),
        { clients: 0, cash: 0, card: 0, total: 0, toReturn: 0 }
    );
}

export function applyPaidOut<T extends { toReturn: number }>(summary: T, paidOut: number): T {
    return { ...summary, toReturn: summary.toReturn - paidOut };
}
