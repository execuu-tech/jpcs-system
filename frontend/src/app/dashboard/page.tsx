"use server"

// Server component
import { getToken } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import DashboardPage from "@/src/components/DashboardPage"; // client component

export default async function Dashboard() {
    const token = await getToken(); // read cookie server-side

    if (!token) {
        redirect("/login");
    }

    return (
        <div className="h-[95vh] flex items-center justify-center bg-gray-100">
            <DashboardPage />  {/* render client-side form only if not logged in */}
        </div>
    );
}
