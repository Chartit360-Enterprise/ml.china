import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

// Password stored in environment variable (server-side only)
const SITE_PASSWORD = process.env.SITE_PASSWORD || "Minsk2024";
const AUTH_COOKIE = "china-gdp-auth";
const AUTH_TOKEN = "authenticated_" + Buffer.from(SITE_PASSWORD).toString("base64").slice(0, 16);

export async function POST(req: NextRequest) {
  try {
    const { password, action } = await req.json();

    if (action === "check") {
      // Check if user is authenticated
      const cookieStore = await cookies();
      const authCookie = cookieStore.get(AUTH_COOKIE);
      return NextResponse.json({ 
        authenticated: authCookie?.value === AUTH_TOKEN 
      });
    }

    if (action === "login") {
      // Verify password
      if (password === SITE_PASSWORD) {
        const response = NextResponse.json({ success: true });
        
        // Set HTTP-only cookie (more secure than localStorage)
        response.cookies.set(AUTH_COOKIE, AUTH_TOKEN, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/",
        });
        
        return response;
      } else {
        return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
      }
    }

    if (action === "logout") {
      const response = NextResponse.json({ success: true });
      response.cookies.delete(AUTH_COOKIE);
      return response;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

