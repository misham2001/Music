import { NextResponse } from 'next/server'
import { saavnSearch, decryptUrl, getHighResImage } from '@/lib/music'

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
            const image = getHighResImage(item.image || '')
            
            if (saavnType === 'albums') {
                const id = (item.albumid || item.id || '').toString()
                const name = item.title || item.name || ''
                const artist = item.music || item.primary_artists || 'Various Artists'
                
                return {
                    id,
                    name,
                    artist,
                    artistId: '', // Skipping for simplicity unless needed
                    image,
                    type: 'album'
                }
            }

            if (saavnType === 'artists') {
                const id = (item.artistid || item.id || '').toString()
                const name = item.title || item.name || ''
                return {
                    id,
                    name,
                    image,
                    type: 'artist'
                }
            }
            
            // For songs/tracks
            const id = (item.id || '').toString()
            const name = item.song || item.title || item.name || ''
            const stream = item.encrypted_media_url ? decryptUrl(item.encrypted_media_url) : ''
            
            const artistsDisplay = item.primary_artists || 'Unknown'
            
            return {
                id,
                name,
                artists: [{ name: artistsDisplay }],
                artistId: item.primary_artists_id?.split(',')[0]?.trim() || '',
                album: {
                    name: item.album || '',
                    images: [{ url: image }]
                },
                preview_url: stream,
                duration_ms: parseInt(item.duration || '0') * 1000,
                type: 'track'
            }
        })

        return NextResponse.json({ results })
    } catch (error: any) {
        console.error('JioSaavn Search API Error:', error)
        return NextResponse.json({ error: 'Failed to search music' }, { status: 500 })
    }
}
