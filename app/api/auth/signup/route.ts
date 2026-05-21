import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth'

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        const hashedPassword = await hashPassword(password)
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name },
        })

        const token = generateToken(user.id)
        await setAuthCookie(token)

        return NextResponse.json({
            message: 'User created successfully',
            user: { id: user.id, email: user.email }
        })
    } catch (error) {
        console.error('Signup error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
