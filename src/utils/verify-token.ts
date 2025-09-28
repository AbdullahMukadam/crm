import jwt from "jsonwebtoken"
import 'dotenv/config'

interface TokenPayload {
    id: string;
    email: string;
    username: string;
    onboarded: boolean;
    role: string;
    iat?: number;
    exp?: number;
}


export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        const decoded = jwt.verify(token, secret) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}