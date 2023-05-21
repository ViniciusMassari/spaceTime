import { FastifyInstance } from "fastify";
import { z } from "zod";
import axios from "axios";
import { prisma } from "../lib/prisma";

export async function authRoutes(app: FastifyInstance) {
  // rota que registra o usuário e que irá receber o código
  // do github
  app.post("/register", async (request) => {
    const bodySchema = z.object({
      code: z.string(),
    });

    const { code } = bodySchema.parse(request.body);

    // chamada para a api do github.
    // o corpo da requisição é nulo.
    // no terceiro parâmetro estão as configs da requisição
    // vamos informar que na url será enviado o código, client_id e o segredo
    // por último informamos pelo header que o github deve entender
    // a requisição como json
    const accessTokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    // token é pego da resposta
    const { access_token } = accessTokenResponse.data;

    // requisição para buscar os dados do git
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    });

    const userInfo = userSchema.parse(userResponse.data);

    // verifica se o usuário já existe
    let user = await prisma.user.findUnique({
      where: {
        gitHubId: userInfo.id,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          gitHubId: userInfo.id,
          login: userInfo.login,
          nome: userInfo.name,
          avatarUrl: userInfo.avatar_url,
        },
      });
    }

    // criação do token
    // dois objetos são passados na função sign
    // o primeiro são as informações do usuário que
    // queremos dentro do token, que não são sensíveis
    // dados que são públicos
    // o segundo obj leva duas informações
    // sub (subject) que é a qual usuário pertence este token, dve elevar uma informação única, como o id
    // expiresIn, quanto tempo o token dura
    const token = app.jwt.sign(
      {
        name: user.nome,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: "30 days",
      }
    );

    return { token };
  });
}
