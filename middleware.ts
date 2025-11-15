import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import { setRequestLocale } from "next-intl/server"

const intlMiddleware = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const localeMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)/)
  const hasLocalePrefix = localeMatch !== null

  if (!hasLocalePrefix && pathname === "/") {
    // Let next-intl middleware handle the root redirect
    const response = intlMiddleware(request)
    if (response.status !== 200) {
      return response
    }
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", pathname)

  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale

  // Set the locale in the request context for next-intl v4
  setRequestLocale(locale)

  // Forward the request with the updated headers so downstream middleware/edge can read x-pathname
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}

