import {cookies} from 'next/headers'
import decode from 'jwt-decode'

interface User{
    sub:string;
    name:string;
    avatarUrl:string
}

export function getUser(): User{
    const token = cookies().get('token')?.value

    if(!token){
        throw new Error("Unauthenticated")
    }

    // extrair as informações do token
    const user: User = decode(token)

    return user
}