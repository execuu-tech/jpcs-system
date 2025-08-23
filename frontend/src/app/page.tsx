// src/app/page.tsx
import { redirect } from "next/navigation";
import { getToken } from "@/src/lib/auth";
import HomeContent from "@/src/components/HomeContent"; // move your current JSX to this client component


export default async function HomePage() {
    const token = await getToken(); // server-side read

    if (!token) {
        // No valid token → redirect to login
        redirect("/login");
    }

    // Authenticated → render homepage content
    return <HomeContent />;
}
