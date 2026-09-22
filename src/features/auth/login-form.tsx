"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin() {
        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Nesprávne meno alebo heslo");
        } else {
            router.push(callbackUrl);
        }
    }

    return (
        <div className="w-full max-w-sm flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label htmlFor="username">Meno</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="password">Heslo</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button onClick={handleLogin}>Prihlásiť sa</Button>
        </div>
    );
}