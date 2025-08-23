// api/check-auth/route.ts
import { getToken, getRefreshToken, withAuthCookies } from "@/src/lib/auth";
import { NextResponse } from "next/server";
import { DJANGO_API_ENDPOINT } from "@/src/config/defaults";

export async function GET() {
    try {
        const token = await getToken();
        const refreshToken = await getRefreshToken();

        if (!token) return NextResponse.json({ authenticated: false });

        // Verify token with Django
        const res = await fetch(`${DJANGO_API_ENDPOINT}/token/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        });

        if (res.ok) return NextResponse.json({ authenticated: true });

        // Try refresh if token expired
        if (res.status === 401 && refreshToken) {
            const refreshRes = await fetch(`${DJANGO_API_ENDPOINT}/token/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (refreshRes.ok) {
                const data = await refreshRes.json();

                let res = NextResponse.json({ authenticated: true });
                res = withAuthCookies(res, data.access, refreshToken);
                return res;
            }
        }

        return NextResponse.json({ authenticated: false });
    } catch (err) {
        console.error("Check auth failed", err);
        return NextResponse.json({ authenticated: false });
    }
}
