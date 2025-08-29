import jwt from "jsonwebtoken"
import 'dotenv/config'

interface TokenData {
    id: string;
    email: string;
    username: string
}

export async function createToken(tokenData: TokenData) {

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, {
        expiresIn: "2d"
    })
    return token
}