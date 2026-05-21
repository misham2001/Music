import Link from 'next/link'

export default function ArtistCard({ id, name, image }: { id: string; name: string; image: string }) {
    return (
        <Link href={`/artist/${id}`} className="block group">
            <div className="bg-white/40 backdrop-blur-md p-5 rounded-[2.5rem] border border-white/50 hover:bg-white/60 transition-all duration-500 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 text-center">
                <div className="relative aspect-square mb-6 overflow-hidden rounded-full shadow-md border-4 border-white">
                    <img
                        src={image}
                        alt={name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div>
                    <h3 className="font-extrabold text-slate-800 truncate text-base mb-1">{name}</h3>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Artist
                    </span>
                </div>
            </div>
        </Link>
    )
}
