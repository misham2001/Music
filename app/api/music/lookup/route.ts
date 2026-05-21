import { NextResponse } from 'next/server'
import { saavnLookup } from '@/lib/music'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        const entityArg = searchParams.get('entity') || 'song'

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

        const typeMap: Record<string, 'songs' | 'albums' | 'artists' | 'playlists'> = {
            'song': 'songs',
            'track': 'songs',
            'album': 'albums',
            'artist': 'artists',
            'playlist': 'playlists'
        }
        
        const saavnType = typeMap[entityArg] || 'songs'
        const data = await saavnLookup(id, saavnType)
        
        if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        const item = Array.isArray(data) ? data[0] : data
        const itemImages = Array.isArray(item.image) ? item.image : []
        const image = itemImages[itemImages.length - 1]?.link || itemImages[0]?.link || item.image || ''

        const artistsDisplay = Array.isArray(item.primaryArtists)
            ? item.primaryArtists.map((a: any) => a.name).join(', ')
            : (typeof item.primaryArtists === 'string' ? item.primaryArtists : 'Unknown')

        if (saavnType === 'albums') {
            const tracks = (item.songs || []).map((song: any) => {
                const streams = song.downloadUrl || []
                const songArtists = Array.isArray(song.primaryArtists)
                    ? song.primaryArtists.map((a: any) => a.name).join(', ')
                    : (typeof song.primaryArtists === 'string' ? song.primaryArtists : artistsDisplay)

                return {
                    id: song.id.toString(),
                    name: song.name,
                    artists: [{ name: songArtists }],
                    album: {
                        name: item.name,
                        images: [{ url: image }]
                    },
                    preview_url: streams[streams.length - 1]?.link || streams[0]?.link || '',
                    duration_ms: parseInt(song.duration) * 1000,
                    type: 'track'
                }
            })

            const primaryArtistId = Array.isArray(item.primaryArtists) 
                ? item.primaryArtists[0]?.id 
                : (item.primaryArtistsId?.split(',')[0]?.trim() || '')

            return NextResponse.json({
                id: item.id.toString(),
                name: item.name,
                artist: artistsDisplay,
                artistId: primaryArtistId,
                image,
                tracks: { items: tracks },
                release_date: item.year || item.releaseDate
            })
        }

        if (saavnType === 'artists') {
            return NextResponse.json({
                id: item.id.toString(),
                name: item.name,
                image,
                type: 'artist',
                followerCount: item.followerCount,
                isVerified: item.isVerified
            })
        }

        // Single track lookup
        const streams = item.downloadUrl || []
        return NextResponse.json({
            id: item.id.toString(),
            name: item.name,
            artists: [{ name: artistsDisplay }],
            artistId: Array.isArray(item.primaryArtists) ? item.primaryArtists[0]?.id : (item.primaryArtistsId || ''),
            album: {
                name: item.album?.name || '',
                images: [{ url: image }]
            },
            preview_url: streams[streams.length - 1]?.link || streams[0]?.link || '',
            duration_ms: parseInt(item.duration) * 1000,
            type: 'track'
        })

    } catch (error: any) {
        console.error('JioSaavn Lookup Proxy Error:', error)
        return NextResponse.json({ error: 'Failed to lookup music' }, { status: 500 })
    }
}
