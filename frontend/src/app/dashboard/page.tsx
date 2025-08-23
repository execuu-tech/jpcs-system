"use server"

import { getToken } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import DashboardPage from "@/src/components/DashboardPage";

export default async function Dashboard() {
    const token = await getToken();

    if (!token) {
        redirect("/login");
    }

    return (
        <div className="h-[95vh] flex items-center justify-center bg-gray-100">
            <DashboardPage />
        </div>
    );
}
