
import { DJANGO_API_ENDPOINT } from "@/src/config/defaults";
import { NextResponse } from "next/server";
import { withAuthCookies } from "@/src/lib/auth";

const DJANGO_API_LOGIN_URL = `${DJANGO_API_ENDPOINT}/token/pair`;

export async function POST(request: Request) {
    const requestData = await request.json();

    const response = await fetch(DJANGO_API_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
    });

    const responseData = await response.json();

    if (response.ok) {
        console.log("logged in");
        const { username, access, refresh } = responseData;

        let res = NextResponse.json(
            { loggedIn: true, username },
            { status: 200 }
        );
        res = withAuthCookies(res, access, refresh); // set cookies properly

        return res;
    }

    return NextResponse.json({ loggedIn: false, ...responseData }, { status: 400 });
}
