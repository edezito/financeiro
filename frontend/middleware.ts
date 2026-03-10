import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Se for a rota raiz, redireciona para /login
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: '/',
}