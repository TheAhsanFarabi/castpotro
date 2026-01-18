import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('userId')?.value
  const { pathname } = request.nextUrl

  // 1. If user IS logged in:
  // Redirect them away from public pages (landing, login, register) to the dashboard
  if (userId) {
    if (pathname === '/' || pathname === '/login' || pathname === '/register') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // 2. If user is NOT logged in:
  // Redirect them away from protected pages (dashboard) to the login page
  if (!userId) {
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

// Config matches everything except static files (images, fonts, etc.)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}