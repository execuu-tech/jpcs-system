// Server component
import { getToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/src/components/LoginForm"; // client component

export default function LoginPage() {
    const token = getToken(); // read cookie server-side

    if (token) {
        // User already logged in → redirect immediately
        redirect("/");
    }

    return (
        <div className="h-[95vh] flex items-center justify-center bg-gray-100">
            <LoginForm />  {/* render client-side form only if not logged in */}
        </div>
    );
}
