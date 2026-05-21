import { create } from 'zustand'

export interface Track {
    id: string
    name: string
    artists: { name: string }[]
    album: {
        name: string
        images: { url: string }[]
    }
    preview_url: string
    duration_ms?: number
}

interface PlayerState {
    currentTrack: Track | null
    isPlaying: boolean
    queue: Track[]
    volume: number
    setTrack: (track: Track) => void
    setQueue: (queue: Track[]) => void
    togglePlay: () => void
    setVolume: (volume: number) => void
    next: () => void
    previous: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    currentTrack: null,
    isPlaying: false,
    queue: [],
    volume: 0.5,
    setTrack: (track) => set({ currentTrack: track, isPlaying: true }),
    setQueue: (queue) => set({ queue }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setVolume: (volume) => set({ volume }),
    next: () => {
        const { currentTrack, queue } = get()
        if (!currentTrack || queue.length === 0) return
        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id)
        if (currentIndex < queue.length - 1) {
            set({ currentTrack: queue[currentIndex + 1], isPlaying: true })
        }
    },
    previous: () => {
        const { currentTrack, queue } = get()
        if (!currentTrack || queue.length === 0) return
        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id)
        if (currentIndex > 0) {
            set({ currentTrack: queue[currentIndex - 1], isPlaying: true })
        }
    },
}))
