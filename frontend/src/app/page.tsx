// src/app/page.tsx
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth";
import HomeContent from "@/src/components/HomeContent"; // move your current JSX to this client component


export default function HomePage() {
    const token = getToken(); // server-side read

    if (!token) {
        // No valid token → redirect to login
        redirect("/login");
    }

    // Authenticated → render homepage content
    return <HomeContent />;
}
