import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
            <LoginForm />
        </div>
    );
}