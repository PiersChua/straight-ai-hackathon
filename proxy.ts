import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const candidateRoutes = ["/dashboard/candidate"];
const hirerRoutes = ["/dashboard/hirer"];
const authRoutes = ["/login", "/sign-up", "/verify-email", "/forgot-password"];
export const proxy = async (req: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  const { pathname } = req.nextUrl;
  const isCandidateRoute = candidateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isHirerRoute = hirerRoutes.some((route) => pathname.startsWith(route));
  const isProtected = isCandidateRoute || isHirerRoute;
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (session && isCandidateRoute && session.user.role !== "CANDIDATE") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (session && isHirerRoute && session.user.role !== "HIRER") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
};
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
