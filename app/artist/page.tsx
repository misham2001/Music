'use client'

import { useQuery } from '@tanstack/react-query'
import { User, Search as SearchIcon, ChevronRight } from 'lucide-react'
import ArtistCard from '@/components/cards/artist-card'

export default function ArtistsPage() {
    const { data: popularArtists, isLoading: isLoadingPopular } = useQuery({
        queryKey: ['popular-artists'],
        queryFn: async () => {
            // Using a generic search term for popular artists
            const res = await fetch('/api/music/search?term=popular&type=artist&limit=20')
            if (!res.ok) throw new Error('Failed to fetch artists')
            return res.json()
        }
    })

    const { data: trendingArtists, isLoading: isLoadingTrending } = useQuery({
        queryKey: ['trending-artists'],
        queryFn: async () => {
            const res = await fetch('/api/music/search?term=trending&type=artist&limit=10')
            if (!res.ok) throw new Error('Failed to fetch trending artists')
            return res.json()
        }
    })

    return (
        <div className="space-y-12 pb-32">
            <div>
                <h1 className="text-4xl font-black text-slate-800 mb-2">Explore Artists</h1>
                <p className="text-slate-500 font-medium">Discover your favorite music creators</p>
            </div>

            {/* Featured Section */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        Trending Now
                        <div className="h-1 w-20 bg-blue-100 rounded-full" />
                    </h2>
                    <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
                        View All <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {isLoadingTrending ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="bg-white/40 aspect-square rounded-full animate-pulse border border-white/50" />
                        ))
                    ) : (
                        trendingArtists?.results?.slice(0, 5).map((artist: any) => (
                            <ArtistCard
                                key={artist.id}
                                id={artist.id}
                                name={artist.name}
                                image={artist.image}
                            />
                        ))
                    )}
                </div>
            </section>

            {/* All Artists Grid */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        Popular Artists
                        <div className="h-1 w-20 bg-blue-100 rounded-full" />
                    </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                    {isLoadingPopular ? (
                        Array(10).fill(0).map((_, i) => (
                            <div key={i} className="bg-white/40 aspect-[4/5] rounded-[2.5rem] animate-pulse border border-white/50" />
                        ))
                    ) : (
                        popularArtists?.results?.map((artist: any) => (
                            <ArtistCard
                                key={artist.id}
                                id={artist.id}
                                name={artist.name}
                                image={artist.image}
                            />
                        ))
                    )}
                </div>
            </section>

            {/* Categories / Genres (Visual placeholder for premium feel) */}
            <section className="pt-8">
                <h2 className="text-2xl font-black text-slate-800 mb-8">Browse by Genre</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {['Playback', 'Indie', 'Pop', 'Rock', 'Classical', 'Hip-Hop'].map((genre, i) => (
                        <div 
                            key={genre}
                            className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-white/50 hover:bg-blue-600 hover:text-white transition-all duration-500 group shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                        >
                            <span className="font-black text-xl tracking-tight">{genre}</span>
                            <div className="mt-4 w-8 h-1 bg-blue-600 group-hover:bg-white transition-colors rounded-full" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
