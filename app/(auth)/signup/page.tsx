'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Music, Mail, Lock, Loader2, ArrowRight, User } from 'lucide-react'

export default function SignupPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await res.json()

            if (res.ok) {
                router.push('/')
                router.refresh()
            } else {
                setError(data.error || 'Signup failed')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50">
            {/* Animated Background Orbs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

            <div className="relative w-full max-w-md p-8">
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-600 shadow-xl shadow-blue-200 mb-6 group transition-all hover:scale-110">
                        <Music className="w-8 h-8 text-white fill-current" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Join Wigoh</h1>
                    <p className="text-slate-500 font-medium">Create an account to start your musical journey</p>
                </div>

                {/* Glassmorphic Card */}
                <div className="glass-morphism rounded-[2.5rem] p-8 shadow-2xl shadow-blue-100/20 border border-white/60 relative z-10">
                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-white/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-200 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-white/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-200 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    placeholder="Min. 8 characters"
                                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-white/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-200 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-200 hover:shadow-blue-300 disabled:opacity-50 flex items-center justify-center gap-3 group active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100/50">
                        <p className="text-center text-slate-500 font-bold text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-600 hover:underline">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
