'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Play, Clock, ChevronLeft, Heart, MoreHorizontal, Plus } from 'lucide-react'
import { usePlayerStore, Track } from '@/store/playerStore'
import { useState } from 'react'
import AddToPlaylist from '@/components/modals/add-to-playlist'

export default function AlbumPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id
    const { setTrack, setQueue, currentTrack, isPlaying } = usePlayerStore()
    const [trackToAdd, setTrackToAdd] = useState<any>(null)

    const { data: album, isLoading } = useQuery({
        queryKey: ['album', id],
        queryFn: async () => {
            const res = await fetch(`/api/music/lookup?id=${id}&entity=album`)
            if (!res.ok) throw new Error('Failed to fetch album')
            return res.json()
        },
        enabled: !!id
    })

    if (isLoading) return <div className="p-8 text-slate-400 animate-pulse">Loading album...</div>
    if (!album) return <div className="p-8 text-slate-800 font-bold text-center">Album not found.</div>

    const tracks: Track[] = album.tracks?.items || []

    const handlePlayAlbum = () => {
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
        <div className="space-y-8 pb-32">
            <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
                Back
            </button>

            <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
                <div className="w-64 h-64 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/50 relative group">
                    <img
                        src={album.image}
                        alt={album.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-4">
                    <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        Album
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-black text-slate-800 leading-tight">{album.name}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-3 text-slate-500 font-bold">
                        <Link href={`/artist/${album.artistId}`} className="text-blue-600 hover:underline">
                            {album.artist}
                        </Link>
                        <span>•</span>
                        <span>{album.release_date}</span>
                        <span>•</span>
                        <span className="text-slate-400">{tracks.length} songs</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={handlePlayAlbum}
                    className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all active:scale-95 shadow-xl shadow-blue-200"
                >
                    <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />
                </button>
                <button className="p-4 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-2xl shadow-sm border border-slate-100">
                    <Heart className="w-6 h-6" />
                </button>
                <button className="p-4 text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-2xl shadow-sm border border-slate-100">
                    <MoreHorizontal className="w-6 h-6" />
                </button>
            </div>

            <div className="w-full bg-white/50 backdrop-blur-md rounded-[3rem] border border-white/40 shadow-sm overflow-hidden">
                <div className="grid grid-cols-[50px_1fr_120px] gap-4 px-10 py-6 border-b border-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest leading-none">
                    <span>#</span>
                    <span>Title</span>
                    <div className="flex justify-end pr-4"><Clock className="w-4 h-4" /></div>
                </div>
                
                <div className="px-4 py-4">
                    {tracks.map((track, index) => {
                        const isCurrent = currentTrack?.id === track.id
                        return (
                            <div
                                key={track.id}
                                onClick={() => {
                                    setQueue(tracks)
                                    setTrack(track)
                                }}
                                className={`grid grid-cols-[50px_1fr_120px] gap-4 px-6 py-4 rounded-[2rem] transition-all group cursor-pointer items-center ${isCurrent ? 'bg-white shadow-md' : 'hover:bg-white/50'}`}
                            >
                                <div className="flex items-center justify-center">
                                    {isCurrent && isPlaying ? (
                                        <div className="w-4 h-4 flex items-center gap-0.5">
                                            <div className="w-[3px] bg-blue-600 h-2 animate-bounce" />
                                            <div className="w-[3px] bg-blue-600 h-4 animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-[3px] bg-blue-600 h-3 animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 font-extrabold text-sm">{index + 1}</span>
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className={`font-bold truncate text-base ${isCurrent ? 'text-blue-600' : 'text-slate-800'}`}>{track.name}</span>
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">{track.artists.map(a => a.name).join(', ')}</span>
                                </div>
                                <div className="flex items-center justify-end gap-4">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setTrackToAdd(track)
                                        }}
                                        className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-blue-600 transition-all"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                    <span className="text-slate-400 text-sm font-bold min-w-[45px] text-right pr-4">
                                        {formatDuration(track.duration_ms || 0)}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {trackToAdd && (
                <AddToPlaylist track={trackToAdd} onClose={() => setTrackToAdd(null)} />
            )}
        </div>
    )
}
