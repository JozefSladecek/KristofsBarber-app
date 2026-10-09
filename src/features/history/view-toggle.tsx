import { Button } from "@/components/ui/button";

export type View = "list" | "calendar";

export function ViewToggle({ value, onChange }: { value: View; onChange: (view: View) => void }) {
    return (
        <div className="flex shrink-0 gap-2">
            <Button
                variant={value === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => onChange("list")}
            >
                Zoznam
            </Button>
            <Button
                variant={value === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => onChange("calendar")}
            >
                Kalendár
            </Button>
        </div>
    );
}
