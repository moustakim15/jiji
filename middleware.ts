import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const ACCESS_COOKIE_NAME = "access_granted";

export function middleware(request: NextRequest) {
  const hasAccess = request.cookies.get(ACCESS_COOKIE_NAME)?.value === "true";

  if (hasAccess) {
    return NextResponse.next();
  }

  const accessUrl = new URL("/access", request.url);
  return NextResponse.redirect(accessUrl);
}

export const config = {
  matcher: [
    "/((?!access|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};