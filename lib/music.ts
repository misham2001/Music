// lib/music.ts
// JioSaavn API wrapper - Community Mirror
// Base URL: https://jiosaavn-api-privatecvc2.vercel.app

const SAAVN_BASE = 'https://jiosaavn-api-privatecvc2.vercel.app'

export async function saavnSearch(query: string, type: 'songs' | 'albums' | 'artists' | 'playlists' = 'songs', limit = 20) {
    const res = await fetch(`${SAAVN_BASE}/search/${type}?query=${encodeURIComponent(query)}&limit=${limit}`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`JioSaavn API error: ${res.status}`)
    const data = await res.json()
    return data.data || { results: [] }
}

export async function saavnLookup(id: string, type: 'songs' | 'albums' | 'artists' | 'playlists' = 'songs') {
    // Note: The mirror uses /songs?id= or /albums?id=
    const res = await fetch(`${SAAVN_BASE}/${type}?id=${id}`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`JioSaavn API error: ${res.status}`)
    const data = await res.json()
    // For lookup, data.data might be a single object or a results array
    return data.data
}
