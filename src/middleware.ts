import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookieName, verifySession } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = pathname.startsWith("/admin") || pathname.startsWith("/buddy");
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get(getSessionCookieName())?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const session = await verifySession(token);

    if (pathname.startsWith("/admin") && session.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/buddy";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/buddy/:path*"]
};
