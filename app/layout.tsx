import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/components/providers/query-provider'
import Sidebar from '@/components/layout/sidebar'
import Header from '@/components/layout/header'
import MusicPlayer from '@/components/player/music-player'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spotify Clone',
  description: 'A full-stack Spotify clone built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-slate-900 h-screen overflow-hidden`}>
        <QueryProvider>
          <div className="flex h-full w-full p-2 md:p-4 gap-2 md:gap-4">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <main className="flex-1 overflow-y-auto custom-scrollbar rounded-2xl md:rounded-3xl">
                <div className="p-4 md:p-8">
                  <Header />
                  {children}
                </div>
              </main>
            </div>
          </div>
          <MusicPlayer />
        </QueryProvider>
      </body>
    </html>
  )
}
