"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LOGIN_URL = "/api/login/";

export default function LoginForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const jsonData = JSON.stringify(Object.fromEntries(formData));

        try {
            const response = await fetch(LOGIN_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: jsonData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Logged in as ${data.username}. Welcome!`, { duration: 2000 });
                router.refresh();
                router.push("/");
            } else {
                toast.error(data.detail || "Invalid username or password", { duration: 2000 });
                setError(data.detail || "Invalid username or password");
            }
        } catch {
            const msg = "Something went wrong. Please try again.";
            toast.error(msg, { duration: 2000 });
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

            {error && <div className="mb-4 text-red-500 font-medium text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
