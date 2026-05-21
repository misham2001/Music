import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const decoded = verifyToken(token)
        if (!decoded || !decoded.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
