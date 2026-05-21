'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, ListMusic, Play, MoreVertical, Search as SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function PlaylistsPage() {
    const queryClient = useQueryClient()
    const [isCreating, setIsCreating] = useState(false)
    const [newPlaylistName, setNewPlaylistName] = useState('')

    const { data: playlists, isLoading } = useQuery({
        queryKey: ['playlists'],
        queryFn: () => fetch('/api/playlists').then(res => res.json())
    })

    const createPlaylistMutation = useMutation({
        mutationFn: async (name: string) => {
            const res = await fetch('/api/playlists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            })
            if (!res.ok) throw new Error('Failed to create playlist')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['playlists'] })
            setIsCreating(false)
            setNewPlaylistName('')
        }
    })

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        if (newPlaylistName.trim()) {
            createPlaylistMutation.mutate(newPlaylistName)
        }
    }

    return (
        <div className="space-y-8 pb-32">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">My Playlists</h1>
                    <p className="text-slate-500">Manage your personal music collections</p>
                </div>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                    <Plus className="w-5 h-5" />
                    Create New Playlist
                </button>
            </div>

            {isCreating && (
                <div className="glass-morphism p-6 rounded-3xl border border-white/50 shadow-xl animate-in fade-in zoom-in duration-200">
                    <form onSubmit={handleCreate} className="flex gap-4">
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Enter playlist name..."
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            className="flex-1 bg-white border border-slate-200 rounded-2xl py-3 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        <button 
                            type="submit"
                            disabled={createPlaylistMutation.isPending}
                            className="bg-blue-600 text-white px-8 rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                            {createPlaylistMutation.isPending ? 'Creating...' : 'Create'}
                        </button>
                        <button 
                            type="button"
                            onClick={() => setIsCreating(false)}
                            className="px-6 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-[2.5rem] h-64 animate-pulse shadow-sm" />
                    ))
                ) : playlists?.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ListMusic className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">No playlists yet</h3>
                        <p className="text-slate-500 mt-2">Start creating your first collection!</p>
                    </div>
                ) : (
                    playlists?.map((playlist: any) => (
                        <Link 
                            key={playlist.id} 
                            href={`/playlist/${playlist.id}`}
                            className="group bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 relative overflow-hidden"
                        >
                            <div className="w-full aspect-square bg-slate-50 rounded-3xl mb-4 flex items-center justify-center group-hover:bg-blue-50 transition-colors relative">
                                <ListMusic className="w-16 h-16 text-slate-200 group-hover:text-blue-200 transition-colors" />
                                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                        <Play className="w-6 h-6 text-blue-600 fill-current" />
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg truncate">{playlist.name}</h3>
                            <p className="text-sm text-slate-500">{playlist.tracks?.length || 0} songs</p>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
