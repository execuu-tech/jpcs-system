// src/app/page.tsx
import { redirect } from "next/navigation";
import { getToken } from "@/src/lib/auth";
import HomeContent from "@/src/components/HomeContent";


export default async function HomePage() {
    const token = await getToken();

    if (!token) {
        redirect("/login");
    }

    return <HomeContent />;
}
