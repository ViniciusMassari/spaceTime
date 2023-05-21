import { NextRequest, NextResponse } from "next/server";

const signInURL =  `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`

export function middleware(request: NextRequest){
const token = request.cookies.get('token')?.value

if (!token) {
    return NextResponse.redirect(signInURL, {
        headers:{
         'Set-Cookie': `redirectTo=${request.url}; HttpOnly Path=/; max-age=20`
      }
    })
}

// next = continuar a rota do usuário
return NextResponse.next()
}

// path* = qualquer rota que começar com memories
// export const config é necessário para informar quais rotas devem ter o middleware
export const config ={
    matcher:"/memories/:path*"
}