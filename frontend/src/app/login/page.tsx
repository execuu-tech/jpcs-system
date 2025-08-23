"use server"

import { getToken } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/src/components/LoginForm";

export default async function LoginPage() {
    const token = await getToken();
    if (token) {
        redirect("/");
    }

    return (
        <div className="h-[95vh] flex items-center justify-center bg-gray-100">
            <LoginForm />
        </div>
    );
}
