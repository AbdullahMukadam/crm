import jwt from "jsonwebtoken"
import 'dotenv/config'
import { Role } from "@prisma/client";


interface TokenData {
    id: string;
    email: string;
    username: string;
    onboarded: boolean,
    role: Role | null
}

export async function createToken(tokenData: TokenData) {

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, {
        expiresIn: "2d"
    })
    return token
}