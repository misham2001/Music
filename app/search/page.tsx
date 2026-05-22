'use client'

import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import AlbumCard from '@/components/cards/album-card'
import { Suspense } from 'react'

function SearchContent() {
    const searchParams = useSearchParams()
    const debouncedQuery = searchParams.get('q') || ''

    const { data, isLoading } = useQuery({
        queryKey: ['search', debouncedQuery],
        queryFn: async () => {
            if (!debouncedQuery) return null
            const res = await fetch(`/api/music/search?term=${encodeURIComponent(debouncedQuery)}&type=album&limit=20`)
            if (!res.ok) throw new Error('Search failed')
            return res.json()
        },
        enabled: !!debouncedQuery
    })

    return (
        <div className="space-y-12 pb-32">
            {!debouncedQuery && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-8">
                    <h2 className="text-3xl font-black text-slate-800 mb-10 flex items-center gap-4">
                        Browse all
                        <div className="h-1 flex-1 bg-slate-100 rounded-full ml-4" />
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[
                            { name: 'Podcasts', color: 'bg-indigo-600' },
                            { name: 'Live Events', color: 'bg-rose-600' },
                            { name: 'Made For You', color: 'bg-emerald-600' },
                            { name: 'New Releases', color: 'bg-blue-600' },
                            { name: 'Hindi', color: 'bg-amber-600' },
                            { name: 'Punjabi', color: 'bg-orange-600' },
                            { name: 'Tamil', color: 'bg-teal-600' },
                            { name: 'Telugu', color: 'bg-sky-600' },
                            { name: 'Charts', color: 'bg-violet-600' },
                            { name: 'Pop', color: 'bg-pink-600' }
                        ].map((cat, i) => (
                            <div 
                                key={cat.name} 
                                className={`aspect-[4/3] ${cat.color} rounded-[2.5rem] p-8 font-black text-2xl text-white relative overflow-hidden transition-all hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl group`}
                            >
                                <span className="relative z-10 leading-tight">{cat.name}</span>
                                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {debouncedQuery && (
                <div className="animate-in fade-in duration-500">
                    <h2 className="text-2xl font-black text-slate-400 mb-10 tracking-tight uppercase">
                        Search results for "<span className="text-slate-800">{debouncedQuery}</span>"
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                        {isLoading ? (
                            Array(10).fill(0).map((_, i) => (
                                <div key={i} className="bg-white/40 aspect-square rounded-[2.5rem] animate-pulse border border-white/50" />
                            ))
                        ) : (
                            data?.results?.length === 0 ? (
                                <div className="col-span-full py-20 text-center text-slate-500 font-bold">No results found for "{debouncedQuery}"</div>
                            ) : (
                                data?.results?.map((item: any) => (
                                    <AlbumCard
                                        key={item.id}
                                        id={item.id}
                                        name={item.name}
                                        artist={item.artist}
                                        image={item.image}
                                    />
                                ))
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading search...</div>}>
            <SearchContent />
        </Suspense>
    )
}
