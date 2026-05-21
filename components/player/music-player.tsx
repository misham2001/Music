'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, VolumeX, Heart, ListMusic } from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'

export default function MusicPlayer() {
    const { currentTrack, isPlaying, togglePlay, next, previous, volume, setVolume } = usePlayerStore()
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying && currentTrack?.preview_url) {
                audioRef.current.play().catch(e => console.error("Playback failed", e))
            } else {
                audioRef.current.pause()
            }
        }
    }, [isPlaying, currentTrack])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime)
            setDuration(audioRef.current.duration)
        }
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value)
        if (audioRef.current) {
            audioRef.current.currentTime = time
            setProgress(time)
        }
    }

    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return "0:00"
        const min = Math.floor(time / 60)
        const sec = Math.floor(time % 60)
        return `${min}:${sec.toString().padStart(2, '0')}`
    }

    if (!currentTrack) return null

    return (
        <div className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-[98%] md:w-[95%] max-w-7xl z-50">
            <footer className="glass-morphism rounded-2xl md:rounded-[2.5rem] p-2 md:p-4 flex items-center justify-between shadow-2xl border border-white/40">
                <audio
                    ref={audioRef}
                    src={currentTrack.preview_url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleTimeUpdate}
                    onEnded={next}
                />

                {/* Track Info */}
                <div className="flex items-center gap-2 md:gap-4 w-[40%] md:w-[25%] min-w-0 px-1 md:px-2">
                    {currentTrack.album?.images?.[0]?.url ? (
                        <div className="relative group shrink-0">
                            <img
                                src={currentTrack.album.images[0].url}
                                alt={currentTrack.name}
                                className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl shadow-md object-cover border-2 border-white/50"
                            />
                        </div>
                    ) : (
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-200 rounded-xl md:rounded-2xl animate-pulse shrink-0" />
                    )}
                    <div className="truncate">
                        <p className="text-xs md:text-sm font-bold text-slate-800 truncate">{currentTrack.name}</p>
                        <p className="text-[10px] md:text-xs text-slate-500 font-medium truncate">
                            {currentTrack.artists.map(a => a.name).join(', ')}
                        </p>
                    </div>
                </div>

                {/* Controls & Progress */}
                <div className="flex flex-col items-center flex-1 min-w-0 px-2 md:px-8">
                    <div className="flex items-center gap-4 md:gap-8 mb-1 md:mb-2 text-slate-400">
                        <button onClick={previous} className="hover:text-blue-600 transition-all active:scale-90 hidden sm:block">
                            <SkipBack className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                        </button>
                        <button
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 hover:scale-110 transition-all active:scale-95 shadow-lg shadow-blue-200"
                            onClick={togglePlay}
                        >
                            {isPlaying ? (
                                <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                            ) : (
                                <Play className="w-5 h-5 md:w-6 md:h-6 fill-current translate-x-0.5" />
                            )}
                        </button>
                        <button onClick={next} className="hover:text-blue-600 transition-all active:scale-90">
                            <SkipForward className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-3 w-full max-w-md">
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 w-6 md:w-8 text-right">{formatTime(progress)}</span>
                        <div className="flex-1 relative group h-3 flex items-center">
                            <input
                                type="range"
                                min={0}
                                max={duration || 0}
                                step={0.1}
                                value={progress || 0}
                                onChange={handleSeek}
                                className="absolute w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer group-hover:h-1.5 transition-all outline-none accent-blue-600"
                                style={{
                                    background: `linear-gradient(to right, #2563eb ${(progress / duration) * 100}%, #e2e8f0 ${(progress / duration) * 100}%)`
                                }}
                            />
                        </div>
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 w-6 md:w-8">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Volume & Extra */}
                <div className="hidden md:flex items-center justify-end gap-4 lg:gap-6 w-[25%] pr-4">
                    <button className="text-slate-400 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                    </button>
                    <button className="text-slate-400 hover:text-blue-600 transition-colors">
                        <ListMusic className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-2 group">
                        <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)} className="text-slate-400 group-hover:text-blue-600 transition-colors">
                            {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-16 h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600 outline-none"
                        />
                    </div>
                </div>

                {/* Mobile Extra Action */}
                <div className="md:hidden flex items-center px-2">
                    <button className="text-slate-400 hover:text-blue-600 ml-1">
                        <ListMusic className="w-5 h-5" />
                    </button>
                </div>
            </footer>
        </div>
    )
}
