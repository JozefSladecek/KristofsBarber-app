"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Employee = { id: string; name: string };

export function EmployeeSelect({ employees, selectedUserId }: { employees: Employee[]; selectedUserId?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    function handleChange(value: string | null) {
        const params = new URLSearchParams(searchParams);
        if (!value || value === "all") {
            params.delete("employee");
        } else {
            params.set("employee", value);
        }
        const query = params.toString();
        router.push(query ? `/overview?${query}` : "/overview");
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