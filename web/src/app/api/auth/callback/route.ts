
import { api } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
   // pegando o código
   const {searchParams} = new URL(request.url)

   const code = searchParams.get('code')

   // cookie com a url da pagina memories/new
   const redirectTo = request.cookies.get('redirectTo')?.value
   
    const registerResponse = await api.post('/register', {
      code
    })

    const {token} = registerResponse.data

    // redireciona o usuário para a rota raíz da aplicação
    const redirectUrl = redirectTo ?? new URL('/', request.url)
    
    // salvando o token nos cookies
    // path=/ indica que o cookie estará disponível em toda a aplicação
    // caso colocasse path=/auth só o que estiver na rota auth poderia acessar o cookie
    // max-age é o tempo que o cookie levará para expirar

    const cookieExpiresInSeconds = 60 * 60 * 24 * 30

    return NextResponse.redirect(redirectUrl,{
      headers:{
         'Set-Cookie': `token=${token}; Path=/; max-age=${cookieExpiresInSeconds}`
      }
    })
}