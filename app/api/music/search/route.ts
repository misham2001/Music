import { NextResponse } from 'next/server'
import { saavnSearch } from '@/lib/music'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const term = searchParams.get('term') || ''
        const typeArg = searchParams.get('type') || 'song'
        
        // Map types to JioSaavn API plural segments
        const typeMap: Record<string, 'songs' | 'albums' | 'artists' | 'playlists'> = {
            'song': 'songs',
            'track': 'songs',
            'album': 'albums',
            'artist': 'artists',
            'playlist': 'playlists'
        }
        
        const saavnType = typeMap[typeArg] || 'songs'
        const limit = parseInt(searchParams.get('limit') || '20')

        const data = await saavnSearch(term, saavnType, limit)
        const results = (data.results || []).map((item: any) => {
            // General normalization
            const id = item.id.toString()
            const name = item.name
            const image = item.image?.[item.image.length - 1]?.link || item.image?.[0]?.link || ''
            
            if (saavnType === 'albums') {
                const artists = Array.isArray(item.primaryArtists) 
                    ? item.primaryArtists.map((a: any) => a.name).join(', ')
                    : item.primaryArtists || 'Various Artists'
                
                return {
                    id,
                    name,
                    artist: artists,
                    artistId: Array.isArray(item.primaryArtists) ? item.primaryArtists[0]?.id : (item.primaryArtistsId || ''),
                    image,
                    type: 'album'
                }
            }

            if (saavnType === 'artists') {
                return {
                    id,
                    name,
                    image,
                    type: 'artist'
                }
            }
            
            // For songs/tracks
            const streams = item.downloadUrl || []
            const stream = streams[streams.length - 1]?.link || streams[0]?.link || ''
            
            const artistsDisplay = Array.isArray(item.primaryArtists)
                ? item.primaryArtists.map((a: any) => a.name).join(', ')
                : item.primaryArtists || 'Unknown'
            
            return {
                id,
                name,
                artists: [{ name: artistsDisplay }],
                artistId: Array.isArray(item.primaryArtists) ? item.primaryArtists[0]?.id : (item.primaryArtistsId || ''),
                album: {
                    name: item.album?.name || '',
                    images: [{ url: image }]
                },
                preview_url: stream,
                duration_ms: parseInt(item.duration) * 1000,
                type: 'track'
            }
        })

        return NextResponse.json({ results })
    } catch (error: any) {
        console.error('JioSaavn Search Proxy Error:', error)
        return NextResponse.json({ error: 'Failed to search music' }, { status: 500 })
    }
}
