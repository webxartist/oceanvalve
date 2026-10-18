import { NextResponse } from "next/server";
import { createAdminSession, adminCookieName, adminSessionMaxAge } from "@/lib/admin-auth";

export const runtime = "nodejs";
export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedUser || !expectedPassword) return NextResponse.json({ error: "Admin credentials are not configured on the server." }, { status: 503 });
    if (username !== expectedUser || password !== expectedPassword) return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    const session = createAdminSession();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(adminCookieName, session.token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: adminSessionMaxAge });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message || "Login failed." }, { status: 500 });
  }
}
