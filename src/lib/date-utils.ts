export function getMonthRange(date: Date = new Date()) {
    const startOfMonth = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
    const startOfNextMonth = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 1));
    return { startOfMonth, startOfNextMonth };
}

// locative case ("v auguste", "vo februári") - Slovak month names don't follow a regular pattern here
const MONTH_LOCATIVE = [
    "V januári",
    "Vo februári",
    "V marci",
    "V apríli",
    "V máji",
    "V júni",
    "V júli",
    "V auguste",
    "V septembri",
    "V októbri",
    "V novembri",
    "V decembri",
];

export function monthLocative(date: Date) {
    return MONTH_LOCATIVE[date.getMonth()];
}