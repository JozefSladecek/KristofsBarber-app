export function getMonthRange(date: Date = new Date()) {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const startOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    return { startOfMonth, startOfNextMonth };
}