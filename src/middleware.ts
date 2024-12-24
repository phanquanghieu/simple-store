import { NextRequest, NextResponse } from 'next/server'

import { authService } from './server/services/auth.service'

const PUBLIC_ROUTES = ['/admin/login']

export async function middleware(request: NextRequest) {
  const isPublicRoute = PUBLIC_ROUTES.includes(request.nextUrl.pathname)
  const isAuthenticated = await authService.checkIsAuthenticated()

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.nextUrl))
  }

  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/login', request.nextUrl))
  }
}

export const config = {
  matcher: ['/(admin.*)'],
}
