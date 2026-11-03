import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySession } from "@/lib/admin/token";

/**
 * Optimistic gate for the admin area: unauthenticated visitors are sent to the
 * login page before any admin code renders. Pages and Server Actions still
 * re-check the session themselves (see requireAdmin).
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const user = await verifySession(request.cookies.get(ADMIN_COOKIE)?.value).catch(() => null);
  if (user) return NextResponse.next();

  const login = request.nextUrl.clone();
  login.pathname = "/admin/login";
  login.search = "";
  if (pathname !== "/admin") login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
