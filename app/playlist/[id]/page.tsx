'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { Play, Clock, ChevronLeft, MoreHorizontal, Heart, ListMusic } from 'lucide-react'
import { usePlayerStore, Track } from '@/store/playerStore'

export default function PlaylistPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id
    const { setTrack, setQueue, currentTrack, isPlaying, togglePlay } = usePlayerStore()

    const { data: playlist, isLoading } = useQuery({
        queryKey: ['playlist', id],
        queryFn: async () => {
            const res = await fetch(`/api/playlists/${id}`)
            if (!res.ok) throw new Error('Failed to fetch playlist')
            return res.json()
        },
        enabled: !!id
    })

    if (isLoading) return <div className="p-8 text-slate-400 animate-pulse">Loading playlist...</div>
    if (!playlist) return <div className="p-8 text-slate-800 font-bold text-center">Playlist not found.</div>

    const tracks: Track[] = Array.isArray(playlist.tracks) ? playlist.tracks : []

    const handlePlayPlaylist = () => {
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
                Back to Playlists
            </button>

            <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                <div className="w-64 h-64 bg-white rounded-[3rem] shadow-xl flex items-center justify-center border border-white/50 relative overflow-hidden group">
                    <ListMusic className="w-24 h-24 text-slate-100 group-hover:text-blue-100 transition-colors" />
                    <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-2">
                    <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        Playlist
                    </span>
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800">{playlist.name}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-3 mt-4 text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-slate-200" />
                            Your Playlist
                        </span>
                        <span>•</span>
                        <span>{tracks.length} songs</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={handlePlayPlaylist}
                    className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all active:scale-95 shadow-xl shadow-blue-200"
                >
                    <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />
                </button>
                <button className="p-3 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-2xl shadow-sm">
                    <Heart className="w-6 h-6" />
                </button>
                <button className="p-3 text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-2xl shadow-sm">
                    <MoreHorizontal className="w-6 h-6" />
                </button>
            </div>

            <div className="w-full bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white/40 shadow-sm overflow-hidden">
                <div className="grid grid-cols-[40px_1fr_40px] gap-4 px-8 py-5 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <span>#</span>
                    <span>Title</span>
                    <div className="flex justify-end pr-2"><Clock className="w-4 h-4" /></div>
                </div>
                
                <div className="px-4 py-2">
                    {tracks.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 italic">
                            No tracks yet. Search for songs and add them!
                        </div>
                    ) : (
                        tracks.map((track, index) => {
                            const isCurrent = currentTrack?.id === track.id
                            return (
                                <div
                                    key={`${track.id}-${index}`}
                                    onClick={() => {
                                        setQueue(tracks)
                                        setTrack(track)
                                    }}
                                    className={`grid grid-cols-[40px_1fr_40px] gap-4 px-4 py-4 rounded-2xl transition-all group cursor-pointer ${isCurrent ? 'bg-white shadow-md' : 'hover:bg-white/50'}`}
                                >
                                    <div className="flex items-center justify-center">
                                        {isCurrent && isPlaying ? (
                                            <div className="w-4 h-4 flex items-center gap-0.5">
                                                <div className="w-[3px] bg-blue-600 h-2 animate-bounce" />
                                                <div className="w-[3px] bg-blue-600 h-4 animate-bounce [animation-delay:0.2s]" />
                                                <div className="w-[3px] bg-blue-600 h-3 animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 font-bold text-xs">{index + 1}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className={`font-bold truncate ${isCurrent ? 'text-blue-600' : 'text-slate-800'}`}>{track.name}</span>
                                        <span className="text-sm text-slate-500 font-medium truncate">{track.artists.map(a => a.name).join(', ')}</span>
                                    </div>
                                    <span className="text-slate-400 text-xs font-bold flex items-center justify-end pr-2">
                                        {formatDuration(track.duration_ms || 0)}
                                    </span>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
