import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret'
)

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value

    const { pathname } = request.nextUrl

    // Allow auth pages and public assets
    if (
        pathname.startsWith('/login') ||
        pathname.startsWith('/signup') ||
        pathname.includes('/api/auth') ||
        pathname.includes('/_next') ||
        pathname === '/favicon.ico'
    ) {
        if (token && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    }

    // Protect all other routes
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        await jwtVerify(token, JWT_SECRET)
        return NextResponse.next()
    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
