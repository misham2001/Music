'use client'

import { Search, Settings, Bell, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'

function HeaderContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('q') || '')

    useEffect(() => {
        if (query) {
            const timer = setTimeout(() => {
                router.push(`/search?q=${encodeURIComponent(query)}`)
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [query, router])

    return (
        <header className="flex items-center justify-between py-2 md:py-4 px-1 md:px-2 mb-4 md:mb-8 gap-4">
            <div className="flex items-center flex-1 max-w-md">
                <div className="relative w-full group">
                    <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-white/50 backdrop-blur-md border border-white/30 rounded-xl md:rounded-2xl py-2 md:py-3 pl-10 md:pl-12 pr-10 md:pr-12 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all shadow-sm"
                    />
                    {query && (
                        <button 
                            onClick={() => { setQuery(''); router.push('/search') }}
                            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-slate-400" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-6 shrink-0">
                <button className="bg-white/70 backdrop-blur-md border border-white/30 px-3 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-slate-700 hover:bg-white transition-all shadow-sm">
                    <span className="hidden sm:inline">Upgrade To Premium</span>
                    <span className="sm:hidden text-blue-600">VIP</span>
                </button>
                <div className="flex items-center gap-2 md:gap-4 text-slate-500">
                    <button className="p-1.5 md:p-2 hover:bg-white/50 rounded-xl transition-colors hidden sm:block">
                        <Settings className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button className="p-1.5 md:p-2 hover:bg-white/50 rounded-xl transition-colors relative">
                        <Bell className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default function Header() {
    return (
        <Suspense fallback={<header className="flex items-center justify-between py-2 md:py-4 px-1 md:px-2 mb-4 md:mb-8 gap-4 h-[60px] md:h-[76px]" />}>
            <HeaderContent />
        </Suspense>
    )
}
