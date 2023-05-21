import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
export async function memoriesRoutes(app: FastifyInstance) {
  // aqui define que todas as rotas deve ter um middleware que verifica se existe o token
  // ou seja, se o usuário está logado
  app.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });

  app.get("/memories", async (request) => {
    // verifica se o token está sendo enviado para essa requisição

    // request.user acessa as informações do usuário que fez a requisição
    const { sub } = request.user;
    const memories = await prisma.memory.findMany({
      where: {
        userId: sub,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // retorna o texto cortado
    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        except: memory.content.substring(0, 115).concat("..."),
        createdAt: memory.createdAt
      };
    });
  });

  app.get("/memories/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });

    // se a memória não for pública e o usuário logado
    // não for o mesmo que o usuário criado da memória, retorna 401
    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    return memory;
  });

  // coerce transforma o valor em booleano
  app.post("/memories/", async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    });

    const { content, isPublic, coverUrl } = bodySchema.parse(request.body);

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: request.user.sub,
      },
    });
    return memory;
  });

  app.put("/memories/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    });

    const { content, isPublic, coverUrl } = bodySchema.parse(request.body);

    let memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });
    // se o usuário logado não for o criado do post, retorna 401
    if (memory?.userId !== request.user.sub) {
      return reply.status(400).send();
    }

    memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    });

    return memory;
  });

  app.delete("/memories/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (memory?.userId !== request.user.sub) {
      return reply.status(400).send();
    }

    await prisma.memory.delete({
      where: {
        id,
      },
    });
  });
}
