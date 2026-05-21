'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { Play, CheckCircle2, ChevronLeft, Heart, MoreHorizontal, Plus, Clock } from 'lucide-react'
import AlbumCard from '@/components/cards/album-card'
import { usePlayerStore } from '@/store/playerStore'
import { useState } from 'react'
import AddToPlaylist from '@/components/modals/add-to-playlist'

export default function ArtistPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id
    const { setTrack, setQueue, currentTrack, isPlaying } = usePlayerStore()
    const [trackToAdd, setTrackToAdd] = useState<any>(null)

    const { data: artist, isLoading: isLoadingArtist } = useQuery({
        queryKey: ['artist', id],
        queryFn: async () => {
            const res = await fetch(`/api/music/lookup?id=${id}&entity=artist`)
            if (!res.ok) throw new Error('Failed to fetch artist')
            return res.json()
        },
        enabled: !!id
    })

    const { data: topTracks, isLoading: isLoadingTracks } = useQuery({
        queryKey: ['artist-top-tracks', id, artist?.name],
        queryFn: async () => {
            const res = await fetch(`/api/music/search?term=${encodeURIComponent(artist.name)}&type=song&limit=10`)
            if (!res.ok) throw new Error('Failed to fetch top tracks')
            return res.json()
        },
        enabled: !!artist?.name
    })

    const { data: albums, isLoading: isLoadingAlbums } = useQuery({
        queryKey: ['artist-albums', id, artist?.name],
        queryFn: async () => {
            const res = await fetch(`/api/music/search?term=${encodeURIComponent(artist.name)}&type=album&limit=10`)
            if (!res.ok) throw new Error('Failed to fetch albums')
            return res.json()
        },
        enabled: !!artist?.name
    })

    if (isLoadingArtist) return <div className="p-8 text-slate-400 animate-pulse">Loading artist...</div>
    if (!artist) return <div className="p-8 text-slate-800 font-bold text-center">Artist not found.</div>

    const handlePlayTopTracks = () => {
        const tracks = topTracks?.results || []
        if (tracks.length > 0) {
            setQueue(tracks)
            setTrack(tracks[0])
        }
    }

    const formatDuration = (ms: number) => {
        const min = Math.floor(ms / 60000)
        const sec = Math.floor((ms % 60000) / 1000)
        return `${min}:${sec.toString().padStart(2, '0')}`
    }

    return (
        <div className="space-y-10 pb-32">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
                Back
            </button>

            {/* Premium Banner */}
            <div className="relative h-96 w-full overflow-hidden rounded-[3rem] bg-white shadow-2xl border border-white/50 group">
                <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent flex flex-col justify-end p-12">
                    <div className="flex items-center gap-2 bg-blue-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full w-fit mb-6 shadow-xl border border-white/20">
                        <CheckCircle2 className="w-4 h-4 fill-white text-blue-600" />
                        <span className="text-xs font-black uppercase tracking-widest">Verified Artist</span>
                    </div>
                    <h1 className="text-6xl lg:text-8xl font-black text-white leading-none drop-shadow-2xl">{artist.name}</h1>
                    <p className="mt-6 text-sm font-bold text-white/80 flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                            {parseInt(artist.followerCount || '0').toLocaleString()} Monthly Listeners
                        </span>
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={handlePlayTopTracks}
                    className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all active:scale-95 shadow-xl shadow-blue-200"
                >
                    <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />
                </button>
                <button className="px-8 py-4 bg-white border border-slate-100 rounded-2xl font-black text-slate-800 hover:bg-slate-50 transition-all shadow-sm uppercase tracking-widest text-xs">
                    Follow
                </button>
                <button className="p-4 text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-2xl shadow-sm border border-slate-100">
                    <MoreHorizontal className="w-6 h-6" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Popular Tracks */}
                <section className="lg:col-span-2">
                    <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
                        Popular
                        <div className="h-1 flex-1 bg-slate-100 rounded-full ml-4" />
                    </h2>
                    <div className="bg-white/50 backdrop-blur-md rounded-[3rem] border border-white/40 shadow-sm overflow-hidden p-4">
                        {isLoadingTracks ? (
                            Array(5).fill(0).map((_, i) => <div key={i} className="h-20 bg-white/60 rounded-[2rem] animate-pulse mb-3" />)
                        ) : (
                            topTracks?.results?.slice(0, 5).map((track: any, i: number) => {
                                const isCurrent = currentTrack?.id === track.id
                                return (
                                    <div
                                        key={track.id}
                                        onClick={() => {
                                            setQueue(topTracks.results)
                                            setTrack(track)
                                        }}
                                        className={`flex items-center justify-between px-6 py-4 rounded-[2rem] transition-all group cursor-pointer ${isCurrent ? 'bg-white shadow-md' : 'hover:bg-white/50'}`}
                                    >
                                        <div className="flex items-center gap-5 min-w-0">
                                            <span className="text-slate-300 font-black w-4 text-right text-sm">{i + 1}</span>
                                            {track.album?.images?.[0]?.url && (
                                                <img src={track.album.images[0].url} className="w-14 h-14 rounded-2xl shadow-md object-cover flex-shrink-0" alt={track.name} />
                                            )}
                                            <div className="flex flex-col min-w-0">
                                                <span className={`font-bold truncate text-base ${isCurrent ? 'text-blue-600' : 'text-slate-800'}`}>{track.name}</span>
                                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">{track.album.name}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setTrackToAdd(track)
                                                }}
                                                className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-blue-600 transition-all"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                            <span className="text-slate-400 text-sm font-bold min-w-[45px] text-right">
                                                {formatDuration(track.duration_ms || 0)}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </section>

                {/* Discography Hint / Top Album */}
                <section>
                    <h2 className="text-3xl font-black text-slate-800 mb-8">Top Album</h2>
                    {albums?.results?.[0] ? (
                        <AlbumCard
                            id={albums.results[0].id}
                            name={albums.results[0].name}
                            artist={albums.results[0].artist}
                            image={albums.results[0].image}
                        />
                    ) : (
                        <div className="h-full bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-bold uppercase text-xs tracking-widest p-10 text-center">
                            No related albums found
                        </div>
                    )}
                </section>
            </div>

            {/* Full Albums Grid */}
            <section>
                <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
                    Discography
                    <div className="h-1 flex-1 bg-slate-100 rounded-full ml-4" />
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                    {isLoadingAlbums ? (
                        Array(5).fill(0).map((_, i) => <div key={i} className="bg-white/40 aspect-square rounded-[2.5rem] animate-pulse border border-white/50" />)
                    ) : (
                        albums?.results?.map((item: any) => (
                            <AlbumCard
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                artist={item.artist}
                                image={item.image}
                            />
                        ))
                    )}
                </div>
            </section>

            {trackToAdd && (
                <AddToPlaylist track={trackToAdd} onClose={() => setTrackToAdd(null)} />
            )}
        </div>
    )
}
