import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const roleCookie = request.cookies.get("craftvilla_role")?.value;

  // Only protect if on server-side protected endpoints
  if (pathname.startsWith("/admin")) {
    if (roleCookie && roleCookie !== "ADMIN") {
      const loginUrl = new URL("/login?redirect=admin", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/artisan") && !pathname.startsWith("/artisan/register")) {
    if (roleCookie && roleCookie !== "ARTISAN" && roleCookie !== "ADMIN") {
      const loginUrl = new URL("/login?redirect=artisan", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/artisan/:path*"],
};
