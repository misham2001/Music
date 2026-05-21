import Link from 'next/link'
import { Play } from 'lucide-react'
import { usePlayerStore, Track } from '@/store/playerStore'

interface AlbumCardProps {
    id: string
    name: string
    artist: string
    image: string
    tracks?: Track[]
}

export default function AlbumCard({ id, name, artist, image, tracks }: AlbumCardProps) {
    const { setTrack, setQueue } = usePlayerStore()

    const handlePlay = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (tracks && tracks.length > 0) {
            setQueue(tracks)
            setTrack(tracks[0])
        }
    }

    return (
        <Link href={`/album/${id}`} className="block group">
            <div className="bg-white/40 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/50 hover:bg-white/60 transition-all duration-500 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1">
                <div className="relative aspect-square mb-6 overflow-hidden rounded-[2rem] shadow-sm">
                    <img
                        src={image}
                        alt={name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <button
                        onClick={handlePlay}
                        className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-blue-600 items-center justify-center shadow-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 flex hover:scale-110 active:scale-95 hover:bg-blue-700"
                    >
                        <Play className="w-5 h-5 text-white fill-current translate-x-0.5" />
                    </button>
                </div>
                <div className="px-2 pb-2">
                    <h3 className="font-extrabold text-slate-800 truncate text-base mb-1">{name}</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider truncate">{artist}</p>
                </div>
            </div>
        </Link>
    )
}
