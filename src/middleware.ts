import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

import { routing } from './app/_i18n/routing'
import { authService } from './server/services/auth.service'

const PUBLIC_ROUTES = ['/admin/login']

const intlMiddleware = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
    const isAuthenticated = await authService.checkIsAuthenticated()

    if (isPublicRoute && isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.nextUrl))
    }

    if (!isPublicRoute && !isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.nextUrl))
    }
  } else {
    return intlMiddleware(request)
  }
}

export const config = {
  matcher: ['/', '/(en|vi)/:path*', '/admin/:path*'],
}
