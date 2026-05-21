import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

async function getUserId() {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    if (!token) return null
    const payload = verifyToken(token)
    return payload?.userId || null
}

export async function GET() {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const playlists = await prisma.playlist.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(playlists)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { name } = await req.json()
        if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

        const playlist = await prisma.playlist.create({
            data: {
                name,
                userId,
                tracks: []
            }
        })
        return NextResponse.json(playlist)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 })
    }
}
