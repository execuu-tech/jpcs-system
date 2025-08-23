// app/test-auth/page.tsx
// THIS IS FOR TEST AUTHENTICATION ONLYY REMOVE PAG DEPLOY NA
import { getToken } from "@/src/lib/auth";

export default async function TestAuthPage() {
    const token = await getToken();

    if (!token) {
        return <div style={{ padding: 20 }}>Error: Not authenticated</div>;
    }

    return (
        <div style={{ padding: 20 }}>
            Logged in! Your token is: {token}
        </div>
    );
}
