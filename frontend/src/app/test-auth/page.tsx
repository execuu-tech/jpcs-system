// app/test-auth/page.tsx
import { getToken } from "@/lib/auth";

export default function TestAuthPage() {
    // This runs server-side
    const token = getToken();

    if (!token) {
        return <div style={{ padding: 20 }}>Error: Not authenticated</div>;
    }

    return (
        <div style={{ padding: 20 }}>
            Logged in! Your token is: {token}
        </div>
    );
}
