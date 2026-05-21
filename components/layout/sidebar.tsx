'use client'

import { Home, ListMusic, User, Album, Radio, Calendar, Mic2, Heart, Search, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const { data: userData } = useQuery({
        queryKey: ['me'],
        queryFn: () => fetch('/api/auth/me').then(res => res.json()),
    })

    const user = userData?.user
    const displayName = user?.name || user?.email?.split('@')[0] || 'Guest User'
    const displayEmail = user?.email || 'Not logged in'
    const avatarSeed = user?.email || 'default'

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', { method: 'POST' })
            if (res.ok) {
                router.push('/login')
                router.refresh()
            }
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const browseItems = [
        { name: 'Home', icon: Home, href: '/' },
        { name: 'Search', icon: Search, href: '/search' },
        { name: 'Playlist', icon: ListMusic, href: '/playlist' },
        { name: 'Artist', icon: User, href: '/artist' },
        { name: 'Albums', icon: Album, href: '/album' },
    ]

    const discoverItems = [
        { name: 'Podcast', icon: Mic2, href: '/podcast' },
        { name: 'For You', icon: Heart, href: '/for-you' },
    ]

    return (
        <aside className="w-64 bg-white rounded-3xl flex flex-col h-full py-8 shadow-xl flex-shrink-0 hidden md:flex overflow-hidden relative">
            {/* User Profile */}
            <div className="px-8 mb-10 text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-slate-100 shadow-md">
                    <img
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                        alt="User"
                        className="w-full h-full object-cover"
                    />
                </div>
                <h2 className="font-bold text-slate-800 text-lg line-clamp-1">{displayName}</h2>
                <p className="text-xs text-blue-500 font-medium truncate">{displayEmail}</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-10">
                {/* Browse Section */}
                <div>
                    <h3 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Browse</h3>
                    <nav className="space-y-1">
                        {browseItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative group ${isActive
                                            ? 'text-slate-900 bg-slate-50'
                                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />}
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
                                    <span className="font-semibold text-sm">{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* Discover Section */}
                <div>
                    <h3 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Discover</h3>
                    <nav className="space-y-1">
                        {discoverItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative group ${isActive
                                            ? 'text-slate-900 bg-slate-50'
                                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />}
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
                                    <span className="font-semibold text-sm">{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* Logout Action */}
                <div className="pt-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-4 py-3 w-full rounded-xl transition-all text-slate-400 hover:text-red-600 hover:bg-red-50 group"
                    >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-sm">Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    )
}
