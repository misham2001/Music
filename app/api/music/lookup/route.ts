import { NextResponse } from 'next/server'
import { saavnLookup, decryptUrl, getHighResImage } from '@/lib/music'

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
        let data = await saavnLookup(id, saavnType)
        
        if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        // song.getDetails returns data inside an object keyed by ID
        if (saavnType === 'songs' && data[id]) {
            data = data[id];
        }

        const item = Array.isArray(data) ? data[0] : data
        const image = getHighResImage(item.image || '')

        const artistsDisplay = item.primary_artists || 'Unknown'

        if (saavnType === 'albums') {
            const tracks = (item.songs || []).map((song: any) => {
                const songArtists = song.primary_artists || artistsDisplay
                const stream = song.encrypted_media_url ? decryptUrl(song.encrypted_media_url) : ''

                return {
                    id: song.id.toString(),
                    name: song.song || song.name || '',
                    artists: [{ name: songArtists }],
                    album: {
                        name: item.title || item.name || '',
                        images: [{ url: image }]
                    },
                    preview_url: stream,
                    duration_ms: parseInt(song.duration || '0') * 1000,
                    type: 'track'
                }
            })

            const primaryArtistId = item.primary_artists_id?.split(',')[0]?.trim() || ''

            return NextResponse.json({
                id: (item.albumid || item.id || '').toString(),
                name: item.title || item.name || '',
                artist: artistsDisplay,
                artistId: primaryArtistId,
                image,
                tracks: { items: tracks },
                release_date: item.year || item.release_date
            })
        }

        if (saavnType === 'artists') {
            return NextResponse.json({
                id: (item.artistid || item.id || '').toString(),
                name: item.name,
                image,
                type: 'artist',
                followerCount: item.follower_count,
                isVerified: item.is_verified
            })
        }

        // Single track lookup
        const stream = item.encrypted_media_url ? decryptUrl(item.encrypted_media_url) : ''
        
        return NextResponse.json({
            id: (item.id || '').toString(),
            name: item.song || item.name || '',
            artists: [{ name: artistsDisplay }],
            artistId: item.primary_artists_id?.split(',')[0]?.trim() || '',
            album: {
                name: item.album || '',
                images: [{ url: image }]
            },
            preview_url: stream,
            duration_ms: parseInt(item.duration || '0') * 1000,
            type: 'track'
        })

    } catch (error: any) {
        console.error('JioSaavn Lookup API Error:', error)
        return NextResponse.json({ error: 'Failed to lookup music' }, { status: 500 })
    }
}
