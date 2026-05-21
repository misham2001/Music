'use client'

import { useQuery } from '@tanstack/react-query'
import { Album as AlbumIcon, ChevronRight, Music } from 'lucide-react'
import AlbumCard from '@/components/cards/album-card'

export default function AlbumsPage() {
    const { data: topAlbums, isLoading: isLoadingTop } = useQuery({
        queryKey: ['top-albums'],
        queryFn: async () => {
            const res = await fetch('/api/music/search?term=top%20albums&type=album&limit=20')
            if (!res.ok) throw new Error('Failed to fetch albums')
            return res.json()
        }
    })

    const { data: newReleases, isLoading: isLoadingNew } = useQuery({
        queryKey: ['new-releases'],
        queryFn: async () => {
            const res = await fetch('/api/music/search?term=new%20releases&type=album&limit=10')
            if (!res.ok) throw new Error('Failed to fetch new releases')
            return res.json()
        }
    })

    return (
        <div className="space-y-12 pb-32">
            <div>
                <h1 className="text-4xl font-black text-slate-800 mb-2">Explore Albums</h1>
                <p className="text-slate-500 font-medium">Discover the best music collections from across the globe</p>
            </div>

            {/* Featured Section */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        New Releases
                        <div className="h-1 w-20 bg-blue-100 rounded-full" />
                    </h2>
                    <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
                        View All <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex gap-8 overflow-x-auto pb-2 custom-scrollbar">
                    {isLoadingNew ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="bg-white/40 w-64 aspect-square rounded-[2.5rem] animate-pulse border border-white/50 shrink-0" />
                        ))
                    ) : (
                        newReleases?.results?.slice(0, 10).map((album: any) => (
                            <div key={album.id} className="w-64 shrink-0">
                                <AlbumCard
                                    id={album.id}
                                    name={album.name}
                                    artist={album.artist}
                                    image={album.image}
                                />
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Popular Albums Grid */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        Popular Albums
                        <div className="h-1 w-20 bg-blue-100 rounded-full" />
                    </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                    {isLoadingTop ? (
                        Array(10).fill(0).map((_, i) => (
                            <div key={i} className="bg-white/40 aspect-square rounded-[2.5rem] animate-pulse border border-white/50" />
                        ))
                    ) : (
                        topAlbums?.results?.map((album: any) => (
                            <AlbumCard
                                key={album.id}
                                id={album.id}
                                name={album.name}
                                artist={album.artist}
                                image={album.image}
                            />
                        ))
                    )}
                </div>
            </section>

            {/* Modern Banner Placeholder */}
            <section className="relative h-64 w-full overflow-hidden rounded-[3rem] bg-blue-600 shadow-2xl group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 flex items-center px-16">
                    <div className="z-10 space-y-4 max-w-lg">
                        <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Limited Edition
                        </span>
                        <h2 className="text-4xl font-black text-white leading-tight">Create your own perfect collection</h2>
                        <button className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl">
                            Start Building
                        </button>
                    </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none">
                    <Music className="w-64 h-64 text-white -rotate-12 translate-x-32" />
                </div>
            </section>
        </div>
    )
}
