import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const TOKEN_AGE = 3600;
const TOKEN_NAME = "auth-token";
const TOKEN_REFRESH_NAME = "auth-refresh-token";

export async function getToken() {
    const cookieStore = await cookies();
    return cookieStore.get(TOKEN_NAME)?.value;
}

// refresh lasts longer
export async function getRefreshToken() {
    const cookieStore = await cookies();
    return cookieStore.get(TOKEN_REFRESH_NAME)?.value;
}
export function withAuthCookies(
    res: NextResponse,
    access: string,
    refresh: string
) {
    res.cookies.set({
        name: TOKEN_NAME,
        value: access,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
        maxAge: TOKEN_AGE,
        path: "/",
    });

    res.cookies.set({
        name: TOKEN_REFRESH_NAME,
        value: refresh,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
        maxAge: TOKEN_AGE * 24,
        path: "/",
    });

    return res;
}

export function clearAuthCookies(res: NextResponse) {
    res.cookies.delete(TOKEN_NAME);
    res.cookies.delete(TOKEN_REFRESH_NAME);
    return res;
}
