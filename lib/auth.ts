import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'

export const hashPassword = async (password: string) => {
    return bcrypt.hash(password, 10)
}

export const comparePassword = async (password: string, hash: string) => {
    return bcrypt.compare(password, hash)
}

export const generateToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string }
    } catch (error) {
        return null
    }
}

export const setAuthCookie = async (token: string) => {
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
    })
}

export const removeAuthCookie = async () => {
    const cookieStore = await cookies()
    cookieStore.delete('auth_token')
}
