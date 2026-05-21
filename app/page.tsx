'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Play, Heart, Pause, Plus } from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'
import Link from 'next/link'
import { useState } from 'react'
import AddToPlaylist from '@/components/modals/add-to-playlist'

export default function Home() {
  const { currentTrack, isPlaying, setTrack, setQueue, togglePlay } = usePlayerStore()
  const [trackToAdd, setTrackToAdd] = useState<any>(null)

  const { data: topMusic } = useQuery({
    queryKey: ['top-music'],
    queryFn: async () => {
      const res = await fetch('/api/music/search?term=trending&type=album&limit=10')
      return res.json()
    }
  })

  const { data: popularTracks } = useQuery({
    queryKey: ['popular-tracks'],
    queryFn: async () => {
      const res = await fetch('/api/music/search?term=popular&type=song&limit=3')
      return res.json()
    }
  })

  const { data: recommended } = useQuery({
    queryKey: ['recommended-albums'],
    queryFn: async () => {
      const res = await fetch('/api/music/search?term=hits&type=album&limit=5')
      return res.json()
    }
  })

  const { data: tamilSongs } = useQuery({
    queryKey: ['tamil-songs'],
    queryFn: async () => {
      const res = await fetch('/api/music/search?term=tamil&type=song&limit=10')
      return res.json()
    }
  })

  const { data: englishSongs } = useQuery({
    queryKey: ['english-songs'],
    queryFn: async () => {
      const res = await fetch('/api/music/search?term=english&type=song&limit=10')
      return res.json()
    }
  })

  const handlePlayTrack = (track: any, results: any[]) => {
    setQueue(results)
    setTrack(track)
  }

  const { data: tamil80s } = useQuery({
    queryKey: ['tamil-80s'],
    queryFn: async () => {
      const res = await fetch('/api/music/search?term=tamil%2080s&type=song&limit=10')
      return res.json()
    }
  })

  const { data: tamil90s } = useQuery({
    queryKey: ['tamil-90s'],
    queryFn: async () => {
      const res = await fetch('/api/music/search?term=tamil%2090s&type=song&limit=10')
      return res.json()
    }
  })

  const { data: tamilLove } = useQuery({
    queryKey: ['tamil-love'],
    queryFn: async () => {
      const res = await fetch('/api/music/search?term=tamil%20love&type=song&limit=10')
      return res.json()
    }
  })

  const { data: tamilChristian } = useQuery({
    queryKey: ['tamil-christian'],
    queryFn: async () => {
      const res = await fetch('/api/music/search?term=tamil%20christian&type=song&limit=10')
      return res.json()
    }
  })


  const { data: englishChristian } = useQuery({
    queryKey: ['english-christian'],
    queryFn: async () => {
      const res = await fetch('/api/music/search?term=english%20christian&type=song&limit=10')
      return res.json()
    }
  })

  const formatDuration = (ms?: number) => {
    if (!ms) return "3:45"
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-12 pb-32">
      {/* Top Music Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Top Music</h2>
          <div className="flex gap-2">
            <button className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
            <button className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2 custom-scrollbar">
          {topMusic?.results?.map((album: any) => (
            <Link key={album.id} href={`/album/${album.id}`} className="flex-shrink-0 w-56 group">
              <div className="relative aspect-square rounded-3xl overflow-hidden mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img src={album.image} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <Play className="w-6 h-6 text-blue-600 fill-current" />
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-slate-800 truncate">{album.name}</h3>
              <p className="text-sm text-slate-500 truncate">{album.artist}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Popular Section */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Popular</h2>
          <div className="space-y-3">
            {popularTracks?.results?.slice(0, 3).map((track: any) => {
              const isCurrent = currentTrack?.id === track.id
              return (
                <div key={track.id} className={`flex items-center gap-4 p-3 rounded-2xl transition-all group ${isCurrent ? 'bg-white shadow-md' : 'hover:bg-white/50'}`}>
                  <button
                    onClick={() => isCurrent ? togglePlay() : handlePlayTrack(track, popularTracks.results)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCurrent && isPlaying ? 'bg-blue-600 text-white' : 'text-slate-400 group-hover:bg-blue-600 group-hover:text-white'}`}
                  >
                    {isCurrent && isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <img src={track.album.images[0].url} alt={track.name} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold truncate ${isCurrent ? 'text-blue-600' : 'text-slate-800'}`}>{track.name}</h4>
                    <p className="text-sm text-slate-500 truncate">{track.artists[0]?.name}</p>
                  </div>
                  <span className="text-xs font-medium text-slate-400">{formatDuration(track.duration_ms)}</span>
                  <button
                    onClick={() => setTrackToAdd(track)}
                    className="text-slate-300 hover:text-blue-600 transition-colors p-2"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button className="text-slate-300 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        {/* Recommended Album Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Recommended Album</h2>
            <div className="flex gap-2">
              <button className="p-1.5 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-1.5 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
            {recommended?.results?.map((album: any) => (
              <Link key={album.id} href={`/album/${album.id}`} className="flex-shrink-0 w-44 group">
                <div className="relative mb-4">
                  <div className="absolute top-0 right-0 w-full h-full bg-slate-900 rounded-full translate-x-4 scale-95 shadow-lg group-hover:translate-x-8 transition-transform duration-500 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-white/20" />
                  </div>
                  <div className="relative z-10 aspect-square rounded-2xl overflow-hidden shadow-md">
                    <img src={album.image} alt={album.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 truncate">{album.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Tamil Christian Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Tamil Christian Devotional</h2>
          <div className="flex gap-2">
            <button className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
            <button className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2 custom-scrollbar">
          {tamilChristian?.results?.map((track: any) => (
            <div key={track.id} className="flex-shrink-0 w-44 group cursor-pointer" onClick={() => handlePlayTrack(track, tamilChristian.results)}>
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-lg transition-all duration-300">
                <img src={track.album.images[0].url} alt={track.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <Play className="w-5 h-5 text-blue-600 fill-current" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 truncate text-sm">{track.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{track.artists[0]?.name}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setTrackToAdd(track)
                  }}
                  className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* English Christian Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">English Christian Hits</h2>
          <div className="flex gap-2">
            <button className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
            <button className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2 custom-scrollbar">
          {englishChristian?.results?.map((track: any) => (
            <div key={track.id} className="flex-shrink-0 w-44 group cursor-pointer" onClick={() => handlePlayTrack(track, englishChristian.results)}>
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-lg transition-all duration-300">
                <img src={track.album.images[0].url} alt={track.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <Play className="w-5 h-5 text-blue-600 fill-current" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 truncate text-sm">{track.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{track.artists[0]?.name}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setTrackToAdd(track)
                  }}
                  className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tamil Songs Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Tamil Songs</h2>
          <div className="flex gap-2">
            <button className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
            <button className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2 custom-scrollbar">
          {tamilSongs?.results?.map((track: any) => (
            <div key={track.id} className="flex-shrink-0 w-44 group cursor-pointer" onClick={() => handlePlayTrack(track, tamilSongs.results)}>
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-lg transition-all duration-300">
                <img src={track.album.images[0].url} alt={track.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <Play className="w-5 h-5 text-blue-600 fill-current" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 truncate text-sm">{track.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{track.artists[0]?.name}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setTrackToAdd(track)
                  }}
                  className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* English Songs Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">English Songs</h2>
          <div className="flex gap-2">
            <button className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
            <button className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2 custom-scrollbar">
          {englishSongs?.results?.map((track: any) => (
            <div key={track.id} className="flex-shrink-0 w-44 group cursor-pointer" onClick={() => handlePlayTrack(track, englishSongs.results)}>
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-lg transition-all duration-300">
                <img src={track.album.images[0].url} alt={track.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <Play className="w-5 h-5 text-blue-600 fill-current" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 truncate text-sm">{track.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{track.artists[0]?.name}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setTrackToAdd(track)
                  }}
                  className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tamil Love Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Tamil Romantic Hits</h2>
          <div className="flex gap-2">
            <button className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
            <button className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2 custom-scrollbar">
          {tamilLove?.results?.map((track: any) => (
            <div key={track.id} className="flex-shrink-0 w-44 group cursor-pointer" onClick={() => handlePlayTrack(track, tamilLove.results)}>
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-lg transition-all duration-300">
                <img src={track.album.images[0].url} alt={track.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <Play className="w-5 h-5 text-blue-600 fill-current" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 truncate text-sm">{track.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{track.artists[0]?.name}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setTrackToAdd(track)
                  }}
                  className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tamil 90s Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Tamil 90s Hits</h2>
          <div className="flex gap-2">
            <button className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
            <button className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2 custom-scrollbar">
          {tamil90s?.results?.map((track: any) => (
            <div key={track.id} className="flex-shrink-0 w-44 group cursor-pointer" onClick={() => handlePlayTrack(track, tamil90s.results)}>
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-lg transition-all duration-300">
                <img src={track.album.images[0].url} alt={track.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <Play className="w-5 h-5 text-blue-600 fill-current" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 truncate text-sm">{track.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{track.artists[0]?.name}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setTrackToAdd(track)
                  }}
                  className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tamil 80s Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Tamil 80s Classics</h2>
          <div className="flex gap-2">
            <button className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
            <button className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2 custom-scrollbar">
          {tamil80s?.results?.map((track: any) => (
            <div key={track.id} className="flex-shrink-0 w-44 group cursor-pointer" onClick={() => handlePlayTrack(track, tamil80s.results)}>
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-lg transition-all duration-300">
                <img src={track.album.images[0].url} alt={track.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <Play className="w-5 h-5 text-blue-600 fill-current" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 truncate text-sm">{track.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{track.artists[0]?.name}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setTrackToAdd(track)
                  }}
                  className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {trackToAdd && (
        <AddToPlaylist track={trackToAdd} onClose={() => setTrackToAdd(null)} />
      )}
    </div>
  )
}
