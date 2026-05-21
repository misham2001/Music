'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, X, ListMusic, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

interface AddToPlaylistProps {
    track: any
    onClose: () => void
}

export default function AddToPlaylist({ track, onClose }: AddToPlaylistProps) {
    const queryClient = useQueryClient()
    const [successId, setSuccessId] = useState<string | null>(null)

    const { data: playlists, isLoading } = useQuery({
        queryKey: ['playlists'],
        queryFn: () => fetch('/api/playlists').then(res => res.json())
    })

    const addToPlaylistMutation = useMutation({
        mutationFn: async ({ playlistId, playlist }: { playlistId: string, playlist: any }) => {
            const currentTracks = Array.isArray(playlist.tracks) ? playlist.tracks : []
            const exists = currentTracks.some((t: any) => t.id === track.id)
            if (exists) return { alreadyExists: true, playlistId }

            const res = await fetch(`/api/playlists/${playlistId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    tracks: [...currentTracks, track] 
                })
            })
            if (!res.ok) throw new Error('Failed to update playlist')
            return res.json()
        },
        onSuccess: (data: any) => {
            setSuccessId(data.id || data.playlistId)
            queryClient.invalidateQueries({ queryKey: ['playlist', data.id || data.playlistId] })
            setTimeout(() => {
                onClose()
            }, 1500)
        }
    })

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border border-white/50 animate-in zoom-in-95 duration-300">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800">Add to Playlist</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                
                <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="py-10 text-center text-slate-400 animate-pulse">Loading playlists...</div>
                    ) : playlists?.length === 0 ? (
                        <div className="py-10 text-center">
                            <p className="text-slate-500 mb-4">No playlists found</p>
                            <button className="text-blue-600 font-bold hover:underline">Create one first</button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {playlists?.map((playlist: any) => {
                                const isSuccess = successId === playlist.id
                                return (
                                    <button
                                        key={playlist.id}
                                        onClick={() => !isSuccess && addToPlaylistMutation.mutate({ playlistId: playlist.id, playlist })}
                                        disabled={addToPlaylistMutation.isPending && !isSuccess}
                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
                                            isSuccess ? 'bg-green-50' : 'hover:bg-slate-50 active:scale-[0.98]'
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                                            isSuccess ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                            {isSuccess ? <CheckCircle2 className="w-6 h-6" /> : <ListMusic className="w-6 h-6" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-bold truncate ${isSuccess ? 'text-green-700' : 'text-slate-800'}`}>
                                                {playlist.name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {isSuccess ? 'Added!' : `${playlist.tracks?.length || 0} songs`}
                                            </p>
                                        </div>
                                        {!isSuccess && <Plus className="w-5 h-5 text-slate-300" />}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
                
                <div className="px-8 py-4 bg-slate-50 text-center">
                    <p className="text-xs text-slate-400 font-medium italic">
                        Select a playlist to add "{track.name}"
                    </p>
                </div>
            </div>
        </div>
    )
}
