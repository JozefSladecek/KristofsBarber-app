"use client";

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Employee = { id: string; name: string };

export function EmployeeSelect({ employees, selectedUserId }: { employees: Employee[]; selectedUserId?: string }) {
    const router = useRouter();

    function handleChange(value: string | null) {
        if (!value || value === "all") {
            router.push("/overview");
        } else {
            router.push(`/overview?employee=${value}`);
        }
    }

    const labels: Record<string, string> = {
        ...Object.fromEntries(employees.map((e) => [e.id, e.name])),
    };

    return (
        <Select value={selectedUserId ?? "all"} onValueChange={handleChange}>
            <SelectTrigger className="bg-card border-border w-full">
                <SelectValue placeholder="Zobraziť: Všetci">
                    {(value: string) => labels[value] ?? "Zobraziť: Všetci"}
                </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
                <SelectItem value="all">Všetci</SelectItem>
                {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}