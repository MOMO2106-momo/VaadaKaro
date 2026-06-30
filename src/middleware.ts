// IMPORTANT: Import from auth.config (Edge-safe, no Prisma) NOT from @/auth.
// Importing from @/auth would pull in PrismaAdapter which crashes on Edge runtime.
import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const demoRole = req.cookies.get("demo_role")?.value
  const isLoggedIn = !!req.auth || !!demoRole
  const { pathname } = req.nextUrl

  // Routes that require authentication
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/citizen") ||
    pathname.startsWith("/officer") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/super-admin")

  // Routes that authenticated users should not see
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/register"

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return Response.redirect(loginUrl)
  }

  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.url))
  }

  return undefined
})

export const config = {
  // Match all protected and auth routes. Exclude static files and API routes.
  matcher: [
    "/dashboard/:path*",
    "/citizen/:path*",
    "/officer/:path*",
    "/admin/:path*",
    "/super-admin/:path*",
    "/login",
    "/signup",
    "/register",
  ],
}
