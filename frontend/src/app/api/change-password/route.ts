// api/change-password/route.ts
"use server";

import { getToken } from "@/src/lib/auth";
import { DJANGO_API_ENDPOINT } from "@/src/config/defaults";
import { NextResponse } from "next/server";

const CHANGE_PASSWORD_URL = `${DJANGO_API_ENDPOINT}/members/change-password`;

export async function POST(request: Request) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();

    const res = await fetch(CHANGE_PASSWORD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ use JWTAuth
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
