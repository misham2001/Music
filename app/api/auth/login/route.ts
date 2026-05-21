import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { comparePassword, generateToken, setAuthCookie } from '@/lib/auth'

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const isPasswordValid = await comparePassword(password, user.password)
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const token = generateToken(user.id)
        await setAuthCookie(token)

        return NextResponse.json({
            message: 'Logged in successfully',
            user: { id: user.id, email: user.email, name: user.name }
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
