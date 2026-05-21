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

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const playlist = await prisma.playlist.findUnique({
            where: { id }
        })

        if (!playlist) return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
        if (playlist.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        return NextResponse.json(playlist)
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { name, tracks } = await req.json()
        const playlist = await prisma.playlist.findUnique({ where: { id } })

        if (!playlist) return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
        if (playlist.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const updated = await prisma.playlist.update({
            where: { id },
            data: {
                name: name !== undefined ? name : playlist.name,
                tracks: tracks !== undefined ? tracks : playlist.tracks
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const playlist = await prisma.playlist.findUnique({ where: { id } })

        if (!playlist) return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
        if (playlist.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        await prisma.playlist.delete({ where: { id } })
        return NextResponse.json({ message: 'Playlist deleted successfully' })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
