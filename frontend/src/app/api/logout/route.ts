import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/src/lib/auth";

export async function POST() {
  let res = NextResponse.json({ loggedOut: true });
  res = clearAuthCookies(res); // remove cookies properly
  return res;
}
