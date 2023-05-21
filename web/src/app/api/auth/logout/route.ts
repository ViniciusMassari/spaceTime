

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){


    // redireciona o usuário para a rota raíz da aplicação
    const redirectUrl = new URL('/', request.url)
    


// max age = 0 apaga o cookie
    return NextResponse.redirect(redirectUrl,{
      headers:{
         'Set-Cookie': `token=; Path=/; max-age=0`
      }
    })
}